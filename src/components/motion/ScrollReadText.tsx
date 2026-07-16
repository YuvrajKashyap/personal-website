"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Fragment, useMemo, useRef } from "react";

type ScrollReadTextProps = Readonly<{
  className?: string;
  text: string;
}>;

type ReadWordProps = Readonly<{
  progress: MotionValue<number>;
  step: number;
  start: number;
  word: string;
}>;

function ReadWord({ progress, step, start, word }: ReadWordProps) {
  const end = start + step * 6;
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);
  const filter = useTransform(progress, [start, end], [
    "blur(7px)",
    "blur(0px)",
  ]);
  const glow = useTransform(
    progress,
    [start, start + step * 3, end],
    [0, 1, 0],
  );

  return (
    <motion.span className="scroll-read-word" style={{ y, filter }}>
      <motion.span className="scroll-read-word-base" style={{ opacity }}>
        {word}
      </motion.span>
      <motion.span
        className="scroll-read-word-glow"
        style={{ opacity: glow }}
        aria-hidden="true"
      >
        {word}
      </motion.span>
    </motion.span>
  );
}

/**
 * Scroll-scrubbed reading reveal: words brighten left to right as the text
 * moves up the viewport, with a glowing accent edge that sweeps through the
 * words currently being "read". Blank lines in `text` start new paragraphs;
 * the sweep runs continuously across them.
 */
export function ScrollReadText({ className, text }: ScrollReadTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const paragraphs = useMemo(() => {
    const blocks = text
      .split(/\n\s*\n/)
      .map((block) => block.split(/\s+/).filter(Boolean));

    return blocks.map((words, index) => ({
      words,
      offset: blocks
        .slice(0, index)
        .reduce((count, prior) => count + prior.length, 0),
    }));
  }, [text]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.3"],
  });
  // Wheel scrolling is stepped; the spring turns those steps into a smooth,
  // trailing read so the sweep never stutters.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    mass: 1,
  });

  if (shouldReduceMotion) {
    return (
      <div className={`scroll-read-text ${className ?? ""}`}>
        {paragraphs.map(({ words }, index) => (
          <p key={index} className="scroll-read-paragraph">
            {words.join(" ")}
          </p>
        ))}
      </div>
    );
  }

  const totalWords = paragraphs.reduce(
    (count, { words }) => count + words.length,
    0,
  );
  const step = 1 / (totalWords + 6);

  return (
    <div ref={ref} className={`scroll-read-text ${className ?? ""}`}>
      <span className="scroll-read-sr">{text}</span>
      {paragraphs.map(({ words, offset }, paragraphIndex) => (
        <p
          key={paragraphIndex}
          className="scroll-read-paragraph"
          aria-hidden="true"
        >
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <ReadWord
                progress={smoothProgress}
                step={step}
                start={(offset + index) * step}
                word={word}
              />
              {index < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
