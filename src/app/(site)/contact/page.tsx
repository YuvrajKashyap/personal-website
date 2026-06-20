import { ContactPage } from "@/features/contact/ContactPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("contact");

export default function ContactRoute() {
  return <ContactPage />;
}
