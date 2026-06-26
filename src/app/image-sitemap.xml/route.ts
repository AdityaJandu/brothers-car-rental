import { db } from "@/db";
import { car } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { getAllPublishedPosts } from "@/lib/mdx";

const BASE_URL = "https://www.brothersgroupindia.online";

export async function GET() {
    // Collect all image URLs
    const imageEntries: { url: string; image: string; title: string }[] = [];

    // 1. Cars
    const cars = await db
        .select({ id: car.id, name: car.name, make: car.make, headerImage: car.headerImage })
        .from(car)
        .where(and(eq(car.isActive, true), isNull(car.deletedAt), eq(car.status, "available")));

    for (const c of cars) {
        if (c.headerImage) {
            imageEntries.push({
                url: `${BASE_URL}/browse/${c.id}`,
                image: c.headerImage,
                title: `${c.make} ${c.name}`,
            });
        }
    }

    // 2. Blog Posts
    const posts = await getAllPublishedPosts();
    for (const post of posts) {
        imageEntries.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            image: post.coverImage.startsWith("http") ? post.coverImage : `${BASE_URL}${post.coverImage}`,
            title: post.title,
        });
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${imageEntries
        .map(
            (entry) => `
    <url>
        <loc>${entry.url}</loc>
        <image:image>
            <image:loc>${entry.image}</image:loc>
            <image:title><![CDATA[${entry.title}]]></image:title>
        </image:image>
    </url>`
        )
        .join("")}
</urlset>`;

    return new Response(sitemapXml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
        },
    });
}
