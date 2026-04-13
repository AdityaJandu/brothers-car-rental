import { rateLimitedProtectedProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { bookingInsertSchema } from "../schemas";
import { db } from "@/db";
import { booking } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { bookingRateLimit } from "@/lib/ratelimit";
import { invalidateCacheGroup } from "@/lib/redis-cache";
import { checkBookingConflict, getUnavailableDateRanges } from "./availability";
import { inngest } from "@/inngest/client";
import z from "zod";


export const bookingRouter = createTRPCRouter({

    /**
     * Query: Get all unavailable date ranges for a specific car.
     * Used by the checkout DatePicker to disable blocked dates.
     */
    getUnavailableDates: protectedProcedure
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
            // Not awaited — never blocks the mutation response
            inngest.send({
                name: "booking/created",
                data: { bookingId: createdBooking.id, userId },
            }).catch((err) => console.error("[Inngest] Failed to send booking/created:", err));

            return createdBooking;
        }),
});