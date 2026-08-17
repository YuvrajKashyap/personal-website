import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type PortfolioShowreelProps = {
  headline: string;
  slides: string[];
  subheadline: string;
};

export function PortfolioShowreel({
  headline,
  slides,
  subheadline,
}: PortfolioShowreelProps) {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [durationInFrames - 35, durationInFrames], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const activeSlide = Math.min(
    slides.length - 1,
    Math.floor((frame / durationInFrames) * slides.length),
  );

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 72% 18%, #6f551b 0%, #12100c 34%, #050505 75%)",
        color: "#f7f2e8",
        fontFamily: "Arial, sans-serif",
        opacity: exit,
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: 88,
        }}
      >
        <div style={{ opacity: intro, transform: `translateY(${(1 - intro) * 48}px)` }}>
          <div style={{ fontSize: 24, letterSpacing: 7, opacity: 0.72 }}>PORTFOLIO / 2026</div>
          <h1 style={{ fontSize: 104, letterSpacing: -6, lineHeight: 0.92, margin: "38px 0 24px" }}>
            {headline}
          </h1>
          <p style={{ fontSize: 34, lineHeight: 1.35, margin: 0, maxWidth: 760, opacity: 0.8 }}>
            {subheadline}
          </p>
        </div>

        <div style={{ marginBottom: 112 }}>
          <div style={{ color: "#dfb85c", fontSize: 30, letterSpacing: 5, marginBottom: 20 }}>
            {String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 148, fontWeight: 700, letterSpacing: -9, lineHeight: 0.9 }}>
            {slides[activeSlide]}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
