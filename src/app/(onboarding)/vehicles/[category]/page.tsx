import type { Metadata } from "next";
import { LandingFaqSection } from "@/components/seo/LandingFaqSection";
import { LandingStructuredData } from "@/components/seo/LandingStructuredData";
import { LandingTrustBar } from "@/components/seo/LandingTrustBar";
import { RelatedPages } from "@/components/seo/RelatedPages";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { InfoSection } from "@/modules/info/components/InfoSection";

const CATEGORIES = ["suv", "sedan", "hatchback", "7-seater", "luxury", "automatic"];

export const dynamic = "force-static";

export async function generateStaticParams() {
    return CATEGORIES.map((category) => ({ category }));
}

function getCategoryData(slug: string) {
    const categoryName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        name: categoryName,
        title: `${categoryName} Car Rental in India — Self Drive | Brothers Car Rental`,
        description: `Rent a ${categoryName} for your next road trip. Choose from our well-maintained fleet of ${categoryName}s. Affordable rates, doorstep delivery.`,
        faqs: [
            {
                question: `Which ${categoryName}s are available for rent?`,
                answer: `We offer a wide variety of top-rated ${categoryName}s. Check our booking app for live availability.`,
            },
            {
                question: `Is there a km limit for ${categoryName} rentals?`,
                answer: `We offer both limited and unlimited km packages for our ${categoryName} fleet to suit your travel needs.`,
            },
        ],
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string }>;
}): Promise<Metadata> {
    const { category } = await params;
    const data = getCategoryData(category);

    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/vehicles/${category}`,
        },
    };
}

export default async function VehicleCategoryLandingPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const data = getCategoryData(category);

    return (
        <main className="min-h-screen pb-12">
            <LandingStructuredData
                type="CollectionPage"
                name={`${data.name} on Rent`}
                description={data.description}
                url={`https://www.brothersgroupindia.online/vehicles/${category}`}
            />
            
            <InfoPageHeader
                title={`${data.name} Car Rental`}
                description={`Premium self-drive ${data.name}s for your next adventure.`}
            />

            <div className="max-w-5xl mx-auto px-6">
                <LandingTrustBar />
            </div>

            <InfoSection>
                <h2 className="text-3xl font-heading font-bold mb-6">Rent a {data.name} with Brothers Car Rental</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    Looking to rent a {data.name}? Brothers Car Rental offers an extensive fleet of well-maintained 
                    {data.name}s perfect for city driving, weekend getaways, or long road trips across India.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    With our transparent pricing, doorstep delivery, and 24/7 roadside assistance, 
                    renting a {data.name} has never been easier or more reliable.
                </p>
            </InfoSection>

            <LandingFaqSection faqs={data.faqs} />

            <RelatedPages currentCategory={category} />
        </main>
    );
}
