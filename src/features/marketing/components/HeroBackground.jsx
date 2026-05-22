/**
 * HeroBackground.jsx
 *
 * This component renders a cinematic "Matrix-style" falling binary digits
 * (0s and 1s) using WebGL shaders inside a React Three Fiber (R3F) canvas.
 *
 * HIGH-LEVEL ARCHITECTURE:
 *   HeroBackground          ← The React component you mount in your app
 *     └─ <Canvas>           ← R3F: creates a WebGL rendering context
 *          └─ <Scene>       ← Groups the 3D scene together
 *               ├─ <fog>   ← Makes distant things fade to black
 *               ├─ CameraRig  ← Animates the camera position over time
 *               └─ StreamFloor  ← The flat plane that renders the shader
 *
 * LIBRARIES USED:
 *   - react-three-fiber (@react-three/fiber) : connects React to Three.js
 *   - three (THREE)                          : 3D math + WebGL objects
 */

// ─── Imports ──────────────────────────────────────────────────────────────────

import React, { Suspense, useRef, useMemo, useEffect } from "react";

// Canvas      → creates the WebGL surface
// useFrame    → callback that runs every animation frame (~60fps)
// useThree    → access the Three.js renderer, camera, scene, and canvas size
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

// Custom hook (from your own codebase) that tells us if we are on a
// mobile or "constrained" (low-end / battery-saving) device.
import { useAdaptiveUi } from "../../../core/hooks/useAdaptiveUi";


// ─── GLSL Shader Strings ───────────────────────────────────────────────────────
//
// GLSL (OpenGL Shading Language) is a C-like language that runs on the GPU.
// There are two types of shaders working together:
//
//   VERTEX SHADER   → runs once per VERTEX (corner of a triangle).
//                     Its job: transform 3D positions into 2D screen positions.
//
//   FRAGMENT SHADER → runs once per PIXEL inside each triangle.
//                     Its job: decide what COLOR to paint that pixel.
//
// The two shaders communicate via "varying" variables:
//   vUv is written in the vertex shader and read in the fragment shader.


