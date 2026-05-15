/**
 * HeroBackground.jsx
 *
 * Cinematic flowing digital intelligence stream.
 * Binary data highways moving beneath the viewer.
 *
 * Stack: React Three Fiber + Drei
 * Install: npm install three @react-three/fiber @react-three/drei
 */

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const BG = "#000000";

const STREAM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STREAM_FRAG = `
   precision mediump float;

   uniform float uTime;
   uniform vec3  uAccent;
   uniform vec2  uResolution;
   uniform float uScale;
   varying vec2  vUv;

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
     float perspRatio
   ) {
     float scaledLaneW = laneW * uScale;
     float halfW = scaledLaneW * 0.5;
     float dx = uv.x - laneX;
     if (abs(dx) > halfW) return 0.0;
     float lx = (dx / scaledLaneW) + 0.5;

     float aspect = uResolution.x / max(uResolution.y, 1.0);
     float charH  = scaledLaneW * aspect * 1.9;

    float scrollY = uTime * speed;
    float cellY   = floor((uv.y + scrollY) / charH);
    float localY  = fract((uv.y + scrollY) / charH);

    float h     = hash(seed + hash2(vec2(seed * 0.1, cellY)));
    float flip  = floor(uTime / (0.35 + hash2(vec2(laneX, seed)) * 0.55));
    float digit = step(0.5, hash(h + flip * 9.3));

    float glyph = 0.0;
    if (digit > 0.5) {
      float bar = step(0.28, lx) * step(lx, 0.72)
                * step(0.05, localY) * step(localY, 0.90);
      glyph = bar;
    } else {
      float outer = step(0.08, lx) * step(lx, 0.92)
                  * step(0.05, localY) * step(localY, 0.92);
      float inner = step(0.26, lx) * step(lx, 0.74)
                  * step(0.20, localY) * step(localY, 0.78);
      glyph = clamp(outer - inner, 0.0, 1.0);
    }

    float headPhase = fract(seed * 0.6173 + uTime * speed * 0.065);
    float headY     = headPhase;
    float headDist  = abs(uv.y - headY);
    float headGlow  = exp(-headDist * 22.0) * 2.8;

    float aboveHead = clamp((uv.y - headY) / 0.55, 0.0, 1.0);
    float trailMask = exp(-aboveHead * 3.5);

    float depthFade = 1.0 - perspRatio * 0.60;

    return clamp((glyph * trailMask + headGlow) * depthFade, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;

    float skyMask = smoothstep(0.82, 0.42, uv.y);

    float vp = pow(clamp(uv.y, 0.0, 1.0), 0.55);
    float cx = (uv.x - 0.5) * mix(1.0, 0.25, vp) + 0.5;
    vec2 wuv = vec2(cx, uv.y);

    float acc = 0.0;

    /* near lanes */
    acc += laneContrib(wuv, 0.10, 0.072, 0.60, 1.00, 0.05);
    acc += laneContrib(wuv, 0.32, 0.068, 0.55, 4.30, 0.08);
    acc += laneContrib(wuv, 0.55, 0.074, 0.65, 8.70, 0.06);
    acc += laneContrib(wuv, 0.78, 0.070, 0.58, 13.1, 0.07);

    /* mid lanes */
    acc += laneContrib(wuv, 0.20, 0.046, 0.40, 20.5, 0.38);
    acc += laneContrib(wuv, 0.43, 0.042, 0.38, 25.9, 0.40);
    acc += laneContrib(wuv, 0.66, 0.044, 0.43, 31.2, 0.37);

    /* far lanes */
    acc += laneContrib(wuv, 0.30, 0.026, 0.22, 40.0, 0.78);
    acc += laneContrib(wuv, 0.52, 0.024, 0.20, 46.5, 0.80);
    acc += laneContrib(wuv, 0.72, 0.028, 0.25, 52.1, 0.76);

    /* flow bands */
    float bands = 0.0;
    for (int b = 0; b < 5; b++) {
      float f    = float(b);
      float bspd = 0.028 + f * 0.008;
      float bseed= f * 0.4173;
      float bY   = fract(bseed + uTime * bspd);
      float bW   = 0.035 + hash(f * 3.7) * 0.025;
      float d    = abs(uv.y - bY) / bW;
      float fade = smoothstep(1.0, 0.0, uv.y * 1.1);
      float xfade= smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
      bands += exp(-d * d * 1.8) * fade * xfade * 0.18;
    }

    float totalLight = clamp(acc, 0.0, 1.0);
    float bloom      = totalLight * totalLight * 0.45;

    vec3 dimGreen = vec3(0.01, 0.07, 0.01);
    vec3 col      = mix(dimGreen, uAccent, totalLight);
    col          += uAccent * bloom;
    col          += uAccent * bands * 0.9;

    float hazeY = smoothstep(0.45, 0.78, uv.y);
    col        += vec3(0.0, 0.06, 0.01) * hazeY * 0.4;

    float vx    = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    float alpha = (totalLight * 0.95 + bands * 0.6) * skyMask * vx;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.94));
  }
`;

// ─────────────────────────────────────────────
// PERSPECTIVE FLOOR
// ─────────────────────────────────────────────

function StreamFloor() {
  const matRef  = useRef();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:   STREAM_VERT,
        fragmentShader: STREAM_FRAG,
        uniforms: {
          uTime:       { value: 0 },
          uAccent:     { value: new THREE.Color(183 / 255, 255 / 255, 153 / 255) },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uScale:      { value: 1.0 },
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
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uResolution.value.set(s.width, s.height);
    // Scale down lane widths on mobile for better visibility
    const scale = s.width < 768 ? 0.55 : 1.0;
    matRef.current.uniforms.uScale.value = scale;
  });

  return (
    <mesh position={[0, -1.18, -7.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[22, 34, 1, 1]} />
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, -1.08, -10.8), []);

  useEffect(() => {
    camera.fov = size.width < 768 ? 68 : 58;
    camera.near = 0.1;
    camera.far = 80;
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.set(
      Math.sin(t * 0.18) * 0.18,
      1.08 + Math.sin(t * 0.12) * 0.035,
      5.9
    );
    target.x = Math.sin(t * 0.16) * 0.35;
    camera.lookAt(target);
  });

  return null;
}

// ─────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 7, 24]} />
      <CameraRig />
      <StreamFloor />
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

export default function HeroBackground({ className = "" }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: BG }}
      aria-hidden="true"
    >
      {/* Bottom darkness */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: `linear-gradient(
            to top,
            rgba(0,0,0,0.94) 0%,
            rgba(0,0,0,0.58) 13%,
            rgba(0,0,0,0.18) 30%,
            transparent 56%
          )`,
        }}
      />

      {/* Top sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.96) 0%,
            rgba(0,0,0,0.68) 18%,
            rgba(0,0,0,0.24) 40%,
            transparent 60%
          )`,
        }}
      />

      {/* Horizon bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `radial-gradient(
            ellipse 64% 14% at 50% 56%,
            rgba(183,255,153,0.085) 0%,
            transparent 100%
          )`,
        }}
      />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.08, 5.9], fov: 58, near: 0.1, far: 80 }}
        gl={{
          antialias:       false,
          alpha:           false,
          powerPreference: "high-performance",
          toneMapping:     THREE.NoToneMapping,
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
