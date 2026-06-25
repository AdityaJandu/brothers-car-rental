import { Link as LinkIcon } from "lucide-react";
import type { ReactNode } from "react";

interface HeadingProps {
    /** Heading level — only 2 or 3 are used in blog posts */
    level: 2 | 3;
    /** Heading content */
    children: ReactNode;
    /** Optional explicit ID override — normally auto-generated from text */
    id?: string;
}

/** Converts heading text content to a URL-safe slug */
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

/** Extracts plain text from React children (handles nested elements) */
function getTextContent(children: ReactNode): string {
    if (typeof children === "string") return children;
    if (typeof children === "number") return String(children);
    if (Array.isArray(children)) return children.map(getTextContent).join("");
    if (
        children &&
        typeof children === "object" &&
        "props" in children &&
        (children as { props: { children?: ReactNode } }).props
    ) {
        return getTextContent(
            (children as { props: { children?: ReactNode } }).props.children
        );
    }
    return "";
}

/**
 * Custom heading component for MDX blog posts.
 * Auto-generates slug-based `id` attributes for Table of Contents anchor links.
 * Renders a hover-reveal link icon for easy section sharing.
 */
export function Heading({ level, children, id }: HeadingProps) {
    const text = getTextContent(children);
    const headingId = id || slugify(text);
    const Tag = `h${level}` as const;

    return (
        <Tag id={headingId} className="group scroll-mt-24">
            <a
                href={`#${headingId}`}
                className="no-underline hover:no-underline flex items-center gap-2"
            >
                {children}
                <LinkIcon className="size-4 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
            </a>
        </Tag>
    );
}
