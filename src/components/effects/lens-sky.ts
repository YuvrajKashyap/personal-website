/**
 * Lens sky: the Home starfield as a fragment shader, with the cursor acting
 * as a gravitational lens.
 *
 * Every pixel asks where its light came from. For a point mass the answer is
 * exact: light seen at distance r from the lens left the sky at
 * r - theta^2 / r, where theta is the Einstein radius. Sampling the stars and
 * the chapter titles at that source position smears them into arcs around the
 * cursor, opens a dark patch at its centre, and (with three slightly
 * different bend strengths per colour channel) fringes the letters the way a
 * real lens splits light.
 *
 * Raw WebGL 1, no dependencies. `createLensSky` returns null when a context
 * is unavailable so the caller can fall back to the 2D starfield.
 */

const VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uScroll;
uniform vec2 uLens;
uniform float uTheta;
uniform float uRing;
uniform float uStretch;
uniform float uLight;
uniform vec3 uInk;
uniform vec3 uTitleInk;
uniform sampler2D uTitleA;
uniform sampler2D uTitleB;
uniform vec4 uRectA;
uniform vec4 uRectB;
uniform float uOnA;
uniform float uOnB;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// One depth of stars. Each cell of a jittered grid may hold one star; deeper
// layers use bigger cells and slide further as the page scrolls.
vec3 layer(vec2 p, float cell, float seed, float depth) {
  vec2 g = (p - vec2(0.0, uScroll * depth)) / cell;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float h = hash21(id + seed);
  if (h < 0.56) return vec3(0.0);
  vec2 c = vec2(hash21(id + seed + 7.1), hash21(id + seed + 13.7)) * 0.5 + 0.25;
  vec2 d = (f - c) * cell;
  // Fast scrolls stretch stars along the direction of travel. The stretch
  // is capped by the cell size so a streak never outgrows its own cell.
  float st = min(uStretch, cell * 0.069);
  float dd = length(vec2(d.x, d.y / (1.0 + st)));
  float b = pow(hash21(id + seed + 3.3), 5.0);
  float rad = 0.75 + b * 1.7;
  float tw = 0.8 + 0.2 * sin(uTime * (0.6 + h * 2.4) + h * 40.0);
  float s = smoothstep(rad, 0.0, dd) * (0.3 + b * 1.25) * tw / (1.0 + st * 0.1);
  // The soft halo stays round: stretching it is what drew tall glowing boxes.
  s += b * b * 0.3 * exp(-dot(d, d) / (rad * rad * 16.0));
  // Each cell only ever draws its own star, so fade to nothing before the
  // cell edge and no glow can be sliced off by it.
  vec2 e = abs(f - 0.5);
  s *= (1.0 - smoothstep(0.34, 0.5, e.x)) * (1.0 - smoothstep(0.34, 0.5, e.y));
  float kind = hash21(id + seed + 21.0);
  vec3 tint = vec3(0.78, 0.84, 1.0);
  if (kind > 0.92) tint = vec3(1.0, 0.86, 0.68);
  else if (kind > 0.74) tint = vec3(0.86, 0.78, 1.0);
  return tint * s;
}