// ── Vertex Shader ──────────────────────────────────────────────────────────────
const STREAM_VERT = `
  // "varying" = variable passed FROM vertex shader TO fragment shader
  // vUv holds the UV texture coordinate of this vertex (0,0 = bottom-left,
  // 1,1 = top-right). We use it in the fragment shader to know WHERE on the
  // plane a pixel sits.
  varying vec2 vUv;

  void main() {
    // Pass the UV through unchanged to the fragment shader
    vUv = uv;

    // Standard MVP transform: converts 3D model-space position → 2D clip-space.
    // projectionMatrix  → camera lens (perspective / FOV)
    // modelViewMatrix   → object position × camera position
    // position          → this vertex's local 3D position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;


// ── Fragment Shader ────────────────────────────────────────────────────────────
//
// This is the heart of the visual effect.  For every pixel on the plane,
// it calculates:
//   1. Which "lane" (vertical column) the pixel belongs to
//   2. What digit (0 or 1) should appear in this cell
//   3. A falling "head glow" + trail fade
//   4. Horizontal flow bands for depth
//   5. Final colour + alpha with bloom and vignette
//
const STREAM_FRAG = `
  // Request maximum floating-point precision on the GPU
  precision highp float;

  // ── "uniform" variables ──────────────────────────────────────────────────
  // Uniforms are values we set FROM JavaScript and they stay the same for
  // every pixel in a single frame (unlike varyings which differ per pixel).

  uniform float uTime;         // seconds since start (drives animation)
  uniform vec3  uAccent;       // the green highlight colour (RGB 0-1)
  uniform vec2  uResolution;   // canvas size in PHYSICAL pixels (width, height)
  uniform float uPixelDensity; // device pixel ratio (1 on normal, 2 on Retina)

  // UV coordinate received from the vertex shader
  varying vec2  vUv;


  // ── Utility: hash functions ──────────────────────────────────────────────
  //
  // A "hash" is a cheap pseudo-random function: given the same input it
  // always returns the same output, but small input changes → big output changes.
  // GPUs have no random() — we fake randomness with sin() math tricks.

  // hash(n): maps a single float → float in [0, 1)
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
    // fract() = fractional part (strips the integer), giving a value 0-1
    // sin() changes wildly for large multiplications of n → looks random
  }

  // hash2(p): maps a 2D coordinate → float in [0, 1)
  // dot(p, magic) = mix x and y together into one number before sin()
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }


  // ── laneContrib ─────────────────────────────────────────────────────────
  //
  // This function returns the brightness (0-1) contributed by ONE lane
  // of falling digits at a given UV position.
  //
  // Parameters:
  //   uv     → the current pixel's UV coordinate (after perspective warp)
  //   laneX  → horizontal centre of the lane in UV space (0 = left, 1 = right)
  //   laneW  → width of the lane in UV space
  //   speed  → how fast digits scroll down (bigger = faster)
  //   seed   → unique random seed so each lane looks different
  //   perspR → perspective ratio: 0 = near/bottom, 1 = far/horizon
  //            used to fade out lanes that should appear distant

  float laneContrib(
    vec2  uv,
    float laneX,
    float laneW,
    float speed,
    float seed,
    float perspR
  ) {
    float halfW = laneW * 0.5;
    float dx    = uv.x - laneX;  // horizontal distance from lane centre

    // Early exit: if the pixel is outside this lane, contribute nothing
    if (abs(dx) > halfW) return 0.0;

    // lx = normalised position WITHIN the lane: 0 = left edge, 1 = right edge
    float lx = (dx / laneW) + 0.5;


    // ── Cell sizing ──────────────────────────────────────────────────────
    // We want each digit cell to be exactly charPixels tall on screen.
    // charPixels is in PHYSICAL pixels (accounts for Retina displays).
    // Dividing by uResolution.y converts it to UV-space (0-1 range).
    float charPixels = 11.0 * uPixelDensity;  // ~11 physical pixels per cell
    float charH      = charPixels / uResolution.y; // cell height in UV space


    // ── Scrolling grid ───────────────────────────────────────────────────
    // uTime * speed = how far we have scrolled so far (in UV units)
    // floor() snaps the offset to the nearest cell → integer cell index
    // fract() gives fractional progress within the current cell (0 → 1)
    float scrollY = uTime * speed;
    float cellY   = floor((uv.y + scrollY) / charH); // which cell row we are in
    float localY  = fract((uv.y + scrollY) / charH); // 0-1 within the cell row


    // ── Which digit: 0 or 1? ─────────────────────────────────────────────
    // h = a stable random value for this cell (based on lane seed + row index)
    float h = hash(seed + hash2(vec2(seed * 0.1, cellY)));

    // flip = integer that increments every 0.3-0.8 seconds (random per lane).
    // Multiplying by 9.3 shifts h enough to flip the digit.
    float flip  = floor(uTime / (0.30 + hash2(vec2(laneX, seed)) * 0.50));
    float digit = step(0.5, hash(h + flip * 9.3));
    // step(0.5, x): returns 0 if x < 0.5, else 1  → binary 0 or 1


    // ── Glyph drawing ────────────────────────────────────────────────────
    // We draw simple pixel-art glyphs using box functions.
    // step(a, x) * step(x, b) = 1 only when a ≤ x ≤ b  (a box test)

    float glyph = 0.0;

    if (digit > 0.5) {
      // ── Draw "1": a narrow vertical bar in the centre of the cell ──
      glyph = step(0.34, lx) * step(lx, 0.66)      // horizontal: middle third
            * step(0.06, localY) * step(localY, 0.88); // vertical: most of cell
    } else {
      // ── Draw "0": a hollow rectangle ──
      // outer box
      float outer = step(0.10, lx) * step(lx, 0.90)
                  * step(0.06, localY) * step(localY, 0.90);
      // inner cutout (subtracting this makes it hollow)
      float inner = step(0.28, lx) * step(lx, 0.72)
                  * step(0.22, localY) * step(localY, 0.76);
      // clamp ensures the subtraction can't go below 0
      glyph = clamp(outer - inner, 0.0, 1.0);
    }


    // ── Falling head glow ────────────────────────────────────────────────
    // Each lane has a bright "head" (the front of the falling stream) that
    // moves from top (1.0) to bottom (0.0) of the screen.
    // headPhase cycles 0→1 over time at a rate proportional to speed.
    float headPhase = fract(seed * 0.6173 + uTime * speed * 0.065);
    float headY     = headPhase;  // current Y position of the head (UV space)
    float headDist  = abs(uv.y - headY); // distance from the pixel to the head

    // exp(-x * k): creates a soft bell-shaped glow that falls off quickly.
    // 28.0 controls how tight/small the glow is; 3.2 controls brightness.
    float headGlow = exp(-headDist * 28.0) * 3.2;


    // ── Trail fade ───────────────────────────────────────────────────────
    // Digits above the head (further along in the trail) should fade out.
    // aboveHead = 0 at the head's position, increases upward.
    // exp(-aboveHead * 4.0) = 1 at the head, fades to ~0 further up.
    float aboveHead = clamp((uv.y - headY) / 0.50, 0.0, 1.0);
    float trailMask = exp(-aboveHead * 4.0);


    // ── Depth / perspective fade ─────────────────────────────────────────
    // perspR ≈ 0 for near lanes (full brightness), ≈ 1 for far lanes (dimmer).
    // This makes distant lanes look further away.
    float depthFade = 1.0 - perspR * 0.55;

    // Final brightness: glyph shape × trail fade + head glow, × depth fade
    return clamp((glyph * trailMask + headGlow) * depthFade, 0.0, 1.0);
  }


  // ── main ─────────────────────────────────────────────────────────────────
  // Called once per pixel.  Combines all lane contributions into a final colour.

  void main() {
    vec2 uv = vUv;  // UV of the current pixel (0,0 bottom-left → 1,1 top-right)


    // ── Sky mask ─────────────────────────────────────────────────────────
    // smoothstep(edge0, edge1, x): smooth 0→1 transition between edge0 and edge1
    // Here: at uv.y = 0.85 (near top) → 0; at uv.y = 0.38 (mid) → 1
    // This fades out the digits near the "horizon" / top of the plane.
    float skyMask = smoothstep(0.85, 0.38, uv.y);


    // ── Perspective warp ─────────────────────────────────────────────────
    // In real life, parallel lines converge at a vanishing point.
    // We fake this by squeezing the x-axis more for pixels near the top (horizon).
    //
    // pow(uv.y, 0.5): "vp" ranges 0 (bottom) → 1 (top). Using pow < 1 makes
    // the compression happen gradually.
    float vp = pow(clamp(uv.y, 0.0, 1.0), 0.50);

    // mix(1.0, 0.22, vp): at y=0 (near) width = 1.0; at y=1 (far) width = 0.22
    // Shrinks horizontal spread near the horizon.
    float cx = (uv.x - 0.5) * mix(1.0, 0.22, vp) + 0.5;

    // wuv = warped UV coordinates used for all lane sampling
    vec2  wuv = vec2(cx, uv.y);


    // ── Sum all lane contributions ────────────────────────────────────────
    // We call laneContrib for each lane and add up the brightness.
    // Parameters: (uv, centreX, width, speed, seed, perspectiveRatio)
    float acc = 0.0;

    // Near lanes: wide columns, fast speed, low perspR (bright, in-your-face)
    acc += laneContrib(wuv, 0.10, 0.050, 0.62,  1.00, 0.04);
    acc += laneContrib(wuv, 0.25, 0.045, 0.57,  4.30, 0.06);
    acc += laneContrib(wuv, 0.40, 0.052, 0.66,  8.70, 0.05);
    acc += laneContrib(wuv, 0.55, 0.048, 0.60, 13.1,  0.06);
    acc += laneContrib(wuv, 0.70, 0.050, 0.63, 17.5,  0.05);
    acc += laneContrib(wuv, 0.85, 0.046, 0.58, 22.0,  0.07);

    // Mid lanes: medium width and speed (transition zone)
    acc += laneContrib(wuv, 0.18, 0.032, 0.42, 31.0, 0.36);
    acc += laneContrib(wuv, 0.38, 0.030, 0.38, 36.5, 0.38);
    acc += laneContrib(wuv, 0.58, 0.033, 0.44, 42.1, 0.37);
    acc += laneContrib(wuv, 0.78, 0.031, 0.40, 47.8, 0.39);

    // Far lanes: narrow columns, slow speed, high perspR (dim, distant)
    acc += laneContrib(wuv, 0.30, 0.018, 0.22, 64.0, 0.77);
    acc += laneContrib(wuv, 0.50, 0.017, 0.20, 70.5, 0.80);
    acc += laneContrib(wuv, 0.70, 0.019, 0.24, 76.1, 0.76);


    // ── Horizontal flow bands ─────────────────────────────────────────────
    // Subtle horizontal stripes that slowly drift upward to add depth / haze.
    float bands = 0.0;
    for (int b = 0; b < 7; b++) {
      float f    = float(b);                            // 0, 1, 2 … 6
      float bspd = 0.020 + f * 0.006;                  // each band has unique speed
      float bseed= f * 0.4173;                          // offset its phase
      float bY   = fract(bseed + uTime * bspd);        // current vertical position (0-1, looping)
      float bW   = 0.030 + hash(f * 3.7) * 0.020;     // slight variation in band thickness

      float d    = abs(uv.y - bY) / bW;               // normalised distance from band centre

      // Fade bands near the top and bottom edges (so they don't look clipped)
      float fade = smoothstep(0.0, 0.20, uv.y) * smoothstep(1.0, 0.78, uv.y);
      // Also fade near left/right edges
      float xfade= smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);

      // Gaussian band: bright at centre, soft falloff, multiplied by 0.14 to keep subtle
      bands += exp(-d * d * 2.0) * fade * xfade * 0.14;
    }


    // ── Final colour calculation ──────────────────────────────────────────

    float totalLight = clamp(acc, 0.0, 1.0); // total lane brightness (0-1)

    // bloom: squaring makes bright spots extra bright (simulates lens bloom)
    float bloom = totalLight * totalLight * 0.40;

    // Base colour: very dark green in the shadows
    vec3 dimGreen = vec3(0.005, 0.05, 0.005); // almost black-green

    // mix(a, b, t): linearly blend from dimGreen (t=0) to uAccent green (t=1)
    vec3 col = mix(dimGreen, uAccent, totalLight);

    // Add bloom highlight on top of bright pixels
    col += uAccent * bloom;

    // Add the horizontal bands tinted with the accent colour
    col += uAccent * bands * 0.85;

    // Subtle horizon haze: brightens near y = 0.8 (where floor meets sky)
    float hazeY = smoothstep(0.40, 0.80, uv.y);
    col += vec3(0.0, 0.05, 0.01) * hazeY * 0.35;

    // Vignette: darken pixels near the left and right screen edges
    float vx = smoothstep(0.0, 0.10, uv.x) * smoothstep(1.0, 0.90, uv.x);

    // Alpha (opacity): dim pixels get near-transparent, bright ones nearly opaque
    // skyMask fades everything toward the horizon; vx adds edge vignette
    float alpha = (totalLight * 0.93 + bands * 0.55) * skyMask * vx;

    // Output: RGBA colour for this pixel
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.93));
  }
