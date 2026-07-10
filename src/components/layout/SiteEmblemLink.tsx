/* eslint-disable @next/next/no-img-element -- The header emblem intentionally uses the original raster source so browser zoom cannot swap to a lower-resolution variant. */
"use client";

import Link from "next/link";

import { useTheme } from "@/components/theme/useTheme";

import emblem from "../../../assets/emblem/emblem.png";
import emblemLight from "../../../assets/emblem/emblemlight.png";

type SiteEmblemLinkProps = Readonly<{
  ariaLabel?: string;
  className?: string;
}>;

export function SiteEmblemLink({
  ariaLabel = "Yuvraj Kashyap home",
  className = "brand-mark focus-ring",
}: SiteEmblemLinkProps) {
  const { theme } = useTheme();
  const activeEmblem = theme === "light" ? emblemLight : emblem;

  return (
    <Link href="/" aria-label={ariaLabel} className={className}>
      <img
        src={activeEmblem.src}
        alt=""
        className="brand-emblem-image"
        width={activeEmblem.width}
        height={activeEmblem.height}
        decoding="async"
        fetchPriority="high"
      />
      <span className="visually-hidden">Yuvraj Kashyap</span>
    </Link>
  );
}
