import { rateLimitedProtectedProcedure, createTRPCRouter } from "@/trpc/init";
import { bookingInsertSchema } from "../schemas";
import { db } from "@/db";
import { booking } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { bookingRateLimit } from "@/lib/ratelimit";
import { invalidateCacheGroup } from "@/lib/redis-cache";


export const bookingRouter = createTRPCRouter({

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

            return createdBooking;
        }),
});