import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Vercel manages its own Next.js output tracing. Standalone output is only
  // needed by the Docker image and conflicts with Vercel's build adapter.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
