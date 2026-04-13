import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
    sendConfirmationEmail,
    expirePendingBooking,
    sendBookingReminder,
    sendStatusChangeEmailFn,
} from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        sendConfirmationEmail,
        expirePendingBooking,
        sendBookingReminder,
        sendStatusChangeEmailFn,
    ],
});