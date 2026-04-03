import { z } from "zod";
import { bookingInsertSchema } from "./schemas";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type BookingInsertInput = z.infer<typeof bookingInsertSchema>;

// Extracts the entire return object: { items: [...], total: number, totalPages: number }
export type BookingGetAllOutput = inferRouterOutputs<AppRouter>["userBookings"]["getAll"];

// Extracts just the array of bookings to use in your Table/Columns
export type BookingGetMany = BookingGetAllOutput["items"];

// Optional: Extract a single booking type from that array for your Row type!
export type BookingRow = BookingGetMany[0];