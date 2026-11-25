"use client";

import { useEffect, useRef } from "react";

import { createFrameLoop } from "@/lib/performance/animation-runtime";

type World = Readonly<{
  orbit: number;
  size: number;
  /** Orbits per minute. */
  pace: number;
  phase: number;
  /** Lean of this orbit's plane, radians. */
  lean: number;
  node: number;
  tone: number;
  ring?: boolean;
  moon?: boolean;
}>;

const WORLDS: readonly World[] = [
  { orbit: 0.2, size: 3.2, pace: 9.5, phase: 0.4, lean: 0.06, node: 0.3, tone: 0 },
  { orbit: 0.32, size: 4.6, pace: 5.6, phase: 2.1, lean: -0.05, node: 1.7, tone: 1 },
  { orbit: 0.47, size: 5.6, pace: 3.4, phase: 4.4, lean: 0.09, node: 2.6, tone: 2, moon: true },
  { orbit: 0.66, size: 9, pace: 1.9, phase: 1.2, lean: -0.07, node: 4.1, tone: 3, ring: true },
  { orbit: 0.86, size: 6.6, pace: 1.15, phase: 5.3, lean: 0.05, node: 5.2, tone: 4 },
];

const PALETTE = {
  dark: {
    sun: "255 226 168",
    orbit: "150 150 255",
    tones: ["214 198 255", "126 156 255", "108 214 236", "214 150 240", "150 132 255"],
    shade: "6 6 18",
  },
  light: {
    sun: "185 28 28",
    orbit: "127 29 29",
    tones: ["150 70 60", "127 29 29", "180 110 84", "150 54 54", "112 72 60"],
    shade: "247 239 227",
  },
} as const;

const ORBIT_STEPS = 72;

/**
 * A working orrery: five worlds on inclined orbits around a star, projected
 * in true 3D and depth-sorted, so worlds pass behind and in front of the star.
 * The whole system tips toward the cursor. Decorative only, paused off
 * screen, one still frame for reduced-motion users.
 */
