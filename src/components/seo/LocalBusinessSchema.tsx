import React from "react";
import type { CityConfig } from "@/lib/locations";

interface LocalBusinessSchemaProps {
    city: CityConfig;
}

export function LocalBusinessSchema({ city }: LocalBusinessSchemaProps) {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": ["CarRental", "LocalBusiness"],
        "name": `Brothers Car Rental — ${city.name}`,
        "description": city.heroDescription,
        "url": `https://www.brothersgroupindia.online/car-rental/${city.slug}`,
        "telephone": city.phone,
        "priceRange": city.priceRange,
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.brothersgroupindia.online/app-logo.svg"
        },
        "image": city.ogImage
            ? `https://www.brothersgroupindia.online${city.ogImage}`
            : "https://www.brothersgroupindia.online/images/og-default.jpg",
        "hasMap": `https://maps.google.com/?q=${city.latitude},${city.longitude}`,
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": city.latitude,
            "longitude": city.longitude
        },
        "areaServed": [
            { "@type": "AdministrativeArea", "name": city.name },
            { "@type": "AdministrativeArea", "name": city.state },
            ...city.deliveryHubs.map((hub) => ({
                "@type": "Place",
                "name": hub
            }))
        ],
        "sameAs": [
            // Add actual Google Business Profile URL here when available
            // "https://g.page/brothers-car-rental",
            // "https://www.facebook.com/brotherscarrental",
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "214",
            "bestRating": "5",
            "worstRating": "1"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "parentOrganization": {
            "@type": "Organization",
            "name": "Brothers Car Rental",
            "url": "https://www.brothersgroupindia.online"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData).replace(/</g, '\\u003c') }}
        />
    );
}
