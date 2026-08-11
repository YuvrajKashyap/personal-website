"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { MAIL_OPENED_EVENT, MAIL_SENT_EVENT } from "@/features/mail/mail-events";
import {
  createPointTrail,
  getTrailPointOffset,
  pushTrailPoint,
  tracePolyline,
  type PointTrail,
} from "@/lib/performance/runtime-utils";

type RouteCanvasProps = Readonly<{
  className?: string;
}>;

type Route = {
  points: Float32Array;
  path: Path2D;
  depth: number;
  t: number;
  speed: number;
  trail: PointTrail;
};

type Flyby = {
  active: boolean;
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
  t: number;
  duration: number;
  scale: number;
  trail: PointTrail;
};

type Speck = {
  x: number;
  y: number;
  radius: number;
  depth: number;
  phase: number;
};

const ROUTE_COUNT = 5;
const SPECK_COUNT = 46;
const SAMPLES = 96;
const TRAIL_LEN = 18;
const FLYBY_TRAIL_LEN = 34;
const FLYBY_POOL = 6;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function readPalette(element: HTMLElement) {
  const computed = getComputedStyle(element);
  const dark = element.dataset.theme !== "light";
  return {
    dark,
    accent: computed.getPropertyValue("--accent").trim() || "#f0c96a",
    secondary: computed.getPropertyValue("--accent-secondary").trim() || "#7db7ff",
    foreground: computed.getPropertyValue("--foreground").trim() || "#f6f1e8",
    // Postal red planes by day, gold comets by night.
    plane: dark ? computed.getPropertyValue("--accent").trim() || "#f0c96a" : "#b8352c",
  };
}

/**
 * The sky of the page: dashed flight arcs with paper planes riding them, each
 * dragging a fading comet trail, plus ambient depth specks. Every few seconds
 * a larger plane crosses the whole scene; opening the envelope launches one,
 * and a successful signup scrambles a small squadron. Dark theme renders the
 * trails additively (gold light at night); light theme keeps crisp postal-red
 * ink on the day sky.
 */
