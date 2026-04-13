/**
 * Deprecated modularization fallback.
 * Re-exports the unified modular email layer configuration and functions
 * from the single source-of-truth inside @/lib/emails
 */
export { resend, FROM_EMAIL, ADMIN_EMAIL } from "./emails/client";
export * from "./emails";
