import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/modules/info/blog/ui/views/BlogPostView";
import { getMdxPost, getAllPostSlugs, type TocHeading, MdxPostMeta } from "@/lib/mdx";
import type { BlogTag } from "@/modules/info/blog/types";
import { ArticleStructuredData } from "@/components/blog/seo/ArticleStructuredData";

export const dynamic = "force-static";

const TAG_KEYWORDS: Record<BlogTag, string[]> = {
    brand: ["brothers car rental", "car rental india", "brothers group india"],
    "how-to": ["how to rent a car india", "car rental guide", "rent a car tips"],
    "city-guide": ["road trip india", "car rental dehradun", "weekend getaway india"],
    tips: ["car rental tips", "save money car rental", "cheap car rental india"],
    faq: ["car rental faq india", "rent a car questions", "car hire india"],
    comparison: ["suv vs sedan", "best car to rent india", "car rental comparison"],
    family: ["family car rental india", "rent car for family", "best family car india"],
    luxury: ["luxury car rental india", "premium car hire", "luxury car rent dehradun"],
    seasonal: ["monsoon road trip", "best car monsoon india", "seasonal car rental"],
    "road-trip": ["road trip india", "self drive road trip", "best driving routes india"],
    commercial: ["cheap self drive car", "affordable car rental", "best rental deals india"],
    "rental-guide": ["car rental rules india", "rental documents", "car hire process india"],
    airport: ["airport car rental india", "car rental near airport", "airport pickup car hire"],
};

const CITY_NAMES = [
    "dehradun", "hisar", "sirsa", "delhi", "jaipur", "rishikesh",
    "haridwar", "mussoorie", "shimla", "agra", "chandigarh", "nainital",
    "noida", "gurgaon", "ghaziabad", "faridabad", "manali", "auli"
];

const VEHICLE_TYPES = ["suv", "sedan", "hatchback", "7-seater", "automatic", "diesel", "luxury"];

const RENTAL_INTENT = ["rent", "rental", "hire", "book", "self drive"];

function enrichKeywords(meta: MdxPostMeta): string[] {
    const base = meta.tags.flatMap((tag) => TAG_KEYWORDS[tag] ?? []);
    const titleLower = meta.title.toLowerCase();
    const descLower = meta.description.toLowerCase();
    const combined = `${titleLower} ${descLower}`;

    const cities = CITY_NAMES.filter((c) => combined.includes(c))
        .map((c) => `car rental ${c}`);

    const vehicles = VEHICLE_TYPES.filter((v) => combined.includes(v))
        .flatMap((v) => RENTAL_INTENT.map((i) => `${i} ${v} india`));

    const all = [...new Set([...base, ...cities, ...vehicles])];
    return all.slice(0, 15);
}

/** Extracts heading info from MDX content string for Table of Contents */
function extractHeadings(slug: string): TocHeading[] {
    // Headings are generated at render time by rehype-slug.
    // We parse the MDX source file to extract heading text.
    const fs = require("fs");
    const path = require("path");
    const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);

    if (!fs.existsSync(filePath)) return [];

    const source: string = fs.readFileSync(filePath, "utf-8");
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: TocHeading[] = [];
    let match;

    while ((match = headingRegex.exec(source)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "");
        headings.push({ id, text, level });
    }

    return headings;
}

function extractFaqItems(slug: string): Array<{ question: string; answer: string }> {
    const fs = require("fs") as typeof import("fs");
    const path = require("path") as typeof import("path");
    const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return [];

    const source: string = fs.readFileSync(filePath, "utf-8");
    const lines = source.split("\n");
    const items: Array<{ question: string; answer: string }> = [];

    for (let i = 0; i < lines.length; i++) {
        const h3Match = lines[i].match(/^###\s+(.+\?)$/);
        if (h3Match) {
            const question = h3Match[1].trim();
            const answerLines: string[] = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].startsWith("#")) {
                if (lines[j].trim()) answerLines.push(lines[j].trim());
                j++;
            }
            if (answerLines.length > 0) {
                items.push({ question, answer: answerLines.join(" ") });
            }
        }
    }
    return items;
}

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const mdxPost = await getMdxPost(slug);
    if (!mdxPost) notFound();

    const { metadata: meta } = mdxPost;
    const keywords = enrichKeywords(meta);
    return {
        title: meta.title,
        description: meta.description,
        keywords,
        openGraph: {
            type: "article",
            title: meta.title,
            description: meta.description,
            url: `https://www.brothersgroupindia.online/blog/${meta.slug}`,
            images: [
                {
                    url: meta.coverImage,
                    width: 1200,
                    height: 630,
                    alt: meta.title,
                },
            ],
            publishedTime: new Date(meta.publishedAt).toISOString(),
            tags: meta.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: meta.title,
            description: meta.description,
            images: [meta.coverImage],
        },
        alternates: {
            canonical: meta.canonicalUrl,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const mdxPost = await getMdxPost(slug);
    if (!mdxPost) notFound();

    const { Component, metadata: meta } = mdxPost;
    const headings = extractHeadings(slug);
    const faqItems = extractFaqItems(slug);

    return (
        <>
            <ArticleStructuredData meta={meta} />
            {faqItems.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            mainEntity: faqItems.map(({ question, answer }) => ({
                                "@type": "Question",
                                name: question,
                                acceptedAnswer: { "@type": "Answer", text: answer }
                            }))
                        })
                    }}
                />
            )}
            <BlogPostView meta={meta} headings={headings}>
                <Component />
            </BlogPostView>
        </>
    );
}
