import { Calendar, Clock, User, RefreshCw } from "lucide-react";

interface EditorialTrustBlockProps {
    authorName: string;
    publishedAt: string;
    readingTime: number;
    /** Optional last-updated date. Falls back to publishedAt if not provided. */
    updatedAt?: string;
}

/** Formats an ISO date string as "Month DD, YYYY" */
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Editorial trust block displayed above the article body.
 * Shows author, publish date, last updated date, and reading time.
 * Builds E-E-A-T trust signals for SEO.
 */
export function EditorialTrustBlock({
    authorName,
    publishedAt,
    readingTime,
    updatedAt,
}: EditorialTrustBlockProps) {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4 px-5 mb-10 rounded-md bg-muted/50 border border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
                <User className="size-4 shrink-0 text-secondary" />
                <span className="font-medium text-foreground">{authorName}</span>
            </span>
            <span className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                Published {formatDate(publishedAt)}
            </span>
            {updatedAt && updatedAt !== publishedAt && (
                <span className="flex items-center gap-2">
                    <RefreshCw className="size-3.5 shrink-0" />
                    Updated {formatDate(updatedAt)}
                </span>
            )}
            <span className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" />
                {readingTime} min read
            </span>
        </div>
    );
}
