"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorState } from "@/components/self/error-state";
import { CarBookingSection } from "../components/CarBookingSection";
import { CarDetailSection } from "../components/CarDetailsSection";

interface CarIdViewProps {
    carId: string;
}

export const CarIdView = ({ carId }: CarIdViewProps) => {
    const trpc = useTRPC();

    const { data: car } = useSuspenseQuery(
        trpc.browse.getOne.queryOptions({ id: carId })
    );

    const images = car.imageUrls?.length ? car.imageUrls : [car.headerImage];

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20">
            <main className=" mx-auto px-6 lg:px-12 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-13 gap-12 lg:gap-20">
                    <div className="lg:col-span-8 flex flex-col">
                        <CarDetailSection car={car} />
                    </div>
                    <div className="lg:col-span-5">
                        <CarBookingSection car={car} images={images} />
                    </div>
                </div>
            </main>

        </div >
    );
};


export const CarIdViewLoading = () => (
    <LoadingState
        title="Loading car"
        descr="This may take from a few seconds to a few minutes."
    />
);

export const CarIdViewError = () => (
    <ErrorState
        title="Failed to load car"
        descr="Something went wrong while fetching car. Try to refresh page."
    />
);