import { HomePage } from "@/features/home/HomePage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata("home");

export default function Page() {
  return <HomePage />;
}
