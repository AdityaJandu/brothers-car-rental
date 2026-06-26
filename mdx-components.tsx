import type { MDXComponents } from "mdx/types";
import { Heading } from "@/components/blog/Heading";
import Link from "next/link";

/**
 * Global MDX component overrides.
 * Required by @next/mdx for App Router.
 * Maps native HTML elements to custom React components.
 */
export function useMDXComponents(): MDXComponents {
    return {
        // Map h2 and h3 to our custom Heading component with auto-generated anchor IDs
        h2: ({ children }) => <Heading level={2}>{children}</Heading>,
        h3: ({ children }) => <Heading level={3}>{children}</Heading>,
        a: ({ href, children, ...props }) => {
            if (href?.startsWith("/")) {
                return (
                    <Link href={href} {...props}>
                        {children}
                    </Link>
                );
            }
            if (href?.startsWith("#")) {
                return (
                    <a href={href} {...props}>
                        {children}
                    </a>
                );
            }
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                </a>
            );
        },
    };
}
