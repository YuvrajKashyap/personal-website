"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { createFrameLoop } from "@/lib/performance/animation-runtime";

const STAR_COUNT = 150;
const ENGAGE_RAMP = 0.3;
const MIN_ENGAGE = 0.24;
const ARRIVE_SECONDS = 0.62;
const ENGAGE_TIMEOUT = 6;
/** Routes that live outside the public shell, plus direct file links. */
const SKIP_PATTERN = /^\/(admin|mail|api|media|_next)(\/|$)|\.[a-z0-9]{2,5}$/i;

type Phase = "idle" | "engage" | "arrive";

type Controller = {
  engage: () => void;
  arrive: () => void;
};

function isWarpLink(event: MouseEvent) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }
  const target = event.target;
  const anchor = target instanceof Element ? target.closest("a[href]") : null;
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname) return false;
  return !SKIP_PATTERN.test(url.pathname);
}

/**
 * Route change as a jump: pressing an internal link spools the stars up into
 * streaks behind a veil, and the next page drops out of warp underneath it.
 * It doubles as the loading state while a route is still on its way. Purely
 * decorative, skipped entirely for reduced-motion users.
 */
export function WarpTransit() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const angle = new Float32Array(STAR_COUNT);
    const radius = new Float32Array(STAR_COUNT);
    const pace = new Float32Array(STAR_COUNT);
    const weight = new Float32Array(STAR_COUNT);
    for (let index = 0; index < STAR_COUNT; index += 1) {
      angle[index] = Math.random() * Math.PI * 2;
      radius[index] = Math.random();
      pace[index] = 0.45 + Math.random() * 0.9;
      weight[index] = 0.35 + Math.random() * 0.65;
    }

    let phase: Phase = "idle";
    let phaseTime = 0;
    let lastTime = 0;
    let velocity = 0;
    let veil = 0;
    let veiled = false;
    let pendingArrive = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let streak = "255 217 130";
    let backdrop = "3 4 6";
    let strength = 1;

    const readPalette = () => {
      const style = getComputedStyle(document.documentElement);
      streak = style.getPropertyValue("--spacetime-body").trim() || streak;
      backdrop = style.getPropertyValue("--spacetime-void").trim() || backdrop;
      strength = document.documentElement.dataset.theme === "light" ? 0.62 : 1;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const setPhase = (next: Phase) => {
      phase = next;
      phaseTime = 0;
    };

    const draw = () => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (veil > 0.004) {
        context.fillStyle = `rgb(${backdrop} / ${veil.toFixed(3)})`;
        context.fillRect(0, 0, width, height);
      }
      if (velocity <= 0.004) return;

      const cx = width / 2;
      const cy = height * 0.46;
      const reach = Math.hypot(width, height) * 0.62;

      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, reach * 0.5);
      glow.addColorStop(
        0,
        `rgb(${streak} / ${(0.16 * velocity * strength).toFixed(3)})`,
      );
      glow.addColorStop(1, `rgb(${streak} / 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.lineCap = "round";
      for (let index = 0; index < STAR_COUNT; index += 1) {
        const r = radius[index];
        const length = velocity * (0.012 + r * 0.2) * pace[index];
        const inner = Math.max(0, r - length);
        const cos = Math.cos(angle[index]);
        const sin = Math.sin(angle[index]);
        const alpha = velocity * Math.min(1, r * 3.2) * weight[index] * strength;
        context.strokeStyle = `rgb(${streak} / ${alpha.toFixed(3)})`;
        context.lineWidth = 0.6 + r * 1.5 * weight[index];
        context.beginPath();
        context.moveTo(cx + cos * inner * reach, cy + sin * inner * reach);
        context.lineTo(cx + cos * r * reach, cy + sin * r * reach);
        context.stroke();
      }
    };

    const loop = createFrameLoop(
      (callback) => window.requestAnimationFrame(callback),
      (frame) => window.cancelAnimationFrame(frame),
      (time) => {
        const dt =
          lastTime === 0 ? 0.016 : Math.min(0.05, (time - lastTime) / 1000);
        lastTime = time;
        phaseTime += dt;

        if (phase === "engage") {
          const t = Math.min(1, phaseTime / ENGAGE_RAMP);
          velocity = t * t;
          veil = veiled ? 0.9 * t : 0;
          if (
            (pendingArrive && phaseTime >= MIN_ENGAGE) ||
            phaseTime > ENGAGE_TIMEOUT
          ) {
            pendingArrive = false;
            setPhase("arrive");
          }
        } else if (phase === "arrive") {
          const t = Math.min(1, phaseTime / ARRIVE_SECONDS);
          const eased = 1 - Math.pow(1 - t, 3);
          velocity = Math.min(velocity, 1 - eased);
          veil = Math.min(veil, (veiled ? 0.9 : 0) * (1 - eased));
          if (t >= 1) {
            setPhase("idle");
            velocity = 0;
            veil = 0;
          }
        }

        for (let index = 0; index < STAR_COUNT; index += 1) {
          radius[index] +=
            velocity * pace[index] * dt * (0.25 + radius[index] * 2.6);
          if (radius[index] > 1.05) {
            radius[index] = Math.random() * 0.12;
            angle[index] = Math.random() * Math.PI * 2;
          }
        }

        draw();
        const running = phase !== "idle";
        if (!running) {
          lastTime = 0;
          canvas.dataset.active = "false";
        }
        return running;
      },
    );

    const start = (withVeil: boolean) => {
      if (reducedMotion.matches) return false;
      readPalette();
      if (width !== window.innerWidth || height !== window.innerHeight) resize();
      veiled = withVeil;
      canvas.dataset.active = "true";
      loop.start();
      return true;
    };

    controllerRef.current = {
      engage() {
        if (phase === "engage") return;
        pendingArrive = false;
        if (start(true)) setPhase("engage");
      },
      arrive() {
        if (phase === "engage") {
          pendingArrive = true;
          return;
        }
        // Arrived without a click (back, forward, programmatic): no veil, just
        // the stars settling over the new page.
        if (phase === "idle" && start(false)) {
          velocity = 0.85;
          setPhase("arrive");
        }
      },
    };

    const onClick = (event: MouseEvent) => {
      if (isWarpLink(event)) controllerRef.current?.engage();
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("click", onClick);

    return () => {
      loop.stop();
      controllerRef.current = null;
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    controllerRef.current?.arrive();
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="warp-transit"
      data-active="false"
    />
  );
}
