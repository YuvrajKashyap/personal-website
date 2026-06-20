import { TrackerPage } from "@/features/tracker/TrackerPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("tracker");

export default function TrackerRoute() {
  return <TrackerPage />;
}
