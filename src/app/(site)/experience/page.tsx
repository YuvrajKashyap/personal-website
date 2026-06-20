import { ExperiencePage } from "@/features/experience/ExperiencePage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("experience");

export default function ExperienceRoutePage() {
  return <ExperiencePage />;
}
