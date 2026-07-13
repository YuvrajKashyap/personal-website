import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { VortexCursor } from "@/components/motion/VortexCursor";
import { SiteStructuredData } from "@/components/seo/SiteStructuredData";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteFooter />
      <SiteStructuredData />
      <VortexCursor />
    </div>
  );
}
