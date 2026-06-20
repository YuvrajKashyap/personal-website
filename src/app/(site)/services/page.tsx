import { ServicesPage } from "@/features/services/ServicesPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("services");

export default function ServicesRoute() {
  return <ServicesPage />;
}
