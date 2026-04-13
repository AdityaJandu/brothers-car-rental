import type { user } from "@/db/schema";
import { resend, FROM_EMAIL } from "./client";
import { emailLayout, bookingTable, statusBadge } from "./templates";
import type { Booking, Car } from "./templates";

type User = typeof user.$inferSelect;

const STATUS_MESSAGES: Record<string, string> = {
    confirmed: "Great news! Your booking has been confirmed by our team. Your car will be ready for pick-up on the scheduled date.",
    cancelled: "Your booking has been cancelled. If you did not request this, please contact our support team.",
    completed: "Your rental has been completed. Thank you for choosing Brothers Car Rental! We hope you had a great experience.",
    expired: "Your booking has expired because it was not confirmed within 15 minutes. You can create a new booking at any time.",
};

/**
 * Sends status change notification to the customer only.
 */
export async function sendStatusChangeEmail(
    b: Booking,
    carData: Car,
    userData: User,
    newStatus: string,
): Promise<void> {
    const message = STATUS_MESSAGES[newStatus] || `Your booking status has been updated to ${newStatus}.`;

    const html = emailLayout("Booking Status Update", `
      <p style="margin:0 0 16px;font-size:16px;color:#334155;">Hi ${userData.name},</p>
      <p style="margin:0 0 8px;font-size:14px;color:#64748b;">${message}</p>
      <p style="margin:0 0 16px;font-size:14px;">Status: ${statusBadge(newStatus)}</p>
      ${bookingTable(b, carData)}
    `);

    // Send to customer only (admin is not notified for status changes)
    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: b.email,
            subject: `Booking ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} — #${b.id.slice(0, 8).toUpperCase()}`,
            html,
        });

        if (error) {
            console.error(`[Resend] API Error sending status change email:`, { error, bookingId: b.id, newStatus });
        } else {
            console.log(`[Resend] Status change email (${newStatus}) sent for booking ${b.id}`);
        }
    } catch (error) {
        console.error(`[Resend] Exception sending status change email:`, { error, bookingId: b.id, newStatus });
    }
}
