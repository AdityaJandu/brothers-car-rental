import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration is important as it tells Next.JS about the images we're allowing
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

export default nextConfig;
