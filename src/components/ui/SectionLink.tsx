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
/**
 * The arrow used to be the &rarr; character, but Space Mono's latin subset
 * lacks U+2192, so the browser substituted a fallback glyph that overflowed
 * the clipped arrow box. An inline SVG keeps the geometry font-independent.
 */
function ArrowGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor">
      <path d="M1 6h9.5M6.5 1.75 10.75 6 6.5 10.25" strokeWidth="1.5" />
    </svg>
  );
}

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
        <span>
          <ArrowGlyph />
        </span>
        <span>
          <ArrowGlyph />
        </span>
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
