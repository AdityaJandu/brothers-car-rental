import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { bookingInsertSchema } from "../schemas";
import { db } from "@/db";
import { booking, car } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import z from "zod";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { and, getTableColumns, eq, desc, count } from "drizzle-orm";


export const bookingRouter = createTRPCRouter({

    create: protectedProcedure
        .input(bookingInsertSchema)
        .mutation(async ({ input, ctx }) => {

            const userId = ctx.auth.user.id; // Or ctx.session.user.id


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
                    message: "Meeting not found or you don't have access to it.",
                });
            }


            return createdBooking;
        }),

    getAll: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize } = input;

            // Securely grab the user ID
            const userId = ctx.auth.user.id;

            // 1. Fetch the paginated bookings for this specific user
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

            // 2. Fetch the total count to calculate totalPages
            const [total] = await db
                .select({ count: count() })
                .from(booking)
                .where(
                    eq(booking.userId, userId),
                );

            const totalPages = Math.ceil(total.count / pageSize);

            // 3. Return the exact shape your frontend pagination expects
            return {
                items: allBookings,
                total: total.count,
                totalPages,
            };
        }),

    getAllAdmin: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize } = input;


            // 1. Fetch the paginated bookings for this all users
            const allBookings = await db
                .select({
                    ...getTableColumns(booking),
                })
                .from(booking)
                .orderBy(desc(booking.createdAt), desc(booking.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            // 2. Fetch the total count to calculate totalPages
            const [total] = await db
                .select({ count: count() })
                .from(booking);

            const totalPages = Math.ceil(total.count / pageSize);

            // 3. Return the exact shape your frontend pagination expects
            return {
                items: allBookings,
                total: total.count,
                totalPages,
            };
        }),
});