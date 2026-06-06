import type { Metadata } from "next";
import { BlogView } from "@/modules/info/blog/ui/views/BlogView";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Expert tips, city guides, and insider knowledge for car rentals in India. From choosing the right car to discovering hidden road trip gems — the Brothers Car Rental blog.",
    openGraph: {
        title: "Blog | Brothers Car Rental",
        description:
            "Expert tips, city guides, and insider knowledge for car rentals in India.",
        type: "website",
    },
};

export default function BlogPage() {
    return <BlogView />;
}
