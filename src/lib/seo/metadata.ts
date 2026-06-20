import type { Metadata } from "next";

import {
  seoConfig,
  type SeoRouteKey,
} from "@/config/seo";
import type { Project } from "@/types/project";

type MetadataOptions = Readonly<{
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}>;

function stripTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${stripTrailingSlash(seoConfig.siteUrl)}${normalizedPath}`;
}

export function createMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}: MetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const image = {
    url: seoConfig.ogImage.path,
    width: seoConfig.ogImage.width,
    height: seoConfig.ogImage.height,
    alt: seoConfig.ogImage.alt,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: seoConfig.siteName,
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: undefined,
      images: [seoConfig.ogImage.path],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
  };
}

export function createPageMetadata(routeKey: SeoRouteKey): Metadata {
  const route = seoConfig.routeMetadata[routeKey];

  return createMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
    absoluteTitle: routeKey === "home",
  });
}

export function createNoindexMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return createMetadata({
    title,
    description,
    path,
    noindex: true,
  });
}

export function createProjectMetadata(project?: Project): Metadata {
  if (!project || project.visibility !== "published") {
    return createMetadata({
      title: "Project not available",
      description: "No public project detail is available for this slug.",
      path: "/projects",
      noindex: true,
    });
  }

  return createMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}
