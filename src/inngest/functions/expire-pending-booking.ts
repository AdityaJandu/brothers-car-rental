import { inngest } from "../client";
import { db } from "@/db";
import { booking, user, car } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sendStatusChangeEmail } from "@/lib/emails";
import { invalidateCacheGroup } from "@/lib/redis-cache";

/**
 * Auto-expires pending bookings after 15 minutes.
 * 
 * Steps:
 * 1. Sleep 15 minutes
 * 2. Idempotent UPDATE WHERE status='pending' → 'expired'
 * 3. Send expiry notification email (separate step for independent retry)
 */
export const expirePendingBooking = inngest.createFunction(
    {
        id: "expire-pending-booking",
        triggers: { event: "booking/created" },
    },
    async ({ event, step }) => {
        await step.sleep("wait-15-minutes", "15m");

        const expireResult = await step.run("expire-if-still-pending", async () => {
            const result = await db
                .update(booking)
                .set({ status: "expired" })
                .where(
                    and(
                        eq(booking.id, event.data.bookingId),
                        eq(booking.status, "pending"),
                    ),
                )
                .returning({ id: booking.id, status: booking.status });

            if (result.length === 0) {
                console.log("[Inngest] Booking no longer pending, skipping expiry:", event.data.bookingId);
                return { expired: false };
            }

            await invalidateCacheGroup("bookings:");
            console.log("[Inngest] Booking expired:", event.data.bookingId);

            return { expired: true };
        });

        // Only send the expiry email if the booking was actually expired
        if (expireResult.expired) {
            await step.run("send-expiry-email", async () => {
                const [joined] = await db
                    .select({ booking: booking, user: user, car: car })
                    .from(booking)
                    .innerJoin(user, eq(booking.userId, user.id))
                    .innerJoin(car, eq(booking.carId, car.id))
                    .where(eq(booking.id, event.data.bookingId))
                    .limit(1);

                if (!joined) return { skipped: true, reason: "data-not-found" };

                const { booking: b, user: u, car: c } = joined;
                await sendStatusChangeEmail(b, c, u, "expired");
                return { sent: true };
            });
        }
    },
);
