import type { MetadataRoute } from "next";
import { db } from "@/db";
import { car, location } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getAllPublishedPosts } from "@/modules/info/blog/data/posts";

const BASE_URL = "https://www.brothersgroupindia.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // ── Static routes (always included) ──────────────────────────────
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/browse`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/support`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // ── Dynamic routes (DB + static blog data) ───────────────────────
    try {
        const [cars, locations] = await Promise.all([
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
                ),
            // Locations: active
            db
                .select({ id: location.id, updatedAt: location.updatedAt })
                .from(location)
                .where(eq(location.isActive, true)),
        ]);

        // Blog posts: published with a publishedAt date (static data)
        const blogPosts = getAllPublishedPosts().filter(
            (p) => p.publishedAt != null
        );

        const carRoutes: MetadataRoute.Sitemap = cars.map((c) => ({
            url: `${BASE_URL}/browse/${c.id}`,
            lastModified: c.updatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
            url: `${BASE_URL}/blog/${p.slug}`,
            lastModified: p.publishedAt,
            changeFrequency: "monthly",
            priority: 0.75,
        }));

        const locationRoutes: MetadataRoute.Sitemap = locations.map((l) => ({
            url: `${BASE_URL}/locations/${l.id}`,
            lastModified: l.updatedAt,
            changeFrequency: "monthly",
            priority: 0.85,
        }));

        return [...staticRoutes, ...carRoutes, ...blogRoutes, ...locationRoutes];
    } catch (err) {
        // If DB is unreachable, return static routes so the sitemap never breaks
        console.error("[sitemap] Sitemap generation failed, falling back to static routes:", err);
        return staticRoutes;
    }
}
