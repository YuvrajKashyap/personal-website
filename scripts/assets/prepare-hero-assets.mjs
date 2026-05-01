import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const sourcePath = path.join(
  "assets",
  "source",
  "hero",
  "singularity-hero-source.png",
);
const outputDir = path.join("public", "media", "hero");

const outputs = [
  {
    label: "Desktop poster",
    path: path.join(outputDir, "singularity-poster.webp"),
    width: 1920,
    height: 1080,
    position: "right",
    quality: 86,
  },
  {
    label: "Tablet poster",
    path: path.join(outputDir, "singularity-poster-tablet.webp"),
    width: 1800,
    height: 1200,
    position: "right",
    quality: 85,
  },
  {
    label: "Mobile poster",
    path: path.join(outputDir, "singularity-poster-mobile.webp"),
    width: 1200,
    height: 1600,
    position: "right",
    quality: 84,
  },
];

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return `${Math.round(bytes / 1024)} KB`;
}

async function getFileSize(filePath) {
  const fileStats = await stat(filePath);
  return fileStats.size;
}

async function main() {
  let sourceStats;

  try {
    sourceStats = await stat(sourcePath);
  } catch {
    console.error(`Missing source image: ${sourcePath}`);
    process.exitCode = 1;
    return;
  }

  const source = sharp(sourcePath, { failOn: "error" });
  const metadata = await source.metadata();
  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height || !metadata.format) {
    console.error("Source image metadata could not be read.");
    process.exitCode = 1;
    return;
  }

  if (width < 1200 || height < 675) {
    console.error(
      `Source image is too small for hero preparation: ${width}x${height}.`,
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(outputDir, { recursive: true });

  console.log("Hero source");
  console.log(`- path: ${sourcePath}`);
  console.log(`- format: ${metadata.format}`);
  console.log(`- dimensions: ${width}x${height}`);
  console.log(`- aspect ratio: ${(width / height).toFixed(3)}`);
  console.log(`- file size: ${formatBytes(sourceStats.size)}`);
  console.log("");

  for (const output of outputs) {
    await sharp(sourcePath)
      .resize({
        width: output.width,
        height: output.height,
        fit: "cover",
        position: output.position,
        withoutEnlargement: false,
      })
      .webp({
        quality: output.quality,
        effort: 6,
      })
      .toFile(output.path);

    const outputSize = await getFileSize(output.path);

    console.log(output.label);
    console.log(`- path: ${output.path}`);
    console.log(`- dimensions: ${output.width}x${output.height}`);
    console.log(`- file size: ${formatBytes(outputSize)}`);
    console.log("");
  }
}

await main();
