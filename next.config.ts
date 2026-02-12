import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Uncomment for static build (npm run build)
  distDir: 'dist',
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: trailing slashes for cleaner URLs
  trailingSlash: true,
};

export default nextConfig;
