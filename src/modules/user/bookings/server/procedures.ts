import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { booking } from "@/db/schema";
import z from "zod";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { getTableColumns, eq, desc, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getCachedData, setCachedData } from "@/lib/redis-cache";

export const userBookingsRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }))
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


    getOne: protectedProcedure
        .input(z.object({
            bookingId: z.string(),
        })).query(async ({ input }) => {
            const { bookingId } = input;

            const cacheKey = `bookings:${bookingId}`;
            const cached = await getCachedData<typeof booking.$inferSelect>(cacheKey);
            if (cached) return cached;

            const [data] = await db
                .select({
                    ...getTableColumns(booking)
                })
                .from(booking).where(eq(booking.id, bookingId));

            if (!data) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking not found",
                });
            }

            await setCachedData(cacheKey, data);
            return data;
        })
});
