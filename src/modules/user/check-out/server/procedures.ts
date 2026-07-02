import { rateLimitedProtectedProcedure, createTRPCRouter, protectedProcedure, baseProcedure } from "@/trpc/init";
import { bookingInsertSchema } from "../schemas";
import { db } from "@/db";
import { booking, car, location, user } from "@/db/schema";
import { inArray, eq, and, getTableColumns, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { bookingRateLimit } from "@/lib/ratelimit";
import { invalidateCacheGroup, getCachedData, setCachedData } from "@/lib/redis-cache";
import { checkBookingConflict, getUnavailableDateRanges } from "./availability";
import { inngest } from "@/inngest/client";
import z from "zod";

export const bookingRouter = createTRPCRouter({

    /**
     * Query: Merged checkout data — car, user profile, unavailable dates, active hubs.
     * Designed to be server-prefetched so the page renders with zero client waterfalls.
     */
    getCheckoutData: protectedProcedure
        .input(z.object({ carId: z.string() }))
        .query(async ({ input, ctx }) => {
            const userId = ctx.auth.user.id;
            const { carId } = input;

            // Fetch car — reuse the same cache key as userBrowse.getOne
            const carCacheKey = `cars:${carId}`;
            const cachedCar = await getCachedData<typeof car.$inferSelect>(carCacheKey);
            const carData = cachedCar ?? await (async () => {
                const [row] = await db
                    .select({ ...getTableColumns(car) })
                    .from(car)
                    .where(
                        and(
                            eq(car.id, carId),
                            isNull(car.deletedAt),
                            eq(car.isActive, true),
                        )
                    );
                if (row) await setCachedData(carCacheKey, row);
                return row;
            })();

            if (!carData) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Car not found or is no longer available." });
            }

            // Fetch user profile
            const [userData] = await db
                .select({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                })
                .from(user)
                .where(eq(user.id, userId));

            if (!userData) {
                throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
            }

            // Fetch unavailable dates
            const unavailableDates = await getUnavailableDateRanges(carId);

            // Fetch active hubs (cached)
            const locCacheKey = "locations:all:active";
            type LocationRow = { id: string; name: string; city: string; fullAddress: string };
            const cachedLocs = await getCachedData<LocationRow[]>(locCacheKey);
            const activeLocations = cachedLocs ?? await db
                .select({
                    id: location.id,
                    name: location.name,
                    city: location.city,
                    fullAddress: location.fullAddress,
                })
                .from(location)
                .where(eq(location.isActive, true))
                .then(async (rows) => {
                    await setCachedData(locCacheKey, rows);
                    return rows;
                });

            return { car: carData, user: userData, unavailableDates, activeLocations };
        }),

    /**
     * Query: Get all unavailable date ranges for a specific car.
     * Used by the checkout DatePicker to disable blocked dates.
     */
    getUnavailableDates: baseProcedure
        .input(z.object({ carId: z.string() }))
        .query(async ({ input }) => {
            return getUnavailableDateRanges(input.carId);
        }),

    /**
     * Mutation: Create a new booking with conflict detection.
     * Enforces double rate limiting + atomic overlap check before insert.
     */
    create: rateLimitedProtectedProcedure
        .input(bookingInsertSchema)
        .mutation(async ({ input, ctx }) => {

            const userId = ctx.auth.user.id;

            // Strict per-user rate limit: 5 bookings per 60 seconds
            const { success } = await bookingRateLimit.limit(userId);
            if (!success) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You are creating bookings too quickly. Please wait a moment before trying again.",
                });
            }

            const uniqueHubIds = Array.from(new Set([input.pickUpLocation, input.dropOffLocation]));
            const validHubs = await db
                .select({ id: location.id })
                .from(location)
                .where(
                    and(
                        inArray(location.id, uniqueHubIds),
                        eq(location.isActive, true)
                    )
                );

            if (validHubs.length !== uniqueHubIds.length) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "One or more selected physical hubs are currently unavailable or invalid.",
                });
            }

            // Booking conflict check: prevent overlapping reservations
            const hasConflict = await checkBookingConflict(
                input.carId,
                input.startDate,
                input.endDate,
            );

            if (hasConflict) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "This car is not available for the selected dates. Please choose different dates.",
                });
            }

            const [createdBooking] = await db
                .insert(booking)
                .values({
                    ...input,
                    userId,
                    pickUpLocation: input.pickUpLocation,
                    dropOffLocation: input.dropOffLocation,
                    paymentStatus: "unpaid",
                    paymentIntentId: null,
                })
                .returning();

            if (!createdBooking) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking could not be created. Please try again.",
                });
            }

            await invalidateCacheGroup("bookings:admin:");
            await invalidateCacheGroup(`bookings:user:${userId}:`);

            // Fire-and-forget: trigger Inngest workflows (confirmation email, expiry, reminder)
            inngest.send({
                name: "booking/created",
                data: { bookingId: createdBooking.id, userId },
            }).catch((err) => console.error("[Inngest] Failed to send booking/created:", err));

            return createdBooking;
        }),
});