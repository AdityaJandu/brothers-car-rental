import { z } from "zod";

// --- Server-side schema (used by tRPC procedures) ---
// Uses z.coerce.date() to handle JSON string → Date coercion from the network.
// The .refine() adds cross-field validation (endDate > startDate).
export const bookingInsertSchema = z.object({
    id: z.string().optional(),

    // --- RELATIONS ---
    userId: z.string().optional(),
    carId: z.string().min(1, "Car selection is required"),

    // --- SCHEDULING ---
    startDate: z.coerce.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Pick-up date cannot be in the past"
    }),

    endDate: z.coerce.date(),

    // --- LOCATION ---
    pickUpLocation: z.string().min(1, "Pick-up location is required"),
    dropOffLocation: z.string().min(1, "Drop-off location is required"),

    // --- FORM: PERSONAL DETAILS ---
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    licenseNumber: z.string().min(5, "License number is required"),

    // --- FORM: PAYMENT ---
    paymentMethod: z.enum(["card", "wallet", "cash"], {
        error: "Please choose a valid payment method",
    }),

    // --- FINANCIAL BREAKDOWN (In cents) ---
    dailyRate: z.number().int().min(0),
    days: z.number().int().min(1, "Must book for at least 1 day"),
    protectionFee: z.number().int().min(0),
    surchargeFee: z.number().int().min(0),
    totalPrice: z.number().int().min(0),

    // --- STATUS ---
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]),

}).refine((data) => data.endDate > data.startDate, {
    message: "Drop-off date must be after the pick-up date",
    path: ["endDate"],
});

// --- Client-side form schema (used by react-hook-form + zodResolver) ---
// Uses z.date() instead of z.coerce.date() because:
//   - The form already provides real Date objects (no coercion needed)
//   - z.coerce.date() infers its INPUT type as `unknown` in Zod 4,
//     which breaks zodResolver's type inference via z4.input<T>
// No top-level .refine() — ZodEffects also breaks react-hook-form types.
export const bookingFormSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    carId: z.string().min(1, "Car selection is required"),
    startDate: z.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Pick-up date cannot be in the past"
    }),
    endDate: z.date(),
    pickUpLocation: z.string().min(1, "Pick-up location is required"),
    dropOffLocation: z.string().min(1, "Drop-off location is required"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    licenseNumber: z.string().min(5, "License number is required"),
    paymentMethod: z.enum(["card", "wallet", "cash"], {
        error: "Please choose a valid payment method",
    }),
    dailyRate: z.number().int().min(0),
    days: z.number().int().min(1, "Must book for at least 1 day"),
    protectionFee: z.number().int().min(0),
    surchargeFee: z.number().int().min(0),
    totalPrice: z.number().int().min(0),
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});