export function Orrery() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = false;
    let lastTime = 0;
    let clock = 14;
    let tipX = 0;
    let tipY = 0;
    let targetTipX = 0;
    let targetTipY = 0;

    // Scratch for the per-frame draw list: [depth, x, y, scale, index].
    const order: number[][] = WORLDS.map(() => [0, 0, 0, 0, 0]);
    const point = { x: 0, y: 0, depth: 0, scale: 1 };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (width === 0 || height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    const project = (
      radius: number,
      angle: number,
      world: World,
      pitch: number,
      yaw: number,
    ) => {
      // Position in the orbit's own plane, then lean that plane.
      const ox = Math.cos(angle) * radius;
      const oz = Math.sin(angle) * radius;
      const cosN = Math.cos(world.node);
      const sinN = Math.sin(world.node);
      const lift = (ox * sinN - oz * cosN) * Math.sin(world.lean);
      // Turn the whole system, then tip it toward the viewer.
      const x = ox * Math.cos(yaw) - oz * Math.sin(yaw);
      const z = ox * Math.sin(yaw) + oz * Math.cos(yaw);
      const y = lift * Math.cos(pitch) - z * Math.sin(pitch);
      const depth = lift * Math.sin(pitch) + z * Math.cos(pitch);
      const scale = 2.6 / (2.6 + depth);
      const reach = Math.min(width * 0.5, height * 0.86);
      point.x = width / 2 + x * reach * scale;
      point.y = height * 0.52 + y * reach * scale;
      point.depth = depth;
      point.scale = scale;
      return point;
    };

    const render = (dt: number) => {
      if (width === 0 || height === 0) return;
      const theme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const palette = PALETTE[theme];
      const dark = theme === "dark";

      clock += dt;
      const follow = 1 - Math.exp(-dt * 3);
      tipX += (targetTipX - tipX) * follow;
      tipY += (targetTipY - tipY) * follow;
      const pitch = 1.12 + tipY * 0.34;
      const yaw = clock * 0.05 + tipX * 0.7;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height * 0.52;

      // Orbits: the far half is fainter than the near half.
      context.lineWidth = 1;
      for (const world of WORLDS) {
        for (let pass = 0; pass < 2; pass += 1) {
          const near = pass === 1;
          context.strokeStyle = `rgb(${palette.orbit} / ${near ? 0.42 : 0.16})`;
          context.beginPath();
          let drawing = false;
          for (let step = 0; step <= ORBIT_STEPS; step += 1) {
            const p = project(
              world.orbit,
              (step / ORBIT_STEPS) * Math.PI * 2,
              world,
              pitch,
              yaw,
            );
            if (p.depth < 0 === near) {
              if (drawing) context.lineTo(p.x, p.y);
              else context.moveTo(p.x, p.y);
              drawing = true;
            } else {
              drawing = false;
            }
          }
          context.stroke();
        }
      }

      WORLDS.forEach((world, index) => {
        const angle = world.phase + (clock * world.pace * Math.PI * 2) / 60;
        const p = project(world.orbit, angle, world, pitch, yaw);
        const slot = order[index];
        slot[0] = p.depth;
        slot[1] = p.x;
        slot[2] = p.y;
        slot[3] = p.scale;
        slot[4] = index;
      });
      order.sort((a, b) => b[0] - a[0]);

      const drawSun = () => {
        const size = Math.min(width, height) * 0.05;
        const corona = context.createRadialGradient(cx, cy, size * 0.3, cx, cy, size * 6);
        corona.addColorStop(0, `rgb(${palette.sun} / ${dark ? 0.5 : 0.22})`);
        corona.addColorStop(0.3, `rgb(${palette.sun} / ${dark ? 0.12 : 0.06})`);
        corona.addColorStop(1, `rgb(${palette.sun} / 0)`);
        context.fillStyle = corona;
        context.beginPath();
        context.arc(cx, cy, size * 6, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = dark ? "rgb(255 246 226)" : `rgb(${palette.sun})`;
        context.beginPath();
        context.arc(cx, cy, size, 0, Math.PI * 2);
        context.fill();
      };

      let sunDrawn = false;
      for (const slot of order) {
        if (!sunDrawn && slot[0] < 0) {
          drawSun();
          sunDrawn = true;
        }

        const world = WORLDS[slot[4]];
        const x = slot[1];
        const y = slot[2];
        const radius = world.size * slot[3] * Math.min(1.7, width / 330);
        const tone = palette.tones[world.tone];

        // Lit from the star: the bright spot sits on the side facing it.
        const toSunX = cx - x;
        const toSunY = cy - y;
        const span = Math.hypot(toSunX, toSunY) + 0.001;
        const hx = x + (toSunX / span) * radius * 0.45;
        const hy = y + (toSunY / span) * radius * 0.45;

        if (world.ring) {
          context.strokeStyle = `rgb(${tone} / 0.5)`;
          context.lineWidth = Math.max(1, radius * 0.22);
          context.beginPath();
          context.ellipse(x, y, radius * 2, radius * 0.56, -0.38, Math.PI, Math.PI * 2);
          context.stroke();
        }

        const shading = context.createRadialGradient(hx, hy, radius * 0.1, x, y, radius);
        shading.addColorStop(0, `rgb(${tone})`);
        shading.addColorStop(0.55, `rgb(${tone} / ${dark ? 0.82 : 0.9})`);
        shading.addColorStop(1, `rgb(${palette.shade} / ${dark ? 0.96 : 0.2})`);
        context.fillStyle = dark ? `rgb(${palette.shade})` : `rgb(${tone} / 0.5)`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = shading;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (world.ring) {
          context.strokeStyle = `rgb(${tone} / 0.7)`;
          context.lineWidth = Math.max(1, radius * 0.22);
          context.beginPath();
          context.ellipse(x, y, radius * 2, radius * 0.56, -0.38, 0, Math.PI);
          context.stroke();
        }

        if (world.moon) {
          const swing = clock * 1.9;
          context.fillStyle = `rgb(${tone} / 0.85)`;
          context.beginPath();
          context.arc(
            x + Math.cos(swing) * radius * 2.5,
            y + Math.sin(swing) * radius * 0.9,
            Math.max(1, radius * 0.26),
            0,
            Math.PI * 2,
          );
          context.fill();
        }
      }
      if (!sunDrawn) drawSun();
    };

    const loop = createFrameLoop(
      (callback) => window.requestAnimationFrame(callback),
      (frame) => window.cancelAnimationFrame(frame),
      (time) => {
        const dt = lastTime === 0 ? 0.016 : Math.min(0.05, (time - lastTime) / 1000);
        lastTime = time;
        render(dt);
        return visible && !document.hidden && !reducedMotion.matches;
      },
    );

    const wake = () => {
      if (reducedMotion.matches) {
        loop.stop();
        render(0);
        return;
      }
      if (visible && !document.hidden) {
        lastTime = 0;
        loop.start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetTipX = event.clientX / window.innerWidth - 0.5;
      targetTipY = event.clientY / window.innerHeight - 0.5;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      wake();
    });
    const themeObserver = new MutationObserver(wake);

    resize();
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", wake);

    return () => {
      loop.stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  return (
    <div ref={hostRef} className="celestial orrery" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
