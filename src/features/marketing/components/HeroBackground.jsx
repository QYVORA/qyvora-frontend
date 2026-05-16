/**
 * HeroBackground.jsx
 *
 * Cinematic flowing digital intelligence stream.
 * Binary data highways moving beneath the viewer.
 *
 * Fixes:
 *  - Digits are much smaller / finer
 *  - Smoother lane blending and flow bands
 *  - Fully responsive across mobile, tablet, desktop, ultrawide
 */

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAdaptiveUi } from "../../../core/hooks/useAdaptiveUi";

/* ─── Shaders ──────────────────────────────────────────────────────────────── */

const STREAM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STREAM_FRAG = `
  precision highp float;

  uniform float uTime;
  uniform vec3  uAccent;
  uniform vec2  uResolution;
  uniform float uPixelDensity;   /* physical px-per-logical-px  */
  varying vec2  vUv;

  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  /*
   * laneContrib
   *
   * laneX   – normalised centre of the lane (0-1 in UV space)
   * laneW   – logical lane width  (0-1 in UV space, BEFORE perspective)
   * speed   – scroll speed multiplier
   * seed    – random seed for this lane
   * perspR  – perspective compression ratio  (0 = near, 1 = horizon)
   *
   * Digit size is controlled by charPixels: the target height of one
   * character cell expressed in *physical* pixels.  Smaller value → smaller
   * digits.  We convert that to UV-space using uResolution so it stays
   * consistent across DPR and window size changes.
   */
  float laneContrib(
    vec2  uv,
    float laneX,
    float laneW,
    float speed,
    float seed,
    float perspR
  ) {
    float halfW = laneW * 0.5;
    float dx    = uv.x - laneX;
    if (abs(dx) > halfW) return 0.0;
    float lx = (dx / laneW) + 0.5;   /* 0-1 within the lane */

    /* Target glyph height in physical pixels – tune this to taste.
       Lower = finer / smaller digits.                                   */
    float charPixels = 11.0 * uPixelDensity;
    float charH      = charPixels / uResolution.y;

    float scrollY = uTime * speed;
    float cellY   = floor((uv.y + scrollY) / charH);
    float localY  = fract((uv.y + scrollY) / charH);

    float h     = hash(seed + hash2(vec2(seed * 0.1, cellY)));
    float flip  = floor(uTime / (0.30 + hash2(vec2(laneX, seed)) * 0.50));
    float digit = step(0.5, hash(h + flip * 9.3));

    /* Glyph: "1" = vertical bar, "0" = hollow rectangle */
    float glyph = 0.0;
    if (digit > 0.5) {
      /* "1" – narrow vertical bar */
      glyph = step(0.34, lx) * step(lx, 0.66)
            * step(0.06, localY) * step(localY, 0.88);
    } else {
      /* "0" – hollow rect with thin walls */
      float outer = step(0.10, lx) * step(lx, 0.90)
                  * step(0.06, localY) * step(localY, 0.90);
      float inner = step(0.28, lx) * step(lx, 0.72)
                  * step(0.22, localY) * step(localY, 0.76);
      glyph = clamp(outer - inner, 0.0, 1.0);
    }

    /* Falling-head glow */
    float headPhase = fract(seed * 0.6173 + uTime * speed * 0.065);
    float headY     = headPhase;
    float headDist  = abs(uv.y - headY);
    float headGlow  = exp(-headDist * 28.0) * 3.2;

    /* Trail that fades upward from the head */
    float aboveHead = clamp((uv.y - headY) / 0.50, 0.0, 1.0);
    float trailMask = exp(-aboveHead * 4.0);

    /* Depth fade */
    float depthFade = 1.0 - perspR * 0.55;

    return clamp((glyph * trailMask + headGlow) * depthFade, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;

    /* Mask the sky area so streams fade out near the horizon */
    float skyMask = smoothstep(0.85, 0.38, uv.y);

    /* Perspective warp – lanes converge toward a vanishing point */
    float vp = pow(clamp(uv.y, 0.0, 1.0), 0.50);
    float cx = (uv.x - 0.5) * mix(1.0, 0.22, vp) + 0.5;
    vec2  wuv = vec2(cx, uv.y);

    float acc = 0.0;

    /* ── Near lanes (wide, fast) ──────────────────────────────── */
    acc += laneContrib(wuv, 0.07,  0.048, 0.62, 1.00,  0.04);
    acc += laneContrib(wuv, 0.21,  0.044, 0.57, 4.30,  0.06);
    acc += laneContrib(wuv, 0.36,  0.050, 0.66, 8.70,  0.05);
    acc += laneContrib(wuv, 0.51,  0.046, 0.60, 13.1,  0.06);
    acc += laneContrib(wuv, 0.66,  0.048, 0.63, 17.5,  0.05);
    acc += laneContrib(wuv, 0.80,  0.044, 0.58, 22.0,  0.07);
    acc += laneContrib(wuv, 0.93,  0.046, 0.61, 26.3,  0.04);

    /* ── Mid lanes ────────────────────────────────────────────── */
    acc += laneContrib(wuv, 0.14,  0.030, 0.42, 31.0,  0.36);
    acc += laneContrib(wuv, 0.28,  0.028, 0.38, 36.5,  0.38);
    acc += laneContrib(wuv, 0.42,  0.031, 0.44, 42.1,  0.37);
    acc += laneContrib(wuv, 0.56,  0.029, 0.40, 47.8,  0.39);
    acc += laneContrib(wuv, 0.70,  0.030, 0.43, 53.4,  0.36);
    acc += laneContrib(wuv, 0.84,  0.028, 0.41, 59.0,  0.38);

    /* ── Far lanes (narrow, slow) ─────────────────────────────── */
    acc += laneContrib(wuv, 0.20,  0.017, 0.22, 64.0,  0.77);
    acc += laneContrib(wuv, 0.35,  0.016, 0.20, 70.5,  0.80);
    acc += laneContrib(wuv, 0.50,  0.018, 0.24, 76.1,  0.76);
    acc += laneContrib(wuv, 0.65,  0.016, 0.21, 81.8,  0.79);
    acc += laneContrib(wuv, 0.80,  0.017, 0.23, 87.3,  0.77);

    /* ── Subtle horizontal flow bands ────────────────────────── */
    float bands = 0.0;
    for (int b = 0; b < 7; b++) {
      float f    = float(b);
      float bspd = 0.020 + f * 0.006;
      float bseed= f * 0.4173;
      float bY   = fract(bseed + uTime * bspd);
      float bW   = 0.030 + hash(f * 3.7) * 0.020;
      float d    = abs(uv.y - bY) / bW;
      float fade = smoothstep(0.0, 0.20, uv.y) * smoothstep(1.0, 0.78, uv.y);
      float xfade= smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
      bands += exp(-d * d * 2.0) * fade * xfade * 0.14;
    }

    float totalLight = clamp(acc, 0.0, 1.0);
    float bloom      = totalLight * totalLight * 0.40;

    vec3 dimGreen = vec3(0.005, 0.05, 0.005);
    vec3 col      = mix(dimGreen, uAccent, totalLight);
    col          += uAccent * bloom;
    col          += uAccent * bands * 0.85;

    /* Subtle horizon haze */
    float hazeY = smoothstep(0.40, 0.80, uv.y);
    col        += vec3(0.0, 0.05, 0.01) * hazeY * 0.35;

    /* Vignette on left/right edges */
    float vx    = smoothstep(0.0, 0.10, uv.x) * smoothstep(1.0, 0.90, uv.x);
    float alpha = (totalLight * 0.93 + bands * 0.55) * skyMask * vx;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.93));
  }
`;

