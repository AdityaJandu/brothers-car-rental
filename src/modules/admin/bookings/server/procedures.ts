import { createTRPCRouter, protectedProcedure, rateLimitedProtectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { booking, car, auditLog } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { paginationInputSchema } from "@/constants";
import { getTableColumns, eq, desc, count } from "drizzle-orm";
import { getCachedData, setCachedData, invalidateCacheGroup } from "@/lib/redis-cache";
import { inngest } from "@/inngest/client";

export const adminBookingsRouter = createTRPCRouter({
    getAllAdmin: protectedProcedure
        .input(paginationInputSchema)
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

            if (allBookings.length === 0) {
                return { items: [], total: 0, totalPages: 0 };
            }

            const [totalResult] = await db
                .select({ count: count() })
                .from(booking);

            const totalPages = Math.ceil((totalResult?.count ?? 0) / pageSize);

            const response = {
                items: allBookings,
                total: totalResult?.count ?? 0,
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
        reason: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { bookingId, status, reason } = input;

        // <-- 'tx' is created here
        // Using transaction because of having multiple writes:
        const updateBooking = await db.transaction(async (tx) => {
            const [before] = await tx
                .select()
                .from(booking)
                .where(eq(booking.id, bookingId))
                .limit(1);

            if (!before) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking not found.",
                });
            }

            const [updatedBooking] = await tx
                .update(booking)
                .set({
                    status,
                    ...(status === "cancelled" ? {
                        cancelledAt: new Date(),
                        cancelledBy: "admin",
                        cancellationReason: reason ?? null
                    } : {})
                })
                .where(eq(booking.id, bookingId))
                .returning();


            if (!updatedBooking) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Booking not found or you don't have access to it.",
                });
            }

            const auditActionMap: Record<string, "booking.confirmed" | "booking.cancelled" | "booking.completed" | "booking.expired"> = {
                confirmed: "booking.confirmed",
                cancelled: "booking.cancelled",
                completed: "booking.completed",
                expired: "booking.expired",
            };

            const auditAction = auditActionMap[status];
            if (auditAction) {
                await tx.insert(auditLog).values({
                    adminId: ctx.auth.user.id,
                    adminName: ctx.auth.user.name,
                    adminEmail: ctx.auth.user.email,
                    action: auditAction,
                    targetType: "booking",
                    targetId: bookingId,
                    previousValue: JSON.stringify({ status: before.status }),
                    newValue: JSON.stringify({ status }),
                });
            }

            return updatedBooking;
        }); // <-- Transaction successfully commits here

        await invalidateCacheGroup("bookings:");

        // Fire-and-forget: trigger status change email workflow
        inngest.send({
            name: "booking/status.updated",
            data: {
                bookingId: updateBooking.id,
                newStatus: status,
                userId: updateBooking.userId,
            },
        }).catch((err) => console.error("[Inngest] Failed to send booking/status.updated:", err));

        return updateBooking;
    }),
});
