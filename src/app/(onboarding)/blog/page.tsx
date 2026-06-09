import type { Metadata } from "next";
import { BlogView } from "@/modules/info/blog/ui/views/BlogView";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Car Rental Tips, Guides & Road Trip Ideas",
    description:
        "Expert car rental advice, road trip guides, and money-saving tips from Brothers Car Rental — serving Dehradun, Hisar, and Sirsa.",
    keywords: [
        "car rental tips india",
        "road trip guide india",
        "brothers car rental blog",
        "rent a car advice",
        "car hire india guide",
        "dehradun road trips",
        "car rental hisar",
    ],
    openGraph: {
        type: "website",
        title: "Car Rental Tips, Guides & Road Trip Ideas | Brothers Car Rental",
        description:
            "Expert car rental advice, road trip guides, and money-saving tips from Brothers Car Rental.",
        url: "https://www.brothersgroupindia.online/blog",
        images: [
            {
                url: "/images/og-default.jpg",
                width: 1200,
                height: 630,
                alt: "Brothers Car Rental Blog",
            },
        ],
    },
    alternates: {
        canonical: "https://www.brothersgroupindia.online/blog",
    },
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What documents do you need to rent a car in India?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "You need a valid driving licence, a government photo ID (Aadhaar, passport, or voter ID), and address proof. International visitors also need an International Driving Permit.",
            },
        },
        {
            "@type": "Question",
            name: "Can you rent a car without a credit card in India?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Brothers Car Rental accepts debit cards, UPI, cash, and digital wallets. A refundable security deposit is required regardless of payment method.",
            },
        },
        {
            "@type": "Question",
            name: "What does Brothers Car Rental booking protection cover?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Standard protection includes third-party liability, 24/7 roadside assistance, and an accident damage waiver. The optional Comprehensive Protection adds zero excess, tyre and windshield coverage, interior protection, and theft protection.",
            },
        },
    ],
};

export default function BlogPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <BlogView />
        </>
    );
}
