import { db } from "@/db";
import { booking } from "@/db/schema";
import { and, eq, lt, gt, inArray, asc } from "drizzle-orm";

/**
 * Statuses that block availability — both confirmed and pending
 * bookings prevent new reservations for the same dates.
 * This eliminates the race condition window where two users
 * could submit overlapping pending bookings simultaneously.
 */
const BLOCKING_STATUSES = ["confirmed", "pending"] as const;

/**
 * Check if a booking conflict exists for a given car and date range.
 *
 * Uses the standard overlap formula:
 *   newStart < existingEnd AND newEnd > existingStart
 *
 * Boundary rule: inclusive start, exclusive end.
 * A car returned on April 15 (endDate) can be re-booked starting April 15.
 *
 * @returns true if a conflict exists (car is NOT available)
 */
export async function checkBookingConflict(
    carId: string,
    startDate: Date,
    endDate: Date,
): Promise<boolean> {
    const [conflict] = await db
        .select({ id: booking.id })
        .from(booking)
        .where(
            and(
                eq(booking.carId, carId),
                inArray(booking.status, [...BLOCKING_STATUSES]),
                lt(booking.startDate, endDate),   // existingStart < newEnd
                gt(booking.endDate, startDate),    // existingEnd > newStart
            )
        )
        .limit(1);

    return !!conflict;
}

/**
 * Get all unavailable (blocked) date ranges for a given car.
 * Returns an ordered list of date ranges where the car cannot be booked.
 *
 * Used by the frontend DatePicker to disable dates and show availability.
 */
export async function getUnavailableDateRanges(
    carId: string,
): Promise<Array<{ startDate: Date; endDate: Date }>> {
    const blockedBookings = await db
        .select({
            startDate: booking.startDate,
            endDate: booking.endDate,
        })
        .from(booking)
        .where(
            and(
                eq(booking.carId, carId),
                inArray(booking.status, [...BLOCKING_STATUSES]),
                // Only include future/current bookings (endDate hasn't passed)
                gt(booking.endDate, new Date()),
            )
        )
        .orderBy(asc(booking.startDate));

    return blockedBookings;
}
