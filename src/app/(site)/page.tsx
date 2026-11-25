import { HomeView } from "@/features/home/HomeView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("home");

/**
 * Home, prerendered for the default (dark) theme so it is served straight
 * from the CDN. Visitors whose `yk-theme` cookie says light are rewritten to
 * the prerendered light copy at `/home-light` (see `next.config.ts`), so the
 * first paint matches their theme without a per-request server render.
 */
export default function Page() {
  return <HomeView serverTheme="dark" />;
}
