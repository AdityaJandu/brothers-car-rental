import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/modules/info/blog/ui/views/BlogPostView";
import { getAllPublishedPosts, getPostBySlug } from "@/modules/info/blog/data/posts";

export const dynamic = "force-static";

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
        return { title: "Post Not Found" };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            type: "article",
            title: post.title,
            description: post.excerpt,
            publishedTime: post.publishedAt.toISOString(),
            tags: post.tags,
            images: post.coverImage ? [post.coverImage] : [],
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

    return <BlogPostView slug={slug} />;
}
