/**
 * Inngest Functions — Barrel export
 *
 * To add a new workflow:
 * 1. Create a new file in src/inngest/functions/ (e.g., send-payment-receipt.ts)
 * 2. Import the inngest client from ../client
 * 3. Export and add the function to the array below
 * 4. It will be auto-registered in the API route handler
 */
import { sendConfirmationEmail } from "./functions/send-confirmation-email";
import { expirePendingBooking } from "./functions/expire-pending-booking";
import { sendBookingReminder } from "./functions/send-booking-reminder";
import { sendStatusChangeEmailFn } from "./functions/send-status-change-email";

/** All registered Inngest functions — import this array in the serve handler */
export const allFunctions = [
    sendConfirmationEmail,
    expirePendingBooking,
    sendBookingReminder,
    sendStatusChangeEmailFn,
];
