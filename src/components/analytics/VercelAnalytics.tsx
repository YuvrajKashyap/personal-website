"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

function isPrivatePath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function shouldDropTelemetry(url: string) {
  try {
    const parsed = new URL(url, "https://yuvrajkashyap.com");
    return isPrivatePath(parsed.pathname) || parsed.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

export function VercelAnalytics() {
  const pathname = usePathname();

  if (isPrivatePath(pathname)) {
    return null;
  }

  return (
    <>
      <Analytics
        beforeSend={(event) =>
          shouldDropTelemetry(event.url) ? null : event
        }
      />
      <SpeedInsights
        beforeSend={(event) =>
          shouldDropTelemetry(event.url) ? null : event
        }
      />
    </>
  );
}
