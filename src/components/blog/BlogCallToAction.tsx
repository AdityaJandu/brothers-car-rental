import Link from "next/link";

interface BlogCallToActionProps {
    /** CTA headline text */
    title: string;
    /** Button link destination */
    href: string;
    /** Button label text */
    buttonText: string;
}

/**
 * Call-to-action block for blog posts.
 * Replaces the old `<div class="blog-cta">` HTML pattern.
 * Uses existing `.blog-cta` and `.blog-cta-button` CSS classes from globals.css.
 */
export function BlogCallToAction({ title, href, buttonText }: BlogCallToActionProps) {
    return (
        <div className="blog-cta">
            <p>
                <strong>{title}</strong>
            </p>
            <Link href={href} className="blog-cta-button" title={buttonText}>
                {buttonText}
            </Link>
        </div>
    );
}
