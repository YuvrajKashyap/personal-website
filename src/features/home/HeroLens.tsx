"use client";

import { useEffect, useRef } from "react";

import { createVideoLens, type VideoLensSource } from "@/components/effects/video-lens";

/**
 * Makes the hero respond to the cursor as a mass.
 *
 * A WebGL copy of the black-hole footage, redrawn through a gravitational
 * lens at the cursor, so the cursor visibly bends the singularity itself.
 * Decorative and asleep until the pointer moves over the hero.
 *
 * Both themes get it. The real video and poster stay underneath. Touch devices,
 * reduced-motion users and browsers without WebGL simply never wake it.
 */
export function HeroLens() {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = anchorRef.current?.closest("section");
    const lensCanvas = section?.querySelector<HTMLCanvasElement>("canvas.home-hero-lens");
    const underCanvas = section?.querySelector<HTMLCanvasElement>("canvas.home-hero-lens-under");
    const under = underCanvas?.getContext("2d") ?? null;
    if (!lensCanvas || !section) return;
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
    let lensX = 0;
    let lensY = 0;
    let theta = 0;
    const fit = { left: 0, top: 0, width: 1, height: 1 };

    // The mirror layer only exists in the ivory hero (CSS hides it in the
    // dark one). When hidden, skip both its backing store and the copy.
    let mirror = false;

    const measure = () => {
      rect = section.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      lens?.resize(width, height, dpr);
      mirror = !!underCanvas && getComputedStyle(underCanvas).display !== "none";
      if (underCanvas && mirror) {
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
      if (drawn && mirror && under && underCanvas) {
        under.drawImage(lensCanvas, 0, 0, underCanvas.width, underCanvas.height);
      }
      // The ivory hero shows the video over the poster only once the video is
      // playing; say which one was copied so the styles can match that state.
      lensCanvas.dataset.source = media && "videoWidth" in media ? "video" : "image";
      lensCanvas.dataset.active = drawn ? "true" : "false";

      if (inside || theta > 0.6) {
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
    <span ref={anchorRef} hidden />
  );
}
