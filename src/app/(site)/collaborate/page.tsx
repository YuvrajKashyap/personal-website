import { CollaboratePage } from "@/features/collaborate/CollaboratePage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("collaborate");

export default function CollaborateRoute() {
  return <CollaboratePage />;
}
