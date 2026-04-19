import type { booking, car, user } from "@/db/schema";

// --- Types (derived from Drizzle schema) ---
export type Booking = typeof booking.$inferSelect;
export type Car = typeof car.$inferSelect;
export type User = typeof user.$inferSelect;

// --- Formatting Utilities ---
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function statusBadge(status: string): string {
  const safeStatus = escapeHtml(status);
  const config: Record<string, { color: string; bg: string }> = {
    pending: { color: "#92400E", bg: "#FEF3C7" },
    confirmed: { color: "#065F46", bg: "#D1FAE5" },
    cancelled: { color: "#991B1B", bg: "#FEE2E2" },
    completed: { color: "#1E40AF", bg: "#DBEAFE" },
    expired: { color: "#78350F", bg: "#FEF3C7" },
  };
  const c = config[safeStatus] || { color: "#334155", bg: "#F1F5F9" };
  return `<span style="background:${c.bg};color:${c.color};padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;text-transform:uppercase;">${safeStatus}</span>`;
}

// --- Shared Email Layout ---
export function emailLayout(title: string, body: string): string {
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

// --- Shared Booking Details Table ---
export function bookingTable(b: Booking, carData: Car): string {
  const safeId = escapeHtml(b.id.slice(0, 8).toUpperCase());
  const safeMake = escapeHtml(carData.make);
  const safeModel = escapeHtml(carData.model);
  const safeYear = escapeHtml(String(carData.year));

  return `
    <div style="background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#64748b;">Booking ID</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#1e293b;">#${safeId}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Vehicle</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${safeMake} ${safeModel} (${safeYear})</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Pick-up</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${formatDate(b.startDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Drop-off</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${formatDate(b.endDate)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Duration</td><td style="padding:8px 0;text-align:right;font-weight:500;color:#1e293b;">${b.days} day${b.days > 1 ? "s" : ""}</td></tr>
        <tr style="border-top:1px solid #e2e8f0;"><td style="padding:12px 0 8px;color:#64748b;font-weight:600;">Total</td><td style="padding:12px 0 8px;text-align:right;font-weight:700;font-size:18px;color:#1e293b;">${formatCurrency(b.totalPrice)}</td></tr>
      </table>
    </div>`;
}
