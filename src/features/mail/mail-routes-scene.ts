type RouteContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type RoutePath = Path2D;
type PathFactory = () => RoutePath;

type PointTrail = {
  points: Float32Array;
  count: number;
  head: number;
};

function createPointTrail(capacity: number): PointTrail {
  return {
    points: new Float32Array(capacity * 2),
    count: 0,
    head: 0,
  };
}

function pushTrailPoint(trail: PointTrail, x: number, y: number) {
  const capacity = trail.points.length / 2;
  trail.head = (trail.head - 1 + capacity) % capacity;
  trail.points[trail.head * 2] = x;
  trail.points[trail.head * 2 + 1] = y;
  trail.count = Math.min(trail.count + 1, capacity);
}

function getTrailPointOffset(trail: PointTrail, index: number) {
  const capacity = trail.points.length / 2;
  return ((trail.head + index) % capacity) * 2;
}

function tracePolyline(path: RoutePath, points: Float32Array) {
  path.moveTo(points[0], points[1]);
  for (let offset = 2; offset < points.length; offset += 2) {
    path.lineTo(points[offset], points[offset + 1]);
  }
}

type Route = {
  geometry: QuadraticRouteGeometry;
  points: Float32Array;
  path: RoutePath;
  depth: number;
  t: number;
  speed: number;
  trail: PointTrail;
};

type Flyby = {
  active: boolean;
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
  t: number;
  duration: number;
  scale: number;
  trail: PointTrail;
};

type Speck = {
  x: number;
  y: number;
  radius: number;
  depth: number;
  phase: number;
};

export type MailRoutesPalette = {
  dark: boolean;
  accent: string;
  secondary: string;
  foreground: string;
  plane: string;
};

const ROUTE_COUNT = 5;
const SPECK_COUNT = 46;
const SAMPLES = 96;
const TRAIL_LEN = 18;
const FLYBY_TRAIL_LEN = 34;
const FLYBY_POOL = 6;
const ROUTE_DASH = [2, 8];
const SOLID_LINE: number[] = [];

export type QuadraticRouteGeometry = {
  startX: number;
  startY: number;
  controlX: number;
  controlY: number;
  endX: number;
  endY: number;
};

