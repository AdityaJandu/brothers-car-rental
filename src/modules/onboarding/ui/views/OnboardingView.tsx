import Image from 'next/image';
import { PhoneCall } from 'lucide-react';
import { COMPANY_PHONE } from '@/lib/locations';
import { StepComponent } from "../components/StepComponent";
import { steps } from "../../data/onboarding_step";
import { LocationComponent } from '../components/LocationComponent';
import { FeaturedFleet } from '../components/FeaturedFleet';
import { FeaturesSection } from '../components/FeaturesSection';
import { CTASection } from '../components/CTASection';
import { Suspense } from "react";
import { AuthButtons, AuthButtonsSkeleton } from "../components/AuthButtons";

// Notice this no longer needs to fetch session at the top level
export async function OnboardingView() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 font-sans overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CarRental",
                        "name": "Brothers Car Rental",
                        "url": "https://www.brothersgroupindia.online",
                        "logo": "https://www.brothersgroupindia.online/app-logo.svg",
                        "telephone": COMPANY_PHONE,
                        "priceRange": "₹₹",
                        "areaServed": ["Dehradun", "Hisar", "Sirsa"],
                        "address": {
                            "@type": "PostalAddress",
                            "addressRegion": "Uttarakhand & Haryana",
                            "addressCountry": "IN"
                        },
                        "sameAs": []
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Brothers Car Rental",
                        "url": "https://www.brothersgroupindia.online",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://www.brothersgroupindia.online/browse?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })
                }}
            />

            <main className="container max-w-7xl mx-auto px-6 pt-12 lg:pt-24 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <div className="flex flex-col max-w-xl">
                        <h1 className="text-[3.5rem] leading-[1.05] lg:text-[4.5rem] font-bold font-heading mb-4 tracking-tight">
                            <span className="bg-linear-to-r from-[#243949] to-[#517fa4] bg-clip-text text-transparent block pb-2">Brothers Car Rental</span>
                        </h1>

                        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                            Rent Cars Anytime, Anywhere
                        </h2>

                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                            Experience the pinnacle of mobility with Brothers. From executive sedans to rugged SUVs, we curate the precision of your journey.
                        </p>

                        <div className="mb-10">
                            <a 
                                href={`tel:${COMPANY_PHONE.replace(/\s+/g, '')}`}
                                className="inline-flex items-center gap-3 bg-linear-to-r from-[#243949] to-[#517fa4] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <PhoneCall className="w-5 h-5 animate-pulse" />
                                <span>Call Now: {COMPANY_PHONE}</span>
                            </a>
                        </div>

                        {/* --- INJECT SUSPENSE HERE --- */}
                        <Suspense fallback={<AuthButtonsSkeleton />}>
                            <AuthButtons />
                        </Suspense>
                    </div>

                    <div className="hidden lg:flex justify-end relative group">
                        {/* Image section remains unchanged */}
                        <div className="card-showroom w-full max-w-150 aspect-4/3 bg-white flex items-center justify-center p-8 relative transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 shadow-ambient">
                            <Image
                                priority={true}
                                src={"/images/onboarding.jpg"}
                                alt="Premium rental cars available at Brothers Car Rental — Hisar, Dehradun and Sirsa"
                                width={600}
                                height={400}
                                className="w-full h-auto object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                            />
                        </div>
                    </div>

                </div>

                <section className="mt-24 lg:mt-32 flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl font-bold text-primary font-heading mb-4">
                        How It Works
                    </h2>
                    <div className="w-16 h-1 bg-[#517fa4] rounded-full"></div>
                </section>

                <div className="mt-10 lg:mt-20">
                    <StepComponent steps={steps} />
                </div>
            </main>

            <section className="w-full mt-10 lg:mt-20">
                <LocationComponent />
            </section>

            <section className="w-full mt-10 lg:mt-20">
                <FeaturedFleet />
            </section>

            <section className="w-full py-10  bg-[#EDF3F8]">
                <FeaturesSection />
            </section>

            <CTASection />

        </div>
    );
}