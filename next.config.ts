import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1920],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    return [
      // Legacy URLs from the current Tilda site
      { source: "/ai2026", destination: "/courses/ai-creator", permanent: true },
      { source: "/prakticum", destination: "/courses/practicum", permanent: true },
      { source: "/courses/ai2026", destination: "/courses/ai-creator", permanent: true },
    ];
  },
};

export default nextConfig;
