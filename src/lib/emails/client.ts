import { Resend } from "resend";

// --- Validate env ---
if (!process.env.RESEND_API_KEY) {
    console.error("[Resend] RESEND_API_KEY is not set. Email sending will fail.");
    throw new Error("[Resend] RESEND_API_KEY is not set. Email sending will fail.");
}

// --- Resend Client (singleton) ---
export const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.BROTHERS_FROM_EMAIL;
if (!fromEmail) {
    console.error("[Resend] BROTHERS_FROM_EMAIL is not set. Email sending will fail.");
    throw new Error("[Resend] BROTHERS_FROM_EMAIL is not set. Email sending will fail.");
}

const adminEmail = process.env.ADMIN_EMAIL;
if (!adminEmail) {
    console.error("[Resend] ADMIN_EMAIL is not set. Email sending will fail.");
    throw new Error("[Resend] ADMIN_EMAIL is not set. Email sending will fail.");
}

// --- Constants ---
export const FROM_EMAIL = `Brothers Car Rental <${fromEmail}>`;
export const ADMIN_EMAIL = adminEmail;
