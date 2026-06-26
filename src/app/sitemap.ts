import type { MetadataRoute } from "next";
import { db } from "@/db";
import { car, location } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getAllPublishedPosts, getAllTags } from "@/lib/mdx";

const BASE_URL = "https://www.brothersgroupindia.online";

export async function generateSitemaps() {
    return [{ id: 0 }];
}

export default async function sitemap({
    id,
}: {
    id: number;
}): Promise<MetadataRoute.Sitemap> {
    const STATIC_DATE = new Date("2026-06-01");

    // ── Static routes (always included) ──────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: STATIC_DATE,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/browse`,
            lastModified: STATIC_DATE,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: STATIC_DATE,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: STATIC_DATE,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: STATIC_DATE,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/support`,
            lastModified: STATIC_DATE,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: STATIC_DATE,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: STATIC_DATE,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/authors/brothers-car-rental`,
            lastModified: STATIC_DATE,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // ── Programmatic Landing Pages ───────────────────────────────────
    const CITIES = ["dehradun", "hisar", "sirsa", "delhi-ncr", "chandigarh", "rishikesh", "haridwar", "mussoorie", "shimla", "agra"];
    const CATEGORIES = ["suv", "sedan", "hatchback", "7-seater", "luxury", "automatic"];
    const USE_CASES = ["wedding", "corporate", "outstation", "airport-transfer", "weekend-getaway"];

    const cityRoutes: MetadataRoute.Sitemap = CITIES.map((c) => ({
        url: `${BASE_URL}/car-rental/${c}`,
        lastModified: STATIC_DATE,
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
        url: `${BASE_URL}/vehicles/${c}`,
        lastModified: STATIC_DATE,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const useCaseRoutes: MetadataRoute.Sitemap = USE_CASES.map((c) => ({
        url: `${BASE_URL}/use-cases/${c}`,
        lastModified: STATIC_DATE,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    // ── Dynamic routes (DB + static blog data) ───────────────────────
    try {
        const [cars, locations, tags, rawPosts] = await Promise.all([
            // Cars: active, not soft-deleted, available
            db
                .select({ id: car.id, updatedAt: car.updatedAt })
                .from(car)
                .where(
                    and(
                        eq(car.isActive, true),
                        isNull(car.deletedAt),
                        eq(car.status, "available")
                    )
                )
                .limit(50000)
                .offset(id * 50000), // Pagination for fleet scalability
            // Locations: active
            db
                .select({ id: location.id, updatedAt: location.updatedAt })
                .from(location)
                .where(eq(location.isActive, true)),
            getAllTags(),
            getAllPublishedPosts(),
        ]);

        const EXCLUDED_SLUGS = ["redirected-old-post"]; // Add any redirected slugs here

        const blogPosts = rawPosts.filter(
            (p) => p.publishedAt != null && !EXCLUDED_SLUGS.includes(p.slug)
        );

        const carRoutes: MetadataRoute.Sitemap = cars.map((c) => ({
            url: `${BASE_URL}/browse/${c.id}`,
            lastModified: c.updatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
            url: `${BASE_URL}/locations/${l.id}`,
            lastModified: l.updatedAt,
            changeFrequency: "monthly",
            priority: 0.85,
        }));

        const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
            url: `${BASE_URL}/blog/${p.slug}`,
            lastModified: p.updatedAt ?? p.publishedAt,
            changeFrequency: "monthly",
            priority: 0.75,
        }));

        // Blog Pagination Routes
        const blogPaginationRoutes: MetadataRoute.Sitemap = [];
        const totalBlogPages = Math.ceil(blogPosts.length / 12); // POSTS_PER_PAGE
        for (let i = 2; i <= totalBlogPages; i++) {
            blogPaginationRoutes.push({
                url: `${BASE_URL}/blog/page/${i}`,
                lastModified: STATIC_DATE,
                changeFrequency: "weekly",
                priority: 0.6,
            });
        }

        const tagRoutes: MetadataRoute.Sitemap = [];
        const tagPaginationRoutes: MetadataRoute.Sitemap = [];
        
        for (const t of tags) {
            tagRoutes.push({
                url: `${BASE_URL}/blog/tag/${t}`,
                lastModified: STATIC_DATE,
                changeFrequency: "weekly",
                priority: 0.7,
            });

            // Calculate pagination for this tag
            const tagPosts = blogPosts.filter((p) => p.tags.includes(t));
            const totalTagPages = Math.ceil(tagPosts.length / 12);
            for (let i = 2; i <= totalTagPages; i++) {
                tagPaginationRoutes.push({
                    url: `${BASE_URL}/blog/tag/${t}/page/${i}`,
                    lastModified: STATIC_DATE,
                    changeFrequency: "weekly",
                    priority: 0.5,
                });
            }
        }

        return [
            ...staticRoutes,
            ...cityRoutes,
            ...categoryRoutes,
            ...useCaseRoutes,
            ...carRoutes,
            ...locationRoutes,
            ...blogRoutes,
            ...blogPaginationRoutes,
            ...tagRoutes,
            ...tagPaginationRoutes,
        ];
    } catch (err) {
        // If DB is unreachable, return static routes so the sitemap never breaks
        console.error("[sitemap] Sitemap generation failed, falling back to static routes:", err);
        return [
            ...staticRoutes,
            ...cityRoutes,
            ...categoryRoutes,
            ...useCaseRoutes,
        ];
    }
}
