/**
 * Video lens: redraws a video (or still image) frame through a point-mass
 * gravitational lens. Away from the lens the picture is untouched, so the
 * canvas can sit directly over the element it copies; near it the footage
 * bends into arcs around a dark centre, with a little colour fringing.
 *
 * Raw WebGL 1, no dependencies. Returns null when a context is unavailable.
 */

const VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

uniform sampler2D uFrame;
uniform vec2 uRes;
uniform float uDpr;
uniform vec4 uFit;    // left, top, width, height of the picture in css px
uniform vec2 uLens;   // css px, origin bottom left
uniform float uTheta;
uniform float uRing;

vec3 frameAt(vec2 s) {
  vec2 uv = (vec2(s.x, uRes.y - s.y) - uFit.xy) / uFit.zw;
  return texture2D(uFrame, clamp(uv, 0.0, 1.0)).rgb;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  vec2 d = p - uLens;
  float r = max(length(d), 0.5);
  vec2 bend = d * (uTheta * uTheta / (r * r));
  vec3 col = vec3(
    frameAt(p - bend * 0.94).r,
    frameAt(p - bend).g,
    frameAt(p - bend * 1.07).b
  );
  col *= smoothstep(0.16 * uTheta, 0.7 * uTheta, r);
  float w = uTheta * 0.045 + 1.2;
  float dr = (r - uTheta) / w;
  col += vec3(1.0, 0.88, 0.68) * (exp(-dr * dr) * 0.42 + exp(-dr * dr / 25.0) * 0.08) * uRing;
  gl_FragColor = vec4(col, 1.0);
}
`;

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

export type VideoLensSource = HTMLVideoElement | HTMLImageElement;

export function createVideoLens(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uDpr = gl.getUniformLocation(program, "uDpr");
  const uFit = gl.getUniformLocation(program, "uFit");
  const uLens = gl.getUniformLocation(program, "uLens");
  const uTheta = gl.getUniformLocation(program, "uTheta");
  const uRing = gl.getUniformLocation(program, "uRing");
  gl.uniform1i(gl.getUniformLocation(program, "uFrame"), 0);

  let height = 1;
  let lost = false;
  let uploadedSource: VideoLensSource | null = null;
  let uploadedStamp: number | string = "";
  let lastRender = 0;

  // Counts the frames the video actually presents. `currentTime` moves on
  // every animation frame during playback, so it cannot tell a new frame
  // from a repeat; it is only the fallback where the callback is missing.
  let watched: HTMLVideoElement | null = null;
  let watchHandle = 0;
  let presented = 0;

  const unwatch = () => {
    if (watched) watched.cancelVideoFrameCallback(watchHandle);
    watched = null;
  };

  const videoStamp = (video: HTMLVideoElement): number => {
    if (typeof video.requestVideoFrameCallback !== "function") return video.currentTime;
    if (watched !== video) {
      unwatch();
      watched = video;
      // Nothing is known about frames presented while unwatched.
      uploadedSource = null;
      const onFrame: VideoFrameRequestCallback = (_now, metadata) => {
        presented = metadata.presentedFrames;
        // Stop counting once the lens has gone to sleep; the next render
        // starts again with a fresh upload.
        if (performance.now() - lastRender > 500) {
          watched = null;
          return;
        }
        watchHandle = video.requestVideoFrameCallback(onFrame);
      };
      watchHandle = video.requestVideoFrameCallback(onFrame);
    }
    return presented;
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    resize(width: number, nextHeight: number, dpr: number) {
      height = nextHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uDpr, dpr);
    },

    /**
     * Draws one frame. `fit` is where the picture lands inside the canvas
     * (CSS px, from the top left). Returns false if the frame could not be
     * read, so the caller can step aside and show the original element.
     */
    render(
      source: VideoLensSource,
      fit: { left: number; top: number; width: number; height: number },
      lensX: number,
      lensY: number,
      theta: number,
      ring: number,
    ) {
      if (lost) return false;
      // Uploading a frame is the expensive part, so only upload when the
      // picture changed: another source, a new video frame or a new image.
      lastRender = performance.now();
      const stamp = "currentTime" in source ? videoStamp(source) : source.currentSrc;
      if (source !== uploadedSource || stamp !== uploadedStamp) {
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        } catch {
          uploadedSource = null;
          return false;
        }
        uploadedSource = source;
        uploadedStamp = stamp;
      }
      gl.uniform4f(uFit, fit.left, fit.top, fit.width, fit.height);
      gl.uniform2f(uLens, lensX, height - lensY);
      gl.uniform1f(uTheta, theta);
      gl.uniform1f(uRing, ring);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    },

    dispose() {
      unwatch();
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}
