"use client";

import { ErrorState } from "@/components/self/error-state"
import { LoadingState } from "@/components/self/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookingHeader } from "../components/BookingHeader"
import { PaymentSummaryCard } from "../components/PaymentSummaryCard"
import { BookedCarCard } from "../components/BookedCarCard"
import { ScheduleLocationCard } from "../components/ScheduleLocationCard"
import { BookingActions } from "../components/BookingActions"

interface BookingIdViewProps {
    bookingId: string;
};

export const BookingIdView = ({ bookingId }: BookingIdViewProps) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.userBookings.getBookingWithDetails.queryOptions({
            bookingId: bookingId
        })
    );

    // FIXED: Destructure the newly aliased data payloads
    const { booking, car, pickUpLocation, dropOffLocation } = data;

    return (
        <div className="min-h-screen bg-[#F4F5F7] py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="px-10 mx-auto space-y-6" id="booking-invoice-content">

                <BookingHeader
                    id={booking.id}
                    status={booking.status}
                />

                <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-stretch">
                    <BookedCarCard car={car} />

                    <PaymentSummaryCard
                        dailyRate={booking.dailyRate}
                        days={booking.days}
                        protectionFee={booking.protectionFee}
                        surchargeFee={booking.surchargeFee}
                        totalPrice={booking.totalPrice}
                        status={booking.status}
                    />
                </div>

                <ScheduleLocationCard
                    startDate={booking.startDate}
                    endDate={booking.endDate}
                    // Pass the names of the locations. If it's a hub, use the hub name. 
                    // If the user typed a custom string, it falls back to the booking string.
                    pickUpLocation={pickUpLocation?.name || booking.pickUpLocation}
                    dropOffLocation={dropOffLocation?.name || booking.dropOffLocation}
                />

                <BookingActions bookingData={data} />
            </div>
        </div>
    )
}

export const BookingIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading booking details"
            descr="This may take from a few seconds to a few minutes."
        />
    )
}

export const BookingIdViewError = () => {
    return (
        <ErrorState
            title="Failed to load booking details"
            descr="Something went wrong while fetching booking details. Try to refresh page."
        />
    )
}