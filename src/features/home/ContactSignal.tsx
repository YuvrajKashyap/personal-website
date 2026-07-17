"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { CONTACT_COPY_EVENT } from "@/features/home/contact-events";

const EMAIL = "ykyuvrajkashyap@gmail.com";
const TAU = Math.PI * 2;
const WIRE_SAMPLES = 60;
const RING_SAMPLES = 96;
const NODE_COUNT = 46;
const PARTICLE_COUNT = 42;
const ALPHA_BUCKETS = 8;
const BOOT_MS = 1500;

// Violet hologram: reads as technology against the site's gold, in both themes
const HOLO_DARK = {
  wire: "#8f7ff5",
  bright: "#c9baff",
  core: "#f1ecff",
  text: "#a898f7",
  composite: "lighter" as GlobalCompositeOperation,
};

const HOLO_LIGHT = {
  wire: "#5646b8",
  bright: "#6d3fd4",
  core: "#37277f",
  text: "#5646b8",
  composite: "source-over" as GlobalCompositeOperation,
};

type Vec3 = { x: number; y: number; z: number };

type Node = Vec3 & { pulseSpeed: number; phase: number };

type Particle = {
  radius: number;
  speed: number;
  phase: number;
  size: number;
};

type Pulse = {
  start: number;
  duration: number;
  originX: number;
  originY: number;
  strong: boolean;
};

function buildWireframe() {
  const circles: Vec3[][] = [];

  for (const latDeg of [-60, -30, 0, 30, 60]) {
    const lat = (latDeg * Math.PI) / 180;
    const ringRadius = Math.cos(lat);
    const y = Math.sin(lat);
    const circle: Vec3[] = [];

    for (let i = 0; i <= WIRE_SAMPLES; i += 1) {
      const u = (i / WIRE_SAMPLES) * TAU;
      circle.push({
        x: Math.cos(u) * ringRadius,
        y,
        z: Math.sin(u) * ringRadius,
      });
    }

    circles.push(circle);
  }

  for (let lonStep = 0; lonStep < 6; lonStep += 1) {
    const lon = (lonStep * Math.PI) / 6;
    const circle: Vec3[] = [];

    for (let i = 0; i <= WIRE_SAMPLES; i += 1) {
      const u = (i / WIRE_SAMPLES) * TAU;
      circle.push({
        x: Math.sin(u) * Math.cos(lon),
        y: Math.cos(u),
        z: Math.sin(u) * Math.sin(lon),
      });
    }

    circles.push(circle);
  }

  return circles;
}

function buildNodes() {
  const nodes: Node[] = [];

  for (let i = 0; i < NODE_COUNT; i += 1) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * 2.399963229728653 + 0.7;

    nodes.push({
      x: Math.cos(theta) * ringRadius,
      y,
      z: Math.sin(theta) * ringRadius,
      pulseSpeed: 0.6 + ((i * 37) % 10) / 7,
      phase: (i * 2.1) % TAU,
    });
  }

  return nodes;
}

function buildLinks(nodes: Node[]) {
  const links: Array<[number, number]> = [];

  for (let i = 0; i < nodes.length && links.length < 14; i += 3) {
    for (let j = i + 5; j < nodes.length; j += 7) {
      const dot =
        nodes[i].x * nodes[j].x +
        nodes[i].y * nodes[j].y +
        nodes[i].z * nodes[j].z;

      if (dot > 0.25 && dot < 0.82) {
        links.push([i, j]);
        break;
      }
    }
  }

  return links;
}

