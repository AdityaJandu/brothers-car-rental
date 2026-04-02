"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { CheckoutForm } from "../components/CheckoutForm";
import { SummaryCard } from "../components/SummaryCard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface CarBookingProps {
    carId: string;
}


export function CarBookingView({ carId }: CarBookingProps) {
    const trpc = useTRPC()

    const { data: car } = useSuspenseQuery(
        trpc.browse.getOne.queryOptions({
            id: carId
        })
    );

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">

            <main className=" mx-auto px-6 lg:px-12 pt-8">


                {/* TODO: Progress Stepper */}
                {/* We'll Probably work on it later */}
                {/* <div className="mb-16">
                    <BookingStepper />
                </div> */}

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-13 gap-12 lg:gap-20">

                    {/* Left Column: Form (Takes up 7 columns on large screens) */}
                    <div className="lg:col-span-8 flex flex-col gap-12">
                        <CheckoutForm car={car} />
                    </div>

                    {/* Right Column: Order Summary (Takes up 5 columns on large screens) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            <SummaryCard car={car} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}


export const CarBookingViewLoading = () => (
    <LoadingState
        title="Loading car"
        descr="This may take from a few seconds to a few minutes."
    />
);

export const CarBookingViewError = () => (
    <ErrorState
        title="Failed to load car"
        descr="Something went wrong while fetching car. Try to refresh page."
    />
);