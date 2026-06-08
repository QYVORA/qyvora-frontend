/**
 * HeroBackground.jsx
 * Clean binary rain — pure rivers of 0s and 1s, no sweeping bands or bloom overlays.
 *
 * Fixes vs previous version:
 *   1. uResolution initialised from a real fallback (1920x1080) not (1,1)
 *      — prevents charH collapsing to a huge value on first frame, which
 *      caused the glyph grid to render as solid opaque bars.
 *   2. A second useEffect reads gl.domElement on mount to set the real size
 *      immediately before the first draw call.
 *   3. Colour ramp: near-black → #58A366 (matches --color-accent) → soft white.
 *      Dim trailing digits are near-black; stream head peaks approach white.
 *   4. headGlow is multiplied by glyph — only brightens digit pixels, not
 *      the full lane width (which was causing solid-bar artefacts).
 *   5. trailMask exponent raised 4.0 → 6.0 for faster falloff so trailing
 *      digits are clearly dimmer than the stream head.
 */

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAdaptiveUi } from "../../../core/hooks/useAdaptiveUi";
import { useTheme } from "../../../core/contexts/ThemeContext";


// ─── Vertex Shader ─────────────────────────────────────────────────────────────
const STREAM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;


// ─── Fragment Shader ───────────────────────────────────────────────────────────
const STREAM_FRAG = `
  precision highp float;

  uniform float uTime;
  uniform vec3  uAccent;       // #58A366 sage green — trail colour
  uniform vec3  uWhite;        // near-white — stream head colour
  uniform vec3  uBase;         // Base color for trails (black in dark, light-ash in light)
  uniform vec2  uResolution;
  uniform float uPixelDensity;

  varying vec2 vUv;

  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float laneContrib(
    vec2  uv,
    float laneX,
    float laneW,
    float speed,
    float seed,
    float perspR
  ) {
    float dx = uv.x - laneX;
    if (abs(dx) > laneW * 0.5) return 0.0;

    float lx = (dx / laneW) + 0.5;

    // Cell height in UV space — depends on real resolution being set correctly
    float charPixels = 11.0 * uPixelDensity;
    float charH      = charPixels / uResolution.y;

    float scrollY = uTime * speed;
    float cellY   = floor((uv.y + scrollY) / charH);
    float localY  = fract((uv.y + scrollY) / charH);

    float h     = hash(seed + hash2(vec2(seed * 0.1, cellY)));
    float flip  = floor(uTime / (0.30 + hash2(vec2(laneX, seed)) * 0.50));
    float digit = step(0.5, hash(h + flip * 9.3));

    // Pixel-art glyph
    float glyph = 0.0;
    if (digit > 0.5) {
      // "1"
      glyph = step(0.34, lx) * step(lx, 0.66)
            * step(0.06, localY) * step(localY, 0.88);
    } else {
      // "0" hollow rectangle
      float outer = step(0.10, lx) * step(lx, 0.90)
                  * step(0.06, localY) * step(localY, 0.90);
      float inner = step(0.28, lx) * step(lx, 0.72)
                  * step(0.22, localY) * step(localY, 0.76);
      glyph = clamp(outer - inner, 0.0, 1.0);
    }

    // Stream head position
    float headPhase = fract(seed * 0.6173 + uTime * speed * 0.065);
    float headY     = headPhase;
    float headDist  = abs(uv.y - headY);

    // FIX: headGlow multiplied by glyph so it only brightens actual digit
    // pixels — not the full lane width (which caused solid-bar artefacts)
    float headGlow = exp(-headDist * 28.0) * 2.8 * glyph;

    // Trail fades out above the head — exponent 6.0 for a sharper dropoff
    float aboveHead = clamp((uv.y - headY) / 0.50, 0.0, 1.0);
    float trailMask = exp(-aboveHead * 6.0);

    float depthFade = 1.0 - perspR * 0.55;

    return clamp((glyph * trailMask + headGlow) * depthFade, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;

    float skyMask = smoothstep(0.85, 0.38, uv.y);

    float vp  = pow(clamp(uv.y, 0.0, 1.0), 0.50);
    float cx  = (uv.x - 0.5) * mix(1.0, 0.22, vp) + 0.5;
    vec2  wuv = vec2(cx, uv.y);

    float acc = 0.0;

    // Near lanes
    acc += laneContrib(wuv, 0.10, 0.050, 0.62,  1.00, 0.04);
    acc += laneContrib(wuv, 0.25, 0.045, 0.57,  4.30, 0.06);
    acc += laneContrib(wuv, 0.40, 0.052, 0.66,  8.70, 0.05);
    acc += laneContrib(wuv, 0.55, 0.048, 0.60, 13.1,  0.06);
    acc += laneContrib(wuv, 0.70, 0.050, 0.63, 17.5,  0.05);
    acc += laneContrib(wuv, 0.85, 0.046, 0.58, 22.0,  0.07);

    // Mid lanes
    acc += laneContrib(wuv, 0.18, 0.032, 0.42, 31.0, 0.36);
    acc += laneContrib(wuv, 0.38, 0.030, 0.38, 36.5, 0.38);
    acc += laneContrib(wuv, 0.58, 0.033, 0.44, 42.1, 0.37);
    acc += laneContrib(wuv, 0.78, 0.031, 0.40, 47.8, 0.39);

    // Far lanes
    acc += laneContrib(wuv, 0.30, 0.018, 0.22, 64.0, 0.77);
    acc += laneContrib(wuv, 0.50, 0.017, 0.20, 70.5, 0.80);
    acc += laneContrib(wuv, 0.70, 0.019, 0.24, 76.1, 0.76);

    float totalLight = clamp(acc, 0.0, 1.0);

    // Three-stop colour ramp
    vec3 midCol = mix(uBase,  uAccent, clamp(totalLight * 1.42, 0.0, 1.0));
    vec3 col    = mix(midCol, uWhite,  clamp((totalLight - 0.68) * 3.2, 0.0, 1.0));

    // Left/right edge vignette
    float vx = smoothstep(0.0, 0.10, uv.x) * smoothstep(1.0, 0.90, uv.x);

    float alpha = totalLight * 0.93 * skyMask * vx;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.93));
  }
`;


