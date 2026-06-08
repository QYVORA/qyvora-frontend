import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../../../core/contexts/ThemeContext';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';

/* ═══════════════════════════════════════════════
   BRAND PALETTE
═══════════════════════════════════════════════ */
const SAGE     = 0x58A366;
const SAGE_HEX = '#58A366';

/* ═══════════════════════════════════════════════
   TARGETS
═══════════════════════════════════════════════ */
const TARGETS = [
  { lat:   5.56, lng:  -0.20, label: 'ACCRA',          status: 'home',    region: 'africa' },
  { lat:   6.52, lng:   3.37, label: '',               status: 'secured', region: 'africa' },
  { lat:  30.04, lng:  31.23, label: '',               status: 'secured', region: 'africa' },
  { lat: -26.20, lng:  28.05, label: '',               status: 'secured', region: 'africa' },
  { lat:  40.71, lng: -74.01, label: '',               status: 'secured', region: 'world'  },
  { lat:  51.51, lng:  -0.13, label: '',               status: 'secured', region: 'world'  },
  { lat:  35.68, lng: 139.69, label: '',               status: 'secured', region: 'world'  },
];

/* ═══════════════════════════════════════════════
   GEO HELPERS
═══════════════════════════════════════════════ */
function latLngToVec3(lat: number, lng: number, r = 1): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function pip(lat: number, lng: number, poly: number[]): boolean {
  const n = poly.length >> 1;
  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const yi = poly[i*2], xi = poly[i*2+1];
    const yj = poly[j*2], xj = poly[j*2+1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj-xi)*(lat-yi))/(yj-yi)+xi)
      inside = !inside;
  }
  return inside;
}