`;


// ─── StreamFloor ──────────────────────────────────────────────────────────────
//
// A flat 3D plane (like the floor of a room) that stretches out into the distance.
// The falling digit effect is painted onto it via the shader above.
// speedScale slows the animation on low-end devices.

function StreamFloor({ speedScale = 0.58 }) {
  // matRef  → direct reference to the ShaderMaterial so we can update uniforms
  // meshRef → direct reference to the Mesh (not actually used beyond creation)
  const matRef  = useRef();
  const meshRef = useRef();

  // size = { width, height } of the canvas in CSS pixels — updates on resize
  const { size } = useThree();

  // useMemo: create the ShaderMaterial ONCE (not on every re-render).
  // A ShaderMaterial is the Three.js object that holds your GLSL shaders
  // and the uniform values passed into them.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader:   STREAM_VERT,   // the GLSL vertex code string
        fragmentShader: STREAM_FRAG,   // the GLSL fragment code string
        uniforms: {
          uTime:         { value: 0 },                           // updated every frame
          uAccent:       { value: new THREE.Color(183/255, 255/255, 153/255) }, // lime-green
          uResolution:   { value: new THREE.Vector2(1, 1) },    // updated on resize
          uPixelDensity: { value: 1.0 },                        // updated on resize
        },
        transparent: true,  // allow partial alpha (the shader writes alpha < 1)
        depthWrite:  false, // don't write to depth buffer (avoids z-fighting with overlapping transparent objects)
        blending:    THREE.NormalBlending, // standard alpha blending
        side:        THREE.DoubleSide,     // visible from above AND below the plane
      }),
    [] // empty deps: only runs once, on mount
  );

  // useEffect: runs when `size` changes (window resize).
  // Keeps the shader's resolution uniform in sync with the actual canvas size.
  useEffect(() => {
    if (!matRef.current) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× to avoid GPU overload
    matRef.current.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    matRef.current.uniforms.uPixelDensity.value = dpr;
  }, [size]);

  // useFrame: runs every animation frame (~60fps).
  // Updates uTime so the digits keep scrolling.
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    // clock.getElapsedTime() = seconds since the canvas started
    // speedScale slows animation on battery-saving / mobile devices
    matRef.current.uniforms.uTime.value = clock.getElapsedTime() * speedScale;
  });

  // Make the plane wide enough to fill ultra-wide monitors.
  // On mobile (< 768px) we use a wider value because the FOV is also larger,
  // so we need the plane to extend further left/right to avoid black edges.
  const planeW = size.width < 768 ? 40 : 32;

  return (
    // <mesh>: a Three.js "game object" — geometry + material = visible thing
    // position: [x, y, z] — placed slightly below and behind the camera
    // rotation: tilt 90° around X so the plane lies flat (like a floor)
    <mesh ref={meshRef} position={[0, -1.18, -7.2]} rotation={[-Math.PI / 2, 0, 0]}>

      {/* planeGeometry: a flat rectangle.
          args = [width, height, widthSegments, heightSegments]
          More segments → smoother perspective warp (the vertex shader only
          warps at corners, so more corners = smoother curve) */}
      <planeGeometry args={[planeW, 40, 2, 2]} />

      {/* Attach our custom ShaderMaterial to this mesh.
          <primitive> lets you use raw Three.js objects in JSX. */}
      <primitive object={material} ref={matRef} attach="material" />
    </mesh>
  );
}


// ─── CameraRig ────────────────────────────────────────────────────────────────
//
// Animates the camera to gently sway and bob, making the scene feel alive.
// No geometry is rendered — this component only manipulates camera properties.

function CameraRig({ speedScale = 0.58 }) {
  const { camera, size } = useThree();

  // The point the camera always looks toward (vanishing point on the floor)
  const target = useMemo(() => new THREE.Vector3(0, -1.08, -10.8), []);

  // Set the camera's field-of-view based on screen width (once on mount/resize).
  // Narrower FOV on wide screens = more telephoto / cinematic.
  // Wider FOV on small/phone screens = fits more in the view.
  useEffect(() => {
    const w = size.width;
    camera.fov  = w < 480 ? 90 : w < 768 ? 80 : w < 1280 ? 65 : 58;
    camera.near = 0.1;   // objects closer than this are clipped
    camera.far  = 120;   // objects further than this are clipped
    camera.updateProjectionMatrix(); // must call this after changing fov/near/far
  }, [camera, size.width]);

  // Every frame: gently oscillate camera position with sin() waves
  useFrame(({ clock }) => {
    const t       = clock.getElapsedTime() * speedScale;
    const w       = size.width;
    const isMob   = w < 768;
    const isSmall = w < 480;

    camera.position.set(
      Math.sin(t * 0.18) * 0.18,  // slow left-right sway (period ≈ 35s)

      // Vertical height: taller on small screens so you can see more of the floor.
      // Plus a tiny bob (sin with small amplitude).
      (isSmall ? 1.60 : isMob ? 1.48 : 1.08) + Math.sin(t * 0.12) * 0.030,

      // Z distance: phones are pulled back further so the plane fills the screen
      isSmall ? 7.8 : isMob ? 7.2 : 5.9
    );

    // Slightly shift the look-target left/right in sync with the camera sway
    target.x = Math.sin(t * 0.16) * 0.30;
    camera.lookAt(target); // rotate the camera to face the target point
  });

  // This component renders nothing — it's a "behaviour only" component
  return null;
}


// ─── Scene ────────────────────────────────────────────────────────────────────
//
// Composes the 3D scene from its pieces.
// Declared separately so <Canvas> can have a clean child structure.

function Scene({ speedScale }) {
  return (
    <>
      {/* Three.js fog: makes objects fade to black beyond a certain distance.
          args = [fogColour, nearDistance, farDistance]
          Near = 8 units, Far = 26 units → gradual fade in that range */}
      <fog attach="fog" args={["#000000", 8, 26]} />

      {/* Animates the camera */}
      <CameraRig speedScale={speedScale} />

      {/* The shader plane */}
      <StreamFloor speedScale={speedScale} />
    </>
  );
}


// ─── HeroBackground ──────────────────────────────────────────────────────────
//
// The public-facing component you drop into your page.
// It creates the WebGL canvas and layers CSS gradient overlays on top
// to blend the shader into the rest of the UI.

function HeroBackground({ className = "" }) {
  // Read device capability from a custom hook:
  //   isMobile        → true on phones (affects DPR cap)
  //   constrainedDevice → true on low-end/battery devices (slows animation)
  const { isMobile, constrainedDevice } = useAdaptiveUi();

  // Slow down on constrained devices to save battery / avoid dropped frames
  const speedScale = constrainedDevice ? 0.34 : 0.52;

  // DPR (device pixel ratio) controls rendering sharpness.
  // [min, max]: R3F will pick the best within this range based on performance.
  // Mobile is capped lower to avoid overdraw on small GPUs.
  const dpr = useMemo(() => (isMobile ? [1, 1.25] : [1, 1.75]), [isMobile]);

  return (
    <div
      // "absolute inset-0" = fill the parent container exactly (Tailwind)
      // overflow-hidden = clip anything that bleeds outside
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "transparent" }}
      aria-hidden="true"  // screen readers skip this decorative element
    >
      {/* ── R3F Canvas (WebGL context) ──────────────────────────────────── */}
      <Canvas
        dpr={dpr}          // pixel ratio range (performance vs sharpness)
        camera={{
          position: [0, 1.08, 5.9], // initial camera position (overridden by CameraRig)
          fov: 58,          // initial field of view in degrees
          near: 0.1,
          far: 120,
        }}
        gl={{
          antialias:       !isMobile,          // smooth edges (skip on mobile = faster)
          alpha:           true,               // transparent canvas background
          powerPreference: "high-performance", // ask GPU driver for best GPU on dual-GPU laptops
          toneMapping:     THREE.NoToneMapping, // disable automatic exposure adjustment
        }}
        performance={{ min: 0.5 }}  // if fps drops, R3F can lower DPR down to 50% to recover
        style={{ width: "100%", height: "100%" }}
      >
        {/* Suspense: while 3D assets are loading show nothing (fallback=null).
            There are no async assets here, but it's good practice for R3F. */}
        <Suspense fallback={null}>
          <Scene speedScale={speedScale} />
        </Suspense>
      </Canvas>


      {/* ── CSS Gradient Overlays ─────────────────────────────────────────
          These are layered ABOVE the canvas (z-10) to:
            1. Blend the bottom edge into the page background
            2. Blend the top edge into the page background
            3. Add a faint green centre bloom to match the accent colour
          pointer-events-none: clicks pass through to the canvas beneath */}
      <div className="absolute inset-0 pointer-events-none z-10">

        {/* Bottom-to-top black fade — hides the near edge of the floor plane */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top,
              rgba(0,0,0,0.90) 0%,    /* fully black at the very bottom */
              rgba(0,0,0,0.45) 18%,   /* half-transparent at 18% up */
              transparent 58%)`,      /* fully transparent by 58% up */
          }}
        />

        {/* Top-to-bottom black fade — hides the top edge / sky area */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              rgba(0,0,0,0.88) 0%,
              rgba(0,0,0,0.38) 16%,
              transparent 55%)`,
          }}
        />

        {/* Radial accent bloom — a very subtle green glow in the screen centre.
            Adds warmth and ties the WebGL colour to the surrounding UI. */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse 55% 18% at 50% 52%,          /* wide flat ellipse at ~centre */
              rgba(183,255,153,0.055) 0%,           /* very faint lime green */
              transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}

// React.memo: wraps the component so it only re-renders when its props change.
// Since HeroBackground has no props that change (it reads everything internally),
// this prevents unnecessary re-renders triggered by parent state updates.
export default React.memo(HeroBackground);