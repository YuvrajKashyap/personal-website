import type { MetadataRoute } from "next";

import { seoConfig } from "@/config/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.siteName,
    short_name: "YK",
    description: seoConfig.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0805",
    theme_color: "#0a0805",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
