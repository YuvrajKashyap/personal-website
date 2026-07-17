"use client";

import { useSyncExternalStore } from "react";

export const CURSOR_TRAIL_STORAGE_KEY = "cursor-trail";
export const CURSOR_TRAIL_EVENT = "cursor-trail-change";

let cursorTrailFallback = false;

export function isCursorTrailEnabled() {
  try {
    cursorTrailFallback =
      window.localStorage.getItem(CURSOR_TRAIL_STORAGE_KEY) === "on";
    return cursorTrailFallback;
  } catch {
    return cursorTrailFallback;
  }
}

function subscribeToCursorTrail(callback: () => void) {
  window.addEventListener(CURSOR_TRAIL_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CURSOR_TRAIL_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * Minimal comet-icon button that toggles the red cursor trail on and off.
 * Persists the choice and broadcasts CURSOR_TRAIL_EVENT for SiteCursor.
 */
export function CursorTrailToggle() {
  const enabled = useSyncExternalStore(
    subscribeToCursorTrail,
    isCursorTrailEnabled,
    () => false,
  );

  function toggle() {
    const next = !enabled;
    cursorTrailFallback = next;

    try {
      window.localStorage.setItem(
        CURSOR_TRAIL_STORAGE_KEY,
        next ? "on" : "off",
      );
    } catch {
      // storage unavailable; the event still updates the current session
    }

    window.dispatchEvent(
      new CustomEvent(CURSOR_TRAIL_EVENT, { detail: { enabled: next } }),
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={`${enabled ? "Disable" : "Enable"} cursor trail`}
      title={`${enabled ? "Disable" : "Enable"} cursor trail`}
      className={`trail-toggle focus-ring${enabled ? " is-on" : ""}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="trail-toggle__icon"
        fill="none"
      >
        <circle cx="17" cy="7" r="2.6" fill="currentColor" stroke="none" />
        <path
          className="trail-toggle__tail"
          d="M14 10.5 10 14.5M8.2 16.3l-1.7 1.7M5 19.5l-.6.6"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
