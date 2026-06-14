import type { Metadata } from "next";
import { CarIdViewLoading, CarIdViewError, CarIdView } from "@/modules/user/car-id-view/ui/views/CarIdView";

import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { db } from "@/db";
import { car, location } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";


interface Props {

    // carId -> should match the [carId] -> Folder
    params: Promise<{ carId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { carId } = await params;

    const [data] = await db
        .select({
            make: car.make,
            model: car.model,
            year: car.year,
            category: car.category,
            pricePerDay: car.pricePerDay,
            seats: car.seats,
            transmission: car.transmission,
            fuelType: car.fuelType,
            headerImage: car.headerImage,
            isActive: car.isActive,
            city: location.city,
        })
        .from(car)
        .innerJoin(location, eq(car.locationId, location.id))
        .where(
            and(
                eq(car.id, carId),
                isNull(car.deletedAt),
                eq(car.isActive, true)
            )
        );

    if (!data || !data.isActive) {
        notFound();
    }

    const title = `Rent ${data.year} ${data.make} ${data.model} in ${data.city}`;
    const description = `${data.make} ${data.model} available for ₹${data.pricePerDay}/day in ${data.city}. ${data.seats} seats, ${data.transmission}, ${data.fuelType}. Book instantly with Brothers Car Rental.`;

    return {
        title,
        description,
        keywords: [
            data.make,
            data.model,
            `rent ${data.make} ${data.model}`,
            `car rental ${data.city}`,
            `${data.category} rental india`,
            "brothers car rental",
        ],
        openGraph: {
            type: "website",
            title,
            description,
            images: [
                {
                    url: data.headerImage,
                    width: 1200,
                    height: 630,
                    alt: `${data.make} ${data.model}`,
                },
            ],
        },
        alternates: {
            canonical: `https://www.brothersgroupindia.online/browse/${carId}`,
        },
    };
}

const Page = async ({ params }: Props) => {
    const { carId } = await params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.userBrowse.getOne.queryOptions({ id: carId }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<CarIdViewLoading />}>
                <ErrorBoundary fallback={<CarIdViewError />}>
                    <CarIdView carId={carId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;