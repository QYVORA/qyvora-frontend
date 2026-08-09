import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import { buildDotMapTexture } from './helpers';
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
  rafId: number;
  last: number;
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

  // Mount / unmount the WebGL scene exactly once. Resizes and fluid size
  // changes are applied in place — the context is never torn down — so the
  // globe cannot flicker, disappear, or stutter while scrolling (mobile
  // browser URL-bar height changes used to trigger a full re-init every
  // scroll tick).
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
    const dotTex = buildDotMapTexture(false, 1.6);

    const globeBack = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, sphereSegments, sphereSegments),
      new THREE.MeshBasicMaterial({
        map: dotTex, transparent: true, opacity: 0.55,
        depthWrite: false, side: THREE.BackSide,
      }),
    );
    globeBack.renderOrder = 1;
    globe.add(globeBack);

    const globeFront = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, sphereSegments, sphereSegments),
      new THREE.MeshBasicMaterial({
        map: dotTex, transparent: true, opacity: 1.0,
        depthWrite: false, side: THREE.FrontSide,
      }),
    );
    globeFront.renderOrder = 2;
    globe.add(globeFront);

    const state: GlobeScene = {
      renderer,
      scene,
      camera,
      globe,
      rafId: 0,
      last: 0,
    };

    const frame = (now: number) => {
      state.rafId = requestAnimationFrame(frame);
      const dt = Math.min(now - state.last, 50);
      state.last = now;
      state.globe.rotation.y += dt * (live.current.simplified ? 0.00040 : 0.00050);
      state.renderer.render(state.scene, state.camera);
    };
    state.rafId = requestAnimationFrame(frame);

    sceneRef.current = state;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        state.renderer.setSize(width, height);
        state.camera.aspect = width / height;
        state.camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(state.rafId);
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
  }, [isSimplified]);

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
