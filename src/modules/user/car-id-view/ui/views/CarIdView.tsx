"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorState } from "@/components/self/error-state";
import { CarBookingSection } from "../components/CarBookingSection";
import { CarDetailSection } from "../components/CarDetailsSection";
import { Star } from "lucide-react";

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
            <main className=" mx-auto px-6 lg:px-12 pt-8 lg:pt-12 font-display">
                {/* Header (Title & Badge) */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#E0EEF7] text-[#517fa4] text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                            {car.category.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                            <span className="font-semibold">{car.rating}</span>
                            <span className="text-slate-400">(124 reviews)</span>
                        </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                        {car.name} {car.model}
                    </h1>
                </div>

                {/* Grid Layout: Image/Booking on top in Mobile, Right side in Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-13 gap-12 lg:gap-20">
                    <div className="lg:col-span-8 flex flex-col order-2 lg:order-1">
                        <CarDetailSection car={car} />
                    </div>
                    <div className="lg:col-span-5 order-1 lg:order-2">
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