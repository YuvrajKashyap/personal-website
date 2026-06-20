import type { MetadataRoute } from "next";

import { seoConfig } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api", "/api/"],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}