/* ─── Three.js components ──────────────────────────────────────────────────── */

function StreamFloor({ speedScale = 0.58 }) {
  const matRef   = useRef();
  const meshRef  = useRef();
  const { size } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:   STREAM_VERT,
        fragmentShader: STREAM_FRAG,
        uniforms: {
          uTime:        { value: 0 },
          uAccent:      { value: new THREE.Color(183 / 255, 255 / 255, 153 / 255) },
          uResolution:  { value: new THREE.Vector2(1, 1) },
          uPixelDensity:{ value: 1.0 },
        },
        transparent: true,
        depthWrite:  false,
        blending:    THREE.NormalBlending,
        side:        THREE.DoubleSide,
      }),
    []
  );

  useFrame(({ clock, size: s }) => {
    if (!matRef.current) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    matRef.current.uniforms.uTime.value        = clock.getElapsedTime() * speedScale;
    matRef.current.uniforms.uResolution.value.set(s.width * dpr, s.height * dpr);
    matRef.current.uniforms.uPixelDensity.value = dpr;
  });

  /* Plane wide enough to fill the widest viewport (incl. ultrawide) */
  const planeW = size.width < 768 ? 40 : 32;

  return (
    <mesh ref={meshRef} position={[0, -1.18, -7.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* More segments = smoother perspective warp */}
      <planeGeometry args={[planeW, 40, 2, 2]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}

function CameraRig({ speedScale = 0.58 }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, -1.08, -10.8), []);

  useEffect(() => {
    const w = size.width;
    /* FOV: narrow on wide screens, wider on small/portrait screens */
    camera.fov  = w < 480 ? 90 : w < 768 ? 80 : w < 1280 ? 65 : 58;
    camera.near = 0.1;
    camera.far  = 120;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame(({ clock, size: s }) => {
    const t       = clock.getElapsedTime() * speedScale;
    const w       = s.width;
    const isMob   = w < 768;
    const isSmall = w < 480;

    camera.position.set(
      Math.sin(t * 0.18) * 0.18,
      (isSmall ? 1.60 : isMob ? 1.48 : 1.08) + Math.sin(t * 0.12) * 0.030,
      isSmall ? 7.8 : isMob ? 7.2 : 5.9
    );
    target.x = Math.sin(t * 0.16) * 0.30;
    camera.lookAt(target);
  });

  return null;
}

function Scene({ speedScale }) {
  return (
    <>
      <fog attach="fog" args={["#000000", 8, 26]} />
      <CameraRig speedScale={speedScale} />
      <StreamFloor speedScale={speedScale} />
    </>
  );
}

/* ─── Public component ─────────────────────────────────────────────────────── */

export default function HeroBackground({ className = "" }) {
  const { isMobile, constrainedDevice } = useAdaptiveUi();
  const speedScale = constrainedDevice ? 0.34 : 0.52;
  const dpr = isMobile ? [1, 1.25] : [1, 1.75];

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 1.08, 5.9], fov: 58, near: 0.1, far: 120 }}
        gl={{
          antialias:       !isMobile,
          alpha:           true,
          powerPreference: "high-performance",
          toneMapping:     THREE.NoToneMapping,
        }}
        performance={{ min: 0.5 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene speedScale={speedScale} />
        </Suspense>
      </Canvas>

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top,
              rgba(0,0,0,0.90) 0%,
              rgba(0,0,0,0.45) 18%,
              transparent 58%)`,
          }}
        />
        {/* Top fade */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.38) 16%,
              transparent 55%)`,
          }}
        />
        {/* Centre accent bloom */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 55% 18% at 50% 52%,
              rgba(183,255,153,0.055) 0%,
              transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}
