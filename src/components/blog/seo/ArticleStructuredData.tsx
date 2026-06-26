import type { MdxPostMeta } from "@/lib/mdx";

interface ArticleStructuredDataProps {
    meta: MdxPostMeta;
}

const BASE_URL = "https://www.brothersgroupindia.online";

function getWordCount(slug: string, fallbackReadingTime: number): number {
    try {
        const fs = require("fs") as typeof import("fs");
        const path = require("path") as typeof import("path");
        const filePath = path.join(process.cwd(), "content", "blog", `${slug}.mdx`);
        const source = fs.readFileSync(filePath, "utf-8");
        const stripped = source
            .replace(/^---[\s\S]*?---/m, "")
            .replace(/^import\s.+$/gm, "")
            .replace(/^export\s.+$/gm, "")
            .replace(/<[^>]+>/g, "")
            .replace(/[#*_`\[\]()>~|]/g, "")
            .replace(/https?:\/\/\S+/g, "")
            .trim();
        return stripped.split(/\s+/).filter(Boolean).length;
    } catch {
        return fallbackReadingTime * 200;
    }
}

/**
 * Injects Article + BreadcrumbList JSON-LD structured data into the page.
 * Server component — renders <script> tags with JSON-LD schema.
 */
export function ArticleStructuredData({ meta }: ArticleStructuredDataProps) {
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        image: {
            "@type": "ImageObject",
            url: meta.coverImage.startsWith("http")
                ? meta.coverImage
                : `${BASE_URL}${meta.coverImage}`,
            width: 1200,
            height: 630,
            caption: meta.title,
        },
        datePublished: meta.publishedAt,
        dateModified: meta.updatedAt ?? meta.publishedAt,
        author: {
            "@type": "Organization",
            name: meta.authorName,
            url: BASE_URL,
            sameAs: "https://www.brothersgroupindia.online/authors/brothers-car-rental",
        },
        publisher: {
            "@type": "Organization",
            name: "Brothers Car Rental",
            logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/app-logo.svg`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/blog/${meta.slug}`,
        },
        isPartOf: {
            "@type": "WebSite",
            url: BASE_URL,
        },
        inLanguage: "en-IN",
        wordCount: getWordCount(meta.slug, meta.readingTime),
        articleSection: meta.tags[0] || "General",
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["article", "h1", "h2"],
        },
        keywords: meta.tags.join(", "),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: BASE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${BASE_URL}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: meta.title,
                item: `${BASE_URL}/blog/${meta.slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
        </>
    );
}
