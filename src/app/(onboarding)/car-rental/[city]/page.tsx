import type { Metadata } from "next";
import { LandingFaqSection } from "@/components/seo/LandingFaqSection";
import { LandingStructuredData } from "@/components/seo/LandingStructuredData";
import { LandingTrustBar } from "@/components/seo/LandingTrustBar";
import { RelatedPages } from "@/components/seo/RelatedPages";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { InfoSection } from "@/modules/info/components/InfoSection";

const CORE_CITIES = ["dehradun", "hisar", "sirsa"];
const OTHER_CITIES = ["delhi-ncr", "chandigarh", "rishikesh", "haridwar", "mussoorie", "shimla", "agra"];

export const dynamic = "force-static";

export async function generateStaticParams() {
    const allCities = [...CORE_CITIES, ...OTHER_CITIES];
    return allCities.map((city) => ({ city }));
}

function getCityData(slug: string) {
    const cityName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    return {
        name: cityName,
        title: `Car Rental in ${cityName} — Self Drive Cars | Brothers Car Rental`,
        description: `Rent a self-drive car in ${cityName} from ₹749/day. 450+ verified vehicles, doorstep delivery, and zero hidden charges with Brothers Car Rental.`,
        faqs: [
            {
                question: `What is the starting price for car rental in ${cityName}?`,
                answer: `Our car rental prices in ${cityName} start from just ₹749 per day for hatchbacks.`,
            },
            {
                question: `Do you provide doorstep delivery in ${cityName}?`,
                answer: `Yes, we provide doorstep delivery and pickup across all major locations in ${cityName}.`,
            },
            {
                question: `Are there any hidden charges?`,
                answer: `No, Brothers Car Rental believes in complete transparency. What you see is what you pay.`,
            }
        ],
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ city: string }>;
}): Promise<Metadata> {
    const { city } = await params;
    const data = getCityData(city);

    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/car-rental/${city}`,
        },
    };
}

export default async function CityLandingPage({
    params,
}: {
    params: Promise<{ city: string }>;
}) {
    const { city } = await params;
    const data = getCityData(city);

    return (
        <main className="min-h-screen pb-12">
            <LandingStructuredData
                type="CollectionPage"
                name={`Car Rental in ${data.name}`}
                description={data.description}
                url={`https://www.brothersgroupindia.online/car-rental/${city}`}
            />
            
            <InfoPageHeader
                title={`Car Rental in ${data.name}`}
                description={`Premium self-drive cars in ${data.name} with doorstep delivery.`}
            />

            <div className="max-w-5xl mx-auto px-6">
                <LandingTrustBar />
            </div>

            <InfoSection>
                <h2 className="text-3xl font-heading font-bold mb-6">Why Choose Brothers Car Rental in {data.name}?</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    Brothers Car Rental is the premier choice for self-drive car hire in {data.name}. 
                    Whether you need a compact hatchback for city driving, a comfortable sedan for business, 
                    or a spacious SUV for a family trip, our fleet of 450+ well-maintained vehicles has you covered.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    Enjoy the freedom of the open road with zero hidden charges, flexible booking options, 
                    and unparalleled customer support. We deliver the car directly to your doorstep, airport, 
                    or hotel in {data.name}.
                </p>
            </InfoSection>

            <LandingFaqSection faqs={data.faqs} city={data.name} />

            <RelatedPages currentCity={city} />
        </main>
    );
}
