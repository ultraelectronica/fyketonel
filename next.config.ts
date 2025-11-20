import type { NextConfig } from "next";

const projectRoot = decodeURIComponent(new URL(".", import.meta.url).pathname);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
