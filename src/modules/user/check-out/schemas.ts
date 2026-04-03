import { z } from "zod";

export const bookingInsertSchema = z.object({
    id: z.string().optional(),

    // --- RELATIONS ---
    userId: z.string().optional(),
    carId: z.string().min(1, "Car selection is required"),

    // --- SCHEDULING ---
    // Fixed: Zod expects 'required_error' and 'invalid_type_error'
    startDate: z.coerce.date({
        error: "Please choose a valid date"
    }),

    endDate: z.coerce.date({
        error: "Please choose a valid date"
    }),

    // --- FORM: PERSONAL DETAILS ---
    fullName: z.string().min(2, "Full name must be at least 2 characters"),

    // Fixed: Changed z.email() to z.string().email()
    email: z.string().email("Please enter a valid email address"),

    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    licenseNumber: z.string().min(5, "License number is required"),

    // --- FORM: PAYMENT ---
    // Fixed: Zod enum custom errors require an object configuration
    paymentMethod: z.enum(["card", "wallet", "cash"],
        "Please choose a valid way"
    ),

    // --- FINANCIAL BREAKDOWN (In cents) ---
    // Note: If you still get a 400 error when submitting, remove the `.int()` calls here!
    dailyRate: z.number().int().min(0),
    days: z.number().int().min(1, "Must book for at least 1 day"),
    protectionFee: z.number().int().min(0),
    surchargeFee: z.number().int().min(0),
    totalPrice: z.number().int().min(0),

    // --- STATUS ---
    status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),

}).refine((data) => data.endDate > data.startDate, {
    message: "Drop-off date must be after the pick-up date",
    path: ["endDate"], // This attaches the error specifically to the endDate field in React Hook Form
});