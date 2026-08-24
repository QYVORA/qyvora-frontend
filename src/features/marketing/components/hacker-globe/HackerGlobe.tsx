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

  const live = useRef({ scale: effectiveScale, offset: effectiveOffset, simplified: isSimplified });
  live.current = { scale: effectiveScale, offset: effectiveOffset, simplified: isSimplified };

  const sceneRef = useRef<GlobeScene | null>(null);

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

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const ctx = live.current;
    let renderer: THREE.WebGLRenderer | null = null;
    let mounted = true;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: ctx.simplified ? 'low-power' : 'default',
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
      });
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          preserveDrawingBuffer: false,
        });
      } catch {
        return;
      }
    }

    if (!renderer || !mounted) {
      renderer?.dispose();
      return;
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

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const handleContextRestored = () => {
      if (mounted) start();
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

    let cancelled = false;
    let buildTimer = 0;
    let sceneReady = false;

    const buildScene = () => {
      if (cancelled || sceneReady || !mounted) return;

      try {
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

        globe.scale.setScalar(live.current.scale);
        globe.position.set(live.current.offset[0], live.current.offset[1], live.current.offset[2]);

        sceneReady = true;
        sceneRef.current = { renderer, scene, camera, globe };
        if (visible && mounted) start();
      } catch (err) {
        console.error('[HackerGlobe] Scene build failed:', err);
      }
    };

    let rafId = 0;
    let last = 0;
    let visible = true;
    let rotationY = globe.rotation.y;
    let targetScrollRotation = 0;
    let currentScrollRotation = 0;

    // Scroll only feeds a target rotation that the render loop lerps toward.
    // The loop itself never stops during scrolling — pausing and resuming it
    // here read as stutter because the globe froze mid-scroll, then jumped.
    const syncTargetFromScroll = () => {
      if (!mounted) return;

      const scrollY = snapEl ? snapEl.scrollTop : window.scrollY;
      targetScrollRotation = scrollY * 0.0003;
    };

    const snapEl = document.querySelector('.snap-container');

    window.addEventListener('scroll', syncTargetFromScroll, { passive: true });
    if (snapEl) snapEl.addEventListener('scroll', syncTargetFromScroll, { passive: true });
    syncTargetFromScroll();

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    // Constrained devices cap at ~30fps; capable devices render every rAF tick
    // so scroll-linked rotation stays perfectly smooth.
    const FRAME_BUDGET = live.current.simplified ? 1000 / 30 : 0;
    let lastRenderFrame = 0;
    
    const tick = (now: number) => {
      if (!mounted) {
        stop();
        return;
      }
      
      rafId = requestAnimationFrame(tick);
      
      if (last > 0) {
        const dt = Math.min(now - last, 200);
        const scrollFactor = 1 - Math.pow(0.88, dt / 16.667);
        currentScrollRotation += (targetScrollRotation - currentScrollRotation) * scrollFactor;
        rotationY += dt * (live.current.simplified ? 0.00035 : 0.00045);
        globe.rotation.y = rotationY + currentScrollRotation;
      }
      last = now;
      
      if (FRAME_BUDGET && now - lastRenderFrame < FRAME_BUDGET) return;
      lastRenderFrame = now;
      
      if (renderer && scene && camera && sceneReady) {
        try {
          renderer.render(scene, camera);
        } catch (err) {
          console.error('[HackerGlobe] Render failed:', err);
          stop();
        }
      }
    };

    const start = () => {
      if (rafId || !visible || !mounted || !sceneReady) return;
      rafId = requestAnimationFrame(tick);
    };

    let debounceTimer = 0;
    const viewObserver = new IntersectionObserver((entries) => {
      if (!mounted) return;

      const isIntersecting = entries[0]?.isIntersecting ?? false;
      if (isIntersecting) {
        clearTimeout(debounceTimer);
        visible = true;
        if (sceneReady) start();
      } else {
        debounceTimer = window.setTimeout(() => {
          visible = false;
          stop();
        }, 600);
      }
    }, { threshold: 0, rootMargin: '300px' });
    
    viewObserver.observe(el);

    const handleVisibility = () => {
      if (!mounted) return;
      if (document.hidden) {
        stop();
      } else if (visible && sceneReady) {
        start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    buildTimer = window.setTimeout(buildScene, 0);

    const resizeObserver = new ResizeObserver((entries) => {
      if (!mounted) return;
      
      const entry = entries[0];
      if (!entry) return;
      
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0 && renderer) {
        try {
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        } catch (err) {
          console.error('[HackerGlobe] Resize failed:', err);
        }
      }
    });
    resizeObserver.observe(el);

    return () => {
      mounted = false;
      cancelled = true;
      clearTimeout(buildTimer);
      clearTimeout(debounceTimer);
      window.removeEventListener('scroll', syncTargetFromScroll);
      if (snapEl) snapEl.removeEventListener('scroll', syncTargetFromScroll);
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
        if (m.geometry) {
          m.geometry.dispose();
        }
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) {
          mat.forEach((x) => x.dispose());
        } else {
          mat?.dispose();
        }
      });
      
      if (renderer) {
        try {
          renderer.forceContextLoss();
          renderer.dispose();
        } catch {
          // Ignore disposal errors
        }
      }
      
      sceneRef.current = null;
    };
  }, [isLight]);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state) return;
    
    try {
      state.globe.scale.setScalar(effectiveScale);
      state.globe.position.set(effectiveOffset[0], effectiveOffset[1], effectiveOffset[2]);
    } catch (err) {
      console.error('[HackerGlobe] Update failed:', err);
    }
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
