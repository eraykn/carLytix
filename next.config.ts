import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Build sırasında ESLint hatalarını ignore et
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