/* ═══════════════════════════════════════════════
   LAND POLYGONS (same as before)
═══════════════════════════════════════════════ */
const AFRICA: number[] = [
  35.8,-5.9,35.5,-2.0,35.2,0.0,36.8,2.4,37.1,4.8,36.9,5.5,37.1,8.7,37.4,9.8,
  37.2,10.4,37.3,11.1,37.5,11.5,30.3,32.2,31.5,32.3,30.0,32.6,27.5,34.1,23.0,37.3,
  18.0,41.5,12.6,43.5,11.6,43.2,11.5,51.3,2.0,41.5,-1.7,41.5,-4.1,39.6,-10.5,40.4,
  -14.8,40.5,-24.0,35.5,-26.5,34.9,-29.9,31.0,-31.5,29.6,-33.9,27.0,-34.8,20.0,
  -34.4,18.5,-33.0,17.9,-28.9,16.5,-22.2,14.5,-17.2,12.0,-12.0,12.0,-6.0,12.2,
  -4.9,8.8,-2.1,9.3,-0.7,8.7,1.4,9.5,2.3,9.9,4.3,6.0,5.0,3.3,6.3,2.4,6.2,1.6,
  6.3,1.2,6.2,0.4,6.0,0.4,5.1,0.0,4.7,-1.6,4.9,-2.5,5.0,-3.1,4.5,-6.4,5.3,-7.5,
  6.9,-8.5,6.9,-11.3,8.5,-13.2,9.5,-13.7,10.7,-14.9,11.3,-15.8,11.5,-16.7,12.7,-16.7,
  14.8,-17.5,14.4,-17.0,13.6,-16.9,13.8,-16.7,14.2,-16.6,16.0,-16.5,20.8,-17.0,
  27.7,-13.2,30.9,-9.8,35.5,-6.2,35.8,-5.9,
];
const MADAGASCAR: number[] = [
  -13.0,49.3,-16.5,44.5,-19.9,44.0,-25.6,44.5,
  -25.5,47.0,-24.9,47.5,-20.5,48.6,-15.5,50.4,-13.0,49.3,
];
const N_AMERICA: number[] = [
  71.3,-156,70.5,-145,60.0,-141,48.5,-124,37.8,-122,32.5,-117,23.0,-110,18.4,-99,
  15.9,-90,15.7,-85,10.0,-83,8.4,-77,10.0,-62,18.5,-66,25.0,-77,25.8,-80,29.0,-81,
  30.4,-87,29.0,-89,26.0,-97,22.0,-98,20.5,-97,19.0,-91,18.5,-88,16.0,-86,10.0,-83,
  8.4,-77,35.2,-75,38.9,-77,41.0,-73,44.0,-67,47.0,-53,52.0,-55,50.0,-66,46.0,-72,
  43.7,-79,42.0,-83,46.7,-92,48.0,-90,48.0,-100,55.0,-109,58.0,-93,60.0,-94,63.0,-86,
  65.0,-87,68.0,-90,71.0,-79,73.0,-66,67.0,-62,60.0,-64,62.0,-78,65.0,-101,68.0,-114,
  70.0,-130,71.3,-156,
];
const GREENLAND: number[] = [
  83.5,-30,82.5,-18,80.0,-18,77.0,-22,75.0,-18,72.0,-22,68.0,-22,65.0,-40,60.0,-46,
  62.0,-52,66.0,-54,70.0,-52,73.0,-56,76.0,-52,78.0,-44,80.5,-32,83.5,-30,
];
const S_AMERICA: number[] = [
  12.4,-71.6,11.0,-73.4,8.5,-76.9,4.9,-77.4,1.3,-78.5,-1.1,-80.2,-4.9,-81.3,-8.0,-78.6,
  -14.0,-76.2,-18.3,-70.5,-22.8,-70.8,-28.0,-71.4,-33.8,-71.6,-37.0,-73.5,-40.0,-73.2,
  -41.9,-74.5,-44.0,-65.4,-50.0,-68.5,-52.5,-69.6,-55.0,-64.0,-52.0,-58.5,-48.0,-55.0,
  -43.5,-48.5,-38.0,-48.0,-34.0,-52.5,-28.0,-50.0,-22.0,-43.2,-16.0,-39.0,-8.0,-35.2,
  -5.0,-35.1,-3.0,-38.5,0.0,-50.0,3.0,-51.0,6.5,-58.0,8.0,-60.5,11.0,-63.0,11.5,-72.0,
  12.4,-71.6,
];
const EUROPE: number[] = [
  36.0,-5.6,38.7,-9.5,42.0,-9.0,43.5,-8.0,43.8,-4.0,43.5,1.5,42.5,3.5,41.3,2.0,
  37.9,0.7,36.0,-5.6,43.5,1.5,47.5,2.5,49.0,1.8,51.0,2.5,51.5,4.0,53.3,6.5,54.0,9.0,
  55.0,10.0,56.0,12.5,57.5,10.0,58.0,11.5,60.0,11.0,60.0,18.5,65.0,22.0,68.0,14.4,
  71.0,28.0,70.0,20.0,68.0,14.4,65.0,14.0,63.0,8.0,58.0,5.0,56.0,8.0,54.5,12.0,
  53.5,14.5,51.0,15.0,50.0,18.0,48.5,18.5,47.5,22.0,45.5,21.0,44.0,22.0,42.0,22.5,
  41.0,23.0,40.5,24.0,37.9,23.6,36.9,22.5,36.5,28.0,41.0,29.0,41.5,28.0,43.0,28.5,
  45.0,30.0,46.5,30.5,47.0,32.5,46.0,33.5,44.5,34.0,43.0,33.0,42.0,36.0,41.5,37.0,
  40.0,36.0,36.0,36.0,36.0,26.0,36.0,30.0,38.0,36.0,37.0,42.0,36.0,36.0,36.0,26.0,
  43.5,1.5,
];
const ASIA: number[] = [
  72.0,26,72.0,60,72.0,100,72.0,140,70.0,142,64.0,141,60.0,140,56.0,133,52.0,133,
  48.0,140,44.0,136,44.0,132,38.0,128,36.0,128,34.0,126,34.0,130,36.0,132,32.0,132,
  30.0,122,26.0,120,22.0,114,20.0,110,18.0,110,10.0,108,4.0,108,4.0,104,2.0,104,
  0.0,104,-4.0,104,-6.0,106,-6.0,108,10.0,100,16.0,100,20.0,100,22.0,106,20.0,108,
  16.0,102,12.0,99,10.0,100,8.0,77,10.0,80,14.0,80,18.0,84,22.0,88,24.0,92,22.0,92,
  16.0,80,8.0,77,24.0,62,28.0,64,32.0,74,24.0,68,24.0,62,36.0,26,36.0,30,38.0,36,
  37.0,42,36.0,43,36.0,36,36.0,26,30.0,32,28.0,34,22.0,37,12.0,43,12.0,45,14.0,48,
  18.0,56,22.0,60,26.0,56,22.0,58,20.0,58,16.0,52,12.0,44,12.0,43,36.0,43,40.0,44,
  44.0,50,48.0,56,52.0,60,56.0,60,60.0,60,64.0,64,68.0,70,72.0,60,72.0,26,
];
const JAPAN: number[] = [
  33.5,130,34.0,131,34.5,133,34.0,135,33.6,135,34.0,136,35.0,137,36.0,137,38.0,141,
  40.5,141,41.5,140,43.5,142,44.5,144,43.0,144,41.0,141,35.5,140,34.5,132,33.5,130,
];
const AUSTRALIA: number[] = [
  -10.7,142,-14.0,130,-14.0,126,-16.0,122,-22.0,114,-24.0,113,-29.0,115,-32.0,115,
  -34.5,118,-37.5,140,-38.5,142,-38.5,145,-37.5,148,-34.0,151,-30.0,153,-24.0,152,
  -19.0,147,-14.5,145,-10.7,142,
];
const NZ_N: number[] = [
  -34.5,173,-37.0,175,-38.5,177,-40.0,176,-41.0,175,-40.5,173,-39.0,174,-37.0,174,-34.5,173,
];
const NZ_S: number[] = [
  -40.5,172,-43.0,171,-46.5,168,-46.0,170,-44.0,172,-40.5,172,
];
const SUMATRA: number[] = [
  5.5,95,4.0,96,2.0,98,-1.0,100,-4.0,103,-5.9,105,-5.5,106,-2.0,104,1.0,102,3.5,99,5.5,95,
];
const BORNEO: number[] = [
  7.0,117,6.0,116,4.0,115,2.0,111,1.0,111,-1.0,110,-2.5,112,-4.0,115,-4.0,116,-2.0,118,
  1.0,119,4.0,118,7.0,117,
];

