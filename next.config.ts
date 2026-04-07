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
    ],
  },
};

export default nextConfig;
