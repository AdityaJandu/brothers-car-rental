import type { user } from "@/db/schema";
import { resend, FROM_EMAIL } from "./client";
import { emailLayout, bookingTable, formatDate } from "./templates";
import type { Booking, Car } from "./templates";

type User = typeof user.$inferSelect;

/**
 * Sends a 24h pickup reminder to the customer only.
 */
export async function sendBookingReminderEmail(
    b: Booking,
    carData: Car,
    userData: User,
): Promise<void> {
    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: b.email,
            subject: `Reminder: Your rental starts tomorrow — ${carData.name}`,
            html: emailLayout("Pickup Reminder", `
              <p style="margin:0 0 16px;font-size:16px;color:#334155;">Hi ${userData.name},</p>
              <p style="margin:0 0 16px;font-size:14px;color:#64748b;">This is a friendly reminder that your car rental is scheduled to start <strong>tomorrow</strong>.</p>

              <div style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:20px;margin:0 0 20px;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;color:#065F46;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Pick-up Date</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#065F46;">${formatDate(b.startDate)}</p>
              </div>

              ${bookingTable(b, carData)}

              <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;margin:0 0 16px;">
                <p style="margin:0;font-size:13px;color:#9A3412;">📋 <strong>Don't forget to bring:</strong> Valid driver's license, booking confirmation, and a valid ID.</p>
              </div>
            `),
        });

        if (error) {
            console.error(`[Resend] API Error sending reminder email:`, { error, bookingId: b.id });
        } else {
            console.log(`[Resend] Reminder email sent for booking ${b.id}`);
        }
    } catch (error) {
        console.error(`[Resend] Exception sending reminder email:`, { error, bookingId: b.id });
    }
}
