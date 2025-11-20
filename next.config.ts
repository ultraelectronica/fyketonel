import type { NextConfig } from "next";

const projectRoot = decodeURIComponent(new URL(".", import.meta.url).pathname);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ghchart.rshah.org",
      },
    ],
  },
};

export default nextConfig;
