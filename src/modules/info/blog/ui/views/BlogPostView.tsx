import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import { InfoSection } from "../../../components/InfoSection";
import { RelatedPosts } from "../components/RelatedPosts";
import { getPostBySlug } from "../../data/posts";

/** Formats a tag slug into a human-readable label */
function formatTag(tag: string): string {
    return tag
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/** Formats a date as "Month DD, YYYY" */
function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface BlogPostViewProps {
    slug: string;
}

export function BlogPostView({ slug }: BlogPostViewProps) {
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt.toISOString(),
        author: {
            "@type": "Organization",
            name: "Brothers Car Rental",
        },
        publisher: {
            "@type": "Organization",
            name: "Brothers Car Rental",
        },
        image: post.coverImage,
    };

    return (
        <>
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen">
                {/* Hero Cover */}
                <div className="relative h-[50vh] min-h-[400px] max-h-[560px] overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Multi-layer gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent" />

                    {/* Back navigation */}
                    <div className="absolute top-6 left-6 z-10">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-md"
                            id="blog-back-link"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Blog
                        </Link>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog?tag=${tag}`}
                                        className="bg-secondary/90 text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md hover:bg-secondary transition-colors"
                                    >
                                        {formatTag(tag)}
                                    </Link>
                                ))}
                            </div>

                            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight mb-4">
                                {post.title}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <User className="size-4 shrink-0" />
                                    {post.authorName}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="size-4 shrink-0" />
                                    {formatDate(post.publishedAt)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="size-4 shrink-0" />
                                    {post.readingTime} min read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <InfoSection className="py-16">
                    <div className="max-w-4xl mx-auto">
                        <article
                            className="blog-prose"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Related Posts */}
                        <RelatedPosts currentSlug={slug} />
                    </div>
                </InfoSection>
            </main>
        </>
    );
}
