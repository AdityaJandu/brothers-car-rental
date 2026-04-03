import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { booking } from "@/db/schema";
import z from "zod";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { getTableColumns, eq, desc, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userBookingsRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize } = input;
            const userId = ctx.auth.user.id;

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

            return {
                items: allBookings,
                total: total.count,
                totalPages,
            };
        }),
});
