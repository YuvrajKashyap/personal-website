"use client";

import { usePathname } from "next/navigation";

/** Internal path of the prerendered light copy of Home (see next.config.ts). */
export const HOME_LIGHT_PATH = "/home-light";

/**
 * `usePathname`, with the light copy of Home reported as `/`. That page is
 * prerendered at its own path, so without this the server HTML would treat
 * it as a different route from the `/` the visitor is actually on.
 */
export function useSitePathname() {
  const pathname = usePathname();
  return pathname === HOME_LIGHT_PATH ? "/" : pathname;
}
