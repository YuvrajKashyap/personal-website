"use client";

type PostmarkProps = Readonly<{
  /** Unique id prefix so multiple postmarks can coexist on one page. */
  markId: string;
  className?: string;
  centerTop?: string;
  centerBottom?: string;
  /** Wavy cancellation bars trailing to the right, classic postmark style. */
  bars?: boolean;
}>;

/* Ring circumference is 2π·45 ≈ 283 units; this text is sized + letter-spaced
   to fill it exactly once so it never overlaps its own start. */
const RING_TEXT = "YUV GOT MAIL • YUVRAJKASHYAP.COM • ";

/**
 * Ink postmark: double ring, circular text, and optional wavy killer bars.
 * Pure SVG stamped in `currentColor` so it works on paper and on the page.
 */
export function Postmark({
  markId,
  className,
  centerTop = "FIRST",
  centerBottom = "CLASS",
  bars = false,
}: PostmarkProps) {
  const ringId = `${markId}-ring`;
  const width = bars ? 232 : 124;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} 124`}
      width={width}
      height={124}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <path
          id={ringId}
          d="M 62 62 m -45 0 a 45 45 0 1 1 90 0 a 45 45 0 1 1 -90 0"
        />
      </defs>
      <circle cx="62" cy="62" r="56" stroke="currentColor" strokeWidth="2.5" />
      <circle
        cx="62"
        cy="62"
        r="34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <text
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="2.4"
      >
        <textPath href={`#${ringId}`}>{RING_TEXT}</textPath>
      </text>
      <text
        x="62"
        y="58"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2"
        textAnchor="middle"
      >
        {centerTop}
      </text>
      <line x1="44" y1="64" x2="80" y2="64" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="62"
        y="78"
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2"
        textAnchor="middle"
      >
        {centerBottom}
      </text>
      {bars ? (
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M126 44 C 146 36, 166 52, 186 44 C 202 38, 216 48, 226 44" />
          <path d="M126 62 C 146 54, 166 70, 186 62 C 202 56, 216 66, 226 62" />
          <path d="M126 80 C 146 72, 166 88, 186 80 C 202 74, 216 84, 226 80" />
        </g>
      ) : null}
    </svg>
  );
}
