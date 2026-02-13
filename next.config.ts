import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for static export without image optimization server
  images: {
    unoptimized: true,
  },

  // Strict mode for catching issues early
  reactStrictMode: true,
};

export default nextConfig;
