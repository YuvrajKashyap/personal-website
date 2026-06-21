import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "../..");
const inputPath = resolve(
  rootDir,
  "assets/source/hero/animation-candidates/singularity-loop-candidate-03-kling-repaired-15s.mp4",
);
const outputDir = resolve(rootDir, "public/media/hero");

const outputProfiles = [
  {
    label: "Desktop WebM",
    outputPath: resolve(outputDir, "singularity-loop.webm"),
    vf: "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,format=yuv420p,setsar=1",
    args: [
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "26",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-pix_fmt",
      "yuv420p",
    ],
  },
  {
    label: "Desktop MP4",
    outputPath: resolve(outputDir, "singularity-loop.mp4"),
    vf: "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,format=yuv420p,setsar=1",
    args: [
      "-an",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-level:v",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "slow",
      "-crf",
      "18",
      "-movflags",
      "+faststart",
    ],
  },
  {
    label: "Mobile WebM",
    outputPath: resolve(outputDir, "singularity-loop-mobile.webm"),
    vf: "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p,setsar=1",
    args: [
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "29",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-pix_fmt",
      "yuv420p",
    ],
  },
  {
    label: "Mobile MP4",
    outputPath: resolve(outputDir, "singularity-loop-mobile.mp4"),
    vf: "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,format=yuv420p,setsar=1",
    args: [
      "-an",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-level:v",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
    ],
  },
];

function refreshWindowsPath() {
  if (process.platform !== "win32") {
    return;
  }

  try {
    const machinePath = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        "[Environment]::GetEnvironmentVariable('Path','Machine')",
      ],
      { encoding: "utf8" },
    ).trim();
    const userPath = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        "[Environment]::GetEnvironmentVariable('Path','User')",
      ],
      { encoding: "utf8" },
    ).trim();

    const pathKey = process.env.Path === undefined ? "PATH" : "Path";
    const mergedPath = [process.env[pathKey], machinePath, userPath]
      .filter(Boolean)
      .join(";");

    process.env.Path = mergedPath;
    process.env.PATH = mergedPath;
  } catch {
    // The command availability check below will provide the actionable error.
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

  if (result.error) {
    throw new Error(`${command} failed to start: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} exited with code ${result.status}\n${result.stderr || result.stdout}`,
    );
  }

  return result.stdout;
}

function requireCommand(command) {
  try {
    run(command, ["-version"]);
  } catch (error) {
    throw new Error(
      `${command} is required but was not found. Install FFmpeg and make sure ${command} is available on PATH.\n${error.message}`,
    );
  }
}

function formatBytes(bytes) {
  const mib = bytes / 1024 / 1024;
  return `${bytes} bytes (${mib.toFixed(2)} MiB)`;
}

function parseRate(rate) {
  if (!rate || !rate.includes("/")) {
    return rate ?? "unknown";
  }

  const [numerator, denominator] = rate.split("/").map(Number);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return rate;
  }

  return `${(numerator / denominator).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} fps`;
}

function probe(filePath) {
  const stdout = run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration,size",
    "-show_entries",
    "stream=width,height,r_frame_rate,codec_name,pix_fmt",
    "-of",
    "json",
    filePath,
  ]);
  const metadata = JSON.parse(stdout);
  const stream = metadata.streams?.[0];

  if (!stream || !metadata.format) {
    throw new Error(`Unable to read video metadata for ${filePath}`);
  }

  return {
    duration: Number.parseFloat(metadata.format.duration).toFixed(3),
    size: Number.parseInt(metadata.format.size, 10),
    width: stream.width,
    height: stream.height,
    fps: parseRate(stream.r_frame_rate),
    codec: stream.codec_name,
    pixelFormat: stream.pix_fmt,
  };
}

function printMetadata(label, filePath) {
  const metadata = probe(filePath);

  console.log(label);
  console.log(`- path: ${filePath}`);
  console.log(`- duration: ${metadata.duration}s`);
  console.log(`- dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`- fps: ${metadata.fps}`);
  console.log(`- codec: ${metadata.codec}`);
  console.log(`- pixel format: ${metadata.pixelFormat}`);
  console.log(`- file size: ${formatBytes(metadata.size)}`);
  console.log("");

  return metadata;
}

refreshWindowsPath();
requireCommand("ffmpeg");
requireCommand("ffprobe");

if (!existsSync(inputPath)) {
  throw new Error(`Selected hero video candidate is missing: ${inputPath}`);
}

mkdirSync(outputDir, { recursive: true });

console.log("Selected source candidate");
printMetadata("Source", inputPath);

for (const profile of outputProfiles) {
  console.log(`Encoding ${profile.label}...`);
  run(
    "ffmpeg",
    [
      "-y",
      "-i",
      inputPath,
      "-vf",
      profile.vf,
      ...profile.args,
      profile.outputPath,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  const size = statSync(profile.outputPath).size;
  console.log(`Generated ${profile.label}: ${formatBytes(size)}`);
  console.log("");
}

console.log("Optimized outputs");
for (const profile of outputProfiles) {
  printMetadata(profile.label, profile.outputPath);
}
