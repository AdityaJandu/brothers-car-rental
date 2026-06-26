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
    return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ tag: string }>;
}): Promise<Metadata> {
    const { tag } = await params;

    // Simple format for title
    const tagName = tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    return {
        title: `${tagName} Articles | Brothers Car Rental Blog`,
        description: `Read the latest articles about ${tagName} from the Brothers Car Rental editorial team.`,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/blog/tag/${tag}`,
        },
    };
}

export default async function TagPage({
    params,
}: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await params;

    const tags = await getAllTags();
    if (!tags.includes(tag as BlogTag)) {
        notFound();
    }

    const posts = await getPostsByTag(tag as BlogTag);
    const tagName = tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    const paginatedPosts = paginatePosts(posts, 1);
    const totalPages = getPageCount(posts.length);

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
                        {totalPages > 1 && (
                            <PaginationControls 
                                currentPage={1} 
                                totalPages={totalPages} 
                                basePath={`/blog/tag/${tag}`} 
                            />
                        )}
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
