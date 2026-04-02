import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'export' to enable server-side routes for Supabase Auth
  // Cloudflare Pages will automatically use Pages Functions for dynamic routes
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
