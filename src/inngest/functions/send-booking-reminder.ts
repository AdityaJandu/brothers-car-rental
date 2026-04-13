import { inngest } from "../client";
import { db } from "@/db";
import { booking, user, car } from "@/db/schema";
import { eq } from "drizzle-orm";
import { subHours } from "date-fns";
import { sendBookingReminderEmail } from "@/lib/emails";

/**
 * Sends a 24-hour pickup reminder for confirmed bookings.
 *
 * Steps:
 * 1. Fetch booking startDate
 * 2. Guard: skip if pickup < 24h away (no reminder for last-minute bookings)
 * 3. sleepUntil 24h before pickup
 * 4. Check if still confirmed (skip if cancelled/expired/etc.)
 * 5. Send reminder email (exactly once — Inngest steps are durable)
 */
export const sendBookingReminder = inngest.createFunction(
    {
        id: "send-booking-reminder",
        triggers: { event: "booking/created" },
    },
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
        
        const shouldSkip = await step.run("guard.pickup-time", async () => {
            return reminderTime <= new Date();
        });

        if (shouldSkip) {
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
