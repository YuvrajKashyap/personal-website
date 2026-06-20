import { ImageResponse } from "next/og";

import { seoConfig } from "@/config/seo";

export const runtime = "edge";
export const alt = "Yuvraj Kashyap personal operating interface";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#030406",
          color: "#f8f3e7",
          fontFamily: "system-ui, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 38%, rgba(245, 178, 74, 0.34), transparent 24%), radial-gradient(circle at 18% 18%, rgba(73, 108, 255, 0.18), transparent 32%), linear-gradient(135deg, #030406 0%, #08090d 58%, #140c07 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -130,
            width: 520,
            height: 520,
            border: "1px solid rgba(245, 178, 74, 0.28)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 120,
            bottom: 76,
            width: 680,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(245, 178, 74, 0.58), transparent)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#f5b24a",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span>Personal Operating Interface</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                fontSize: 82,
                lineHeight: 0.95,
                fontWeight: 780,
                letterSpacing: -1,
                maxWidth: 760,
              }}
            >
              {seoConfig.creator}
            </div>
            <div
              style={{
                color: "#f5d394",
                fontSize: 34,
                lineHeight: 1.15,
                maxWidth: 760,
              }}
            >
              I build systems that create gravity.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(248, 243, 231, 0.72)",
              fontSize: 24,
              letterSpacing: 1,
            }}
          >
            <span>Software systems</span>
            <span>{seoConfig.siteUrl.replace("https://", "")}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
