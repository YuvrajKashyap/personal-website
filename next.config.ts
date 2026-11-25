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
      // The light copy of Home is only ever served through the rewrite below.
      // Redirects match the URL the visitor asked for, so this never touches
      // the rewritten request.
      { source: "/home-light", destination: "/", permanent: false },
    ];
  },
  // Hero footage, posters, portraits and project previews used to be
  // revalidated with the server on every visit. A day of browser caching
  // (then serve-stale while refreshing) saves returning visitors those round
  // trips. The resume is left alone so a new upload shows up immediately.
  async headers() {
    const media = "public, max-age=86400, stale-while-revalidate=604800";
    return ["hero", "project-previews", "portrait", "og"].map((folder) => ({
      source: `/media/${folder}/:path*`,
      headers: [{ key: "Cache-Control", value: media }],
    }));
  },
  // Home is prerendered twice, once per theme, so it can be served from the
  // CDN instead of rendered per request. The theme cookie picks the copy at
  // the routing layer, before any function runs.
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "cookie", key: "yk-theme", value: "light" }],
          destination: "/home-light",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
