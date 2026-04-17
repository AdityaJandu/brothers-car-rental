import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";


export type GetOneBookingDetails = inferRouterOutputs<AppRouter>["userBookings"]["getBookingWithDetails"];

export type GetOneBooking = inferRouterOutputs<AppRouter>["userBookings"]["getBookingWithDetails"]["booking"];

export type GetLocationOne = inferRouterOutputs<AppRouter>["userBookings"]["getBookingWithDetails"]["pickUpLocation"] | inferRouterOutputs<AppRouter>["userBookings"]["getBookingWithDetails"]["dropOffLocation"];