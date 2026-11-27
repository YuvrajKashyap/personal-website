import type { Metadata } from "next";
import { preload } from "react-dom";
import { VercelAnalytics } from "@/components/analytics/VercelAnalytics";
import { PostHogAnalytics } from "@/components/analytics/PostHogAnalytics";
import { MotionSystemProvider } from "@/components/motion/MotionSystemProvider";
import { ScrollProgressBar } from "@/components/motion/ScrollProgressBar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { seoConfig } from "@/config/seo";
import { DEFAULT_THEME } from "@/lib/theme/theme";
import { FONT_PRELOADS } from "./font-preloads.generated";
import "./fonts.generated.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  applicationName: seoConfig.siteName,
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  authors: [...seoConfig.authors],
  creator: seoConfig.creator,
  publisher: seoConfig.creator,
  keywords: [...seoConfig.keywords],
  category: "personal website",
  alternates: {
    canonical: seoConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    images: [
      {
        url: seoConfig.ogImage.path,
        width: seoConfig.ogImage.width,
        height: seoConfig.ogImage.height,
        alt: seoConfig.ogImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [seoConfig.ogImage.path],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Self-hosted fonts, trimmed at build time (scripts/fonts/build-fonts.mjs).
  // Only the trimmed Latin files are preloaded, exactly as next/font did.
  for (const href of FONT_PRELOADS) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  }
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className="h-full"
    >
      <body className="flex min-h-full flex-col antialiased">
        <ThemeScript />
        <ThemeProvider>
          <MotionSystemProvider>
            <ScrollProgressBar />
            {children}
          </MotionSystemProvider>
        </ThemeProvider>
        <VercelAnalytics />
        <PostHogAnalytics />
      </body>
    </html>
  );
}
