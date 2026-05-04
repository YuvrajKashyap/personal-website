import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "../..");
const inputPath = resolve(
  rootDir,
  "assets/source/hero/animation-candidates/singularity-loop-candidate-01-kling.mp4",
);
const outputDir = resolve(
  rootDir,
  "assets/source/hero/animation-candidates/loop-repair-tests",
);

const tests = [
  { seconds: 0.5, suffix: "050" },
  { seconds: 0.75, suffix: "075" },
  { seconds: 1, suffix: "100" },
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

function probeDuration() {
  const stdout = run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    inputPath,
  ]);
  const metadata = JSON.parse(stdout);
  const duration = Number.parseFloat(metadata?.format?.duration);

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Unable to read a valid source duration from ${inputPath}`);
  }

  return duration;
}

function formatSeconds(seconds) {
  return seconds.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function formatBytes(bytes) {
  const mib = bytes / 1024 / 1024;
  return `${bytes} bytes (${mib.toFixed(2)} MiB)`;
}

refreshWindowsPath();
requireCommand("ffmpeg");
requireCommand("ffprobe");

if (!existsSync(inputPath)) {
  throw new Error(`Input video is missing: ${inputPath}`);
}

mkdirSync(outputDir, { recursive: true });

const duration = probeDuration();
console.log(`Input: ${inputPath}`);
console.log(`Duration: ${formatSeconds(duration)}s`);
console.log(`Output folder: ${outputDir}`);

for (const test of tests) {
  const fadeDuration = test.seconds;
  const offset = Math.max(0, duration - fadeDuration);
  const outputPath = resolve(
    outputDir,
    `singularity-loop-repair-xfade-${test.suffix}.mp4`,
  );

  const filter = [
    "[0:v]fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,format=yuv420p,settb=AVTB[v0]",
    "[1:v]fps=24,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,format=yuv420p,settb=AVTB[v1]",
    `[v0][v1]xfade=transition=fade:duration=${formatSeconds(fadeDuration)}:offset=${formatSeconds(offset)},trim=duration=${formatSeconds(duration)},setpts=PTS-STARTPTS,format=yuv420p[v]`,
  ].join(";");

  run(
    "ffmpeg",
    [
      "-y",
      "-i",
      inputPath,
      "-i",
      inputPath,
      "-filter_complex",
      filter,
      "-map",
      "[v]",
      "-an",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-level:v",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "24",
      "-crf",
      "19",
      "-preset",
      "medium",
      "-tag:v",
      "avc1",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  const size = statSync(outputPath).size;
  console.log(
    `Generated ${fadeDuration.toFixed(2)}s xfade: ${outputPath} - ${formatBytes(size)}`,
  );
}
