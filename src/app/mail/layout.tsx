import { preload } from "react-dom";

import { SiteCursor } from "@/components/motion/SiteCursor";

import { FONT_PRELOADS } from "./font-preloads.generated";
/* The letter's own typeface, Fraunces, loaded only on this route; trimmed
   at build time like the site's fonts (scripts/fonts/build-fonts.mjs). */
import "./fonts.generated.css";

/**
 * Standalone chrome for the mail page: no site navigation, no footer — the
 * letter is the whole experience. The page renders its own YK emblem link
 * back to the main site and its own theme toggle.
 */
export default function MailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  for (const href of FONT_PRELOADS) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  }
  return (
    <div className="mail-fonts min-h-screen bg-background text-foreground">
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteCursor />
    </div>
  );
}
