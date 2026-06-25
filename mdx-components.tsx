import type { MDXComponents } from "mdx/types";
import { Heading } from "@/components/blog/Heading";

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
    };
}
