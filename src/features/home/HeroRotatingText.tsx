"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { homeContent } from "@/features/home/home-content";

type TypingPhase = "typing" | "holding" | "deleting";

const typeDelayMs = 44;
const deleteDelayMs = 24;
const holdDelayMs = 1450;
const restartDelayMs = 260;

function shuffleLineIndexes(length: number, avoidFirstIndex?: number) {
  const indexes = Array.from({ length }, (_, index) => index);

  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
  }

  if (indexes.length > 1 && indexes[0] === avoidFirstIndex) {
    const swapIndex = 1 + Math.floor(Math.random() * (indexes.length - 1));
    [indexes[0], indexes[swapIndex]] = [indexes[swapIndex], indexes[0]];
  }

  return indexes;
}

export function HeroRotatingText({
  className,
}: Readonly<{
  className?: string;
}>) {
  const shouldReduceMotion = useReducedMotion();
  const lines = homeContent.bodyLines;
  const [lineOrder, setLineOrder] = useState(() =>
    Array.from({ length: lines.length }, (_, index) => index),
  );
  const [isOrderReady, setIsOrderReady] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [phase, setPhase] = useState<TypingPhase>("typing");
  const currentLine = lines[lineOrder[lineIndex] ?? 0] ?? lines[0];
  const visibleText = shouldReduceMotion
    ? currentLine
    : currentLine.slice(0, visibleLength);

  useEffect(() => {
    if (!isOrderReady) {
      const timeout = window.setTimeout(() => {
        setLineOrder(shuffleLineIndexes(lines.length));
        setLineIndex(0);
        setVisibleLength(0);
        setPhase("typing");
        setIsOrderReady(true);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    if (shouldReduceMotion) {
      return undefined;
    }

    if (phase === "typing") {
      const timeout = window.setTimeout(
        () => {
          if (visibleLength >= currentLine.length) {
            setPhase("holding");
            return;
          }

          setVisibleLength((length) => length + 1);
        },
        visibleLength >= currentLine.length ? holdDelayMs : typeDelayMs,
      );

      return () => window.clearTimeout(timeout);
    }

    if (phase === "holding") {
      const timeout = window.setTimeout(() => {
        setPhase("deleting");
      }, restartDelayMs);

      return () => window.clearTimeout(timeout);
    }

    if (visibleLength <= 0) {
      const timeout = window.setTimeout(() => {
        const nextIndex = lineIndex + 1;

        if (nextIndex >= lineOrder.length) {
          setLineOrder(shuffleLineIndexes(lines.length, lineOrder[lineIndex]));
          setLineIndex(0);
        } else {
          setLineIndex(nextIndex);
        }

        setPhase("typing");
      }, restartDelayMs);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setVisibleLength((length) => Math.max(0, length - 1));
    }, deleteDelayMs);

    return () => window.clearTimeout(timeout);
  }, [
    currentLine,
    isOrderReady,
    lineIndex,
    lineOrder,
    lineOrder.length,
    lines.length,
    phase,
    shouldReduceMotion,
    visibleLength,
  ]);

  return (
    <p
      className={`hero-rotating-text text-body-large text-pretty${
        className ? ` ${className}` : ""
      }`}
    >
      <span className="visually-hidden">{currentLine}</span>
      <span aria-hidden="true" className="hero-rotating-text__value">
        {visibleText || "\u00A0"}
      </span>
      {shouldReduceMotion ? null : (
        <span aria-hidden="true" className="hero-rotating-text__cursor" />
      )}
    </p>
  );
}
