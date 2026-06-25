import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Image configuration for external image hosts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'giqenkioglreapfhfcyg.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog/best-road-trips-from-delhi',
        destination: '/blog/best-road-trips-from-dehradun',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      // Use string form for Turbopack compatibility
      "remark-gfm",
    ],
    rehypePlugins: [
      "rehype-slug",
    ],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
