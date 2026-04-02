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
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <CarDetailSection car={car} />
            <CarBookingSection car={car} images={images} />
        </div>
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