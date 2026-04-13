import { inngest } from "./client";
import { db } from "@/db";
import { booking, user, car } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { subHours } from "date-fns";
import { sendBookingConfirmationEmail, sendStatusChangeEmail, sendBookingReminderEmail } from "@/lib/resend";
import { invalidateCacheGroup } from "@/lib/redis-cache";

// ============================================================
// 1. SEND CONFIRMATION EMAIL — immediate on booking/created
// ============================================================
export const sendConfirmationEmail = inngest.createFunction(
    { id: "send-confirmation-email", triggers: { event: "booking/created" } },
    async ({ event, step }) => {
        await step.run("send-confirmation", async () => {
            const result = await db
                .select({ booking: booking, user: user, car: car })
                .from(booking)
                .innerJoin(user, eq(booking.userId, user.id))
                .innerJoin(car, eq(booking.carId, car.id))
                .where(eq(booking.id, event.data.bookingId))
                .limit(1);

            if (!result[0]) {
                console.warn("[Inngest] Booking not found, skipping confirmation email:", event.data.bookingId);
                return { skipped: true };
            }

            const { booking: b, user: u, car: c } = result[0];
            await sendBookingConfirmationEmail(b, c, u);
            return { sent: true };
        });
    },
);

// ============================================================
// 2. EXPIRE PENDING BOOKING — sleep 15m, then expire if still pending
// ============================================================
export const expirePendingBooking = inngest.createFunction(
    { id: "expire-pending-booking", triggers: { event: "booking/created" } },
    async ({ event, step }) => {
        await step.sleep("wait-15-minutes", "15m");

        const expireResult = await step.run("expire-if-still-pending", async () => {
            // Idempotent: only expires bookings still in "pending" state
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

            // Invalidate cache so dashboards reflect the change
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

// ============================================================
// 3. SEND 24H REMINDER — sleepUntil 24h before pickup
// ============================================================
export const sendBookingReminder = inngest.createFunction(
    { id: "send-booking-reminder", triggers: { event: "booking/created" } },
    async ({ event, step }) => {
        // Step 1: Fetch the booking to get startDate
        const bookingData = await step.run("fetch-booking-dates", async () => {
            const [result] = await db
                .select({ startDate: booking.startDate })
                .from(booking)
                .where(eq(booking.id, event.data.bookingId))
                .limit(1);

            return result ?? null;
        });

        if (!bookingData) {
            return { skipped: true, reason: "booking-not-found" };
        }

        // Step 2: Guard — skip if pickup is less than 24h away
        const reminderTime = subHours(new Date(bookingData.startDate), 24);
        if (reminderTime <= new Date()) {
            return { skipped: true, reason: "pickup-less-than-24h-away" };
        }

        // Step 3: Sleep until 24h before pickup
        await step.sleepUntil("wait-until-reminder", reminderTime);

        // Step 4: Check if booking is still confirmed
        const shouldSend = await step.run("check-still-confirmed", async () => {
            const [result] = await db
                .select({ status: booking.status })
                .from(booking)
                .where(eq(booking.id, event.data.bookingId))
                .limit(1);

            if (!result || result.status !== "confirmed") {
                console.log("[Inngest] Booking no longer confirmed, skipping reminder:", event.data.bookingId);
                return false;
            }
            return true;
        });

        if (!shouldSend) {
            return { skipped: true, reason: "no-longer-confirmed" };
        }

        // Step 5: Send the reminder (exactly once — Inngest steps are durable)
        await step.run("send-reminder-email", async () => {
            const [result] = await db
                .select({ booking: booking, user: user, car: car })
                .from(booking)
                .innerJoin(user, eq(booking.userId, user.id))
                .innerJoin(car, eq(booking.carId, car.id))
                .where(eq(booking.id, event.data.bookingId))
                .limit(1);

            if (!result) return { skipped: true };

            const { booking: b, user: u, car: c } = result;
            await sendBookingReminderEmail(b, c, u);
            return { sent: true };
        });
    },
);

// ============================================================
// 4. SEND STATUS CHANGE EMAIL — immediate on booking/status.updated
// ============================================================
export const sendStatusChangeEmailFn = inngest.createFunction(
    { id: "send-status-change-email", triggers: { event: "booking/status.updated" } },
    async ({ event, step }) => {
        await step.run("send-status-email", async () => {
            const [result] = await db
                .select({ booking: booking, user: user, car: car })
                .from(booking)
                .innerJoin(user, eq(booking.userId, user.id))
                .innerJoin(car, eq(booking.carId, car.id))
                .where(eq(booking.id, event.data.bookingId))
                .limit(1);

            if (!result) {
                console.warn("[Inngest] Booking not found for status email:", event.data.bookingId);
                return { skipped: true };
            }

            const { booking: b, user: u, car: c } = result;
            await sendStatusChangeEmail(b, c, u, event.data.newStatus);
            return { sent: true, newStatus: event.data.newStatus };
        });
    },
);