function isAfrica(lat: number, lng: number): boolean {
  if (lat < -36 || lat > 38 || lng < -18 || lng > 52) return false;
  return pip(lat, lng, AFRICA) || pip(lat, lng, MADAGASCAR);
}
const OTHER_POLYS = [N_AMERICA,GREENLAND,S_AMERICA,EUROPE,ASIA,JAPAN,AUSTRALIA,NZ_N,NZ_S,SUMATRA,BORNEO];
function isLand(lat: number, lng: number): boolean {
  return isAfrica(lat, lng) || OTHER_POLYS.some(p => pip(lat, lng, p));
}

/* ═══════════════════════════════════════════════
   BUILD FLAT DOT-MAP TEXTURE
   Draws a world map as dots on a canvas → sphere texture
═══════════════════════════════════════════════ */
function buildDotMapTexture(isLight: boolean, step = 1.8): THREE.CanvasTexture {
  const W = 2048, H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Ocean background — transparent (globe ocean sphere will show through)
  ctx.clearRect(0, 0, W, H);

  const dotR     = (step / 180) * H * 0.38; // dot radius scales with step density
  // All lands now use the accent color (sage green) with consistent styling
  const landFill  = isLight ? '#58A366'  : '#58A366';   // sage green for all lands
  const landAlpha = 1.0;

  for (let lat = 89; lat >= -89; lat -= step) {
    for (let lng = -179; lng <= 179; lng += step) {
      if (!isLand(lat, lng)) continue;

      const x = ((lng + 180) / 360) * W;
      const y = ((90 - lat) / 180) * H;

      // All lands now use the same color and opacity
      ctx.globalAlpha = landAlpha;
      ctx.fillStyle   = landFill;

      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
interface HackerGlobeProps { scale?: number }

const HackerGlobe: React.FC<HackerGlobeProps> = ({ scale = 0.88 }) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme }  = useTheme();
  const shouldReduceMotion  = useReducedMotion();
  const { constrainedDevice } = useAdaptiveUi();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const isLight = theme === 'light';
    let w = el.clientWidth, h = el.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: !constrainedDevice, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, constrainedDevice ? 1.25 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;z-index:1;';
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.z = 3.2;

    const globe = new THREE.Group();
    globe.scale.setScalar(scale);
    scene.add(globe);

    /* ── Ocean sphere ── */
    const oceanColor = isLight ? 0xffffff : 0x000000;
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.998, 64, 64),
      new THREE.MeshBasicMaterial({ color: oceanColor }),
    ));

    /* ── Dot-map texture on sphere ── */
    const step = constrainedDevice ? 2.5 : 1.6;
    const dotTex = buildDotMapTexture(isLight, step);
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.001, 64, 64),
      new THREE.MeshBasicMaterial({
        map:         dotTex,
        transparent: true,
        opacity:     1.0,
        depthWrite:  false,
      }),
    ));

    /* ── Graticule lines (lat/lng grid) — subtle ── */
    const graticuleColor = isLight ? 0x88aa88 : 0x1a2e1a;
    const graticuleOpacity = isLight ? 0.15 : 0.18;
    const graticuleGeo = new THREE.BufferGeometry();
    const graticuleVerts: number[] = [];
    // Longitude lines every 30°
    for (let lng = -180; lng < 180; lng += 30) {
      for (let lat = -88; lat <= 88; lat += 2) {
        const v1 = latLngToVec3(lat,   lng, 1.003);
        const v2 = latLngToVec3(lat+2, lng, 1.003);
        graticuleVerts.push(v1.x,v1.y,v1.z, v2.x,v2.y,v2.z);
      }
    }
    // Latitude lines every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lng = -180; lng < 180; lng += 2) {
        const v1 = latLngToVec3(lat, lng,   1.003);
        const v2 = latLngToVec3(lat, lng+2, 1.003);
        graticuleVerts.push(v1.x,v1.y,v1.z, v2.x,v2.y,v2.z);
      }
    }
    graticuleGeo.setAttribute('position', new THREE.Float32BufferAttribute(graticuleVerts, 3));
    globe.add(new THREE.LineSegments(graticuleGeo, new THREE.LineBasicMaterial({
      color: graticuleColor, transparent: true, opacity: graticuleOpacity,
    })));

    /* ── Target pins — flat rings + glow dots ── */
    type PingObj = { ring: THREE.Mesh; glow: THREE.Mesh; phase: number; isHome: boolean };
    const pings: PingObj[]   = [];
    const hitMeshes: THREE.Mesh[] = [];

    TARGETS.forEach(({ lat, lng, status, region }) => {
      const pos    = latLngToVec3(lat, lng, 1.005);
      const isHome = status === 'home';
      const col    = isHome ? SAGE : (region === 'africa' ? SAGE : 0x4a7a5a);

      // Core dot — flat circle on surface
      const dotR = isHome ? 0.010 : (region === 'africa' ? 0.007 : 0.006);
      const dot  = new THREE.Mesh(
        new THREE.CircleGeometry(dotR, 16),
        new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }),
      );
      dot.position.copy(pos);
      dot.lookAt(new THREE.Vector3(0, 0, 0));
      dot.rotateY(Math.PI); // face outward
      globe.add(dot);

      // Outer pulse ring — flat, on surface
      const ri = isHome ? 0.014 : 0.009;
      const ro = isHome ? 0.022 : 0.015;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(ri, ro, 32),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide }),
      );
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      ring.rotateY(Math.PI);
      globe.add(ring);

      // Glow halo for home pin
      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(isHome ? 0.035 : 0.020, 32),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: isHome ? 0.18 : 0.10, side: THREE.DoubleSide }),
      );
      glow.position.copy(pos.clone().multiplyScalar(1.001));
      glow.lookAt(new THREE.Vector3(0, 0, 0));
      glow.rotateY(Math.PI);
      globe.add(glow);

      pings.push({ ring, glow, phase: Math.random() * Math.PI * 2, isHome });

      // Hit test mesh (invisible)
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
      );
      hit.position.copy(pos);
      globe.add(hit);
      hitMeshes.push(hit);
    });

    /* ── Connection arcs ── */
    type ArcObj = { geo: THREE.BufferGeometry; progress: number; speed: number };
    const arcs: ArcObj[] = [];
    const ARC_PAIRS: Array<[number, number]> = [[0,1],[0,3],[0,4],[0,5]];

    ARC_PAIRS.forEach(([a, b]) => {
      const ta = TARGETS[a], tb = TARGETS[b];
      const s   = latLngToVec3(ta.lat, ta.lng, 1.01);
      const e_  = latLngToVec3(tb.lat, tb.lng, 1.01);
      const mid = s.clone().add(e_).normalize().multiplyScalar(1.18);
      const curve = new THREE.QuadraticBezierCurve3(s, mid, e_);
      const geo   = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
      const isPrimary = a === 0;
      globe.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
        color:       isPrimary ? (isLight ? 0x2f8a1f : SAGE) : (isLight ? 0x7aaa70 : 0x2a4030),
        transparent: true,
        opacity:     isPrimary ? (isLight ? 0.35 : 0.22) : 0.10,
      })));
      arcs.push({ geo, progress: Math.random(), speed: 0.0008 + Math.random() * 0.0012 });
    });

    /* ── Single satellite ── */
    const satDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.005, 6, 6),
      new THREE.MeshBasicMaterial({ color: isLight ? 0x2f8a1f : 0xffffff, transparent: true, opacity: 0.35 }),
    );
    scene.add(satDot);
    const TRAIL_LEN = 24;
    const trailPts  = Array.from({ length: TRAIL_LEN }, () => new THREE.Vector3());
    const trailGeo  = new THREE.BufferGeometry().setFromPoints(trailPts);
    scene.add(new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
      color: isLight ? 0x8ab88a : 0x2e4038, transparent: true, opacity: 0.18,
    })));
    let trailHead = 0;
    const SAT_RADIUS = 1.40;
    const SAT_INCL   = Math.PI / 5;
    const SAT_SPEED  = 0.003;

    /* ── Tooltip ── */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let rect = renderer.domElement.getBoundingClientRect();

    const onHover = (e: MouseEvent) => {
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(hitMeshes);
      const tip  = tooltipRef.current;
      if (!tip) return;
      if (hits.length) {
        const idx = hitMeshes.indexOf(hits[0].object as THREE.Mesh);
        const d   = TARGETS[idx];
        if (!d?.label) { tip.style.display = 'none'; return; }
        tip.style.display = 'block';
        tip.style.left    = `${e.clientX - rect.left + 16}px`;
        tip.style.top     = `${e.clientY - rect.top  - 12}px`;
        tip.innerHTML = `<span style="color:${SAGE_HEX};font-weight:700;letter-spacing:.09em">${d.label}</span><br><span style="font-size:9px;letter-spacing:.12em;color:${SAGE_HEX}">◈ HQ · GHANA</span>`;
      } else {
        tip.style.display = 'none';
      }
    };
    renderer.domElement.addEventListener('mousemove', onHover);

    /* ── Render loop ── */
    let rafId = 0, last = 0, tick = 0;
    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(now - last, 50);
      last = now;
      tick += dt * 0.001;

      globe.rotation.y += dt * (constrainedDevice ? 0.00018 : 0.00030);

      // Pulse rings
      pings.forEach(({ ring, glow, isHome, phase }) => {
        const spd = isHome ? 1.2 : 1.8;
        const amp = isHome ? 1.8 : 1.4;
        const s   = 1 + amp * ((Math.sin(tick * spd + phase) + 1) / 2);
        ring.scale.setScalar(s);
        (ring.material as THREE.MeshBasicMaterial).opacity = (isHome ? 0.75 : 0.55) * (1 - (s-1)/amp);
        // Glow breathes
        (glow.material as THREE.MeshBasicMaterial).opacity = (isHome ? 0.18 : 0.10) * (0.5 + 0.5 * Math.sin(tick * spd * 0.5 + phase));
      });

      // Arc draw range progress
      arcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        arc.geo.setDrawRange(0, Math.max(2, Math.floor(arc.progress * 80)));
      });

      // Satellite orbit
      const angle = tick * SAT_SPEED * 60;
      satDot.position.set(
        SAT_RADIUS * Math.cos(angle),
        SAT_RADIUS * Math.sin(angle) * Math.sin(SAT_INCL),
        SAT_RADIUS * Math.sin(angle) * Math.cos(SAT_INCL),
      );
      trailPts[trailHead % TRAIL_LEN].copy(satDot.position);
      trailHead++;
      trailGeo.setFromPoints(trailPts);

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      w = el.clientWidth; h = el.clientHeight;
      if (h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      rect = renderer.domElement.getBoundingClientRect();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onHover);
      dotTex.dispose();
      scene.traverse(obj => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach(x => x.dispose());
        else mat?.dispose();
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [scale, theme, constrainedDevice]);

  return (
    <div className="relative h-full w-full overflow-visible">
      <div
        ref={mountRef}
        className="relative z-10 h-full w-full"
        style={{ cursor: 'default', willChange: 'transform', contain: 'layout size style' }}
      >
        <div
          ref={tooltipRef}
          style={{
            display: 'none', position: 'absolute', pointerEvents: 'none',
            background: theme === 'light' ? 'rgba(232,240,232,0.95)' : 'rgba(3,6,4,0.92)',
            border: '1px solid rgba(88,163,102,0.25)',
            borderRadius: '4px', padding: '7px 12px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: theme === 'light' ? '#58A366' : '#58A366',
            zIndex: 10, lineHeight: 1.75,
            whiteSpace: 'nowrap', backdropFilter: 'blur(6px)',
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(HackerGlobe);