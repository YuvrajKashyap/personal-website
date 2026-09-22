import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Yuvraj Kashyap landing page in Singularity OS dark mode";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const landingPreview = await readFile(
    join(process.cwd(), "public/media/og/home-preview.png"),
    "base64",
  );

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      width={size.width}
      height={size.height}
      src={`data:image/png;base64,${landingPreview}`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />,
    size,
  );
}
