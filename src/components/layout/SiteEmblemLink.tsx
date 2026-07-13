"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import { useTheme } from "@/components/theme/useTheme";

import styles from "./SiteEmblemLink.module.css";

import emblem from "../../../assets/emblem/emblem2.png";
import emblemLight from "../../../assets/emblem/emblem2light.png";

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
  const alphaMatrix =
    theme === "light"
      ? "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -4 -4 -4 0 10.8"
      : "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0.72 0.72 0.72 0 -0.12";

  return (
    <Link
      href="/"
      aria-label={ariaLabel}
      className={`${className} ${styles.cleanEmblem}`}
      style={{ "--brand-emblem-size": "clamp(4.634rem, 5.313vw, 5.432rem)" } as CSSProperties}
    >
      <svg
        viewBox={`0 0 ${activeEmblem.width} ${activeEmblem.height}`}
        aria-hidden="true"
        className={styles.radiance}
      >
        <defs>
          <filter id="yk-emblem-alpha-glow" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={alphaMatrix} />
          </filter>
        </defs>
        <image
          href={activeEmblem.src}
          width={activeEmblem.width}
          height={activeEmblem.height}
          filter="url(#yk-emblem-alpha-glow)"
        />
      </svg>
      <svg
        viewBox={`0 0 ${activeEmblem.width} ${activeEmblem.height}`}
        aria-hidden="true"
        className={`brand-emblem-image ${styles.image}`}
      >
        <defs>
          <filter id="yk-emblem-alpha-main" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={alphaMatrix} />
          </filter>
        </defs>
        <image
          href={activeEmblem.src}
          width={activeEmblem.width}
          height={activeEmblem.height}
          filter="url(#yk-emblem-alpha-main)"
        />
      </svg>
      <span className="visually-hidden">Yuvraj Kashyap</span>
    </Link>
  );
}
