import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";
import { getProjectSeoRoutes, getPublicSeoRoutes } from "@/lib/seo/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...getPublicSeoRoutes(), ...getProjectSeoRoutes()].map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