function buildParticles() {
  const particles: Particle[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    particles.push({
      radius: 0.3 + (((i * 53) % 100) / 100) * 0.66,
      speed:
        (0.00012 + (((i * 29) % 50) / 50) * 0.00026) * (i % 2 === 0 ? 1 : -1),
      phase: i * 0.777,
      size: 0.7 + (((i * 17) % 10) / 10) * 1.3,
    });
  }

  return particles;
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

/**
 * JARVIS-style holographic globe: additive-blended wireframe sphere with a
 * pulsing reactor core, scanning latitude ring, network nodes with data
 * packets travelling their links, tilted gimbal rings with trailing markers,
 * a ticked HUD bezel with segmented and sweeping arc rings, ambient orbiting
 * particles, hologram flicker with glitch dropouts, a boot-up sequence each
 * time it scrolls into view, and the email address orbiting as curved text.
 * Drag spins it with inertia, the cursor gets a targeting reticle that locks
 * nearby nodes, clicking fires a shockwave, and copying the email
 * (CONTACT_COPY_EVENT) flares the whole interface.
 */
export function ContactSignal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mountedCanvas = canvasRef.current;
    const mountedCtx = mountedCanvas?.getContext("2d");

    if (!mountedCanvas || !mountedCtx) {
      return undefined;
    }

    const canvas: HTMLCanvasElement = mountedCanvas;
    const ctx: CanvasRenderingContext2D = mountedCtx;
    const reduceMotion = shouldReduceMotion ?? false;

    const wireframe = buildWireframe();
    const nodes = buildNodes();
    const links = buildLinks(nodes);
    const particles = buildParticles();
    const pulses: Pulse[] = [];
    const projectedNodes = nodes.map(() => ({ sx: 0, sy: 0, depth: 0 }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let palette = HOLO_DARK;
    let monoFont = "ui-monospace, monospace";

    // Unit-space gradients cached per palette and reused every frame via
    // canvas transforms — identical pixels, no per-frame allocations.
    let coreGradient: CanvasGradient | null = null;
    let scanGradient: CanvasGradient | null = null;
    let gradientPaletteKey = "";

    function ensureGradients() {
      if (gradientPaletteKey === palette.core + palette.wire) {
        return;
      }

      gradientPaletteKey = palette.core + palette.wire;

      coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      coreGradient.addColorStop(0, palette.core);
      coreGradient.addColorStop(0.25, palette.bright);
      coreGradient.addColorStop(1, "transparent");

      scanGradient = ctx.createLinearGradient(0, -1, 0, 1);
      scanGradient.addColorStop(0, "transparent");
      scanGradient.addColorStop(0.5, palette.wire);
      scanGradient.addColorStop(1, "transparent");
    }

    let yaw = 0.6;
    let pitch = -0.28;
    let pitchTarget = -0.28;
    let spin = 0;
    let bezelAngle = 0;
    let arcAngleA = 0;
    let arcAngleB = 1.9;
    let segmentAngle = 0;
    let gimbalA = 0;
    let gimbalB = 0;
    let bootStart = -1;
    let frame = 0;
    let lastTime = 0;
    let running = false;
    let inView = true;

    const pointer = { x: 0, y: 0, active: false };
    let userAdjusted = false;
    const drag = {
      active: false,
      lastX: 0,
      lastY: 0,
      travel: 0,
      pointerId: -1,
    };

    function readTheme() {
      const styles = getComputedStyle(document.documentElement);
      monoFont = styles.getPropertyValue("--font-mono").trim() || monoFont;
      palette =
        document.documentElement.getAttribute("data-theme") === "light"
          ? HOLO_LIGHT
          : HOLO_DARK;
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();

      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      if (reduceMotion) {
        render(0, true);
      }
    }

    function render(time: number, once = false) {
      if (width === 0) {
        return;
      }

      const step = once
        ? 1
        : Math.min(Math.max(time - lastTime, 1), 40) / 16.67;
      lastTime = time;
      const now = performance.now();

      // Boot-up sequence, replayed each time the hologram scrolls into view
      if (bootStart < 0) {
        bootStart = now;
      }

      const boot = once ? 1 : Math.min(1, (now - bootStart) / BOOT_MS);
      const bootPhase = (from: number, to: number) =>
        easeOutCubic(Math.min(1, Math.max(0, (boot - from) / (to - from))));
      const bezelBoot = bootPhase(0, 0.45);
      const sphereBoot = bootPhase(0.15, 0.7);
      const detailBoot = bootPhase(0.4, 1);

      let flare = 0;

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const age = (now - pulses[i].start) / pulses[i].duration;

        if (age >= 1) {
          pulses.splice(i, 1);
        } else if (pulses[i].strong) {
          flare = Math.max(flare, 1 - age);
        }
      }

      // Spin energy: how hard the visitor is throwing the globe around.
      // Everything glows brighter and whirls faster the harder it spins.
      const spinEnergy = Math.min(
        1,
        Math.abs(spin) * 220 + (drag.active ? 0.3 : 0),
      );
      const speedBoost = 1 + flare * 2.6 + spinEnergy * 1.8;

      if (!once) {
        yaw += (0.0024 + spin) * step;
        spin *= Math.pow(0.96, step);
        pitch += (pitchTarget - pitch) * 0.055 * step;
        bezelAngle += 0.0011 * step * speedBoost;
        arcAngleA += 0.012 * step * speedBoost;
        arcAngleB -= 0.008 * step * speedBoost;
        segmentAngle += 0.0034 * step * speedBoost;
        gimbalA += 0.0062 * step * speedBoost;
        gimbalB -= 0.0044 * step * speedBoost;
      }

      const flicker = 1;

      const centerX = width / 2;
      const centerY =
        height / 2 + (once || reduceMotion ? 0 : Math.sin(now * 0.0011) * 4);
      const sphereR =
        Math.min(width, height) * 0.3 * (0.55 + 0.45 * sphereBoot);
      const bezelR =
        Math.min(width, height) * 0.472 * (0.75 + 0.25 * bezelBoot);
      const focal = sphereR * 3;

      const pitchRender =
        pitch + (once || reduceMotion ? 0 : 0.05 * Math.sin(now * 0.00042));
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitchRender);
      const sinPitch = Math.sin(pitchRender);

      function project(point: Vec3) {
        const rx = point.x * cosYaw + point.z * sinYaw;
        const rz = -point.x * sinYaw + point.z * cosYaw;
        const ry = point.y * cosPitch - rz * sinPitch;
        const rz2 = point.y * sinPitch + rz * cosPitch;
        const scale = focal / (focal + rz2 * sphereR);

        return {
          sx: centerX + rx * sphereR * scale,
          sy: centerY + ry * sphereR * scale,
          depth: (1 - rz2) / 2,
        };
      }

      function alpha(value: number) {
        ctx.globalAlpha = Math.max(0, Math.min(1, value * flicker));
      }

      function glowStroke(path: Path2D, lineWidth: number, glowAlpha: number) {
        ctx.lineWidth = lineWidth * 3.4;
        alpha(glowAlpha * 0.22);
        ctx.stroke(path);
        ctx.lineWidth = lineWidth;
        alpha(glowAlpha);
        ctx.stroke(path);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = palette.composite;
      ctx.lineCap = "round";

      // --- Horizontal scan band drifting down, clipped to the bezel circle ---
      ensureGradients();
      const scanY = ((now * 0.045) % (height + 240)) - 120;
      ctx.save();
      const scanClip = new Path2D();
      scanClip.arc(centerX, centerY, bezelR, 0, TAU);
      ctx.clip(scanClip);
      ctx.translate(0, scanY);
      ctx.scale(1, 70);
      ctx.fillStyle = scanGradient ?? palette.wire;
      alpha((0.05 + flare * 0.05) * detailBoot);
      ctx.fillRect(0, -1, width, 2);
      ctx.restore();

      // --- Ambient particles orbiting the core ---
      ctx.fillStyle = palette.wire;

      for (const particle of particles) {
        const angle = particle.phase + now * particle.speed;
        const wobble = 1 + 0.04 * Math.sin(now * 0.0007 + particle.phase);
        const px = centerX + Math.cos(angle) * particle.radius * bezelR * wobble;
        const py = centerY + Math.sin(angle) * particle.radius * bezelR * wobble;

        alpha(
          (0.1 + 0.12 * Math.sin(now * 0.002 + particle.phase * 3)) *
            detailBoot,
        );
        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, TAU);
        ctx.fill();
      }

      // --- HUD bezel: outer circle and tick ring ---
      const bezelPath = new Path2D();
      bezelPath.arc(centerX, centerY, bezelR, 0, TAU);
      ctx.strokeStyle = palette.wire;
      glowStroke(bezelPath, 1, (0.3 + flare * 0.3) * bezelBoot);

      const ticksPath = new Path2D();

      for (let i = 0; i < 96; i += 1) {
        const angle = bezelAngle + (i / 96) * TAU;
        const long = i % 8 === 0;
        const inner = bezelR - (long ? 8 : 3.4);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ticksPath.moveTo(centerX + cos * bezelR, centerY + sin * bezelR);
        ticksPath.lineTo(centerX + cos * inner, centerY + sin * inner);
      }

      ctx.lineWidth = 1;
      alpha((0.42 + flare * 0.3) * bezelBoot);
      ctx.stroke(ticksPath);

      // --- Segmented ring: 10 arc segments with gaps, rotating ---
      const segmentPath = new Path2D();
      const segmentR = bezelR * 0.845;

      for (let i = 0; i < 10; i += 1) {
        const from = segmentAngle + (i / 10) * TAU;
        segmentPath.moveTo(
          centerX + Math.cos(from) * segmentR,
          centerY + Math.sin(from) * segmentR,
        );
        segmentPath.arc(centerX, centerY, segmentR, from, from + TAU * 0.072);
      }

      ctx.strokeStyle = palette.wire;
      glowStroke(segmentPath, 1.4, (0.34 + flare * 0.35) * bezelBoot);

      // --- Sweeping HUD arcs ---
      const arcPathA = new Path2D();
      arcPathA.arc(
        centerX,
        centerY,
        bezelR * 0.94,
        arcAngleA,
        arcAngleA + TAU * 0.16,
      );
      ctx.strokeStyle = palette.bright;
      glowStroke(arcPathA, 2, 0.8 * bezelBoot);

      const arcPathB = new Path2D();
      arcPathB.arc(
        centerX,
        centerY,
        bezelR * 0.895,
        arcAngleB,
        arcAngleB + TAU * 0.3,
      );
      glowStroke(arcPathB, 1.2, 0.5 * bezelBoot);

      // --- Blip telemetry on the bezel ---
      ctx.fillStyle = palette.bright;

      for (let i = 0; i < 7; i += 1) {
        const blink = Math.sin(now * 0.0012 * (0.7 + (i % 3) / 2) + i * 1.9);

        if (blink <= 0.35) {
          continue;
        }

        const angle = i * 0.897 + Math.floor(now / 2600) * 0.53;
        const blipR = bezelR * 0.845;
        alpha((blink - 0.35) * 1.1 * detailBoot);
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(angle) * blipR,
          centerY + Math.sin(angle) * blipR,
          2.4,
          0,
          TAU,
        );
        ctx.fill();
      }

      // --- Email address orbiting the bezel as curved text ---
      const textRadius = bezelR * 0.775;
      const fontSize = Math.max(8, Math.round(bezelR * 0.052));
      ctx.font = `600 ${fontSize}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = palette.text;

      const orbitText = `${EMAIL} • ${EMAIL} • `;
      const charStep = TAU / orbitText.length;

      for (let i = 0; i < orbitText.length; i += 1) {
        const angle = -bezelAngle * 2.4 + i * charStep;
        ctx.save();
        ctx.translate(
          centerX + Math.cos(angle) * textRadius,
          centerY + Math.sin(angle) * textRadius,
        );
        ctx.rotate(angle + Math.PI / 2);
        alpha((0.44 + flare * 0.4) * detailBoot);
        ctx.fillText(orbitText[i], 0, 0);
        ctx.restore();
      }

      // --- Wireframe sphere, alpha-bucketed by depth ---
      const buckets: Path2D[] = [];

      for (let b = 0; b < ALPHA_BUCKETS; b += 1) {
        buckets.push(new Path2D());
      }

      for (const circle of wireframe) {
        let prev = project(circle[0]);

        for (let i = 1; i < circle.length; i += 1) {
          const next = project(circle[i]);
          const depth = (prev.depth + next.depth) / 2;
          const bucket = Math.min(
            ALPHA_BUCKETS - 1,
            Math.floor(depth * ALPHA_BUCKETS),
          );
          buckets[bucket].moveTo(prev.sx, prev.sy);
          buckets[bucket].lineTo(next.sx, next.sy);
          prev = next;
        }
      }

      ctx.strokeStyle = palette.wire;
      ctx.lineWidth = 1;

      for (let b = 0; b < ALPHA_BUCKETS; b += 1) {
        const depth = (b + 0.5) / ALPHA_BUCKETS;
        alpha(
          (0.05 + depth * 0.36) *
            (1 + flare * 0.9 + spinEnergy * 0.5) *
            sphereBoot,
        );
        ctx.stroke(buckets[b]);
      }

      // --- Scanning latitude ring sweeping the sphere ---
      const scanLat = Math.sin(now * 0.00052) * 1.05;
      const scanRingR = Math.cos(scanLat);
      const scanRingY = Math.sin(scanLat);
      const scanPath = new Path2D();
      let scanStarted = false;

      for (let i = 0; i <= WIRE_SAMPLES; i += 1) {
        const u = (i / WIRE_SAMPLES) * TAU;
        const projected = project({
          x: Math.cos(u) * scanRingR,
          y: scanRingY,
          z: Math.sin(u) * scanRingR,
        });

        if (scanStarted) {
          scanPath.lineTo(projected.sx, projected.sy);
        } else {
          scanPath.moveTo(projected.sx, projected.sy);
          scanStarted = true;
        }
      }

      ctx.strokeStyle = palette.bright;
      glowStroke(scanPath, 1.2, (0.5 + flare * 0.4) * sphereBoot);

      // --- Reactor core with rotating dashed halo ring ---
      const coreR =
        sphereR *
        (0.15 + 0.02 * Math.sin(now * 0.003)) *
        (1 + flare * 0.55 + spinEnergy * 0.5);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(coreR * 2.6, coreR * 2.6);
      ctx.fillStyle = coreGradient ?? palette.bright;
      alpha((0.5 + flare * 0.45 + spinEnergy * 0.35) * sphereBoot);
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, TAU);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = palette.wire;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 7]);
      ctx.lineDashOffset = -now * 0.02;
      alpha(0.34 * sphereBoot);
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereR * 0.45, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Network nodes, links, and data packets ---
      for (let i = 0; i < nodes.length; i += 1) {
        const projected = project(nodes[i]);
        projectedNodes[i].sx = projected.sx;
        projectedNodes[i].sy = projected.sy;
        projectedNodes[i].depth = projected.depth;
      }

      ctx.strokeStyle = palette.bright;
      ctx.lineWidth = 0.8;

      for (const [a, b] of links) {
        const nodeA = projectedNodes[a];
        const nodeB = projectedNodes[b];
        const depth = (nodeA.depth + nodeB.depth) / 2;

        if (depth < 0.35) {
          continue;
        }

        alpha((depth - 0.3) * 0.55 * (1 + flare) * sphereBoot);
        ctx.beginPath();
        ctx.moveTo(nodeA.sx, nodeA.sy);
        ctx.lineTo(nodeB.sx, nodeB.sy);
        ctx.stroke();
      }

      // data packets travelling along links
      ctx.fillStyle = palette.core;

      for (let li = 0; li < links.length; li += 1) {
        const nodeA = projectedNodes[links[li][0]];
        const nodeB = projectedNodes[links[li][1]];
        const depth = (nodeA.depth + nodeB.depth) / 2;

        if (depth < 0.4) {
          continue;
        }

        const t = (now * 0.00035 * (0.6 + (li % 5) / 4) + li * 0.37) % 1;
        const px = nodeA.sx + (nodeB.sx - nodeA.sx) * t;
        const py = nodeA.sy + (nodeB.sy - nodeA.sy) * t;

        alpha(depth * 0.9 * detailBoot);
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, TAU);
        ctx.fill();
      }

      let lockedNode = -1;
      let lockedDistance = 64;

      if (pointer.active && !reduceMotion) {
        for (let i = 0; i < nodes.length; i += 1) {
          if (projectedNodes[i].depth < 0.45) {
            continue;
          }

          const distance = Math.hypot(
            projectedNodes[i].sx - pointer.x,
            projectedNodes[i].sy - pointer.y,
          );

          if (distance < lockedDistance) {
            lockedDistance = distance;
            lockedNode = i;
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const node = projectedNodes[i];
        const blink = reduceMotion
          ? 0.5
          : 0.5 +
            Math.sin(now * 0.001 * nodes[i].pulseSpeed + nodes[i].phase) / 2;
        const size = (0.9 + node.depth * 1.6) * (i === lockedNode ? 1.8 : 1);

        alpha(
          (0.08 + node.depth * 0.8) *
            (0.55 + blink * 0.7) *
            (1 + flare + spinEnergy * 0.6) *
            sphereBoot,
        );
        ctx.fillStyle = i === lockedNode ? palette.core : palette.bright;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, size, 0, TAU);
        ctx.fill();
      }

      // --- Gimbal rings with trailing markers ---
      const gimbals: Array<{
        radius: number;
        tilt: number;
        angle: number;
        strength: number;
      }> = [
        { radius: 1.22, tilt: 1.15, angle: gimbalA, strength: 0.62 },
        { radius: 1.38, tilt: -0.75, angle: gimbalB, strength: 0.44 },
      ];

      for (const gimbal of gimbals) {
        const cosTilt = Math.cos(gimbal.tilt);
        const sinTilt = Math.sin(gimbal.tilt);

        const gimbalPoint = (u: number): Vec3 => {
          const sinU = Math.sin(u);

          return {
            x: Math.cos(u) * gimbal.radius,
            y: sinU * gimbal.radius * sinTilt,
            z: sinU * gimbal.radius * cosTilt,
          };
        };

        const ringPath = new Path2D();
        let started = false;

        for (let i = 0; i <= RING_SAMPLES; i += 1) {
          const u = (i / RING_SAMPLES) * TAU + gimbal.angle;
          const projected = project(gimbalPoint(u));

          if (started) {
            ringPath.lineTo(projected.sx, projected.sy);
          } else {
            ringPath.moveTo(projected.sx, projected.sy);
            started = true;
          }
        }

        ctx.strokeStyle = palette.wire;
        glowStroke(
          ringPath,
          1.1,
          gimbal.strength * (1 + flare * 0.8 + spinEnergy * 0.7) * sphereBoot,
        );

        const markerU = gimbal.angle * 3.1;
        ctx.strokeStyle = palette.bright;
        ctx.lineWidth = 1.6;

        for (let t = 0; t < 5; t += 1) {
          const from = project(gimbalPoint(markerU - (t + 1) * 0.06));
          const to = project(gimbalPoint(markerU - t * 0.06));
          alpha((1 - t / 5) * 0.5 * (0.4 + to.depth * 0.6) * detailBoot);
          ctx.beginPath();
          ctx.moveTo(from.sx, from.sy);
          ctx.lineTo(to.sx, to.sy);
          ctx.stroke();
        }

        const marker = project(gimbalPoint(markerU));
        alpha(Math.min(1, 0.4 + marker.depth * 0.6) * detailBoot);
        ctx.fillStyle = palette.core;
        ctx.beginPath();
        ctx.arc(marker.sx, marker.sy, 2.4, 0, TAU);
        ctx.fill();
      }

      // --- Pulse shockwaves ---
      const maxRing = Math.hypot(width, height) / 2;

      for (const pulse of pulses) {
        const age = (now - pulse.start) / pulse.duration;
        const radius = easeOutCubic(age) * maxRing;
        const wavePath = new Path2D();
        wavePath.arc(pulse.originX, pulse.originY, radius, 0, TAU);
        ctx.strokeStyle = palette.bright;
        glowStroke(
          wavePath,
          pulse.strong ? 2 : 1.2,
          (1 - age) * (pulse.strong ? 0.65 : 0.42),
        );

        if (pulse.strong) {
          alpha((1 - age) * 0.28);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(pulse.originX, pulse.originY, radius * 0.72, 0, TAU);
          ctx.stroke();
        }
      }

      // --- Targeting reticle ---
      if (pointer.active && !reduceMotion && !drag.active) {
        ctx.strokeStyle = palette.bright;
        ctx.lineWidth = 0.8;
        alpha(0.24);
        ctx.beginPath();
        ctx.moveTo(0, pointer.y);
        ctx.lineTo(width, pointer.y);
        ctx.moveTo(pointer.x, 0);
        ctx.lineTo(pointer.x, height);
        ctx.stroke();

        alpha(0.85);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 11, 0, TAU);
        ctx.stroke();

        if (lockedNode >= 0) {
          const node = projectedNodes[lockedNode];
          const bracket = 7;

          alpha(0.92);
          ctx.beginPath();

          for (const [dirX, dirY] of [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ]) {
            const cornerX = node.sx + dirX * bracket;
            const cornerY = node.sy + dirY * bracket;
            ctx.moveTo(cornerX - dirX * 3.5, cornerY);
            ctx.lineTo(cornerX, cornerY);
            ctx.lineTo(cornerX, cornerY - dirY * 3.5);
          }

          ctx.stroke();

          alpha(0.32);
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(node.sx, node.sy);
          ctx.stroke();
        }
      }

      // --- Live readouts ---
      const readoutSize = Math.max(8, Math.round(bezelR * 0.048));
      ctx.font = `600 ${readoutSize}px ${monoFont}`;
      ctx.fillStyle = palette.text;
      ctx.textBaseline = "alphabetic";

      const yawDegrees = ((((yaw * 180) / Math.PI) % 360) + 360) % 360;
      ctx.textAlign = "left";
      alpha(0.55 * detailBoot);
      ctx.fillText(
        `ORBIT ${yawDegrees.toFixed(1).padStart(5, "0")}°`,
        centerX - bezelR * 0.62,
        centerY + bezelR * 0.98,
      );

      const sysCode = (0x2f00 + (Math.floor(now / 700) % 0x0fff))
        .toString(16)
        .toUpperCase();
      alpha(0.42 * detailBoot);
      ctx.fillText(
        `SYS 0x${sysCode}`,
        centerX - bezelR * 0.62,
        centerY - bezelR * 0.92,
      );

      ctx.textAlign = "right";
      const energized = flare > 0.04 || spinEnergy > 0.45;
      ctx.fillStyle = energized ? palette.core : palette.text;
      alpha((energized ? 0.7 + flare * 0.3 : 0.55) * detailBoot);
      ctx.fillText(
        flare > 0.04
          ? "ADDRESS COPIED"
          : boot < 1
            ? "CALIBRATING…"
            : spinEnergy > 0.45
              ? "MANUAL OVERRIDE"
              : "JARVIS?",
        centerX + bezelR * 0.62,
        centerY + bezelR * 0.98,
      );

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function loop(time: number) {
      frame = 0;
      render(time);

      if (running) {
        frame = window.requestAnimationFrame(loop);
      }
    }

    function setRunning(next: boolean) {
      if (next === running) {
        return;
      }

      running = next;

      if (running) {
        lastTime = performance.now();
        frame = window.requestAnimationFrame(loop);
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function syncRunning() {
      setRunning(!reduceMotion && inView && !document.hidden);
    }

    function addPulse(originX: number, originY: number, strong: boolean) {
      pulses.push({
        start: performance.now(),
        duration: strong ? 1600 : 900,
        originX,
        originY,
        strong,
      });

      if (pulses.length > 6) {
        pulses.shift();
      }
    }

    function onPointerMove(event: PointerEvent) {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;

      if (drag.active && event.pointerId === drag.pointerId) {
        const dx = event.clientX - drag.lastX;
        const dy = event.clientY - drag.lastY;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.travel += Math.abs(dx) + Math.abs(dy);

        if (drag.travel > 4) {
          userAdjusted = true;
        }

        yaw += dx * 0.008;
        spin = dx * 0.0008;
        pitchTarget = Math.min(1.5, Math.max(-1.5, pitchTarget - dy * 0.005));
      } else if (!userAdjusted) {
        // Gentle pointer-follow tilt, but never fight an orientation the
        // user chose by dragging.
        pitchTarget =
          -0.28 + ((pointer.y - bounds.height / 2) / bounds.height) * 0.3;
      }
    }

    function onPointerLeave() {
      pointer.active = false;

      if (!userAdjusted) {
        pitchTarget = -0.28;
      }
    }

    function onPointerDown(event: PointerEvent) {
      drag.active = true;
      drag.pointerId = event.pointerId;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.travel = 0;
      canvas.setPointerCapture(event.pointerId);
    }

    function onPointerUp(event: PointerEvent) {
      if (!drag.active || event.pointerId !== drag.pointerId) {
        return;
      }

      drag.active = false;

      if (drag.travel < 8) {
        const bounds = canvas.getBoundingClientRect();
        addPulse(
          event.clientX - bounds.left,
          event.clientY - bounds.top,
          false,
        );
      }
    }

    function onEmailCopied() {
      addPulse(width / 2, height / 2, true);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      readTheme();

      if (reduceMotion) {
        render(0, true);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;

        if (!inView) {
          bootStart = -1;
        }

        syncRunning();
      },
      { threshold: 0.05 },
    );
    viewObserver.observe(canvas);

    function onVisibilityChange() {
      syncRunning();
    }

    readTheme();
    resize();
    window.addEventListener(CONTACT_COPY_EVENT, onEmailCopied);

    if (reduceMotion) {
      render(0, true);
    } else {
      document.addEventListener("visibilitychange", onVisibilityChange);
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave, {
        passive: true,
      });
      canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
      canvas.addEventListener("pointerup", onPointerUp, { passive: true });
      canvas.addEventListener("pointercancel", onPointerLeave, {
        passive: true,
      });
      syncRunning();
    }

    return () => {
      setRunning(false);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener(CONTACT_COPY_EVENT, onEmailCopied);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerLeave);
    };
  }, [shouldReduceMotion]);

  return (
    <div className="contact-signal" aria-hidden="true">
      <canvas ref={canvasRef} className="contact-signal-canvas" />
    </div>
  );
}
