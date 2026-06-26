import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import type { BlogTag } from "@/modules/info/blog/types";
import { PostCard } from "@/modules/info/blog/ui/components/PostCard";
import { InfoPageHeader } from "@/modules/info/components/InfoPageHeader";
import { paginatePosts, getPageCount } from "@/lib/pagination";
import { PaginationControls } from "@/components/self/pagination-controls";

export const dynamic = "force-static";

export async function generateStaticParams() {
    const tags = await getAllTags();
    const params = [];

    for (const tag of tags) {
        const posts = await getPostsByTag(tag as BlogTag);
        const totalPages = getPageCount(posts.length);

        for (let i = 2; i <= totalPages; i++) {
            params.push({ tag, page: i.toString() });
        }
    }

    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ tag: string; page: string }>;
}): Promise<Metadata> {
    const { tag, page } = await params;
    const pageNum = parseInt(page, 10);
    const tagName = tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    return {
        title: `Page ${pageNum} | ${tagName} Articles | Brothers Car Rental Blog`,
        description: `Browse page ${pageNum} of our ${tagName} articles from the Brothers Car Rental editorial team.`,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/blog/tag/${tag}/page/${pageNum}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TagPaginationPage({
    params,
}: {
    params: Promise<{ tag: string; page: string }>;
}) {
    const { tag, page } = await params;
    const pageNum = parseInt(page, 10);

    if (isNaN(pageNum) || pageNum < 2) {
        notFound();
    }

    const tags = await getAllTags();
    if (!tags.includes(tag as BlogTag)) {
        notFound();
    }

    const posts = await getPostsByTag(tag as BlogTag);
    const totalPages = getPageCount(posts.length);

    if (pageNum > totalPages) {
        notFound();
    }

    const tagName = tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const paginatedPosts = paginatePosts(posts, pageNum);

    return (
        <main className="min-h-screen pb-12">
            <InfoPageHeader
                title={`${tagName} Articles`}
                description={`Explore all our posts related to ${tagName}.`}
            />

            <div className="max-w-5xl mx-auto px-6 mt-12">
                {paginatedPosts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                        </div>
                        <PaginationControls 
                            currentPage={pageNum} 
                            totalPages={totalPages} 
                            basePath={`/blog/tag/${tag}`} 
                        />
                    </>
                ) : (
                    <div className="text-center py-20 bg-muted/30 rounded-xl">
                        <h2 className="text-2xl font-bold font-heading mb-2">No posts found</h2>
                        <p className="text-muted-foreground">We couldn't find any articles for this tag.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
