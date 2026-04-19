import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { booking, car, location } from "@/db/schema";
import z from "zod";
import { paginationInputSchema } from "@/constants";
import { getTableColumns, eq, desc, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getCachedData, setCachedData } from "@/lib/redis-cache";
import { alias } from "drizzle-orm/pg-core";


const pickUpLoc = alias(location, "pickUpLocation");
const dropOffLoc = alias(location, "dropOffLocation");

export const userBookingsRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(paginationInputSchema)
        .query(async ({ input, ctx }) => {
            const { page, pageSize } = input;
            const userId = ctx.auth.user.id;

            const cacheKey = `bookings:user:${userId}:page:${page}:size:${pageSize}`;
            const cached = await getCachedData<{ items: typeof booking.$inferSelect[], total: number, totalPages: number }>(cacheKey);
            if (cached) return cached;

            const allBookings = await db
                .select({
                    ...getTableColumns(booking),
                })
                .from(booking)
                .where(
                    eq(booking.userId, userId),
                )
                .orderBy(desc(booking.createdAt), desc(booking.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            if (!allBookings) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No bookings found",
                });
            }

            const [total] = await db
                .select({ count: count() })
                .from(booking)
                .where(
                    eq(booking.userId, userId),
                );

            const totalPages = Math.ceil(total.count / pageSize);

            const response = {
                items: allBookings,
                total: total.count,
                totalPages,
            };

            await setCachedData(cacheKey, response);
            return response;
        }),


    getBookingWithDetails: protectedProcedure
        .input(z.object({
            bookingId: z.string(),
        })).query(async ({ input }) => {
            const { bookingId } = input;
            const cacheKey = `bookings:${bookingId}`;

            type BookingWithCarAndLocations = {
                booking: typeof booking.$inferSelect;
                car: typeof car.$inferSelect;
                pickUpLocation: typeof location.$inferSelect;
                dropOffLocation: typeof location.$inferSelect;
            };

            const cached = await getCachedData<BookingWithCarAndLocations>(cacheKey);
            if (cached) return cached;

            const [data] = await db
                .select({
                    booking: getTableColumns(booking),
                    car: getTableColumns(car),
                    pickUpLocation: getTableColumns(pickUpLoc),
                    dropOffLocation: getTableColumns(dropOffLoc),
                })
                .from(booking)
                .innerJoin(car, eq(booking.carId, car.id))
                .innerJoin(pickUpLoc, eq(booking.pickUpLocation, pickUpLoc.id))
                .innerJoin(dropOffLoc, eq(booking.dropOffLocation, dropOffLoc.id))
                .where(eq(booking.id, bookingId));

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking not found",
                });
            }

            await setCachedData(cacheKey, data);
            return data;
        }),

    getLatestBooking: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.auth.user.id;

        const cacheKey = `bookings:user:${userId}:latest`;

        // We update the cache type to expect the attached car object
        type LatestBookingWithCar = { booking: typeof booking.$inferSelect } & {
            car: typeof car.$inferSelect;
        };

        const cached = await getCachedData<LatestBookingWithCar>(cacheKey);
        if (cached) return cached;

        const [data] = await db
            .select({
                // Spreads all the booking columns at the root level
                booking: getTableColumns(booking),
                // Nests all the car columns inside a "car" object
                car: getTableColumns(car),
            })
            .from(booking)
            // Perform the SQL JOIN bridging the two tables
            .innerJoin(car, eq(booking.carId, car.id))
            .where(eq(booking.userId, userId))
            .orderBy(
                desc(booking.createdAt), desc(booking.id)
            )
            .limit(1);

        if (!data) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "No bookings found",
            });
        }

        await setCachedData(cacheKey, data);
        return data;
    }),
});
