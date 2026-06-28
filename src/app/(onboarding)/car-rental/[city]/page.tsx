import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PRIORITY_CITIES } from "@/lib/locations";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { InfoSection } from "@/modules/info/components/InfoSection";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { BlogCallToAction } from "@/components/blog/BlogCallToAction";

export const dynamic = "force-static";

interface Props {
    params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
    return PRIORITY_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: slug } = await params;
    const city = PRIORITY_CITIES.find((c) => c.slug === slug);
    if (!city) return {};

    return {
        title: city.metaTitle,
        description: city.metaDescription,
        keywords: [
            `car rental ${city.name.toLowerCase()}`,
            `self drive car ${city.name.toLowerCase()}`,
            `rent a car ${city.name.toLowerCase()}`,
            `car hire ${city.name.toLowerCase()}`,
            `self drive car rental ${city.state.toLowerCase()}`,
            `brothers car rental ${city.name.toLowerCase()}`
        ],
        alternates: {
            canonical: `https://www.brothersgroupindia.online/car-rental/${city.slug}`
        },
        openGraph: {
            title: city.metaTitle,
            description: city.metaDescription,
            url: `https://www.brothersgroupindia.online/car-rental/${city.slug}`,
            type: "website",
            images: city.ogImage
                ? [{ url: city.ogImage, width: 1200, height: 630, alt: city.metaTitle }]
                : [{ url: "/images/og-default.jpg", width: 1200, height: 630 }]
        }
    };
}

export default async function CityLandingPage({ params }: Props) {
    const { city: slug } = await params;
    const city = PRIORITY_CITIES.find((c) => c.slug === slug);
    if (!city) notFound();

    // --- Breadcrumb Schema ---
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.brothersgroupindia.online" },
            { "@type": "ListItem", "position": 2, "name": "Car Rental", "item": "https://www.brothersgroupindia.online/car-rental" },
            { "@type": "ListItem", "position": 3, "name": city.name, "item": `https://www.brothersgroupindia.online/car-rental/${city.slug}` }
        ]
    };

    // --- FAQ Schema (only if FAQs exist) ---
    const faqSchema = city.faqItems?.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": city.faqItems.map(({ question, answer }) => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": { "@type": "Answer", "text": answer }
        }))
    } : null;

    return (
        <>
            {/* Structured Data */}
            <LocalBusinessSchema city={city} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
            {faqSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
            )}

            <main className="min-h-screen pt-20">

                {/* ── HERO SECTION ───────────────────────────────────────────── */}
                <InfoSection>
                    {/* Breadcrumb — visible for UX, invisible schema added above */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/car-rental" className="hover:text-foreground">Car Rental</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{city.name}</span>
                    </nav>

                    <p className="font-sans text-secondary font-bold tracking-[0.2em] uppercase text-sm mb-4">
                        {city.state} • Verified Fleet • Doorstep Delivery
                    </p>

                    <InfoPageHeader
                        title={`Self Drive Car Rental in ${city.name}`}
                        description={city.tagline}
                        className="mb-6"
                    />

                    <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
                        {city.heroDescription}
                    </p>

                    {/* Primary CTA — visible above fold on every device */}
                    <div className="flex gap-4 flex-wrap mb-4">
                        <Link
                            href="/browse"
                            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-md hover:bg-secondary/90 transition-colors"
                        >
                            Browse Cars in {city.name} →
                        </Link>
                        <Link
                            href={`tel:${city.phone}`}
                            className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                        >
                            Call {city.phone}
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Pricing: <strong>₹{city.startingPrice}/day</strong> · Free cancellation · No credit card required
                    </p>
                </InfoSection>

                {/* ── BODY CONTENT (the 200-300 words that actually rank) ──── */}
                <InfoSection className="py-12">
                    <div className="max-w-3xl prose-like">
                        {/* Render bodyContent — split on double newlines for paragraphs */}
                        {city.bodyContent.split("\n\n").map((para, i) => (
                            <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-sm">
                                {para.trim()}
                            </p>
                        ))}
                    </div>
                </InfoSection>

                {/* ── DELIVERY HUBS ──────────────────────────────────────────── */}
                <InfoSection className="pb-12">
                    <h2 className="font-heading font-bold text-xl text-primary mb-6">
                        Pickup & Delivery Points in {city.name}
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
                        {city.deliveryHubs.map((hub) => (
                            <li key={hub} className="flex items-center gap-3 p-4 rounded-md bg-muted/40 border border-border text-sm font-medium">
                                <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                                {hub}
                            </li>
                        ))}
                    </ul>
                </InfoSection>

                {/* ── POPULAR ROUTES FROM THIS CITY ──────────────────────────── */}
                {city.popularRoutes?.length > 0 && (
                    <InfoSection className="pb-12">
                        <h2 className="font-heading font-bold text-xl text-primary mb-6">
                            Popular Road Trips from {city.name}
                        </h2>
                        <div className="overflow-x-auto rounded-md border border-border max-w-2xl">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-semibold">Destination</th>
                                        <th className="text-left px-4 py-3 font-semibold">Distance</th>
                                        <th className="text-left px-4 py-3 font-semibold">Drive Time</th>
                                        <th className="text-left px-4 py-3 font-semibold">Guide</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {city.popularRoutes.map((route) => (
                                        <tr key={route.destination} className="border-t border-border">
                                            <td className="px-4 py-3 font-medium">{route.destination}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{route.distance}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{route.driveTime}</td>
                                            <td className="px-4 py-3">
                                                {route.blogSlug ? (
                                                    <Link
                                                        href={`/blog/${route.blogSlug}`}
                                                        className="text-secondary text-xs font-medium hover:underline"
                                                    >
                                                        Read Guide →
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Coming soon</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </InfoSection>
                )}

                {/* ── RELATED BLOG POSTS ─────────────────────────────────────── */}
                {city.relatedBlogSlugs?.length > 0 && (
                    <InfoSection className="pb-12">
                        <h2 className="font-heading font-bold text-xl text-primary mb-6">
                            {city.name} Car Rental Guides
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 max-w-xl">
                            Everything you need to know about renting and driving in {city.name} — from mountain routes to parking tips.
                        </p>
                        <ul className="flex flex-col gap-2 max-w-xl">
                            {city.relatedBlogSlugs.map((blogSlug) => (
                                <li key={blogSlug}>
                                    <Link
                                        href={`/blog/${blogSlug}`}
                                        className="text-sm text-secondary hover:underline"
                                    >
                                        /blog/{blogSlug} →
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </InfoSection>
                )}

                {/* ── FAQ SECTION ────────────────────────────────────────────── */}
                {city.faqItems?.length > 0 && (
                    <InfoSection className="pb-12">
                        <h2 className="font-heading font-bold text-xl text-primary mb-8">
                            Frequently Asked Questions — Car Rental in {city.name}
                        </h2>
                        <div className="max-w-2xl flex flex-col gap-6">
                            {city.faqItems.map(({ question, answer }) => (
                                <div key={question} className="border-b border-border pb-6 last:border-0">
                                    <h3 className="font-semibold text-primary mb-2 text-sm">{question}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
                                </div>
                            ))}
                        </div>
                    </InfoSection>
                )}

                {/* ── FINAL CTA ──────────────────────────────────────────────── */}
                <InfoSection className="pb-32">
                    <BlogCallToAction
                        title={`Ready to drive in ${city.name}?`}
                        href="/browse"
                        buttonText={`Browse Cars in ${city.name} →`}
                    />
                </InfoSection>

            </main>
        </>
    );
}
