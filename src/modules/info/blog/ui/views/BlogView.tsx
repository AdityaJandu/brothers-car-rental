"use client";

import { useMemo, useState } from "react";
import { InfoPageHeader } from "../../../components/InfoPageHeader";
import { InfoSection } from "../../../components/InfoSection";
import { PostCard } from "../components/PostCard";
import { BlogFilters } from "../components/BlogFilters";
import { EmptyState } from "@/components/self/empty-state";
import { useQueryState, parseAsString } from "nuqs";
import { getAllPublishedPosts, getAllTags } from "../../data/posts";
import type { BlogTag } from "../../types";

export function BlogView() {
    const allPosts = useMemo(() => getAllPublishedPosts(), []);
    const allTags = useMemo(() => getAllTags(), []);

    const [activeTagStr, setActiveTagStr] = useQueryState("tag", parseAsString.withDefault(""));
    const activeTag = (activeTagStr || null) as BlogTag | null;
    const setActiveTag = (tag: BlogTag | null) => setActiveTagStr(tag || "");

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
                    <div className="mt-10">
                        <EmptyState
                            title="No articles found"
                            descr="Try adjusting your search or clearing the tag filter to browse all articles."
                        />
                    </div>
                )}
            </InfoSection>
        </main>
    );
}
