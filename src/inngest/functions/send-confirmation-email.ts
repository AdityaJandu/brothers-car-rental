import { inngest } from "../client";
import { db } from "@/db";
import { booking, user, car } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendBookingConfirmationEmail } from "@/lib/emails";

/**
 * Sends booking confirmation email immediately on booking/created.
 * Emails both the customer and admin (if ADMIN_EMAIL is configured).
 */
export const sendConfirmationEmail = inngest.createFunction(
    {
        id: "send-confirmation-email",
        triggers: { event: "booking/created" },
    },
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
