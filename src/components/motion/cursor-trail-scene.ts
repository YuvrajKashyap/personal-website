type TrailContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

const TRAIL_LIFE_MS = 380;
const TRAIL_MAX_POINTS = 70;
const TRAIL_COLOR = "232, 38, 45";

export function createCursorTrailScene(context: TrailContext) {
  const xs = new Float64Array(TRAIL_MAX_POINTS);
  const ys = new Float64Array(TRAIL_MAX_POINTS);
  const times = new Float64Array(TRAIL_MAX_POINTS);
  let start = 0;
  let count = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const pointIndex = (offset: number) => (start + offset) % TRAIL_MAX_POINTS;

  return {
    resize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      context.canvas.width = Math.round(width * dpr);
      context.canvas.height = Math.round(height * dpr);
    },
    pushPoint(x: number, y: number, time: number) {
      let index: number;
      if (count < TRAIL_MAX_POINTS) {
        index = pointIndex(count);
        count += 1;
      } else {
        index = start;
        start = (start + 1) % TRAIL_MAX_POINTS;
      }
      xs[index] = x;
      ys[index] = y;
      times[index] = time;
    },
    renderFrame(now: number) {
      while (count && now - times[start] > TRAIL_LIFE_MS) {
        start = (start + 1) % TRAIL_MAX_POINTS;
        count -= 1;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      if (count > 1) {
        context.globalCompositeOperation = "lighter";
        context.lineCap = "round";
        context.lineJoin = "round";

        for (let offset = 1; offset < count; offset += 1) {
          const from = pointIndex(offset - 1);
          const to = pointIndex(offset);
          const strength = Math.max(0, 1 - (now - times[to]) / TRAIL_LIFE_MS);

          context.strokeStyle = `rgba(${TRAIL_COLOR}, ${strength * 0.12})`;
          context.lineWidth = 2 + strength * 9;
          context.beginPath();
          context.moveTo(xs[from], ys[from]);
          context.lineTo(xs[to], ys[to]);
          context.stroke();

          context.strokeStyle = `rgba(${TRAIL_COLOR}, ${strength * 0.55})`;
          context.lineWidth = 0.6 + strength * 2.6;
          context.beginPath();
          context.moveTo(xs[from], ys[from]);
          context.lineTo(xs[to], ys[to]);
          context.stroke();
        }

        context.globalCompositeOperation = "source-over";
      }

      return count > 0;
    },
  };
}
