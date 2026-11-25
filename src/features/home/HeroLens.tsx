"use client";

import { useEffect, useRef } from "react";

import { createVideoLens, type VideoLensSource } from "@/components/effects/video-lens";

/** Where the black hole sits in the desktop footage, as a share of the frame. */
const HOLE = { u: 0.757, v: 0.483, radius: 0.112 } as const;
const MAX_SPARKS = 150;

type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number };

/**
 * Makes the hero respond to the cursor as a mass.
 *
 * Two layers, both decorative and both asleep until the pointer moves over
 * the hero:
 *  - a WebGL copy of the black-hole footage, redrawn through a gravitational
 *    lens at the cursor, so the cursor visibly bends the singularity itself;
 *  - dust shed by the moving cursor that is pulled across the frame and
 *    swallowed by the black hole.
 *
 * Both themes get it. The real video and poster stay underneath. Touch devices,
 * reduced-motion users and browsers without WebGL simply never wake it.
 */
export function HeroLens() {
  const dustRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const dustCanvas = dustRef.current;
    const section = dustCanvas?.closest("section");
    const lensCanvas = section?.querySelector<HTMLCanvasElement>("canvas.home-hero-lens");
    const underCanvas = section?.querySelector<HTMLCanvasElement>("canvas.home-hero-lens-under");
    const under = underCanvas?.getContext("2d") ?? null;
    const dust = dustCanvas?.getContext("2d");
    if (!lensCanvas || !dustCanvas || !section || !dust) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const lens = createVideoLens(lensCanvas);
    let lensUsable = lens !== null;

    let rect = section.getBoundingClientRect();
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let inside = false;
    let pointerX = 0;
    let pointerY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lensX = 0;
    let lensY = 0;
    let theta = 0;
    let shed = 0;
    const sparks: Spark[] = [];
    const fit = { left: 0, top: 0, width: 1, height: 1 };

    const measure = () => {
      rect = section.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      lens?.resize(width, height, dpr);
      dustCanvas.width = Math.round(width * dpr);
      dustCanvas.height = Math.round(height * dpr);
      if (underCanvas) {
        underCanvas.width = Math.round(width * dpr);
        underCanvas.height = Math.round(height * dpr);
      }
    };

    /** The frame to copy: the live video once it has data, else the poster. */
    const source = (): VideoLensSource | null => {
      const video = section.querySelector<HTMLVideoElement>("video.home-hero-video");
      // Copy the video only while the page itself is showing it; until then
      // the poster is what is on screen, so that is what gets bent.
      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.classList.contains("home-hero-video-ready")
      ) {
        return video;
      }
      const image = section.querySelector<HTMLImageElement>("img.home-hero-image");
      if (image && image.complete && image.naturalWidth > 0) return image;
      return null;
    };

    /** Same placement as `object-fit: cover; object-position: right center`. */
    const place = (media: VideoLensSource) => {
      const sourceWidth = "videoWidth" in media ? media.videoWidth : media.naturalWidth;
      const sourceHeight = "videoHeight" in media ? media.videoHeight : media.naturalHeight;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      fit.width = sourceWidth * scale;
      fit.height = sourceHeight * scale;
      fit.left = width - fit.width;
      fit.top = (height - fit.height) / 2;
    };

    const tick = (time: number) => {
      frame = 0;
      const dt = lastTime === 0 ? 0.016 : Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const size = Math.min(96, Math.max(52, Math.min(width, height) * 0.085));
      const follow = 1 - Math.exp(-dt * 11);
      lensX += (pointerX - lensX) * follow;
      lensY += (pointerY - lensY) * follow;
      theta += ((inside ? size : 0) - theta) * (1 - Math.exp(-dt * 5));

      const media = source();
      if (media) place(media);

      let drawn = false;
      if (lens && lensUsable && media && theta > 0.6) {
        drawn = lens.render(media, fit, lensX, lensY, theta, 0.24);
        if (!drawn) lensUsable = false;
      }
      // Mirror the frame for the layer that replaces the poster (ivory hero).
      if (drawn && under && underCanvas) {
        under.drawImage(lensCanvas, 0, 0, underCanvas.width, underCanvas.height);
      }
      // The ivory hero shows the video over the poster only once the video is
      // playing; say which one was copied so the styles can match that state.
      lensCanvas.dataset.source = media && "videoWidth" in media ? "video" : "image";
      lensCanvas.dataset.active = drawn ? "true" : "false";

      // Dust: shed by the moving cursor, pulled in by the black hole.
      const holeX = fit.left + fit.width * HOLE.u;
      const holeY = fit.top + fit.height * HOLE.v;
      const holeRadius = fit.width * HOLE.radius;
      const moved = Math.hypot(pointerX - lastPointerX, pointerY - lastPointerY);
      if (inside && media) {
        shed += moved * 0.05;
        while (shed >= 1 && sparks.length < MAX_SPARKS) {
          shed -= 1;
          const along = Math.random();
          const x = lastPointerX + (pointerX - lastPointerX) * along + (Math.random() - 0.5) * 10;
          const y = lastPointerY + (pointerY - lastPointerY) * along + (Math.random() - 0.5) * 10;
          sparks.push({
            x,
            y,
            px: x,
            py: y,
            vx: ((pointerX - lastPointerX) / Math.max(dt, 0.008)) * 0.07 + (Math.random() - 0.5) * 26,
            vy: ((pointerY - lastPointerY) / Math.max(dt, 0.008)) * 0.07 + (Math.random() - 0.5) * 26,
            life: 0,
          });
        }
        if (shed > 4) shed = 4;
      }
      lastPointerX = pointerX;
      lastPointerY = pointerY;

      const light = document.documentElement.dataset.theme === "light";
      dust.setTransform(dpr, 0, 0, dpr, 0, 0);
      dust.clearRect(0, 0, width, height);
      // Gold light on the dark hero, oxblood ink on the ivory one.
      dust.globalCompositeOperation = light ? "source-over" : "lighter";
      dust.lineCap = "round";
      const pull = holeRadius * holeRadius * 620;
      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.life += dt;
        const dx = holeX - spark.x;
        const dy = holeY - spark.y;
        const distance = Math.sqrt(dx * dx + dy * dy) + 1;
        if (distance < holeRadius * 0.92 || spark.life > 6) {
          sparks.splice(index, 1);
          continue;
        }
        // Inward pull plus a sideways shove, so dust spirals in like the disc.
        const force = pull / (distance * distance + holeRadius * holeRadius * 0.4);
        const ax = (dx / distance) * force + (-dy / distance) * force * 0.55;
        const ay = (dy / distance) * force + (dx / distance) * force * 0.55;
        spark.vx = (spark.vx + ax * dt) * (1 - dt * 0.35);
        spark.vy = (spark.vy + ay * dt) * (1 - dt * 0.35);
        spark.px = spark.x;
        spark.py = spark.y;
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;

        const near = Math.min(1, (holeRadius * 2.2) / distance);
        const alpha = Math.min(1, spark.life * 4) * (0.24 + near * 0.6) * Math.min(1, (6 - spark.life) * 0.8);
        // A soft mote with a short fading tail, never a hard dash.
        const tint = light
          ? `${Math.round(150 + near * 35)} ${Math.round(46 - near * 16)} ${Math.round(40 - near * 12)}`
          : `255 ${Math.round(214 - near * 60)} ${Math.round(150 - near * 70)}`;
        const tailX = spark.x - (spark.x - spark.px) * 0.6;
        const tailY = spark.y - (spark.y - spark.py) * 0.6;
        dust.strokeStyle = `rgb(${tint} / ${(alpha * 0.3).toFixed(3)})`;
        dust.lineWidth = 0.8 + near * 0.8;
        dust.beginPath();
        dust.moveTo(tailX, tailY);
        dust.lineTo(spark.x, spark.y);
        dust.stroke();
        dust.fillStyle = `rgb(${tint} / ${(alpha * 0.22).toFixed(3)})`;
        dust.beginPath();
        dust.arc(spark.x, spark.y, 2.6 + near * 2.2, 0, Math.PI * 2);
        dust.fill();
        dust.fillStyle = `rgb(${tint} / ${alpha.toFixed(3)})`;
        dust.beginPath();
        dust.arc(spark.x, spark.y, 0.8 + near * 0.7, 0, Math.PI * 2);
        dust.fill();
      }
      dust.globalCompositeOperation = "source-over";

      if (inside || theta > 0.6 || sparks.length > 0) {
        frame = window.requestAnimationFrame(tick);
      } else {
        lastTime = 0;
        lensCanvas.dataset.active = "false";
      }
    };

    const wake = () => {
      if (frame === 0) frame = window.requestAnimationFrame(tick);
    };

    let clientX = 0;
    let clientY = 0;
    let pointerKnown = false;

    /** Places the pointer against the hero as it sits right now. */
    const trackPointer = () => {
      rect = section.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const nowInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (nowInside && !inside) {
        // Arrive at the cursor instead of sweeping in from the last position.
        if (theta < 1) {
          lensX = x;
          lensY = y;
        }
        lastPointerX = x;
        lastPointerY = y;
      }
      inside = nowInside;
      if (inside) {
        pointerX = x;
        pointerY = y;
        wake();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      clientX = event.clientX;
      clientY = event.clientY;
      pointerKnown = true;
      trackPointer();
    };

    // Scrolling moves the hero under a still cursor. Without this, a wheel
    // scroll away from the hero leaves `inside` stuck on and the lens
    // rendering offscreen until the mouse moves again.
    const onScroll = () => {
      if (pointerKnown) trackPointer();
    };

    const onLeave = () => {
      inside = false;
    };

    const resizeObserver = new ResizeObserver(measure);
    measure();
    resizeObserver.observe(section);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      lens?.dispose();
    };
  }, []);

  return (
    <canvas ref={dustRef} className="home-hero-dust" aria-hidden="true" />
  );
}
