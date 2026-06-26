"use client";

import { useMemo, useState } from "react";
import { InfoPageHeader } from "../../../components/InfoPageHeader";
import { InfoSection } from "../../../components/InfoSection";
import { PostCard } from "../components/PostCard";
import { BlogFilters } from "../components/BlogFilters";
import { EmptyState } from "@/components/self/empty-state";
import { useQueryState, parseAsString } from "nuqs";
import type { BlogTag } from "../../types";
import type { MdxPostMeta } from "@/lib/mdx";
import { PaginationControls } from "@/components/self/pagination-controls";

interface BlogViewProps {
    allPosts: MdxPostMeta[]; // In paginated mode, this contains only the current page's posts
    allTags: BlogTag[];
    currentPage?: number;
    totalPages?: number;
    basePath?: string;
}

const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Brothers Car Rental Blog",
    description:
        "Car rental tips, road trip guides, and travel advice for India",
    url: "https://www.brothersgroupindia.online/blog",
    publisher: {
        "@type": "Organization",
        name: "Brothers Car Rental",
        logo: {
            "@type": "ImageObject",
            url: "https://www.brothersgroupindia.online/app-logo.svg",
        },
    },
};

export function BlogView({ allPosts, allTags, currentPage = 1, totalPages = 1, basePath = "/blog" }: BlogViewProps) {

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
                    p.description.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.includes(q))
            );
        }

        return filtered;
    }, [allPosts, activeTag, searchQuery]);

    // Calculate result count before pagination to pass to filters
    // Wait, allPosts is already paginated server-side! 
    // The filter works ONLY on the current page.

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />
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
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                                {filteredPosts.map((post, index) => (
                                    <PostCard key={post.slug} post={post} priority={index < 3} />
                                ))}
                            </div>
                            
                            {/* Hide pagination if user is actively searching/filtering on client */}
                            {!searchQuery && !activeTag && totalPages > 1 && (
                                <PaginationControls 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    basePath={basePath} 
                                />
                            )}
                        </>
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
        </>
    );
}
