import { inngest } from "../client";
import { db } from "@/db";
import { booking, user, car } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendStatusChangeEmail } from "@/lib/emails";

/**
 * Sends status change email to customer when admin updates booking status.
 * Triggered by booking/status.updated events.
 */
export const sendStatusChangeEmailFn = inngest.createFunction(
    {
        id: "send-status-change-email",
        triggers: { event: "booking/status.updated" },
    },
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
