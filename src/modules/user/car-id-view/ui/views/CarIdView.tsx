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
        trpc.userBrowse.getOne.queryOptions({ id: carId })
    );

    const images = car.imageUrls?.length ? car.imageUrls : [car.headerImage];

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `${car.make} ${car.model}`,
        description: car.description,
        image: car.headerImage,
        offers: {
            "@type": "Offer",
            price: car.pricePerDay,
            priceCurrency: "INR",
            availability:
                car.status === "available"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            url: `https://www.brothersgroupindia.online/browse/${car.id}`,
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.brothersgroupindia.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Browse",
                item: "https://www.brothersgroupindia.online/browse",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: `${car.make} ${car.model}`,
                item: `https://www.brothersgroupindia.online/browse/${car.id}`,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
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