export function sampleQuadraticRoute(
  geometry: QuadraticRouteGeometry,
  progress: number,
) {
  const t = Math.min(1, Math.max(0, progress));
  const inverse = 1 - t;
  const x =
    inverse * inverse * geometry.startX +
    2 * inverse * t * geometry.controlX +
    t * t * geometry.endX;
  const y =
    inverse * inverse * geometry.startY +
    2 * inverse * t * geometry.controlY +
    t * t * geometry.endY;
  const dx =
    2 * inverse * (geometry.controlX - geometry.startX) +
    2 * t * (geometry.endX - geometry.controlX);
  const dy =
    2 * inverse * (geometry.controlY - geometry.startY) +
    2 * t * (geometry.endY - geometry.controlY);

  return { x, y, angle: Math.atan2(dy, dx) };
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULT_PALETTE: MailRoutesPalette = {
  dark: true,
  accent: "#f0c96a",
  secondary: "#7db7ff",
  foreground: "#f6f1e8",
  plane: "#f0c96a",
};

export function createMailRoutesScene(
  context: RouteContext,
  createPath: PathFactory = () => new Path2D(),
) {
  let width = 0;
  let height = 0;
  let routes: Route[] = [];
  let specks: Speck[] = [];
  const planeBodyPath = createPath();
  planeBodyPath.moveTo(7, 0);
  planeBodyPath.lineTo(-5, 4.2);
  planeBodyPath.lineTo(-2.4, 0);
  planeBodyPath.lineTo(-5, -4.2);
  planeBodyPath.closePath();
  const planeFoldPath = createPath();
  planeFoldPath.moveTo(7, 0);
  planeFoldPath.lineTo(-2.4, 0);
  planeFoldPath.lineTo(-5, 4.2);
  planeFoldPath.closePath();
  const flybys: Flyby[] = Array.from({ length: FLYBY_POOL }, () => ({
    active: false,
    startX: 0,
    startY: 0,
    controlX: 0,
    controlY: 0,
    endX: 0,
    endY: 0,
    t: 0,
    duration: 3400,
    scale: 1,
    trail: createPointTrail(FLYBY_TRAIL_LEN),
  }));
  let palette = DEFAULT_PALETTE;
  let energy = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastTime = 0;
  let clock = 0;
  let nextFlybyAt = 4200;
  const pendingFlybys: number[] = [];
  const runtimeRandom = mulberry32(97131);

  const buildScene = () => {
    const random = mulberry32(20260809);
    routes = [];
    specks = [];

    for (let index = 0; index < ROUTE_COUNT; index += 1) {
      const startY = height * (0.16 + random() * 0.7);
      const endY = height * (0.1 + random() * 0.74);
      const controlX = width * (0.3 + random() * 0.4);
      const controlY = Math.min(startY, endY) - height * (0.16 + random() * 0.22);
      const geometry: QuadraticRouteGeometry = {
        startX: -width * 0.06,
        startY,
        controlX,
        controlY,
        endX: width * 1.06,
        endY,
      };
      const points = new Float32Array((SAMPLES + 1) * 2);

      for (let sample = 0; sample <= SAMPLES; sample += 1) {
        const point = sampleQuadraticRoute(geometry, sample / SAMPLES);
        points[sample * 2] = point.x;
        points[sample * 2 + 1] = point.y;
      }

      const path = createPath();
      tracePolyline(path, points);
      routes.push({
        geometry,
        points,
        path,
        depth: 0.35 + random() * 0.65,
        t: random(),
        speed: 0.00013 + random() * 0.0002,
        trail: createPointTrail(TRAIL_LEN),
      });
    }

    for (let index = 0; index < SPECK_COUNT; index += 1) {
      specks.push({
        x: random() * width,
        y: random() * height,
        radius: 0.6 + random() * 1.4,
        depth: 0.2 + random() * 0.8,
        phase: random() * Math.PI * 2,
      });
    }

  };

  const spawnFlyby = (big = false) => {
    const slot = flybys.find((flyby) => !flyby.active);
    if (!slot) return;

    const leftToRight = runtimeRandom() > 0.32;
    const yStart = height * (0.12 + runtimeRandom() * 0.6);
    const yEnd = height * (0.08 + runtimeRandom() * 0.55);
    slot.startX = leftToRight ? -width * 0.08 : width * 1.08;
    slot.endX = leftToRight ? width * 1.08 : -width * 0.08;
    slot.startY = yStart;
    slot.endY = yEnd;
    slot.controlX = width * (0.34 + runtimeRandom() * 0.32);
    slot.controlY = Math.min(yStart, yEnd) - height * (0.12 + runtimeRandom() * 0.24);
    slot.t = 0;
    slot.duration = big ? 2600 + runtimeRandom() * 700 : 3300 + runtimeRandom() * 1400;
    slot.scale = big ? 1.9 + runtimeRandom() * 0.5 : 1.15 + runtimeRandom() * 0.45;
    slot.trail.count = 0;
    slot.active = true;
  };

  const drawTrail = (trail: PointTrail, baseAlpha: number, lineWidth: number) => {
    const { count, points } = trail;
    if (count < 2) return;

    context.strokeStyle = palette.plane;
    context.lineCap = "round";
    for (let index = 0; index < count - 1; index += 1) {
      const fade = 1 - index / (count - 1);
      const currentOffset = getTrailPointOffset(trail, index);
      const nextOffset = getTrailPointOffset(trail, index + 1);
      context.globalAlpha = baseAlpha * fade * fade;
      context.lineWidth = lineWidth * (0.35 + fade * 0.65);
      context.beginPath();
      context.moveTo(points[currentOffset], points[currentOffset + 1]);
      context.lineTo(points[nextOffset], points[nextOffset + 1]);
      context.stroke();
    }
    context.globalAlpha = 1;
  };

  const drawPlane = (
    x: number,
    y: number,
    angle: number,
    scale: number,
    alpha: number,
  ) => {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);
    context.globalAlpha = alpha;
    context.fillStyle = palette.plane;
    context.fill(planeBodyPath);
    context.globalAlpha = alpha * 0.45;
    context.fill(planeFoldPath);
    context.globalAlpha = alpha * (0.1 + energy * 0.18);
    context.beginPath();
    context.arc(0, 0, 7 + energy * 5, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };

  const drawRoute = (route: Route, time: number, advance: boolean) => {
    const { points } = route;
    const parallaxX = pointerX * 10 * route.depth;
    const parallaxY = pointerY * 7 * route.depth;
    const alpha =
      (palette.dark ? 0.05 : 0.075) * route.depth + energy * 0.08 * route.depth;

    context.save();
    context.translate(parallaxX, parallaxY);
    context.strokeStyle = palette.dark ? palette.accent : palette.plane;
    context.globalAlpha = alpha;
    context.lineWidth = 1;
    context.setLineDash(ROUTE_DASH);
    context.lineDashOffset = -time * 0.004 * route.depth;
    context.stroke(route.path);
    context.setLineDash(SOLID_LINE);

    let position: ReturnType<typeof sampleQuadraticRoute>;
    if (advance) {
      position = sampleQuadraticRoute(route.geometry, route.t);
    } else {
      const pointIndex = Math.min(SAMPLES - 1, Math.floor(route.t * SAMPLES));
      const x = points[pointIndex * 2];
      const y = points[pointIndex * 2 + 1];
      const nextX = points[(pointIndex + 1) * 2];
      const nextY = points[(pointIndex + 1) * 2 + 1];
      position = { x, y, angle: Math.atan2(nextY - y, nextX - x) };
    }

    if (advance) pushTrailPoint(route.trail, position.x, position.y);
    drawTrail(route.trail, (0.16 + energy * 0.3) * route.depth, 2.4);
    drawPlane(
      position.x,
      position.y,
      position.angle,
      0.85 * route.depth + 0.35,
      (0.55 + energy * 0.45) * route.depth,
    );
    context.restore();
  };

  const drawFlyby = (flyby: Flyby, delta: number) => {
    flyby.t += delta / flyby.duration;
    if (flyby.t >= 1) {
      flyby.active = false;
      return;
    }

    const t = flyby.t;
    const inverse = 1 - t;
    const x =
      inverse * inverse * flyby.startX +
      2 * inverse * t * flyby.controlX +
      t * t * flyby.endX;
    const y =
      inverse * inverse * flyby.startY +
      2 * inverse * t * flyby.controlY +
      t * t * flyby.endY;
    const dx =
      2 * inverse * (flyby.controlX - flyby.startX) +
      2 * t * (flyby.endX - flyby.controlX);
    const dy =
      2 * inverse * (flyby.controlY - flyby.startY) +
      2 * t * (flyby.endY - flyby.controlY);
    const angle = Math.atan2(dy, dx);
    const fade = Math.min(1, Math.min(t, 1 - t) * 8);

    pushTrailPoint(flyby.trail, x, y);
    drawTrail(flyby.trail, 0.3 * fade + energy * 0.2, 3.4 * flyby.scale * 0.5);
    drawPlane(x, y, angle, flyby.scale, 0.9 * fade);
  };

  return {
    resize(nextWidth: number, nextHeight: number, dpr: number) {
      width = nextWidth;
      height = nextHeight;
      context.canvas.width = Math.round(width * dpr);
      context.canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    },
    setPalette(nextPalette: MailRoutesPalette) {
      palette = nextPalette;
    },
    setPointerTarget(x: number, y: number) {
      pointerTargetX = x;
      pointerTargetY = y;
    },
    resetTiming() {
      lastTime = 0;
    },
    triggerOpened() {
      energy = Math.min(1, energy + 0.55);
      spawnFlyby(true);
    },
    triggerSent() {
      energy = 1;
      pendingFlybys.push(clock + 150, clock + 480, clock + 900);
    },
    renderFrame(time: number) {
      const delta = lastTime ? Math.min(time - lastTime, 40) : 16.7;
      lastTime = time;
      clock += delta;
      const step = delta / 16.7;

      pointerX += (pointerTargetX - pointerX) * 0.045 * step;
      pointerY += (pointerTargetY - pointerY) * 0.045 * step;
      energy *= 0.986 ** step;

      if (clock >= nextFlybyAt) {
        spawnFlyby(false);
        nextFlybyAt = clock + 6500 + runtimeRandom() * 5200;
      }
      while (pendingFlybys.length && clock >= pendingFlybys[0]) {
        pendingFlybys.shift();
        spawnFlyby(true);
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = palette.foreground;
      for (const speck of specks) {
        const twinkle =
          0.5 + 0.5 * Math.sin(speck.phase + time * 0.0011 * speck.depth);
        context.globalAlpha =
          (palette.dark ? 0.04 : 0.05) * speck.depth +
          twinkle * 0.07 * speck.depth;
        context.beginPath();
        context.arc(
          speck.x + pointerX * 16 * speck.depth,
          speck.y + pointerY * 11 * speck.depth,
          speck.radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      }
      context.globalAlpha = 1;

      if (palette.dark) context.globalCompositeOperation = "lighter";
      for (const route of routes) {
        route.t += route.speed * delta * route.depth * (1 + energy * 2.4);
        if (route.t > 1) {
          route.t -= 1;
          route.trail.count = 0;
        }
        drawRoute(route, time, true);
      }
      for (const flyby of flybys) {
        if (flyby.active) drawFlyby(flyby, delta);
      }
      context.globalCompositeOperation = "source-over";
    },
    drawStatic() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = palette.foreground;
      for (const speck of specks) {
        context.globalAlpha = 0.07 * speck.depth;
        context.beginPath();
        context.arc(speck.x, speck.y, speck.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      for (const route of routes) drawRoute(route, 0, false);
    },
  };
}
