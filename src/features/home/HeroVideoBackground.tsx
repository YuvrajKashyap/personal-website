"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { heroMedia } from "@/config/media";

type HeroVideoMedia = (typeof heroMedia)["singularity"];
type HeroVideoVariant = "dark" | "light";
type HeroVideoViewport = "mobile" | "desktop";

const DESKTOP_VIEWPORT_QUERY = "(min-width: 768px)";
const MOBILE_VIDEO_MEDIA =
  "(prefers-reduced-motion: no-preference) and (max-width: 767px)";
const DESKTOP_VIDEO_MEDIA =
  "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

function subscribeToDesktopViewport(callback: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_VIEWPORT_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(DESKTOP_VIEWPORT_QUERY).matches;
}

function getDesktopViewportServerSnapshot() {
  return false;
}

function HeroVideoLayer({
  media,
  viewport,
}: {
  media: HeroVideoMedia;
  viewport: HeroVideoViewport;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isInViewRef = useRef(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const requestPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video || !isInViewRef.current) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;

    const playRequest = video.play();

    if (playRequest !== undefined) {
      playRequest
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          setIsVideoPlaying(false);
        });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          requestPlayback();
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(video);

    // iOS pauses autoplaying video aggressively (Low Power Mode, tab
    // switches) and paints its own play glyph over the frozen frame. Retry
    // when the page returns, and on the first touch, since a user gesture
    // always unlocks playback.
    function retryPlayback() {
      if (isInViewRef.current) {
        requestPlayback();
      }
    }

    document.addEventListener("visibilitychange", retryPlayback);
    window.addEventListener("pageshow", retryPlayback);
    window.addEventListener("touchstart", retryPlayback, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", retryPlayback);
      window.removeEventListener("pageshow", retryPlayback);
      window.removeEventListener("touchstart", retryPlayback);
      video.pause();
    };
  }, [requestPlayback]);

  return (
    <video
      ref={videoRef}
      className={`home-hero-video home-hero-video-${viewport}${
        isVideoPlaying ? " home-hero-video-ready" : ""
      }`}
      poster={media.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      disablePictureInPicture
      onCanPlay={requestPlayback}
      onLoadedData={requestPlayback}
      onPlaying={() => {
        setIsVideoPlaying(true);
      }}
      onPause={() => {
        // Paused while on screen (iOS Low Power Mode etc.): fade back to the
        // poster instead of showing a frozen frame with a play glyph.
        const video = videoRef.current;
        if (isInViewRef.current && video && !video.ended) {
          setIsVideoPlaying(false);
        }
      }}
      onError={() => {
        setIsVideoPlaying(false);
      }}
    >
      {viewport === "mobile" ? (
        <>
          <source
            media={MOBILE_VIDEO_MEDIA}
            src={media.videoMobileWebm}
            type="video/webm"
          />
          <source
            media={MOBILE_VIDEO_MEDIA}
            src={media.videoMobileMp4}
            type="video/mp4"
          />
        </>
      ) : (
        <>
          <source
            media={DESKTOP_VIDEO_MEDIA}
            src={media.videoWebm}
            type="video/webm"
          />
          <source
            media={DESKTOP_VIDEO_MEDIA}
            src={media.videoMp4}
            type="video/mp4"
          />
        </>
      )}
    </video>
  );
}

type HeroVideoBackgroundProps = {
  variant?: HeroVideoVariant;
};

export function HeroVideoBackground({
  variant = "dark",
}: HeroVideoBackgroundProps) {
  const media = heroMedia.singularity;
  const isDesktopViewport = useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getDesktopViewportServerSnapshot,
  );
  const videoViewport = isDesktopViewport ? "desktop" : "mobile";

  return (
    <div className={`home-hero-media home-hero-media-${variant}`} aria-hidden="true">
      <picture className="home-hero-poster">
        <source media="(min-width: 641px) and (max-width: 1024px)" srcSet={media.posterTablet} />
        <source
          media="(max-width: 640px) and (prefers-reduced-motion: reduce)"
          srcSet={media.posterMobile}
        />
        <img
          src={media.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-hero-image"
        />
      </picture>

      <HeroVideoLayer
        key={videoViewport}
        media={media}
        viewport={videoViewport}
      />
    </div>
  );
}