float titleAt(sampler2D tex, vec4 rect, vec2 s) {
  vec2 uv = (s - rect.xy) / rect.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  return texture2D(tex, vec2(uv.x, 1.0 - uv.y)).a;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  vec2 src = p;
  vec2 bend = vec2(0.0);
  float shade = 1.0;
  float gain = 1.0;
  vec3 col = vec3(0.0);

  if (uTheta > 0.5) {
    vec2 d = p - uLens;
    float r = max(length(d), 0.5);
    bend = d * (uTheta * uTheta / (r * r));
    src = p - bend;
    shade = smoothstep(0.18 * uTheta, 0.75 * uTheta, r);
    float w = uTheta * 0.045 + 1.2;
    float dr = (r - uTheta) / w;
    // The Einstein ring: light piles up exactly at theta.
    col += vec3(0.74, 0.78, 1.0) * (exp(-dr * dr) * 0.6 + exp(-dr * dr / 25.0) * 0.12) * uRing;
    // Lensing magnifies: whatever sits near the ring gets brighter.
    gain = 1.0 + 1.4 * exp(-dr * dr / 60.0);
  }

  col += layer(src, 56.0, 1.0, 0.12) * shade;
  col += layer(src + 311.0, 102.0, 5.0, 0.2) * shade * 1.15;
  col += layer(src + 97.0, 172.0, 9.0, 0.34) * shade * 1.5;

  float fringe = mix(0.35, 1.0, shade) * gain;
  if (uOnA > 0.001) {
    vec3 ink = vec3(
      titleAt(uTitleA, uRectA, p - bend * 0.92),
      titleAt(uTitleA, uRectA, p - bend),
      titleAt(uTitleA, uRectA, p - bend * 1.09)
    );
    col += ink * uTitleInk * uOnA * fringe;
  }
  if (uOnB > 0.001) {
    vec3 ink = vec3(
      titleAt(uTitleB, uRectB, p - bend * 0.92),
      titleAt(uTitleB, uRectB, p - bend),
      titleAt(uTitleB, uRectB, p - bend * 1.09)
    );
    col += ink * uTitleInk * uOnB * fringe;
  }

  float peak = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  // Dark: light on black. Light: the same intensities laid down as ink.
  vec4 night = vec4(min(col, vec3(1.0)), peak);
  vec4 day = vec4(uInk * peak * 0.62, peak * 0.62);
  gl_FragColor = mix(night, day, uLight);
}
`;

export type LensFrame = {
  time: number;
  scroll: number;
  /** CSS px from the top left of the canvas. */
  lensX: number;
  lensY: number;
  theta: number;
  ring: number;
  stretch: number;
};

export type LensTitleRect = { x: number; y: number; w: number; h: number; on: number };

const UNIFORMS = [
  "uRes",
  "uDpr",
  "uTime",
  "uScroll",
  "uLens",
  "uTheta",
  "uRing",
  "uStretch",
  "uLight",
  "uInk",
  "uTitleInk",
  "uTitleA",
  "uTitleB",
  "uRectA",
  "uRectB",
  "uOnA",
  "uOnB",
] as const;

type UniformName = (typeof UNIFORMS)[number];

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createLensSky(canvas: HTMLCanvasElement, titleCount: number) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;
  if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision === 0) {
    return null;
  }

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One oversized triangle covers the viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = {} as Record<UniformName, WebGLUniformLocation | null>;
  for (const name of UNIFORMS) uniform[name] = gl.getUniformLocation(program, name);

  const makeTexture = () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(4),
    );
    return texture;
  };
  const titles = Array.from({ length: titleCount }, makeTexture);
  const ready = new Array<boolean>(titleCount).fill(false);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);
  gl.uniform1i(uniform.uTitleA, 0);
  gl.uniform1i(uniform.uTitleB, 1);

  let width = 1;
  let height = 1;
  let dpr = 1;
  let lost = false;
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    isLost() {
      return lost;
    },

    resize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniform.uRes, width, height);
      gl.uniform1f(uniform.uDpr, dpr);
    },

    /** Star and title colours as 0..1 rgb. `light` lays them down as ink. */
    setTheme(light: boolean, ink: readonly number[], titleInk: readonly number[]) {
      gl.uniform1f(uniform.uLight, light ? 1 : 0);
      gl.uniform3f(uniform.uInk, ink[0], ink[1], ink[2]);
      gl.uniform3f(uniform.uTitleInk, titleInk[0], titleInk[1], titleInk[2]);
    },

    /** A chapter title, drawn to a 2D canvas, becomes part of the sky. */
    setTitle(slot: number, source: HTMLCanvasElement | null) {
      ready[slot] = false;
      if (!source) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, titles[slot]);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      ready[slot] = true;
    },

    hasTitle(slot: number) {
      return ready[slot];
    },

    /**
     * Draws one frame. Up to two titles can be on screen at once; pass their
     * slots and rects (CSS px from the top left), or -1 for none.
     */
    render(
      frame: LensFrame,
      slotA: number,
      rectA: LensTitleRect | null,
      slotB: number,
      rectB: LensTitleRect | null,
    ) {
      if (lost) return;
      gl.uniform1f(uniform.uTime, frame.time);
      gl.uniform1f(uniform.uScroll, frame.scroll);
      gl.uniform2f(uniform.uLens, frame.lensX, height - frame.lensY);
      gl.uniform1f(uniform.uTheta, frame.theta);
      gl.uniform1f(uniform.uRing, frame.ring);
      gl.uniform1f(uniform.uStretch, frame.stretch);

      const bind = (
        unit: number,
        slot: number,
        rect: LensTitleRect | null,
        rectUniform: WebGLUniformLocation | null,
        onUniform: WebGLUniformLocation | null,
      ) => {
        const live = rect !== null && slot >= 0 && ready[slot];
        gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, titles[live ? slot : 0]);
        if (live && rect) {
          gl.uniform4f(rectUniform, rect.x, height - (rect.y + rect.h), rect.w, rect.h);
          gl.uniform1f(onUniform, rect.on);
        } else {
          gl.uniform1f(onUniform, 0);
        }
      };
      bind(0, slotA, rectA, uniform.uRectA, uniform.uOnA);
      bind(1, slotB, rectB, uniform.uRectB, uniform.uOnB);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      for (const texture of titles) gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}

export type LensSky = NonNullable<ReturnType<typeof createLensSky>>;