// ─── StreamFloor ───────────────────────────────────────────────────────────────
function StreamFloor({ speedScale = 0.58, isLight }) {
  const matRef  = useRef();
  const meshRef = useRef();
  const { size, gl } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:   STREAM_VERT,
        fragmentShader: STREAM_FRAG,
        uniforms: {
          uTime:         { value: 0 },
          // #58A366 — matches --color-accent in your dark theme CSS
          uAccent:       { value: isLight ? new THREE.Color(0x37 / 255, 0x5E / 255, 0x2B / 255) : new THREE.Color(0x88 / 255, 0xAD / 255, 0x7C / 255) },
          // Soft warm white for the stream head glow
          uWhite:        { value: isLight ? new THREE.Color(0.2, 0.3, 0.2) : new THREE.Color(0.92, 0.96, 0.90) },
          // Base trail color
          uBase:         { value: isLight ? new THREE.Color(0.95, 0.95, 0.95) : new THREE.Color(0, 0.008, 0) },
          // Initialise to a safe fallback — useEffects below correct it immediately
          uResolution:   { value: new THREE.Vector2(1920, 1080) },
          uPixelDensity: { value: Math.min(window.devicePixelRatio || 1, 2) },
        },
        transparent: true,
        depthWrite:  false,
        blending:    THREE.NormalBlending,
        side:        THREE.DoubleSide,
      }),
    [isLight] // eslint-disable-line
  );

  // Read real canvas size from the DOM element on first mount
  // (runs before the size-change effect so first frame is correct)
  useEffect(() => {
    if (!matRef.current) return;
    const el  = gl.domElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    matRef.current.uniforms.uResolution.value.set(
      el.clientWidth  * dpr,
      el.clientHeight * dpr
    );
    matRef.current.uniforms.uPixelDensity.value = dpr;
  }, [gl]);

  // Keep resolution in sync on resize
  useEffect(() => {
    if (!matRef.current) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    matRef.current.uniforms.uResolution.value.set(
      size.width  * dpr,
      size.height * dpr
    );
    matRef.current.uniforms.uPixelDensity.value = dpr;
  }, [size]);

  const timeRef = useRef(0);
  useFrame((state, delta) => {
    if (!matRef.current) return;
    timeRef.current += delta;
    matRef.current.uniforms.uTime.value = timeRef.current * speedScale;
  });

  const planeW = size.width < 768 ? 40 : 32;

  return (
    <mesh ref={meshRef} position={[0, -1.18, -7.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[planeW, 40, 2, 2]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}


// ─── CameraRig ─────────────────────────────────────────────────────────────────
function CameraRig({ speedScale = 0.58 }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, -1.08, -10.8), []);

  useEffect(() => {
    const w = size.width;
    camera.fov  = w < 480 ? 90 : w < 768 ? 80 : w < 1280 ? 65 : 58;
    camera.near = 0.1;
    camera.far  = 120;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta;
    const t       = timeRef.current * speedScale;
    const w       = size.width;
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


// ─── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ speedScale, isLight }) {
  return (
    <>
      <fog attach="fog" args={[isLight ? "#ffffff" : "#000000", 8, 26]} />
      <CameraRig speedScale={speedScale} />
      <StreamFloor speedScale={speedScale} isLight={isLight} />
    </>
  );
}


// ─── HeroBackground ────────────────────────────────────────────────────────────
function HeroBackground({ className = "" }) {
  const { isMobile, constrainedDevice } = useAdaptiveUi();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const speedScale = constrainedDevice ? 0.34 : 0.52;
  const dpr = useMemo(() => (isMobile ? [1, 1.25] : [1, 1.75]), [isMobile]);

  const bgHex = isLight ? "255,255,255" : "0,0,0";

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
          <Scene speedScale={speedScale} isLight={isLight} />
        </Suspense>
      </Canvas>

      {/* Edge fades only — blends near/far edges of the floor plane into the
          surrounding page. No radial bloom, no haze, no decorative effects. */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top,
              rgba(${bgHex},0.90) 0%,
              rgba(${bgHex},0.45) 18%,
              transparent 58%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              rgba(${bgHex},0.88) 0%,
              rgba(${bgHex},0.38) 16%,
              transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(HeroBackground);