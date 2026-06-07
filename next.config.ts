import type { NextConfig } from "next";
import { readBackendOriginForRewrites } from "@/config/next-runtime";

const backendOrigin = readBackendOriginForRewrites({
  BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/issue",
        destination: "/all-issues",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: `${backendOrigin}/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
