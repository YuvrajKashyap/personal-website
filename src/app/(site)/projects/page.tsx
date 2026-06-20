import { ProjectsPage } from "@/features/projects/ProjectsPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("projects");

export default function ProjectsRoute() {
  return <ProjectsPage />;
}
