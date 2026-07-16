import type { CSSProperties } from "react";

type HoverWaveTextProps = Readonly<{
  text: string;
  className?: string;
}>;

/**
 * Splits text into letters that ripple upward with a gold glow when the
 * whole word is hovered — the stagger runs left-to-right on enter and
 * unwinds on leave. Pure CSS; see `.hover-wave` styles.
 */
export function HoverWaveText({ text, className }: HoverWaveTextProps) {
  return (
    <span
      className={`hover-wave${className ? ` ${className}` : ""}`}
      aria-label={text}
    >
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          aria-hidden="true"
          className="hover-wave-char"
          style={{ "--wave-i": index } as CSSProperties}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
