import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages trailingSlash handling
  trailingSlash: true,
};

export default nextConfig;
