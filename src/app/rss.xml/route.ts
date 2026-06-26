import { getAllPublishedPosts } from "@/lib/mdx";

const BASE_URL = "https://www.brothersgroupindia.online";

export async function GET() {
    const posts = await getAllPublishedPosts();

    const rssItemsXml = posts
        .map((post) => {
            const pubDate = new Date(post.publishedAt).toUTCString();
            const link = `${BASE_URL}/blog/${post.slug}`;
            return `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${link}</link>
            <guid>${link}</guid>
            <pubDate>${pubDate}</pubDate>
            <description><![CDATA[${post.description}]]></description>
        </item>`;
        })
        .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>Brothers Car Rental Blog</title>
        <link>${BASE_URL}</link>
        <description>Car rental tips, road trip guides, and news from Brothers Car Rental.</description>
        <language>en-IN</language>
        ${rssItemsXml}
    </channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
