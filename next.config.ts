import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Barrel-optimize the motion import so only the pieces actually used are
  // bundled — smaller client JS, faster parse/hydrate. No runtime/UI change.
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
