import fs from "fs";
import path from "path";
import type { BlogTag } from "@/modules/info/blog/types";

/** Metadata exported from each MDX blog post file */
export interface MdxPostMeta {
    slug: string;
    title: string;
    description: string;
    coverImage: string;
    authorName: string;
    tags: BlogTag[];
    readingTime: number;
    /** ISO date string, e.g. "2025-11-15" */
    publishedAt: string;
    canonicalUrl: string;
}

/** Heading info extracted from MDX content for Table of Contents */
export interface TocHeading {
    id: string;
    text: string;
    level: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

// ── Slug listing ───────────────────────────────────────────────────

/** Returns all MDX slugs from the content/blog directory */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    return fs
        .readdirSync(CONTENT_DIR)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""));
}

// ── Metadata cache ─────────────────────────────────────────────────

let cachedPosts: MdxPostMeta[] | null = null;

/** Loads and caches all post metadata. Uses dynamic import to access `metadata` exports. */
async function loadAllMetadata(): Promise<MdxPostMeta[]> {
    if (cachedPosts) return cachedPosts;

    const slugs = getAllPostSlugs();
    const metas: MdxPostMeta[] = [];

    for (const slug of slugs) {
        try {
            const mod = await import(`@content/blog/${slug}.mdx`);
            if (mod.metadata) {
                metas.push(mod.metadata as MdxPostMeta);
            }
        } catch (err) {
            console.error(`[mdx] Failed to load metadata for "${slug}":`, err);
        }
    }

    // Sort by publishedAt descending (newest first)
    metas.sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    cachedPosts = metas;
    return metas;
}

// ── Synchronous helpers (for use in non-async contexts) ────────────

/**
 * Synchronous version that returns cached posts.
 * Must be called after `loadAllMetadata()` has been awaited at least once.
 * Falls back to empty array if cache is not ready.
 */
export function getAllPublishedPostsSync(): MdxPostMeta[] {
    return cachedPosts ?? [];
}

// ── Async helpers ──────────────────────────────────────────────────

/** Returns all published post metadata, sorted by date descending */
export async function getAllPublishedPosts(): Promise<MdxPostMeta[]> {
    return loadAllMetadata();
}

/** Returns a single post's metadata by slug, or undefined */
export async function getPostMetaBySlug(
    slug: string
): Promise<MdxPostMeta | undefined> {
    const posts = await loadAllMetadata();
    return posts.find((p) => p.slug === slug);
}

/** Returns all published posts matching a given tag */
export async function getPostsByTag(tag: BlogTag): Promise<MdxPostMeta[]> {
    const posts = await loadAllMetadata();
    return posts.filter((p) => p.tags.includes(tag));
}

/** Returns all unique tags used across published posts */
export async function getAllTags(): Promise<BlogTag[]> {
    const posts = await loadAllMetadata();
    const tags = new Set<BlogTag>();
    for (const post of posts) {
        for (const tag of post.tags) {
            tags.add(tag);
        }
    }
    return Array.from(tags);
}

/** Returns related posts based on overlapping tags, excluding the current post */
export async function getRelatedPosts(
    currentSlug: string,
    limit = 3
): Promise<MdxPostMeta[]> {
    const posts = await loadAllMetadata();
    const current = posts.find((p) => p.slug === currentSlug);

    if (!current) return posts.slice(0, limit);

    const scored = posts
        .filter((p) => p.slug !== currentSlug)
        .map((p) => ({
            post: p,
            score: p.tags.filter((t) => current.tags.includes(t)).length,
        }))
        .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.post);
}

// ── MDX component loading ──────────────────────────────────────────

/** Dynamically imports an MDX file and returns both the component and metadata */
export async function getMdxPost(slug: string) {
    try {
        const mod = await import(`@content/blog/${slug}.mdx`);
        return {
            Component: mod.default as React.ComponentType,
            metadata: mod.metadata as MdxPostMeta,
        };
    } catch {
        return null;
    }
}
