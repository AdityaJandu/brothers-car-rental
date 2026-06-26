import Link from "next/link";

interface RelatedPagesProps {
    currentCity?: string;
    currentCategory?: string;
}

const CITIES = [
    { name: "Dehradun", slug: "dehradun" },
    { name: "Hisar", slug: "hisar" },
    { name: "Sirsa", slug: "sirsa" },
    { name: "Delhi NCR", slug: "delhi-ncr" },
    { name: "Chandigarh", slug: "chandigarh" },
];

const CATEGORIES = [
    { name: "SUVs", slug: "suv" },
    { name: "Sedans", slug: "sedan" },
    { name: "Hatchbacks", slug: "hatchback" },
    { name: "7-Seaters", slug: "7-seater" },
    { name: "Luxury Cars", slug: "luxury" },
];

export function RelatedPages({ currentCity, currentCategory }: RelatedPagesProps) {
    return (
        <div className="py-12 border-t border-border mt-12">
            <div className="max-w-5xl mx-auto px-6">
                <h3 className="text-2xl font-bold font-heading mb-6">Explore More</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-muted-foreground">
                            Top Rental Cities
                        </h4>
                        <ul className="space-y-2">
                            {CITIES.filter((c) => c.slug !== currentCity).map((city) => (
                                <li key={city.slug}>
                                    <Link
                                        href={`/car-rental/${city.slug}`}
                                        className="text-primary hover:underline"
                                    >
                                        Car Rental in {city.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-4 text-muted-foreground">
                            Browse by Category
                        </h4>
                        <ul className="space-y-2">
                            {CATEGORIES.filter((c) => c.slug !== currentCategory).map(
                                (category) => (
                                    <li key={category.slug}>
                                        <Link
                                            href={`/vehicles/${category.slug}`}
                                            className="text-primary hover:underline"
                                        >
                                            {category.name} on Rent
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
