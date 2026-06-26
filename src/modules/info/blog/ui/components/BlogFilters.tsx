"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogTag } from "../../types";

/** Formats a tag slug into a human-readable label */
function formatTag(tag: string): string {
    return tag
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

interface BlogFiltersProps {
    tags: BlogTag[];
    activeTag: BlogTag | null;
    searchQuery: string;
    onTagChange: (tag: BlogTag | null) => void;
    onSearchChange: (query: string) => void;
    resultCount: number;
}

export function BlogFilters({
    tags,
    activeTag,
    searchQuery,
    onTagChange,
    onSearchChange,
    resultCount,
}: BlogFiltersProps) {
    const [isFocused, setIsFocused] = useState(false);

    const sortedTags = useMemo(() => [...tags].sort(), [tags]);

    return (
        <div className="space-y-6" id="blog-filters">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search
                    className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200 z-10",
                        isFocused ? "text-secondary" : "text-muted-foreground"
                    )}
                />
                <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="pl-11 pr-10 h-12 w-full rounded-md text-sm"
                    id="blog-search"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSearchChange("")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            {/* Tag Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                <Link
                    href="/blog"
                    className={cn(
                        "shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                        activeTag === null
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    id="blog-filter-all"
                >
                    All
                </Link>
                {sortedTags.map((tag) => (
                    <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className={cn(
                            "shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                            activeTag === tag
                                ? "bg-secondary text-secondary-foreground shadow-lg"
                                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        id={`blog-filter-${tag}`}
                    >
                        {formatTag(tag)}
                    </Link>
                ))}
            </div>

            {/* Result Count */}
            {(activeTag || searchQuery) && (
                <p className="text-sm text-muted-foreground">
                    {resultCount === 0
                        ? "No articles found"
                        : `${resultCount} article${resultCount !== 1 ? "s" : ""} found`}
                    {activeTag && (
                        <span>
                            {" "}in <span className="font-semibold text-secondary">{formatTag(activeTag)}</span>
                        </span>
                    )}
                    {searchQuery && (
                        <span>
                            {" "}matching &ldquo;<span className="font-semibold text-primary">{searchQuery}</span>&rdquo;
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}
