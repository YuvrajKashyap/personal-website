# Hero Assets

## 1. Purpose

This document defines how the selected cinematic hero source is stored, regenerated, optimized, and used later.

The hero image is an asset layer. It is not the website by itself. Future text, navigation, buttons, orbital UI, telemetry, and panels must remain coded UI layered over assets.

## 2. Selected hero direction

The primary selected source is the black-hole and engineered terrain image. It has dark negative space on the left, the event horizon and warm cinematic light on the right, and faint terrain or structures near the bottom.

Do not use the alternate planet or ring image as the primary source.

## 3. Source image location

Primary source:

```text
assets/source/hero/singularity-hero-source.png
```

The source image should be preserved for regeneration. Do not replace it without architect approval.

## 4. Production asset locations

Generated still poster assets live in:

```text
public/media/hero/singularity-poster.webp
public/media/hero/singularity-poster-tablet.webp
public/media/hero/singularity-poster-mobile.webp
```

Typed media paths live in:

```text
src/config/media.ts
```

## 5. Desktop, tablet, and mobile crop strategy

Desktop poster:

- 1920 by 1080.
- 16:9 crop.
- Right-side focal position to preserve the black hole and event horizon.
- Left dark space remains available for future coded UI.

Tablet poster:

- 1800 by 1200.
- 3:2 crop.
- Right-side focal position to keep the event horizon visible.
- Keeps enough left-side atmosphere for future interface layers where practical.

Mobile poster:

- 1200 by 1600.
- Portrait crop.
- Right-side focal position so the event horizon is not cropped away.
- Some left negative space is sacrificed because the source is wide, but the crop avoids becoming only empty darkness.

## 6. Composition notes

The selected image works because it has a clear cinematic focal point on the right and usable negative space on the left. Future coded gradients and overlays should protect text readability without flattening the image.

## 7. File size notes

Poster assets are exported as WebP with quality settings in the mid 80s. The goal is production-friendly size without destroying the cinematic range.

Regenerate assets with:

```bash
npm run prepare:hero
```

## 8. Usage rules

- Keep important text in HTML.
- Keep CTAs as coded interactive elements.
- Keep navigation as coded UI.
- Do not bake UI panels, buttons, stats, or claims into images.
- Do not point config to missing files.
- Do not use these assets as semantic content unless alt text is revisited.

## 9. Dark and light loading rule

The dark cinematic hero belongs to Singularity OS only. Light mode must not download dark cinematic hero assets.

Future implementation should conditionally load these assets only when dark mode needs them.

Step 13 implementation note:

- The static dark homepage hero initially rendered the poster only in the dark home view.
- The light home view does not render the dark poster, video, image source, or video source.
- Home text, CTAs, chips, navigation, and UI remain coded HTML and CSS layered over media.
- Step 14 replaces the dark poster-only environmental layer with poster-backed video.

## 10. Step 14 dark hero video integration

The optimized video assets are now integrated into `HomeDark` through `src/features/home/HeroVideoBackground.tsx`.

Implementation rules:

- `HomeDark` renders the dark cinematic video as a decorative environmental layer.
- WebM sources are listed before MP4 fallbacks.
- Mobile WebM and MP4 sources are used for viewports up to 767px.
- Desktop WebM and MP4 sources are used after the mobile sources.
- The video element is muted, looped, `playsInline`, autoplaying where allowed, and `aria-hidden`.
- No controls are shown.
- The poster picture remains behind the video so the hero does not flash black while video loads or fails.
- Reduced-motion users keep the poster fallback and do not mount the video.
- `HomeLight` does not render or reference dark posters, videos, source tags, or video paths.
- Hero text, CTAs, chips, navigation, and overlays remain real coded UI layered over media.

## 11. Step 15 light hero asset isolation

Step 15 builds the final-direction Ivory Observatory light hero without using dark cinematic hero assets.

- `HomeLight` uses CSS, SVG, semantic tokens, and coded UI only.
- No dark poster, video, image source, or video source is rendered by the light hero.
- The dark cinematic media remains exclusive to `HomeDark`.
- Light mode should continue to avoid downloading `singularity-loop` and `singularity-poster` assets.

## 12. Future animation step notes

Production WebM and MP4 loop assets now exist and are integrated into the dark home hero. Future animation work should not replace this with a text-baked video or a separate route.

The still poster should remain usable when reduced motion is enabled or when video cannot load.

## 13. Step 12 optimized video assets

Selected source candidate:

```text
assets/source/hero/animation-candidates/singularity-loop-candidate-03-kling-repaired-15s.mp4
```

The raw animation candidate folder is ignored and must remain uncommitted:

```text
assets/source/hero/animation-candidates/
```

Production video outputs:

```text
public/media/hero/singularity-loop.webm
public/media/hero/singularity-loop.mp4
public/media/hero/singularity-loop-mobile.webm
public/media/hero/singularity-loop-mobile.mp4
```

Output metadata:

| Asset | Codec | Dimensions | FPS | Duration | Pixel format | Size |
| --- | --- | --- | --- | --- | --- | --- |
| `singularity-loop.webm` | VP9 | 1920 by 1080 | 24 | 15.000s | yuv420p | 1.28 MiB |
| `singularity-loop.mp4` | H.264 | 1920 by 1080 | 24 | 15.000s | yuv420p | 3.94 MiB |
| `singularity-loop-mobile.webm` | VP9 | 1280 by 720 | 24 | 15.000s | yuv420p | 0.56 MiB |
| `singularity-loop-mobile.mp4` | H.264 | 1280 by 720 | 24 | 15.000s | yuv420p | 1.15 MiB |

Codec choices:

- WebM uses VP9 for modern browsers.
- MP4 uses H.264 as the broad compatibility fallback.
- All outputs remove audio.
- All outputs preserve 24 fps and yuv420p compatibility.
- MP4 outputs use `+faststart`.

Fallback strategy:

- Use the still poster when video cannot load.
- Use the still poster when reduced motion is enabled.
- Keep the poster visible until video playback is ready.
- Do not rely on video for text readability.

Mobile strategy:

- Mobile video outputs are approved and kept.
- Mobile video is 1280 by 720 to preserve the selected composition.
- Do not use a portrait video crop unless a later step explicitly approves it.

Regenerate optimized video assets with:

```bash
npm run optimize:hero-video
```

Human visual QA approved the current outputs:

- Desktop MP4 quality: pass.
- Desktop WebM quality: pass.
- Mobile MP4 quality: pass.
- Mobile WebM quality: pass.
- Loop seam acceptable: yes.
- Compression artifacts: none.
- Mobile video strategy: keep mobile video.
- Overall approval: approved.

## 14. Anti-patterns

- Replacing the selected source without approval.
- Using the alternate planet or ring image as the primary source.
- Baking text into the image.
- Baking navigation or buttons into the image.
- Loading dark hero assets in light mode.
- Using huge unoptimized files directly in the app.
- Treating the poster as the final homepage implementation.
- Committing raw animation candidate videos.
- Loading dark hero video in light mode.
- Rendering hidden dark hero media in the light DOM.
- Baking hero text or CTAs into the poster or video.
