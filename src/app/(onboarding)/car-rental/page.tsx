import { Metadata } from "next";
import Link from "next/link";
import { PRIORITY_CITIES } from "@/lib/locations";
import { InfoSection } from "@/modules/info/components/InfoSection";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";

export const metadata: Metadata = {
    title: "Car Rental Locations in India | Brothers Car Rental",
    description: "Find self-drive car rentals across India. Doorstep delivery available in Dehradun, Chandigarh, Gurgaon, Noida, Jaipur and more.",
    alternates: {
        canonical: "https://www.brothersgroupindia.online/car-rental"
    }
};

export default function CarRentalHubPage() {
    return (
        <main className="min-h-screen pt-20 pb-20">
            <InfoSection>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Car Rental Locations</span>
                </nav>

                <InfoPageHeader
                    title="Our Car Rental Locations"
                    description="Premium self-drive cars available across major cities in North India."
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRIORITY_CITIES.map((city) => (
                        <Link 
                            key={city.slug} 
                            href={`/car-rental/${city.slug}`}
                            className="group block rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-heading font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                                {city.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {city.heroDescription}
                            </p>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-secondary">Explore Fleet</span>
                                <span className="text-muted-foreground">From {city.priceRange.split(' ')[0]}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </InfoSection>
        </main>
    );
}
