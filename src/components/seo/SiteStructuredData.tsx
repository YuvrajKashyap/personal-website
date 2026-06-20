import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteStructuredData } from "@/lib/seo/jsonld";

export function SiteStructuredData() {
  return <JsonLd data={getSiteStructuredData()} />;
}
