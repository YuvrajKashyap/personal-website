import { siteConfig } from "@/config/site";

export const SEO_SITE_URL = "https://yuvrajkashyap.com";

export const seoConfig = {
  siteName: siteConfig.name,
  siteTitle: "Yuvraj Kashyap",
  titleTemplate: "%s | Yuvraj Kashyap",
  defaultTitle: "Yuvraj Kashyap",
  defaultDescription:
    "Personal operating interface for software systems, projects, current-state signal, services, collaboration, and contact.",
  siteUrl: SEO_SITE_URL,
  canonicalBase: SEO_SITE_URL,
  creator: "Yuvraj Kashyap",
  authors: [{ name: "Yuvraj Kashyap", url: SEO_SITE_URL }],
  keywords: [
    "Yuvraj Kashyap",
    "software builder",
    "software systems",
    "projects",
    "personal website",
    "current-state signal",
    "services",
    "collaboration",
  ],
  ogImage: {
    path: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Yuvraj Kashyap landing page in Singularity OS dark mode",
  },
  sameAs: siteConfig.socialLinks
    .filter((link) => link.external)
    .map((link) => link.href),
  noindexRoutePrefixes: ["/admin", "/api"],
  routeMetadata: {
    home: {
      path: "/",
      title: "Yuvraj Kashyap",
      description:
        "Personal operating interface for software systems, projects, current-state signal, services, collaboration, and contact.",
      priority: 1,
      changeFrequency: "weekly",
    },
  },
} as const;

export type SeoRouteKey = keyof typeof seoConfig.routeMetadata;
