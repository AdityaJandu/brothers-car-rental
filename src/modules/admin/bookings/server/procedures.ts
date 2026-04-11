import { createTRPCRouter, protectedProcedure, rateLimitedProtectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { booking, car } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from "@/constants";
import { getTableColumns, eq, desc, count } from "drizzle-orm";
import { getCachedData, setCachedData, invalidateCacheGroup } from "@/lib/redis-cache";

export const adminBookingsRouter = createTRPCRouter({
    getAllAdmin: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }))
        .query(async ({ input }) => {
            const { page, pageSize } = input;

            const cacheKey = `bookings:admin:page:${page}:size:${pageSize}`;
            const cached = await getCachedData<{ items: typeof booking.$inferSelect[], total: number, totalPages: number }>(cacheKey);
            if (cached) return cached;

            const allBookings = await db
                .select({
                    ...getTableColumns(booking),
                })
                .from(booking)
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
                .from(booking);

            const totalPages = Math.ceil(total.count / pageSize);

            const response = {
                items: allBookings,
                total: total.count,
                totalPages,
            };

            await setCachedData(cacheKey, response);
            return response;
        }),

    getOneAdmin: protectedProcedure
        .input(z.object({
            bookingId: z.string()
        }))
        .query(async ({ input }) => {
            const { bookingId } = input;

            const cacheKey = `bookings:${bookingId}:admin`;
            const cached = await getCachedData<typeof booking.$inferSelect & {
                carName: string | null;
                carMake: string | null;
                carModel: string | null;
                carYear: number | null;
            }>(cacheKey);
            if (cached) return cached;

            const [bookingData] = await db.select({
                ...getTableColumns(booking),
                carName: car.name,
                carMake: car.make,
                carModel: car.model,
                carYear: car.year,
            })
                .from(booking)
                .leftJoin(car, eq(booking.carId, car.id))
                .where(
                    eq(booking.id, bookingId),
                );

            if (!bookingData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking not found or you don't have access to it.",
                });
            }

            await setCachedData(cacheKey, bookingData);
            return bookingData;
        }),

    updateOneAdmin: rateLimitedProtectedProcedure.input(z.object({
        bookingId: z.string(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
    })).mutation(async ({ input }) => {
        const { bookingId, status } = input;

        const [updatedBooking] = await db
            .update(booking)
            .set({
                status,
            })
            .where(eq(booking.id, bookingId))
            .returning();

        if (!updatedBooking) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Booking not found or you don't have access to it.",
            });
        }

        await invalidateCacheGroup("bookings:");

        return updatedBooking;
    }),
});
