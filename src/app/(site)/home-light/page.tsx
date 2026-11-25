import { HomeView } from "@/features/home/HomeView";
import { createPageMetadata } from "@/lib/seo/metadata";

// Same metadata as `/` (canonical included): this is `/` for light visitors.
export const metadata = createPageMetadata("home");

/**
 * Home prerendered for the light theme. Never linked or visited directly:
 * `/` is rewritten here when the `yk-theme` cookie is `light`, and a direct
 * request is redirected back to `/` (both in `next.config.ts`).
 */
export default function HomeLightPage() {
  return <HomeView serverTheme="light" />;
}
