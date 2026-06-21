"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { heroMedia } from "@/config/media";

type HeroVideoMedia = (typeof heroMedia)["singularity"];
type HeroVideoVariant = "dark" | "light";

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

function HeroVideoLayer({ media }: { media: HeroVideoMedia }) {
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

  return (
    <video
      ref={videoRef}
      className={`home-hero-video${isVideoPlaying ? " home-hero-video-ready" : ""}`}
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
      <source
        media="(max-width: 767px)"
        src={media.videoMobileWebm}
        type="video/webm"
      />
      <source
        media="(max-width: 767px)"
        src={media.videoMobileMp4}
        type="video/mp4"
      />
      <source src={media.videoWebm} type="video/webm" />
      <source src={media.videoMp4} type="video/mp4" />
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

  return (
    <div className={`home-hero-media home-hero-media-${variant}`} aria-hidden="true">
      <picture className="home-hero-poster">
        <source media="(max-width: 640px)" srcSet={media.posterMobile} />
        <source media="(max-width: 1024px)" srcSet={media.posterTablet} />
        <img
          src={media.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-hero-image"
        />
      </picture>

      {allowsMotion ? <HeroVideoLayer media={media} /> : null}
    </div>
  );
}
