import { getRelatedPosts } from "../../data/posts";
import { PostCard } from "./PostCard";

interface RelatedPostsProps {
    currentSlug: string;
}

export function RelatedPosts({ currentSlug }: RelatedPostsProps) {
    const related = getRelatedPosts(currentSlug, 3);

    if (related.length === 0) return null;

    return (
        <section className="mt-20 pt-16 border-t border-border" id="related-posts">
            <div className="text-center mb-12">
                <p className="font-sans text-secondary font-bold tracking-[0.2em] uppercase text-xs mb-3">
                    Keep Reading
                </p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">
                    Related Articles
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((post) => (
                    <PostCard key={post.slug} post={post} compact />
                ))}
            </div>
        </section>
    );
}
