import { seoConfig } from "@/config/seo";
import { getPublishedProjects } from "@/lib/projects/projects";

export function getPublicSeoRoutes() {
  return Object.values(seoConfig.routeMetadata).map((route) => ({
    path: route.path,
    priority: route.priority,
    changeFrequency: route.changeFrequency,
  }));
}

export function getProjectSeoRoutes() {
  return getPublishedProjects().map((project) => ({
    path: `/projects/${project.slug}`,
    priority: project.priority === "flagship" ? 0.82 : 0.66,
    changeFrequency: "monthly" as const,
  }));
}
