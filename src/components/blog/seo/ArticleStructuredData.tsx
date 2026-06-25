import type { MdxPostMeta } from "@/lib/mdx";

interface ArticleStructuredDataProps {
    meta: MdxPostMeta;
}

const BASE_URL = "https://www.brothersgroupindia.online";

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
        image: meta.coverImage.startsWith("http")
            ? meta.coverImage
            : `${BASE_URL}${meta.coverImage}`,
        datePublished: meta.publishedAt,
        dateModified: meta.publishedAt,
        author: {
            "@type": "Organization",
            name: meta.authorName,
            url: BASE_URL,
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
        wordCount: meta.readingTime * 200,
        articleSection: meta.tags[0] || "General",
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