export function MailRoutesCanvas({ className }: RouteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let routes: Route[] = [];
    let specks: Speck[] = [];
    const flybys: Flyby[] = Array.from({ length: FLYBY_POOL }, () => ({
      active: false,
      startX: 0,
      startY: 0,
      controlX: 0,
      controlY: 0,
      endX: 0,
      endY: 0,
      t: 0,
      duration: 3400,
      scale: 1,
      trail: createPointTrail(FLYBY_TRAIL_LEN),
    }));
    let palette = readPalette(document.documentElement);
    let frame = 0;
    let running = false;
    let visible = true;
    let energy = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastTime = 0;
    let clock = 0;
    let nextFlybyAt = 4200;
    const pendingFlybys: number[] = [];
    const runtimeRandom = mulberry32(97131);

    const buildScene = () => {
      const random = mulberry32(20260809);
      routes = [];
      specks = [];

      for (let index = 0; index < ROUTE_COUNT; index += 1) {
        const startY = height * (0.16 + random() * 0.7);
        const endY = height * (0.1 + random() * 0.74);
        const controlX = width * (0.3 + random() * 0.4);
        const controlY = Math.min(startY, endY) - height * (0.16 + random() * 0.22);
        const points = new Float32Array((SAMPLES + 1) * 2);

        for (let sample = 0; sample <= SAMPLES; sample += 1) {
          const t = sample / SAMPLES;
          const inverse = 1 - t;
          const x =
            inverse * inverse * (-width * 0.06) +
            2 * inverse * t * controlX +
            t * t * width * 1.06;
          const y =
            inverse * inverse * startY + 2 * inverse * t * controlY + t * t * endY;
          points[sample * 2] = x;
          points[sample * 2 + 1] = y;
        }

        const path = new Path2D();
        tracePolyline(path, points);

        routes.push({
          points,
          path,
          depth: 0.35 + random() * 0.65,
          t: random(),
          speed: 0.00013 + random() * 0.0002,
          trail: createPointTrail(TRAIL_LEN),
        });
      }

      for (let index = 0; index < SPECK_COUNT; index += 1) {
        specks.push({
          x: random() * width,
          y: random() * height,
          radius: 0.6 + random() * 1.4,
          depth: 0.2 + random() * 0.8,
          phase: random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    };

    const spawnFlyby = (big = false) => {
      const slot = flybys.find((flyby) => !flyby.active);

      if (!slot) {
        return;
      }

      const leftToRight = runtimeRandom() > 0.32;
      const yStart = height * (0.12 + runtimeRandom() * 0.6);
      const yEnd = height * (0.08 + runtimeRandom() * 0.55);
      slot.startX = leftToRight ? -width * 0.08 : width * 1.08;
      slot.endX = leftToRight ? width * 1.08 : -width * 0.08;
      slot.startY = yStart;
      slot.endY = yEnd;
      slot.controlX = width * (0.34 + runtimeRandom() * 0.32);
      slot.controlY = Math.min(yStart, yEnd) - height * (0.12 + runtimeRandom() * 0.24);
      slot.t = 0;
      slot.duration = big ? 2600 + runtimeRandom() * 700 : 3300 + runtimeRandom() * 1400;
      slot.scale = big ? 1.9 + runtimeRandom() * 0.5 : 1.15 + runtimeRandom() * 0.45;
      slot.trail.count = 0;
      slot.active = true;
    };

    const drawTrail = (
      trail: PointTrail,
      baseAlpha: number,
      lineWidth: number,
    ) => {
      const { count, points } = trail;
      if (count < 2) {
        return;
      }

      context.strokeStyle = palette.plane;
      context.lineCap = "round";
      for (let i = 0; i < count - 1; i += 1) {
        const fade = 1 - i / (count - 1);
        const currentOffset = getTrailPointOffset(trail, i);
        const nextOffset = getTrailPointOffset(trail, i + 1);
        context.globalAlpha = baseAlpha * fade * fade;
        context.lineWidth = lineWidth * (0.35 + fade * 0.65);
        context.beginPath();
        context.moveTo(points[currentOffset], points[currentOffset + 1]);
        context.lineTo(points[nextOffset], points[nextOffset + 1]);
        context.stroke();
      }
      context.globalAlpha = 1;
    };

    const drawPlane = (
      x: number,
      y: number,
      angle: number,
      scale: number,
      alpha: number,
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(scale, scale);
      context.globalAlpha = alpha;
      context.fillStyle = palette.plane;
      context.beginPath();
      context.moveTo(7, 0);
      context.lineTo(-5, 4.2);
      context.lineTo(-2.4, 0);
      context.lineTo(-5, -4.2);
      context.closePath();
      context.fill();
      // Fold shadow gives the paper plane its crease.
      context.globalAlpha = alpha * 0.45;
      context.beginPath();
      context.moveTo(7, 0);
      context.lineTo(-2.4, 0);
      context.lineTo(-5, 4.2);
      context.closePath();
      context.fill();
      context.globalAlpha = alpha * (0.1 + energy * 0.18);
      context.beginPath();
      context.arc(0, 0, 7 + energy * 5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const drawRoute = (route: Route, time: number, advance: boolean) => {
      const { points } = route;
      const parallaxX = pointerX * 10 * route.depth;
      const parallaxY = pointerY * 7 * route.depth;
      const alpha = (palette.dark ? 0.05 : 0.075) * route.depth + energy * 0.08 * route.depth;

      context.save();
      context.translate(parallaxX, parallaxY);
      context.strokeStyle = palette.dark ? palette.accent : palette.plane;
      context.globalAlpha = alpha;
      context.lineWidth = 1;
      context.setLineDash([2, 8]);
      context.lineDashOffset = -time * 0.004 * route.depth;
      context.stroke(route.path);
      context.setLineDash([]);

      const index = Math.min(SAMPLES - 1, Math.floor(route.t * SAMPLES));
      const x = points[index * 2];
      const y = points[index * 2 + 1];
      const nextX = points[(index + 1) * 2];
      const nextY = points[(index + 1) * 2 + 1];
      const angle = Math.atan2(nextY - y, nextX - x);

      if (advance) {
        pushTrailPoint(route.trail, x, y);
      }

      drawTrail(route.trail, (0.16 + energy * 0.3) * route.depth, 2.4);
      drawPlane(x, y, angle, 0.85 * route.depth + 0.35, (0.55 + energy * 0.45) * route.depth);
      context.restore();
    };

    const drawFlyby = (flyby: Flyby, delta: number) => {
      flyby.t += delta / flyby.duration;

      if (flyby.t >= 1) {
        flyby.active = false;
        return;
      }

      const t = flyby.t;
      const inverse = 1 - t;
      const x =
        inverse * inverse * flyby.startX +
        2 * inverse * t * flyby.controlX +
        t * t * flyby.endX;
      const y =
        inverse * inverse * flyby.startY +
        2 * inverse * t * flyby.controlY +
        t * t * flyby.endY;
      const dx =
        2 * inverse * (flyby.controlX - flyby.startX) +
        2 * t * (flyby.endX - flyby.controlX);
      const dy =
        2 * inverse * (flyby.controlY - flyby.startY) +
        2 * t * (flyby.endY - flyby.controlY);
      const angle = Math.atan2(dy, dx);
      const fade = Math.min(1, Math.min(t, 1 - t) * 8);

      pushTrailPoint(flyby.trail, x, y);
      drawTrail(flyby.trail, 0.3 * fade + energy * 0.2, 3.4 * flyby.scale * 0.5);
      drawPlane(x, y, angle, flyby.scale, 0.9 * fade);
    };

    const renderFrame = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16.7;
      lastTime = time;
      clock += delta;
      const step = delta / 16.7;

      pointerX += (pointerTargetX - pointerX) * 0.045 * step;
      pointerY += (pointerTargetY - pointerY) * 0.045 * step;
      energy *= 0.986 ** step;

      if (clock >= nextFlybyAt) {
        spawnFlyby(false);
        nextFlybyAt = clock + 6500 + runtimeRandom() * 5200;
      }

      while (pendingFlybys.length && clock >= pendingFlybys[0]) {
        pendingFlybys.shift();
        spawnFlyby(true);
      }

      context.clearRect(0, 0, width, height);

      context.fillStyle = palette.foreground;
      for (const speck of specks) {
        const twinkle = 0.5 + 0.5 * Math.sin(speck.phase + time * 0.0011 * speck.depth);
        context.globalAlpha = (palette.dark ? 0.04 : 0.05) * speck.depth + twinkle * 0.07 * speck.depth;
        context.beginPath();
        context.arc(
          speck.x + pointerX * 16 * speck.depth,
          speck.y + pointerY * 11 * speck.depth,
          speck.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;

      if (palette.dark) {
        context.globalCompositeOperation = "lighter";
      }

      for (const route of routes) {
        route.t += route.speed * delta * route.depth * (1 + energy * 2.4);
        if (route.t > 1) {
          route.t -= 1;
          route.trail.count = 0;
        }
        drawRoute(route, time, true);
      }

      for (const flyby of flybys) {
        if (flyby.active) {
          drawFlyby(flyby, delta);
        }
      }

      context.globalCompositeOperation = "source-over";

      frame = running && visible ? window.requestAnimationFrame(renderFrame) : 0;
    };

    const start = () => {
      if (!frame && running && visible) {
        lastTime = 0;
        frame = window.requestAnimationFrame(renderFrame);
      }
    };

    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = palette.foreground;
      for (const speck of specks) {
        context.globalAlpha = 0.07 * speck.depth;
        context.beginPath();
        context.arc(speck.x, speck.y, speck.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      for (const route of routes) {
        drawRoute(route, 0, false);
      }
    };

    resize();

    if (shouldReduceMotion) {
      drawStatic();

      const staticObserver = new ResizeObserver(() => {
        resize();
        drawStatic();
      });
      staticObserver.observe(canvas);

      const staticThemeObserver = new MutationObserver(() => {
        palette = readPalette(document.documentElement);
        drawStatic();
      });
      staticThemeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      return () => {
        staticObserver.disconnect();
        staticThemeObserver.disconnect();
      };
    }

    running = true;

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    intersectionObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette(document.documentElement);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleOpened = () => {
      energy = Math.min(1, energy + 0.55);
      spawnFlyby(true);
    };

    const handleSent = () => {
      energy = 1;
      pendingFlybys.push(clock + 150, clock + 480, clock + 900);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener(MAIL_OPENED_EVENT, handleOpened);
    window.addEventListener(MAIL_SENT_EVENT, handleSent);
    start();

    return () => {
      running = false;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener(MAIL_OPENED_EVENT, handleOpened);
      window.removeEventListener(MAIL_SENT_EVENT, handleSent);
    };
  }, [shouldReduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
