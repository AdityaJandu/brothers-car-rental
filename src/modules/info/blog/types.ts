export type BlogTag =
    | "tips"
    | "city-guide"
    | "how-to"
    | "comparison"
    | "family"
    | "luxury"
    | "seasonal"
    | "faq"
    | "brand";

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    /** HTML string — rendered via dangerouslySetInnerHTML */
    content: string;
    coverImage: string;
    authorName: string;
    tags: BlogTag[];
    /** Estimated reading time in minutes */
    readingTime: number;
    publishedAt: Date;
    isPublished: boolean;
}
