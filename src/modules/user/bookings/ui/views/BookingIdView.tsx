"use client";

import { ErrorState } from "@/components/self/error-state"
import { LoadingState } from "@/components/self/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
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
        trpc.userBookings.getOne.queryOptions({
            bookingId: bookingId
        })
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/bookings" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#0F172A] transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Bookings
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 mb-8">
                    <BookingHeader
                        id={data.id}
                        status={data.status}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
                    <div className="space-y-6">
                        <BookedCarCard carId={data.carId} />
                        <ScheduleLocationCard
                            startDate={data.startDate}
                            endDate={data.endDate}
                        />
                    </div>

                    <div className="sticky top-8">
                        <PaymentSummaryCard
                            dailyRate={data.dailyRate}
                            days={data.days}
                            protectionFee={data.protectionFee}
                            surchargeFee={data.surchargeFee}
                            totalPrice={data.totalPrice}
                            status={data.status}
                        />
                    </div>
                </div>

                <BookingActions />
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
