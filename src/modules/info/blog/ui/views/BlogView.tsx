"use client";

import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import { InfoPageHeader } from "../../../components/InfoPageHeader";
import { InfoSection } from "../../../components/InfoSection";
import { PostCard } from "../components/PostCard";
import { BlogFilters } from "../components/BlogFilters";
import { getAllPublishedPosts, getAllTags } from "../../data/posts";
import type { BlogTag } from "../../types";

export function BlogView() {
    const allPosts = useMemo(() => getAllPublishedPosts(), []);
    const allTags = useMemo(() => getAllTags(), []);

    const [activeTag, setActiveTag] = useState<BlogTag | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = useMemo(() => {
        let filtered = allPosts;

        if (activeTag) {
            filtered = filtered.filter((p) => p.tags.includes(activeTag));
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.excerpt.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.includes(q))
            );
        }

        return filtered;
    }, [allPosts, activeTag, searchQuery]);

    return (
        <main className="min-h-screen pt-20">
            {/* Hero */}
            <InfoSection>
                <div className="relative">
                    {/* Background accents */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative">
                        <p className="font-sans text-secondary font-bold tracking-[0.2em] uppercase text-sm mb-6">
                            Insights &amp; Guides
                        </p>
                        <InfoPageHeader
                            title={
                                <>
                                    The Brothers<br />
                                    Car Rental Blog
                                </>
                            }
                            description="Expert tips, city guides, and insider knowledge to make every journey unforgettable. From choosing the right car to discovering hidden road trip gems."
                            className="mb-12"
                        />
                    </div>
                </div>
            </InfoSection>

            {/* Filters + Grid */}
            <InfoSection className="pb-32">
                <BlogFilters
                    tags={allTags}
                    activeTag={activeTag}
                    searchQuery={searchQuery}
                    onTagChange={setActiveTag}
                    onSearchChange={setSearchQuery}
                    resultCount={filteredPosts.length}
                />

                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                            <FileText className="size-7 text-muted-foreground" />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-primary mb-2">
                            No articles found
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            Try adjusting your search or clearing the tag filter to browse all articles.
                        </p>
                    </div>
                )}
            </InfoSection>
        </main>
    );
}
