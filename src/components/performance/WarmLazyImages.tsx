"use client";

import { useEffect } from "react";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Fetches and decodes the page's lazy images right after the page has loaded,
 * a few at a time in page order.
 *
 * On a returning visit those images come straight from the disk cache. On a
 * first visit each lazy image would only start downloading as the reader
 * scrolled near it, then land mid-scroll, where decoding it and redrawing
 * its part of the page cost frames. Warming them ahead of time makes a first
 * visit scroll like a returning one. Nothing on screen changes: the same
 * images, just already there when they are reached.
 *
 * Skipped when the visitor asked to save data or is on a very slow
 * connection; those keep the browser's normal lazy loading.
 */
export function WarmLazyImages() {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || /2g$/.test(connection?.effectiveType ?? "")) return;

    let cancelled = false;
    let cancelStart = () => {};

    const warm = async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));
      for (let index = 0; index < images.length && !cancelled; index += 3) {
        await Promise.all(
          images.slice(index, index + 3).map((image) => {
            image.loading = "eager";
            return image.decode().catch(() => {});
          }),
        );
      }
    };

    // Right after load rather than at the first idle moment: the page's
    // animations leave the browser almost never idle, and readers start
    // scrolling within a second or two. Images below the fold download at
    // low priority, so this never competes with what is on screen.
    const start = () => {
      const handle = window.setTimeout(() => void warm(), 100);
      cancelStart = () => window.clearTimeout(handle);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      cancelStart();
      window.removeEventListener("load", start);
    };
  }, []);

  return null;
}
