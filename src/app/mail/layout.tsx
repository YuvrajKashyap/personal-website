import { Fraunces } from "next/font/google";

import { SiteCursor } from "@/components/motion/SiteCursor";

/* The letter's own typeface, loaded only on this route. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

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
  return (
    <div className={`${fraunces.variable} min-h-screen bg-background text-foreground`}>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <SiteCursor />
    </div>
  );
}
