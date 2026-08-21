import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import { buildDotMapTexture, buildLandDots, latLngToVec3, getDotRadius, getMapColors, isBlackRegion } from './helpers';
import { useFluidGlobe } from './useFluidGlobe';

interface HackerGlobeProps {
  scale?: number;
  offset?: [number, number, number];
  fluid?: boolean;
}

interface GlobeScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  globe: THREE.Group;
}

const HackerGlobe: React.FC<HackerGlobeProps> = ({ scale = 0.88, offset = [0, 0, 0], fluid = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const isSimplified = constrainedDevice || isMobile;
  const fluidGlobe = useFluidGlobe();
  const effectiveScale = fluid ? fluidGlobe.scale : scale;
  const effectiveOffset = fluid ? fluidGlobe.offset : offset;

  // Live values read inside the animation loop so changing them never
  // restarts the WebGL scene.
  const live = useRef({ scale: effectiveScale, offset: effectiveOffset, simplified: isSimplified });
  live.current = { scale: effectiveScale, offset: effectiveOffset, simplified: isSimplified };

  const sceneRef = useRef<GlobeScene | null>(null);

  // The target-country voids are theme-inverted (white on dark, black on
  // light). Track the theme reactively so toggling it rebuilds the globe.
  const [isLight, setIsLight] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light',
  );

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsLight(el.getAttribute('data-theme') === 'light');
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Mount / unmount the WebGL scene exactly once. Resizes and fluid size
  // changes are applied in place — the context is never torn down — so the
  // globe cannot flicker, disappear, or stutter while scrolling (mobile
  // browser URL-bar height changes used to trigger a full re-init every
  // scroll tick).
  //
  // The rotation is driven by elapsed wall-clock time, so dropped or
  // throttled frames during a scroll never make the globe pause or run in
  // slow motion — it always renders at the angle the real clock says it
  // should be at. The loop only stops while the globe is off-screen.
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const ctx = live.current;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: ctx.simplified ? 'low-power' : 'default',
        failIfMajorPerformanceCaveat: false,
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: 'default',
        });
      } catch {
        // WebGL completely unavailable (old mobile browser, WebView, etc.)
        return;
      }
    }

    const w = Math.max(el.clientWidth, 1);
    const h = Math.max(el.clientHeight, 1);
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ctx.simplified ? 1 : 1.25));
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;width:100%;height:100%;';
    el.appendChild(renderer.domElement);

    // Handle context loss gracefully
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const handleContextRestored = () => {
      start();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.z = 2.1;
    camera.lookAt(0, 0, 0);

    const globe = new THREE.Group();
    globe.scale.setScalar(ctx.scale);
    globe.position.set(ctx.offset[0], ctx.offset[1], ctx.offset[2]);
    globe.rotation.y = -1.9;
    scene.add(globe);

    const sphereSegments = ctx.simplified ? 32 : 64;

    // The dot-map texture and instanced pins are built off the critical path so
    // the first paint and the initial frames are never blocked by synchronous
    // texture generation or instancing (the biggest load-time jank source on
    // slower machines).
    let cancelled = false;
    let buildTimer = 0;
    let sceneReady = false;

    const buildScene = () => {
      if (cancelled || sceneReady) return;

      const dotTex = buildDotMapTexture(isLight, 1.6);

      const globeFront = new THREE.Mesh(
        new THREE.SphereGeometry(1.0, sphereSegments, sphereSegments),
        new THREE.MeshBasicMaterial({
          map: dotTex, transparent: true, opacity: 1.0,
          alphaTest: 0.01, depthWrite: true, side: THREE.DoubleSide,
        }),
      );
      globeFront.renderOrder = 1;
      globe.add(globeFront);

      // Raised pins on every land dot — smooth rounded bumps, softly translucent,
      // with no edge outlines so the dot map reads clean instead of brick-like.
      const pinR   = getDotRadius(1.6);
      const pinLen = 0.014;
      const landDots = buildLandDots(1.6);
      const cylGeo = new THREE.CylinderGeometry(pinR, pinR, pinLen, 16);
      const pins = new THREE.InstancedMesh(
        cylGeo,
        new THREE.MeshBasicMaterial({ depthWrite: true, transparent: true, opacity: 0.7 }),
        landDots.length,
      );

      const pinMatrix = new THREE.Matrix4();
      const pinQuat = new THREE.Quaternion();
      const yUp = new THREE.Vector3(0, 1, 0);
      const unit = new THREE.Vector3(1, 1, 1);
      const { land, region } = getMapColors(isLight);

      landDots.forEach((d, i) => {
        const dir = latLngToVec3(d.lat, d.lng, 1).normalize();
        const center = dir.clone().multiplyScalar(1.001 + pinLen / 2);
        pinQuat.setFromUnitVectors(yUp, dir);
        pinMatrix.compose(center, pinQuat, unit);
        pins.setMatrixAt(i, pinMatrix);
        pins.setColorAt(i, isBlackRegion(d.lat, d.lng) ? region : land);
      });

      pins.instanceMatrix.needsUpdate = true;
      if (pins.instanceColor) pins.instanceColor.needsUpdate = true;
      pins.renderOrder = 3;
      globe.add(pins);

      // Apply the freshest fluid sizing now that the globe is ready.
      globe.scale.setScalar(live.current.scale);
      globe.position.set(live.current.offset[0], live.current.offset[1], live.current.offset[2]);

      sceneReady = true;
      sceneRef.current = { renderer, scene, camera, globe };
      start();
    };

    let rafId = 0;
    let last = 0;
    let visible = true;
    let rotationY = globe.rotation.y;
    let targetScrollRotation = 0;
    let currentScrollRotation = 0;

    const snapEl = document.querySelector('.snap-container');

    // While a scroll gesture is in flight the render loop is frozen so the
    // canvas never competes with the browser compositor mid-snap. Rotation
    // is wall-clock driven, so it catches up seamlessly on resume.
    let scrollSettleTimer = 0;
    const handleScroll = () => {
      targetScrollRotation = (snapEl ? snapEl.scrollTop : window.scrollY) * 0.0003;
      stop();
      clearTimeout(scrollSettleTimer);
      scrollSettleTimer = window.setTimeout(start, 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (snapEl) snapEl.addEventListener('scroll', handleScroll, { passive: true });

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const FRAME_BUDGET = 1000 / 30; // 30 fps cap — enough for a slow decorative rotation
    let lastRenderFrame = 0;
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      
      // Always update timing and rotation, even if we skip rendering.
      // The cap at 200 ms only prevents huge jumps on tab-refocus; it
      // never throttles the normal per-frame rotation so the globe
      // always tracks wall-clock time accurately.
      if (last > 0) {
        const dt = Math.min(now - last, 200);
        const scrollFactor = 1 - Math.pow(0.88, dt / 16.667);
        currentScrollRotation += (targetScrollRotation - currentScrollRotation) * scrollFactor;
        rotationY += dt * (live.current.simplified ? 0.00035 : 0.00045);
        globe.rotation.y = rotationY + currentScrollRotation;
      }
      last = now;
      
      // Throttle render to 30 fps. Rotation is wall-clock driven so the
      // globe stays smooth even when frames are dropped.
      if (now - lastRenderFrame < FRAME_BUDGET) return;
      lastRenderFrame = now;
      
      // Only render if we have a valid renderer and scene
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const start = () => {
      if (rafId || !visible) return;
      // Do NOT reset `last` here — if the globe was paused (off-screen),
      // the next tick's dt will be the pause duration (capped at 200 ms),
      // so the rotation "catches up" to the correct wall-clock angle
      // instead of freezing for one frame.
      rafId = requestAnimationFrame(tick);
    };

    let debounceTimer = 0;
    const viewObserver = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0].isIntersecting;
      if (isIntersecting) {
        clearTimeout(debounceTimer);
        visible = true;
        start();
      } else {
        // Delay stopping to avoid rapid pause/resume during snap-scrolling
        debounceTimer = window.setTimeout(() => {
          visible = false;
          stop();
        }, 600);
      }
    }, { threshold: 0, rootMargin: '300px' });
    viewObserver.observe(el);

    const handleVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Kick off the heavy build after the current task so the first paint is
    // not blocked by texture generation / instancing.
    buildTimer = window.setTimeout(buildScene, 0);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0 && renderer) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(el);

    return () => {
      cancelled = true;
      clearTimeout(buildTimer);
      clearTimeout(debounceTimer);
      clearTimeout(scrollSettleTimer);
      window.removeEventListener('scroll', handleScroll);
      if (snapEl) snapEl.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      viewObserver.disconnect();
      resizeObserver.disconnect();
      stop();
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      if (renderer) {
        renderer.forceContextLoss();
        renderer.dispose();
      }
      sceneRef.current = null;
    };
  }, [isLight]); // isSimplified read from live.current — no scene rebuild on mobile toggle

  // Fluid scale / offset changes are applied in place — no scene rebuild.
  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;
    state.globe.scale.setScalar(effectiveScale);
    state.globe.position.set(effectiveOffset[0], effectiveOffset[1], effectiveOffset[2]);
  }, [effectiveScale, effectiveOffset]);

  return (
    <motion.div
      ref={mountRef}
      className="relative z-0 h-full w-full pointer-events-none overflow-hidden"
      style={{ cursor: 'default' }}
    />
  );
};

export default React.memo(HackerGlobe);
