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
        powerPreference: ctx.simplified ? 'low-power' : 'high-performance',
      });
    } catch {
      // WebGL unavailable (old mobile browser, WebView, etc.)
      return;
    }

    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
    el.appendChild(renderer.domElement);

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
    const dotTex = buildDotMapTexture(isLight, 1.6);

    // The globe itself must not occlude the far hemisphere: this is a
    // see-through globe. Instead, only opaque map dots write depth. With both
    // sides rendered, far-side land remains visible through empty globe space,
    // while a nearer land dot still prevents another map dot behind it from
    // showing through at the same screen position.
    const globeFront = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, sphereSegments, sphereSegments),
      new THREE.MeshBasicMaterial({
        map: dotTex, transparent: true, opacity: 1.0,
        alphaTest: 0.01, depthWrite: true, side: THREE.DoubleSide,
      }),
    );
    globeFront.renderOrder = 1;
    globe.add(globeFront);

    // Raised "terrain" pins on every land dot: each flat dot that forms the map
    // gets a short radial cylinder standing out of the surface, so the map reads
    // as raised high ground. The cylinder keeps the footprint of the flat dot —
    // it only lifts the dot up, it does not reshape it into a spike.
    const pinR   = getDotRadius(1.6);
    const pinLen = 0.02;
    const landDots = buildLandDots(1.6);
    const pins = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(pinR, pinR, pinLen, 8),
      new THREE.MeshBasicMaterial({ depthWrite: true }),
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

    sceneRef.current = { renderer, scene, camera, globe };

    let rafId = 0;
    let last = 0;
    let visible = true;
    let rotationY = globe.rotation.y;

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (last > 0) {
        const dt = now - last;
        rotationY += dt * (live.current.simplified ? 0.00040 : 0.00050);
        globe.rotation.y = rotationY;
      }
      last = now;
      renderer.render(scene, camera);
    };

    const start = () => {
      if (rafId || !visible) return;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const viewObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0 });
    viewObserver.observe(el);

    start();

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(el);

    return () => {
      viewObserver.disconnect();
      resizeObserver.disconnect();
      stop();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.forceContextLoss();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [isSimplified, isLight]);

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
