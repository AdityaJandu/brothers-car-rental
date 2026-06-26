import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingFaqSection } from "@/components/seo/LandingFaqSection";
import { LandingStructuredData } from "@/components/seo/LandingStructuredData";
import { LandingTrustBar } from "@/components/seo/LandingTrustBar";
import { RelatedPages } from "@/components/seo/RelatedPages";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { InfoSection } from "@/modules/info/components/InfoSection";

const USE_CASES = ["wedding", "corporate", "outstation", "airport-transfer", "weekend-getaway"];

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    return USE_CASES.map((usecase) => ({ usecase }));
}

function getUseCaseData(slug: string) {
    const useCaseName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        name: useCaseName,
        title: `${useCaseName} Car Rental in India | Brothers Car Rental`,
        description: `Looking for reliable car rental for your ${useCaseName}? Brothers Car Rental offers premium vehicles with doorstep delivery for all your ${useCaseName} needs.`,
        faqs: [
            {
                question: `Why choose Brothers Car Rental for ${useCaseName}?`,
                answer: `We provide meticulously maintained vehicles, transparent pricing, and unparalleled customer service tailored for your ${useCaseName} requirements.`,
            },
            {
                question: `Can I book a car in advance for my ${useCaseName}?`,
                answer: `Absolutely! We highly recommend booking in advance to ensure you get the exact vehicle you want for your ${useCaseName}.`,
            },
        ],
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ usecase: string }>;
}): Promise<Metadata> {
    const { usecase } = await params;
    
    if (!USE_CASES.includes(usecase)) {
        notFound();
    }
    
    const data = getUseCaseData(usecase);

    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/use-cases/${usecase}`,
        },
    };
}

export default async function UseCaseLandingPage({
    params,
}: {
    params: Promise<{ usecase: string }>;
}) {
    const { usecase } = await params;
    
    if (!USE_CASES.includes(usecase)) {
        notFound();
    }
    
    const data = getUseCaseData(usecase);

    return (
        <main className="min-h-screen pb-12">
            <LandingStructuredData
                type="CollectionPage"
                name={`${data.name} Car Rental`}
                description={data.description}
                url={`https://www.brothersgroupindia.online/use-cases/${usecase}`}
            />
            
            <InfoPageHeader
                title={`Car Rental for ${data.name}`}
                description={`Premium self-drive cars tailored for your ${data.name} needs.`}
            />

            <div className="max-w-5xl mx-auto px-6">
                <LandingTrustBar />
            </div>

            <InfoSection>
                <h2 className="text-3xl font-heading font-bold mb-6">The Perfect Ride for Your {data.name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    Make your {data.name} unforgettable with the perfect vehicle from Brothers Car Rental. 
                    Whether you need a luxury sedan to make an impression or a spacious SUV to accommodate 
                    everyone comfortably, we have the right car for you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Our commitment to quality, cleanliness, and punctuality means you can focus entirely 
                    on your {data.name} while we take care of your transportation needs.
                </p>
            </InfoSection>

            <LandingFaqSection faqs={data.faqs} />

            <RelatedPages />
        </main>
    );
}
