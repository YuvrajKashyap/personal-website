import Link from "next/link";

import { OrbitalMark } from "@/components/brand/OrbitalMark";
import { Magnetic } from "@/components/motion/Magnetic";

type SiteEmblemLinkProps = Readonly<{
  ariaLabel?: string;
  className?: string;
}>;

export function SiteEmblemLink({
  ariaLabel = "Yuvraj Kashyap home",
  className = "brand-mark focus-ring",
}: SiteEmblemLinkProps) {
  return (
    <Link href="/" aria-label={ariaLabel} className={className}>
      <Magnetic className="orbital-magnet" strength={0.22} radius={110}>
        <OrbitalMark />
      </Magnetic>
      <span className="visually-hidden">Yuvraj Kashyap</span>
    </Link>
  );
}
