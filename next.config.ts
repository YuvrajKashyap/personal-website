import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Barrel-optimize the motion import so only the pieces actually used are
  // bundled — smaller client JS, faster parse/hydrate. No runtime/UI change.
  experimental: {
    optimizePackageImports: ["motion"],
  },
  // The standalone pages were folded into Home (Nov 2026). Old links from
  // search results, the resume, and socials land on the matching chapter.
  async redirects() {
    return [
      { source: "/about", destination: "/#home-about-preview", permanent: true },
      { source: "/experience", destination: "/#home-experience-preview", permanent: true },
      { source: "/projects", destination: "/#home-projects-preview", permanent: true },
      { source: "/contact", destination: "/#home-contact", permanent: true },
      { source: "/services", destination: "/#home-contact", permanent: true },
      { source: "/collaborate", destination: "/#home-contact", permanent: true },
      { source: "/tracker", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
