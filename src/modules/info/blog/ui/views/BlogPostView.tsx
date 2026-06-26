import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { InfoSection } from "../../../components/InfoSection";
import { RelatedPosts } from "../components/RelatedPosts";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { EditorialTrustBlock } from "@/components/blog/seo/EditorialTrustBlock";
import { TableOfContents } from "@/components/blog/TableOfContents";
import type { MdxPostMeta, TocHeading } from "@/lib/mdx";

/** Formats a tag slug into a human-readable label */
function formatTag(tag: string): string {
    return tag
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/** Formats an ISO date string as "Month DD, YYYY" */
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface BlogPostViewProps {
    /** Post metadata from the MDX export */
    meta: MdxPostMeta;
    /** Rendered MDX content (children) */
    children: React.ReactNode;
    /** Headings extracted for Table of Contents */
    headings?: TocHeading[];
}

export function BlogPostView({ meta, children, headings = [] }: BlogPostViewProps) {
    return (
        <>
            {/* Reading progress bar */}
            <ReadingProgressBar />

            <main className="min-h-screen">
                {/* Hero Cover */}
                <div className="relative h-[50vh] min-h-[400px] max-h-[560px] overflow-hidden">
                    <Image
                        src={meta.coverImage}
                        alt={meta.title}
                        fill
                        className="object-cover"
                        priority
                        fetchPriority="high"
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
                                {meta.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/blog?tag=${tag}`}
                                        className="bg-secondary/90 text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md hover:bg-secondary transition-colors"
                                    >
                                        {formatTag(tag)}
                                    </Link>
                                ))}
                            </div>

                            <nav aria-label="Breadcrumb" className="sr-only">
                                <ol>
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/blog">Blog</Link></li>
                                    <li><span aria-current="page">{meta.title}</span></li>
                                </ol>
                            </nav>

                            <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight mb-4">
                                {meta.title}
                            </h1>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <User className="size-4 shrink-0" />
                                    {meta.authorName}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="size-4 shrink-0" />
                                    {formatDate(meta.publishedAt)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="size-4 shrink-0" />
                                    {meta.readingTime} min read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <InfoSection className="py-16">
                    <div className="max-w-6xl mx-auto flex gap-12">
                        {/* Main content */}
                        <div className="max-w-4xl flex-1 min-w-0">
                            {/* Editorial Trust Block */}
                            <EditorialTrustBlock
                                authorName={meta.authorName}
                                publishedAt={meta.publishedAt}
                                readingTime={meta.readingTime}
                            />

                            {/* MDX rendered content */}
                            <article className="blog-prose">
                                {children}
                            </article>

                            {/* Related Posts */}
                            <RelatedPosts currentSlug={meta.slug} />
                        </div>

                        {/* Sidebar — Table of Contents (desktop only) */}
                        {headings.length >= 2 && (
                            <aside className="hidden xl:block w-64 shrink-0">
                                <TableOfContents headings={headings} />
                            </aside>
                        )}
                    </div>
                </InfoSection>
            </main>
        </>
    );
}
