"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { heroMedia } from "@/config/media";

type HeroVideoMedia = (typeof heroMedia)["singularity"];
type HeroVideoVariant = "dark" | "light";
type HeroVideoViewport = "all" | "mobile" | "desktop";

function useAllowsHeroMotion() {
  const [allowsMotion, setAllowsMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const updateMotionPreference = () => {
      setAllowsMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  return allowsMotion;
}

function getMobileSourceMedia(viewport: HeroVideoViewport) {
  if (viewport === "mobile") {
    return "(prefers-reduced-motion: no-preference) and (max-width: 767px)";
  }

  return "(max-width: 767px)";
}

function getDesktopSourceMedia(viewport: HeroVideoViewport) {
  if (viewport === "desktop") {
    return "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
  }

  return undefined;
}

function HeroVideoLayer({
  media,
  viewport = "all",
}: {
  media: HeroVideoMedia;
  viewport?: HeroVideoViewport;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const requestPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;

    const playRequest = video.play();

    if (playRequest !== undefined) {
      playRequest.catch(() => {
        setIsVideoPlaying(false);
      });
    }
  }, []);

  useEffect(() => {
    requestPlayback();
  }, [requestPlayback]);

  const mobileSourceMedia = getMobileSourceMedia(viewport);
  const desktopSourceMedia = getDesktopSourceMedia(viewport);
  const renderMobileSources = viewport !== "desktop";
  const renderDesktopSources = viewport !== "mobile";

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
      onError={() => {
        setIsVideoPlaying(false);
      }}
    >
      {renderMobileSources ? (
        <>
          <source
            media={mobileSourceMedia}
            src={media.videoMobileWebm}
            type="video/webm"
          />
          <source
            media={mobileSourceMedia}
            src={media.videoMobileMp4}
            type="video/mp4"
          />
        </>
      ) : null}
      {renderDesktopSources ? (
        <>
          <source media={desktopSourceMedia} src={media.videoWebm} type="video/webm" />
          <source media={desktopSourceMedia} src={media.videoMp4} type="video/mp4" />
        </>
      ) : null}
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
  const allowsMotion = useAllowsHeroMotion();
  const useLandscapePhonePoster = variant === "dark";

  return (
    <div className={`home-hero-media home-hero-media-${variant}`} aria-hidden="true">
      <picture className="home-hero-poster">
        {useLandscapePhonePoster ? null : (
          <source media="(max-width: 640px)" srcSet={media.posterMobile} />
        )}
        <source
          media={
            useLandscapePhonePoster
              ? "(min-width: 641px) and (max-width: 1024px)"
              : "(max-width: 1024px)"
          }
          srcSet={media.posterTablet}
        />
        <img
          src={media.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-hero-image"
        />
      </picture>

      {variant === "dark" ? <HeroVideoLayer media={media} viewport="mobile" /> : null}
      {allowsMotion ? (
        <HeroVideoLayer
          media={media}
          viewport={variant === "dark" ? "desktop" : "all"}
        />
      ) : null}
    </div>
  );
}
