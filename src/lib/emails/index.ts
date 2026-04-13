/**
 * Email Layer — Barrel export
 *
 * To add a new email type:
 * 1. Create a new file in src/lib/emails/ (e.g., payment-receipt.ts)
 * 2. Import shared utilities from ./client and ./templates
 * 3. Re-export the function here
 */
export { sendBookingConfirmationEmail } from "./booking-confirmation";
export { sendStatusChangeEmail } from "./status-change";
export { sendBookingReminderEmail } from "./booking-reminder";
