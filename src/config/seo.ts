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
    alt: "Yuvraj Kashyap personal operating interface",
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
    about: {
      path: "/about",
      title: "About",
      description:
        "Background, trajectory, discipline, and current building phase of Yuvraj Kashyap.",
      priority: 0.78,
      changeFrequency: "monthly",
    },
    experience: {
      path: "/experience",
      title: "Experience",
      description:
        "Technical work, leadership, projects, discipline, and direction shaping how Yuvraj Kashyap builds.",
      priority: 0.78,
      changeFrequency: "monthly",
    },
    projects: {
      path: "/projects",
      title: "Projects",
      description:
        "Selected systems, technical projects, build directions, and public proof surfaces from Yuvraj Kashyap.",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    tracker: {
      path: "/tracker",
      title: "Tracker",
      description:
        "Manual current-state signal, active systems, focus areas, and operating direction for Yuvraj Kashyap.",
      priority: 0.72,
      changeFrequency: "weekly",
    },
    services: {
      path: "/services",
      title: "Services",
      description:
        "Scoped build requests for product surfaces, technical systems, prototypes, and execution support.",
      priority: 0.74,
      changeFrequency: "monthly",
    },
    collaborate: {
      path: "/collaborate",
      title: "Collaborate",
      description:
        "Broader aligned opportunities with founders, builders, creators, startups, and technical teams.",
      priority: 0.72,
      changeFrequency: "monthly",
    },
    contact: {
      path: "/contact",
      title: "Contact",
      description:
        "Verified contact routes and submission forms for scoped requests, broader collaboration, and project context.",
      priority: 0.7,
      changeFrequency: "monthly",
    },
  },
} as const;

export type SeoRouteKey = keyof typeof seoConfig.routeMetadata;
