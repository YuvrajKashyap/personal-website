import type { CSSProperties } from "react";

type HoverWaveTextProps = Readonly<{
  text: string;
  className?: string;
}>;

/** Words with the index of their first letter, so the wave keeps its order. */
function words(text: string) {
  const parts = text.split(" ");
  let start = 0;
  return parts.map((part, index) => {
    const word = { text: part, start, last: index === parts.length - 1 };
    start += Array.from(part).length + 1;
    return word;
  });
}

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
      {words(text).map((word) => (
        <span key={word.start} aria-hidden="true">
          {/* Letters are inline-blocks, so without this wrapper a narrow
              screen would break a line in the middle of a word. */}
          <span className="hover-wave-word">
            {Array.from(word.text).map((char, offset) => (
              <span
                key={`${char}-${offset}`}
                className="hover-wave-char"
                style={{ "--wave-i": word.start + offset } as CSSProperties}
              >
                {char}
              </span>
            ))}
          </span>
          {word.last ? null : " "}
        </span>
      ))}
    </span>
  );
}
