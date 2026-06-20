import { AboutPage } from "@/features/about/AboutPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("about");

export default function AboutRoutePage() {
  return <AboutPage />;
}
