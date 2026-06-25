"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TocHeading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    /** Headings extracted from the MDX content */
    headings: TocHeading[];
}

/**
 * Sticky sidebar Table of Contents for blog posts.
 * Highlights the currently visible section using IntersectionObserver.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const headingElements = headings
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (headingElements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first intersecting heading
                const visible = entries.find((e) => e.isIntersecting);
                if (visible?.target.id) {
                    setActiveId(visible.target.id);
                }
            },
            {
                rootMargin: "-80px 0px -60% 0px",
                threshold: 0,
            }
        );

        headingElements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <nav
            className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto"
            aria-label="Table of Contents"
        >
            <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <List className="size-3.5 shrink-0" />
                On This Page
            </div>
            <ul className="space-y-1 border-l border-border pl-0 list-none">
                {headings.map(({ id, text, level }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            className={cn(
                                "block py-1.5 text-sm leading-snug transition-colors border-l-2 -ml-px no-underline",
                                level === 3 ? "pl-6" : "pl-4",
                                activeId === id
                                    ? "border-secondary text-secondary font-medium"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                            )}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
