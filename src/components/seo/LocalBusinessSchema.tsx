import React from "react";

const dehradunSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CarRental"],
    "@id": "https://www.brothersgroupindia.online/locations/dehradun",
    name: "Brothers Car Rental — Dehradun",
    url: "https://www.brothersgroupindia.online",
    telephone: "+91-9999999999", // REPLACE with actual
    email: "support@brothersgroupindia.online",
    image: "https://www.brothersgroupindia.online/images/og-default.jpg",
    description:
        "Self-drive car rental in Dehradun. Hatchbacks, sedans, and SUVs from ₹749/day with doorstep delivery.",
    priceRange: "₹749 - ₹6000",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
    geo: {
        "@type": "GeoCoordinates",
        latitude: 30.3165,
        longitude: 78.0322,
    },
    address: {
        "@type": "PostalAddress",
        streetAddress: "Brothers Car Rental, ISBT", // REPLACE with actual
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
    },
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "08:00",
            closes: "20:00",
        },
    ],
    areaServed: [
        { "@type": "City", name: "Dehradun" },
        { "@type": "City", name: "Rishikesh" },
        { "@type": "City", name: "Mussoorie" },
        { "@type": "City", name: "Haridwar" },
    ],
    hasMap: "https://maps.google.com/?q=Brothers+Car+Rental+Dehradun",
    sameAs: ["https://www.brothersgroupindia.online"],
};

const hisarSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CarRental"],
    "@id": "https://www.brothersgroupindia.online/locations/hisar",
    name: "Brothers Car Rental — Hisar",
    url: "https://www.brothersgroupindia.online",
    telephone: "+91-9999999999", // REPLACE with actual
    email: "support@brothersgroupindia.online",
    image: "https://www.brothersgroupindia.online/images/og-default.jpg",
    description:
        "Self-drive car rental in Hisar. Affordable fleet, doorstep delivery, and premium service.",
    priceRange: "₹749 - ₹6000",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
    geo: {
        "@type": "GeoCoordinates",
        latitude: 29.1492,
        longitude: 75.7217,
    },
    address: {
        "@type": "PostalAddress",
        streetAddress: "Brothers Car Rental, Camp Chowk", // REPLACE with actual
        addressLocality: "Hisar",
        addressRegion: "Haryana",
        postalCode: "125001",
        addressCountry: "IN",
    },
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "08:00",
            closes: "20:00",
        },
    ],
    areaServed: [
        { "@type": "City", name: "Hisar" },
        { "@type": "City", name: "Hansi" },
        { "@type": "City", name: "Fatehabad" },
    ],
    hasMap: "https://maps.google.com/?q=Brothers+Car+Rental+Hisar",
    sameAs: ["https://www.brothersgroupindia.online"],
};

const sirsaSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CarRental"],
    "@id": "https://www.brothersgroupindia.online/locations/sirsa",
    name: "Brothers Car Rental — Sirsa",
    url: "https://www.brothersgroupindia.online",
    telephone: "+91-9999999999", // REPLACE with actual
    email: "support@brothersgroupindia.online",
    image: "https://www.brothersgroupindia.online/images/og-default.jpg",
    description:
        "Self-drive car rental in Sirsa. Best maintained fleet for family and corporate trips.",
    priceRange: "₹749 - ₹6000",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, Debit Card, UPI",
    geo: {
        "@type": "GeoCoordinates",
        latitude: 29.5336,
        longitude: 75.0177,
    },
    address: {
        "@type": "PostalAddress",
        streetAddress: "Brothers Car Rental, Barnala Road", // REPLACE with actual
        addressLocality: "Sirsa",
        addressRegion: "Haryana",
        postalCode: "125055",
        addressCountry: "IN",
    },
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "08:00",
            closes: "20:00",
        },
    ],
    areaServed: [
        { "@type": "City", name: "Sirsa" },
        { "@type": "City", name: "Ellenabad" },
        { "@type": "City", name: "Mandi Dabwali" },
    ],
    hasMap: "https://maps.google.com/?q=Brothers+Car+Rental+Sirsa",
    sameAs: ["https://www.brothersgroupindia.online"],
};

export function LocalBusinessSchema() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(dehradunSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(hisarSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(sirsaSchema) }}
            />
        </>
    );
}
