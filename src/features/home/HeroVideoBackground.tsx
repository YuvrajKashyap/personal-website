"use client";

import { useEffect, useState } from "react";

import { heroMedia } from "@/config/media";

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

export function HeroVideoBackground() {
  const media = heroMedia.singularity;
  const allowsMotion = useAllowsHeroMotion();

  return (
    <div className="home-hero-media" aria-hidden="true">
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

      {allowsMotion ? (
        <video
          className="home-hero-video"
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
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
      ) : null}
    </div>
  );
}
