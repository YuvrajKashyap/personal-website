import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { seoConfig } from "@/config/seo";

export const alt = "Yuvraj Kashyap personal operating interface";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portraitData = await readFile(
    join(
      process.cwd(),
      "public/media/portrait/yuvraj-worlds-fair-og.png",
    ),
    "base64",
  );
  const portraitUrl = `data:image/png;base64,${portraitData}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#020305",
          color: "#f8f3e7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 72% 50%, rgba(245, 178, 74, 0.18), transparent 28%), radial-gradient(circle at 12% 14%, rgba(73, 108, 255, 0.13), transparent 28%), linear-gradient(135deg, #020305 0%, #08090d 62%, #120b07 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -210,
            top: -270,
            width: 700,
            height: 700,
            border: "2px solid rgba(245, 178, 74, 0.16)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 62,
            width: 690,
            height: 2,
            background:
              "linear-gradient(90deg, rgba(245, 178, 74, 0.82), rgba(245, 178, 74, 0.12), transparent)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 790,
              height: "100%",
              padding: "58px 42px 52px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                marginTop: 112,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 104,
                  lineHeight: 0.86,
                  fontWeight: 850,
                  letterSpacing: -5,
                  textTransform: "uppercase",
                }}
              >
                <span>Yuvraj</span>
                <span>Kashyap</span>
              </div>
              <div
                style={{
                  color: "#f5d394",
                  fontSize: 30,
                  fontWeight: 650,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                Builder · Operator · Engineer
              </div>
            </div>
            <div
              style={{
                color: "rgba(248, 243, 231, 0.76)",
                fontSize: 24,
                letterSpacing: 1.2,
              }}
            >
              {seoConfig.siteUrl.replace("https://", "")}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              width: 410,
              height: "100%",
              overflow: "hidden",
              borderLeft: "1px solid rgba(245, 178, 74, 0.32)",
              background: "#0a0a0b",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              width="410"
              height="630"
              src={portraitUrl}
              style={{
                position: "absolute",
                left: -245,
                top: -190,
                width: 900,
                height: 1125,
                filter: "saturate(0.78) contrast(1.08) brightness(0.86)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(2, 3, 5, 0.46), transparent 42%), linear-gradient(0deg, rgba(2, 3, 5, 0.58), transparent 36%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 28,
                bottom: 28,
                display: "flex",
                color: "#f5b24a",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Dallas · SF
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
