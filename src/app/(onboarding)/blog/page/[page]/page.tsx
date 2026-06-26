import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogView } from "@/modules/info/blog/ui/views/BlogView";
import { getAllPublishedPosts, getAllTags } from "@/lib/mdx";
import { paginatePosts, getPageCount } from "@/lib/pagination";

export const dynamic = "force-static";

export async function generateStaticParams() {
    const allPosts = await getAllPublishedPosts();
    const totalPages = getPageCount(allPosts.length);

    const params = [];
    // Page 1 is at /blog, so we generate from page 2 upwards
    for (let i = 2; i <= totalPages; i++) {
        params.push({ page: i.toString() });
    }

    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ page: string }>;
}): Promise<Metadata> {
    const { page } = await params;
    const pageNum = parseInt(page, 10);

    return {
        title: `Page ${pageNum} | Brothers Car Rental Blog`,
        description: `Browse page ${pageNum} of the Brothers Car Rental Blog featuring self-drive travel guides, rental tips, road trips, and destination articles.`,
        alternates: {
            canonical: `https://www.brothersgroupindia.online/blog/page/${pageNum}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function BlogPaginationPage({
    params,
}: {
    params: Promise<{ page: string }>;
}) {
    const { page } = await params;
    const pageNum = parseInt(page, 10);

    if (isNaN(pageNum) || pageNum < 2) {
        notFound();
    }

    const allPosts = await getAllPublishedPosts();
    const totalPages = getPageCount(allPosts.length);

    if (pageNum > totalPages) {
        notFound();
    }

    const allTags = await getAllTags();
    const paginatedPosts = paginatePosts(allPosts, pageNum);

    return (
        <BlogView 
            allPosts={paginatedPosts} 
            allTags={allTags} 
            currentPage={pageNum}
            totalPages={totalPages}
            basePath="/blog"
        />
    );
}
