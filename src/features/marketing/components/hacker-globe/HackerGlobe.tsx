import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import { buildDotMapTexture } from './helpers';
import { useFluidGlobe } from './useFluidGlobe';

interface HackerGlobeProps {
  scale?: number;
  offset?: [number, number, number];
  fluid?: boolean;
  /** Disables the scroll-linked scale-up + fade-out exit. Used on auth pages,
      which host the globe as a persistent page backdrop rather than a hero. */
  scrollExit?: boolean;
}

const HackerGlobe: React.FC<HackerGlobeProps> = ({ scale = 0.88, offset = [0, 0, 0], fluid = false, scrollExit = true }) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const isSimplified = constrainedDevice || isMobile;
  const fluidGlobe = useFluidGlobe();
  const effectiveScale = fluid ? fluidGlobe.scale : scale;
  const effectiveOffset = fluid ? fluidGlobe.offset : offset;

  // Scroll-linked exit — as the section scrolls away, the globe smoothly
  // expands outward and fades out, so it appears to swell and vanish beyond
  // the viewport instead of being clipped. Same behavior across every section
  // that hosts the globe.
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: mountRef,
    offset: ['start start', 'end start'],
  });
  const exitScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.3, 1.75]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let rafId: number | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let globe: THREE.Group | null = null;
    let w = 0, h = 0;
    let isInView = false;

    const init = (initialW: number, initialH: number) => {
      w = initialW;
      h = initialH;
      const isLight = false;

      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: isSimplified ? 'low-power' : 'high-performance'
        });
      } catch {
        // WebGL unavailable (old mobile browser, WebView, etc.)
        return;
      }
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSimplified ? 2 : 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;';
      el.appendChild(renderer.domElement);

      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.z = 2.1;

      globe = new THREE.Group();
      globe.scale.setScalar(effectiveScale);
      globe.position.set(effectiveOffset[0], effectiveOffset[1], effectiveOffset[2]);
      globe.rotation.y = -1.9;
      scene.add(globe);

      const sphereSegments = isSimplified ? 32 : 64;
      const step = 1.6;
      const dotTex = buildDotMapTexture(isLight, step);

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

      let last = 0, tick = 0, frameCount = 0;

      const animate = (now: number) => {
        if (!isInView) {
          rafId = null;
          return;
        }

        rafId = requestAnimationFrame(animate);

        const dt = Math.min(now - last, 50);
        last = now;
        tick += dt * 0.001;
        frameCount++;

        if (globe) globe.rotation.y += dt * (isSimplified ? 0.00040 : 0.00050);

        if (camera) {
          const orbitSpeed = isSimplified ? 0.20 : 0.30;
          const orbitRadius = 0.35;
          const verticalDrift = 0.12;
          camera.position.x = Math.sin(tick * orbitSpeed) * orbitRadius;
          camera.position.y = Math.cos(tick * orbitSpeed * 0.7) * verticalDrift;
          camera.lookAt(0, 0, 0);
        }

        if (renderer && scene && camera && (!isSimplified || frameCount % 2 === 0)) renderer.render(scene, camera);
      };

      if (isInView) {
        rafId = requestAnimationFrame(animate);
      }

      (el as any)._animate = animate;
      };

    const cleanup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scene) {
        scene.traverse(obj => {
          const m = obj as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
          const mat = m.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach(x => x.dispose());
          else mat?.dispose();
        });
      }
      if (renderer) {
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        renderer.forceContextLoss();
        renderer.dispose();
      }
      renderer = null; scene = null; camera = null; globe = null;
    };

    const viewObserver = new IntersectionObserver((entries) => {
      const wasInView = isInView;
      isInView = entries[0].isIntersecting;
      if (isInView && !wasInView && !rafId) {
        const animate = (el as any)._animate;
        if (animate) rafId = requestAnimationFrame(animate);
      }
    }, { threshold: 0 });
    viewObserver.observe(el);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: newW, height: newH } = entry.contentRect;
      if (newW > 0 && newH > 0) {
        if (!renderer) init(newW, newH);
        else {
          w = newW; h = newH;
          if (renderer) renderer.setSize(w, h);
          if (camera) { camera.aspect = w / h; camera.updateProjectionMatrix(); }
        }
      }
    });
    observer.observe(el);
    return () => {
      viewObserver.disconnect();
      observer.disconnect();
      cleanup();
    };
  }, [effectiveScale, isSimplified, effectiveOffset]);

  return (
    <motion.div
      ref={mountRef}
      className="relative z-0 h-full w-full pointer-events-none overflow-hidden"
      style={{
        cursor: 'default',
        willChange: 'transform, opacity',
        scale: shouldReduceMotion || !scrollExit ? 1 : exitScale,
        opacity: shouldReduceMotion || !scrollExit ? 1 : exitOpacity,
      }}
    />
  );
};

export default React.memo(HackerGlobe);
