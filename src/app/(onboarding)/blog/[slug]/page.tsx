import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/modules/info/blog/ui/views/BlogPostView";
import { getAllPublishedPosts, getPostBySlug } from "@/modules/info/blog/data/posts";
import type { BlogTag } from "@/modules/info/blog/types";

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
};

export async function generateStaticParams() {
    return getAllPublishedPosts().map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const keywords = post.tags.flatMap((tag) => TAG_KEYWORDS[tag]);

    return {
        title: post.title,
        description: post.excerpt,
        keywords,
        openGraph: {
            type: "article",
            title: post.title,
            description: post.excerpt,
            url: `https://www.brothersgroupindia.online/blog/${post.slug}`,
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            publishedTime: post.publishedAt.toISOString(),
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
        alternates: {
            canonical: `https://www.brothersgroupindia.online/blog/${post.slug}`,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.publishedAt.toISOString(),
        dateModified: post.publishedAt.toISOString(),
        author: {
            "@type": "Organization",
            name: "Brothers Car Rental",
            url: "https://www.brothersgroupindia.online",
        },
        publisher: {
            "@type": "Organization",
            name: "Brothers Car Rental",
            logo: {
                "@type": "ImageObject",
                url: "https://www.brothersgroupindia.online/app-logo.svg",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.brothersgroupindia.online/blog/${post.slug}`,
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.brothersgroupindia.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.brothersgroupindia.online/blog",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://www.brothersgroupindia.online/blog/${post.slug}`,
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
            <BlogPostView slug={slug} />
        </>
    );
}
