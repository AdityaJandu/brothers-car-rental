import type { user } from "@/db/schema";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "./client";
import { emailLayout, bookingTable, statusBadge } from "./templates";
import type { Booking, Car } from "./templates";

type User = typeof user.$inferSelect;

/**
 * Sends booking confirmation to the customer + actionable alert to admin.
 */
export async function sendBookingConfirmationEmail(
    b: Booking,
    carData: Car,
    userData: User,
): Promise<void> {
    const customerHtml = emailLayout("Booking Confirmation", `
      <p style="margin:0 0 16px;font-size:16px;color:#334155;">Hi ${userData.name},</p>
      <p style="margin:0 0 16px;font-size:14px;color:#64748b;">Your booking has been received and is being processed. Here are your details:</p>
      ${bookingTable(b, carData)}
      <p style="margin:16px 0 0;font-size:13px;color:#94a3b8;text-align:center;">You'll receive another email once your booking is confirmed by our team.</p>
    `);

    // Send to customer
    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: b.email,
            subject: `Booking Received — #${b.id.slice(0, 8).toUpperCase()}`,
            html: customerHtml,
        });

        if (error) {
            console.error(`[Resend] API Error sending confirmation to customer:`, { error, bookingId: b.id });
        } else {
            console.log(`[Resend] Confirmation email sent to customer for booking ${b.id}`);
        }
    } catch (error) {
        console.error(`[Resend] Exception sending confirmation email:`, { error, bookingId: b.id });
    }

    // Send admin alert — actionable notification to review the booking
    if (!ADMIN_EMAIL) {
        console.warn("[Resend] ADMIN_EMAIL not configured, skipping admin booking alert");
        return;
    }
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `🔔 New Booking Request — ${carData.make} ${carData.model} by ${userData.name}`,
            html: emailLayout("New Booking Alert", `
                  <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;margin:0 0 20px;">
                    <p style="margin:0;font-size:14px;color:#9A3412;font-weight:600;">⚡ Action Required</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#9A3412;">A new booking request has come in and needs your review. Please check your admin panel to confirm or manage this booking.</p>
                  </div>

                  <p style="margin:0 0 8px;font-size:13px;color:#64748b;">Customer</p>
                  <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1e293b;">${userData.name}</p>
                  <p style="margin:0 0 20px;font-size:13px;color:#64748b;">${userData.email} · ${b.phoneNumber}</p>

                  ${bookingTable(b, carData)}

                  <p style="margin:0 0 20px;font-size:13px;color:#64748b;">Current Status: ${statusBadge(b.status)}</p>

                  <a href="${APP_URL}/admin-booking/${b.id}" style="display:block;text-align:center;background:#1E2A44;color:white;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Review on Dashboard →</a>
                `),
        });

        if (error) {
            console.error(`[Resend] API Error sending admin booking alert:`, { error, bookingId: b.id, ADMIN_EMAIL });
        } else {
            console.log(`[Resend] Admin alert sent for booking ${b.id}`);
        }
    } catch (error) {
        console.error(`[Resend] Exception sending admin booking alert:`, { error, bookingId: b.id });
    }
}
