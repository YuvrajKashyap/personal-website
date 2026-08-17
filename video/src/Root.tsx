import { Composition } from "remotion";

import {
  PortfolioShowreel,
  type PortfolioShowreelProps,
} from "./PortfolioShowreel";

const defaultProps: PortfolioShowreelProps = {
  headline: "Yuvraj Kashyap",
  subheadline: "Software, systems, and ideas in motion.",
  slides: ["Build", "Explore", "Connect"],
};

export function RemotionRoot() {
  return (
    <Composition
      id="PortfolioShowreel"
      component={PortfolioShowreel}
      defaultProps={defaultProps}
      durationInFrames={360}
      fps={30}
      width={1080}
      height={1920}
    />
  );
}
