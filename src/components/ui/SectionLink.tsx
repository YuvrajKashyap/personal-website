import Link from "next/link";

import { Magnetic } from "@/components/motion/Magnetic";

type SectionLinkProps = Readonly<{
  href: string;
  label: string;
  /** Opens in a new tab via a plain anchor (for off-site destinations). */
  external?: boolean;
}>;

/**
 * Bracketed section CTA: corner brackets are the only chrome, a gold fill
 * wipes up on hover while the label rolls over and the arrow slides through.
 * Magnetic, so it leans toward the cursor before it arrives.
 */
export function SectionLink({ href, label, external }: SectionLinkProps) {
  const content = (
    <>
      <span className="section-link-fill" aria-hidden="true" />
      <span className="section-link-corner is-tl" aria-hidden="true" />
      <span className="section-link-corner is-tr" aria-hidden="true" />
      <span className="section-link-corner is-bl" aria-hidden="true" />
      <span className="section-link-corner is-br" aria-hidden="true" />
      <span className="section-link-text">
        <span className="section-link-label">{label}</span>
        <span className="section-link-label" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="section-link-arrow" aria-hidden="true">
        <span>&rarr;</span>
        <span>&rarr;</span>
      </span>
    </>
  );

  return (
    <Magnetic strength={0.3} radius={110}>
      {external ? (
        <a
          href={href}
          className="section-link focus-ring"
          target="_blank"
          rel="noreferrer"
        >
          {content}
        </a>
      ) : (
        <Link href={href} className="section-link focus-ring">
          {content}
        </Link>
      )}
    </Magnetic>
  );
}
