import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "../../types";

interface PostCardProps {
    post: BlogPost;
    /** Compact variant for related posts grid */
    compact?: boolean;
    /** Whether to load the image eagerly (LCP optimization) */
    priority?: boolean;
}

/** Formats a tag slug into a human-readable label */
function formatTag(tag: string): string {
    return tag
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/** Formats a date as "Mon DD, YYYY" */
function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function PostCard({ post, compact = false, priority = false }: PostCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group block"
            id={`post-card-${post.slug}`}
        >
            <article
                className={cn(
                    "card-showroom overflow-hidden transition-all duration-500",
                    "hover:-translate-y-1 hover:shadow-[0_32px_64px_-12px_oklch(0.27_0.05_262/0.12)]",
                    "rounded-md"
                )}
            >
                {/* Cover Image */}
                <div
                    className={cn(
                        "relative overflow-hidden",
                        compact ? "aspect-16/10" : "aspect-video"
                    )}
                >
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={priority}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                    {/* Tag Badge */}
                    {post.tags[0] && (
                        <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-lg">
                            {formatTag(post.tags[0])}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className={cn("p-6", compact ? "p-4" : "p-6")}>
                    <h3
                        className={cn(
                            "font-heading font-bold text-primary leading-snug mb-2 transition-colors duration-300 group-hover:text-secondary",
                            compact ? "text-base line-clamp-2" : "text-lg md:text-xl line-clamp-2"
                        )}
                    >
                        {post.title}
                    </h3>

                    {!compact && (
                        <p className="font-sans text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta Footer */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 shrink-0" />
                            {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 shrink-0" />
                            {post.readingTime} min read
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
