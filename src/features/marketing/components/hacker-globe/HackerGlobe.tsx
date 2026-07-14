import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import { useAdaptiveUi } from '../../../../core/hooks/useAdaptiveUi';
import { TARGETS, ARC_PAIRS, ACCENT_COLOR } from './data';
import { latLngToVec3, buildDotMapTexture } from './helpers';
import { Ping, Arc, Satellite, Label } from './types';

interface HackerGlobeProps { scale?: number; offset?: [number, number, number] }

const HackerGlobe: React.FC<HackerGlobeProps> = ({ scale = 0.88, offset = [0, 0, 0] }) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion  = useReducedMotion();
  const { constrainedDevice, isMobile } = useAdaptiveUi();
  const isSimplified = constrainedDevice || isMobile;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let labelContainer: HTMLDivElement | null = null;
    let rafId: number | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let globe: THREE.Group | null = null;
    let pings: Ping[] = [];
    let arcs: Arc[] = [];
    let sats: Satellite[] = [];
    let persistentLabels: Label[] = [];
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
      globe.scale.setScalar(scale);
      globe.position.set(offset[0], offset[1], offset[2]);
      globe.rotation.y = -1.9;
      scene.add(globe);

      const outlineGeo = new THREE.SphereGeometry(1.0, isSimplified ? 32 : 64, isSimplified ? 32 : 64);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: ACCENT_COLOR,
        transparent: true,
        opacity: isLight ? 0.05 : 0.08,
        side: THREE.BackSide,
        depthWrite: false,
      });
      globe.add(new THREE.Mesh(outlineGeo, outlineMat));

      const equatorGeo = new THREE.TorusGeometry(1.002, 0.001, 8, isSimplified ? 64 : 128);
      const equatorMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: isLight ? 0.15 : 0.25,
      });
      const equator = new THREE.Mesh(equatorGeo, equatorMat);
      equator.rotation.x = Math.PI / 2;
      globe.add(equator);

      const step = isSimplified ? 1.4 : 1.0;
      const dotTex = buildDotMapTexture(isLight, step);
      const sphereSegments = isSimplified ? 24 : 64;

      const globeBack = new THREE.Mesh(
        new THREE.SphereGeometry(1.001, sphereSegments, sphereSegments),
        new THREE.MeshBasicMaterial({
          map: dotTex, transparent: true, opacity: 0.55,
          depthWrite: false, side: THREE.BackSide,
        }),
      );
      globeBack.renderOrder = 1;
      globe.add(globeBack);

      const globeFront = new THREE.Mesh(
        new THREE.SphereGeometry(1.001, sphereSegments, sphereSegments),
        new THREE.MeshBasicMaterial({
          map: dotTex, transparent: true, opacity: 1.0,
          depthWrite: false, side: THREE.FrontSide,
        }),
      );
      globeFront.renderOrder = 2;
      globe.add(globeFront);

      {
        const graticuleColor = 0x000000;
        const graticuleOpacity = isLight ? 0.08 : 0.12;
        const lineStep = isSimplified ? 60 : 30;
        const latStep = isSimplified ? 4 : 2;
        const meridianStep = isSimplified ? 60 : 30;
        const lngStep = isSimplified ? 4 : 2;
        const graticuleGeo = new THREE.BufferGeometry();
        const graticuleVerts: number[] = [];
        for (let lng = -180; lng < 180; lng += lineStep) {
          for (let lat = -88; lat <= 88; lat += latStep) {
            const v1 = latLngToVec3(lat,   lng, 1.003);
            const v2 = latLngToVec3(lat+latStep, lng, 1.003);
            graticuleVerts.push(v1.x,v1.y,v1.z, v2.x,v2.y,v2.z);
          }
        }
        for (let lat = -60; lat <= 60; lat += meridianStep) {
          for (let lng = -180; lng < 180; lng += lngStep) {
            const v1 = latLngToVec3(lat, lng,   1.003);
            const v2 = latLngToVec3(lat, lng+lngStep, 1.003);
            graticuleVerts.push(v1.x,v1.y,v1.z, v2.x,v2.y,v2.z);
          }
        }
        graticuleGeo.setAttribute('position', new THREE.Float32BufferAttribute(graticuleVerts, 3));
        globe.add(new THREE.LineSegments(graticuleGeo, new THREE.LineBasicMaterial({
          color: graticuleColor, transparent: true, opacity: graticuleOpacity,
        })));
      }

      TARGETS.forEach(({ lat, lng, status, region }, i) => {
        if (isSimplified && i % 2 !== 0 && status !== 'home') return;

        const pos    = latLngToVec3(lat, lng, 1.005);
        const isHome = status === 'home';
        const col    = ACCENT_COLOR;
        const dotR = isHome ? 0.004 : (region === 'africa' ? 0.0025 : 0.002);
        const dot  = new THREE.Mesh(
          new THREE.CircleGeometry(dotR, isSimplified ? 8 : 16),
          new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }),
        );
        dot.position.copy(pos);
        dot.lookAt(new THREE.Vector3(0, 0, 0));
        dot.rotateY(Math.PI);
        globe!.add(dot);

        const ri = isHome ? 0.006 : 0.004;
        const ro = isHome ? 0.009 : 0.006;
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(ri, ro, isSimplified ? 16 : 32),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide }),
        );
        ring.position.copy(pos);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        ring.rotateY(Math.PI);
        globe!.add(ring);

        const glow = new THREE.Mesh(
          new THREE.CircleGeometry(isHome ? 0.014 : 0.008, isSimplified ? 16 : 32),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: isHome ? 0.18 : 0.10, side: THREE.DoubleSide }),
        );
        glow.position.copy(pos.clone().multiplyScalar(1.001));
        glow.lookAt(new THREE.Vector3(0, 0, 0));
        glow.rotateY(Math.PI);
        globe!.add(glow);
        pings.push({ ring, glow, phase: Math.random() * Math.PI * 2, isHome });
      });

      const activeArcs = isSimplified ? ARC_PAIRS.filter((_, i) => i % 2 === 0) : ARC_PAIRS;

      activeArcs.forEach(([a, b]) => {
        const ta = TARGETS[a], tb = TARGETS[b];
        if (!ta || !tb) return;

        const s = latLngToVec3(ta.lat, ta.lng, 1.01), e_ = latLngToVec3(tb.lat, tb.lng, 1.01);
        const dist = s.distanceTo(e_), hScale = 1.1 + (dist * 0.15);
        const mid = s.clone().add(e_).normalize().multiplyScalar(hScale);
        const curve = new THREE.QuadraticBezierCurve3(s, mid, e_);
        const segments = isSimplified ? 30 : 80;
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(segments));
        const isAfricaLink = ta.region === 'africa' && tb.region === 'africa';
        globe!.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: isAfricaLink ? (isLight ? 0.40 : 0.35) : 0.15,
        })));
        arcs.push({ geo, progress: Math.random(), speed: 0.001 + Math.random() * 0.002 });
      });

      const SATS_COUNT = isSimplified ? 4 : 12;
      const satsObjs = Array.from({ length: SATS_COUNT }).map((_, i) => {
        const radius = 1.35 + i * 0.12;
        const incl   = (Math.PI / 4) + (i * Math.PI / 6);
        const speed  = 0.0025 + (i * 0.0008);
        const phase  = i * (Math.PI * 0.5);

        const startPos = new THREE.Vector3(
          radius * Math.cos(phase),
          radius * Math.sin(phase) * Math.sin(incl),
          radius * Math.sin(phase) * Math.cos(incl)
        );

        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.003, 4, 4),
          new THREE.MeshBasicMaterial({ color: ACCENT_COLOR, transparent: true, opacity: 0.5 }),
        );
        dot.position.copy(startPos);
        scene!.add(dot);

        const trailLen = isSimplified ? 10 : 28;
        const trailPts = Array.from({ length: trailLen }, () => startPos.clone());
        const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPts);
        const trailLine = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
          color: 0x000000, transparent: true, opacity: 0.15,
        }));
        scene!.add(trailLine);
        return { dot, trailLine, trailPts, trailHead: 0, radius, incl, speed, phase };
      });
      sats.push(...satsObjs);

      labelContainer = document.createElement('div');
      labelContainer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
      el.appendChild(labelContainer);

      const labelTargets = isSimplified ? TARGETS.filter((t, i) => i % 3 === 0 || t.status === 'home') : TARGETS;

      const labelObjs = labelTargets.map((t) => {
        const div = document.createElement('div');
        const backdropBlur = isSimplified ? '' : 'backdrop-filter: blur(4px);';
        div.style.cssText = `position: absolute; display: none; pointer-events: none; background: ${isLight ? 'rgba(232,240,232,0.85)' : 'rgba(3,6,4,0.75)'}; border: 1px solid rgba(0,0,0,0.25); border-radius: 4px; padding: 4px 8px; font-family: JetBrains Mono, monospace; font-size: 9px; color: #06B66F; white-space: nowrap; ${backdropBlur} transform: translate(-50%, -100%); margin-top: -12px; font-weight: 700; letter-spacing: 0.08em; transition: opacity 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
        div.textContent = t.label;
        labelContainer!.appendChild(div);
        return { div, pos: latLngToVec3(t.lat, t.lng, 1.005) };
      });
      persistentLabels.push(...labelObjs);

      let last = 0, tick = 0, frameCount = 0;

      const worldPos = new THREE.Vector3();
      const normWorldPos = new THREE.Vector3();
      const dirToCamera = new THREE.Vector3();

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

        if (!isSimplified || frameCount % 2 === 0) {
          pings.forEach(({ ring, glow, isHome, phase }) => {
            const spd = isHome ? 1.2 : 1.8, amp = isHome ? 1.8 : 1.4;
            const s = 1 + amp * ((Math.sin(tick * spd + phase) + 1) / 2);
            ring.scale.setScalar(s);
            (ring.material as THREE.MeshBasicMaterial).opacity = (isHome ? 0.75 : 0.55) * (1 - (s-1)/amp);
            (glow.material as THREE.MeshBasicMaterial).opacity = (isHome ? 0.18 : 0.10) * (0.5 + 0.5 * Math.sin(tick * spd * 0.5 + phase));
          });
        }

        arcs.forEach(arc => {
          arc.progress = (arc.progress + arc.speed) % 1;
          if (!isSimplified) {
            arc.geo.setDrawRange(0, Math.max(2, Math.floor(arc.progress * 80)));
          }
        });

        if (!isSimplified || frameCount % 2 === 0) {
          sats.forEach(sat => {
            const angle = sat.phase + tick * sat.speed * 60;
            sat.dot.position.set(sat.radius * Math.cos(angle), sat.radius * Math.sin(angle) * Math.sin(sat.incl), sat.radius * Math.sin(angle) * Math.cos(sat.incl));
            sat.trailPts[sat.trailHead % sat.trailPts.length].copy(sat.dot.position);
            sat.trailHead++;
            if (!isSimplified || frameCount % 4 === 0) {
              sat.trailLine.geometry.setFromPoints(sat.trailPts);
            }
          });
        }

        if (!isSimplified || frameCount % 2 === 0) {
          persistentLabels.forEach((l) => {
            if (!globe || !camera) return;

            worldPos.copy(l.pos).applyMatrix4(globe.matrixWorld);
            normWorldPos.copy(worldPos).normalize();
            dirToCamera.copy(camera.position).sub(worldPos).normalize();

            const dot = normWorldPos.dot(dirToCamera);
            if (dot > 0.15) {
              const screenPos = worldPos.project(camera);
              l.div.style.display = 'block';
              l.div.style.left = `${(screenPos.x * 0.5 + 0.5) * w}px`;
              l.div.style.top = `${(screenPos.y * -0.5 + 0.5) * h}px`;
              l.div.style.opacity = String(Math.min(1, (dot - 0.15) * 4));
            } else l.div.style.display = 'none';
          });
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
      if (labelContainer && el.contains(labelContainer)) el.removeChild(labelContainer);
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
        renderer.dispose();
      }
      renderer = null; scene = null; camera = null; globe = null; pings = []; arcs = []; sats = []; persistentLabels = [];
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
  }, [scale, isSimplified, offset]);

  return (
    <div
      ref={mountRef}
      className="relative z-0 h-full w-full pointer-events-none"
      style={{ cursor: 'default', willChange: 'transform' }}
    >
      <div
        ref={tooltipRef}
        style={{
          display: 'none', position: 'absolute', pointerEvents: 'none',
          background: 'rgba(3,6,4,0.92)',
          border: '1px solid rgba(0,0,0,0.25)',
          borderRadius: '4px', padding: '7px 12px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          color: '#000000',
          zIndex: 10, lineHeight: 1.75,
          whiteSpace: 'nowrap', backdropFilter: 'blur(6px)',
        }}
      />
    </div>
  );
};

export default React.memo(HackerGlobe);
