import { Resend } from "resend";
import type { booking, user, car } from "@/db/schema";

// --- Resend Client ---
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Brothers Car Rental <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'janduaditay@gmail.com';

// --- Types (derived from Drizzle schema) ---
type Booking = typeof booking.$inferSelect;
type User = typeof user.$inferSelect;
type Car = typeof car.$inferSelect;

// --- Utility ---
function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function statusBadge(status: string): string {
    const config: Record<string, { color: string; bg: string }> = {
        pending: { color: "#92400E", bg: "#FEF3C7" },
        confirmed: { color: "#065F46", bg: "#D1FAE5" },
        cancelled: { color: "#991B1B", bg: "#FEE2E2" },
        completed: { color: "#1E40AF", bg: "#DBEAFE" },
        expired: { color: "#78350F", bg: "#FEF3C7" },
    };
    const c = config[status] || { color: "#334155", bg: "#F1F5F9" };
    return `<span style="background:${c.bg};color:${c.color};padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;text-transform:uppercase;">${status}</span>`;
}

// --- Shared email wrapper ---
function emailLayout(title: string, body: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#1E2A44;border-radius:12px 12px 0 0;padding:28px 32px;color:white;text-align:center;">
      <h1 style="margin:0 0 4px;font-size:22px;font-weight:700;">Brothers Car Rental</h1>
      <p style="margin:0;opacity:0.7;font-size:13px;">${title}</p>
    </div>
    <div style="background:white;border-radius:0 0 12px 12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      ${body}
    </div>
    <p style="text-align:center;margin:20px 0 0;font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} Brothers Car Rental. All rights reserved.</p>
  </div>
</body>
</html>`;
}

function bookingTable(b: Booking, carData: Car): string {
    return `
    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#64748b;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1e293b;">#${b.id.slice(0, 8).toUpperCase()}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Vehicle</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${carData.make} ${carData.model} (${carData.year})</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Pick-up</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${formatDate(b.startDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Drop-off</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${formatDate(b.endDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Duration</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${b.days} day${b.days > 1 ? "s" : ""}</td></tr>
        <tr style="border-top:1px solid #e2e8f0;"><td style="padding:12px 0 8px;color:#64748b;font-weight:600;">Total</td><td style="padding:12px 0 8px;text-align:right;font-weight:700;font-size:18px;color:#1e293b;">${formatCurrency(b.totalPrice)}</td></tr>
      </table>
    </div>`;
}

// ============================================================
// 1. BOOKING CONFIRMATION EMAIL
// ============================================================
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

// ============================================================
// 2. STATUS CHANGE EMAIL
// ============================================================

const STATUS_MESSAGES: Record<string, string> = {
    confirmed: "Great news! Your booking has been confirmed by our team. Your car will be ready for pick-up on the scheduled date.",
    cancelled: "Your booking has been cancelled. If you did not request this, please contact our support team.",
    completed: "Your rental has been completed. Thank you for choosing Brothers Car Rental! We hope you had a great experience.",
    expired: "Your booking has expired because it was not confirmed within 15 minutes. You can create a new booking at any time.",
};

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

// ============================================================
// 3. BOOKING REMINDER EMAIL (24h before pickup — customer only)
// ============================================================
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
