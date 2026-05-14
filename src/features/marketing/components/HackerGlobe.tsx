import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../../../core/contexts/ThemeContext';

/* ═══════════════════════════════════════════════
   BRAND PALETTE
═══════════════════════════════════════════════ */
const SAGE     = 0x88ad7c;
const SAGE_HEX = '#88ad7c';

/* ═══════════════════════════════════════════════
   TARGETS
═══════════════════════════════════════════════ */
const TARGETS = [
  { lat:   9.40, lng:  -0.85, label: 'TAMALE',        status: 'home',    region: 'africa' },
  { lat:   6.52, lng:   3.37, label: '',               status: 'secured', region: 'africa' },
  { lat:  30.04, lng:  31.23, label: '',               status: 'secured', region: 'africa' },
  { lat: -26.20, lng:  28.05, label: '',               status: 'secured', region: 'africa' },
  { lat:  40.71, lng: -74.01, label: '',               status: 'secured', region: 'world'  },
  { lat:  51.51, lng:  -0.13, label: '',               status: 'secured', region: 'world'  },
  { lat:  35.68, lng: 139.69, label: '',               status: 'secured', region: 'world'  },
];

const STATUS_COLOR: Record<string, number> = {
  home: SAGE, breach: SAGE, scanning: SAGE, secured: SAGE,
};
const STATUS_HEX: Record<string, string> = {
  home: SAGE_HEX, breach: SAGE_HEX, scanning: SAGE_HEX, secured: SAGE_HEX,
};

/* ═══════════════════════════════════════════════
   ASCII BAND — the text we'll wrap onto a cylinder
   Each line is one row of glyphs drawn via canvas→texture
═══════════════════════════════════════════════ */
const ASCII_LINES = [
  ' █████   █████  █████████     ███████      █████████  █████ ██████████ ███████████ █████ █████',
  '▒▒███   ▒▒███  ███▒▒▒▒▒███  ███▒▒▒▒▒███   ███▒▒▒▒▒███▒▒███ ▒▒███▒▒▒▒▒█▒█▒▒▒███▒▒▒█▒▒███ ▒▒███',
  ' ▒███    ▒███ ▒███    ▒▒▒  ███     ▒▒███ ███     ▒▒▒  ▒███  ▒███  █ ▒ ▒   ▒███  ▒  ▒▒███ ███  ',
  ' ▒███████████ ▒▒█████████ ▒███      ▒███▒███          ▒███  ▒██████       ▒███      ▒▒█████   ',
  ' ▒███▒▒▒▒▒███  ▒▒▒▒▒▒▒▒███▒███      ▒███▒███          ▒███  ▒███▒▒█       ▒███       ▒▒███    ',
  ' ▒███    ▒███  ███    ▒███▒▒███     ███ ▒▒███     ███ ▒███  ▒███ ▒   █    ▒███        ▒███    ',
  ' █████   █████▒▒█████████  ▒▒▒███████▒   ▒▒█████████  █████ ██████████    █████       █████   ',
  '▒▒▒▒▒   ▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒      ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒    ▒▒▒▒▒       ▒▒▒▒▒   ',
];

/* ═══════════════════════════════════════════════
   GEO HELPERS
═══════════════════════════════════════════════ */
function latLngToVec3(lat: number, lng: number, r = 1): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
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
    const yi = poly[i * 2], xi = poly[i * 2 + 1];
    const yj = poly[j * 2], xj = poly[j * 2 + 1];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

/* ═══════════════════════════════════════════════
   LAND POLYGONS
═══════════════════════════════════════════════ */
const AFRICA: number[] = [
  35.8,-5.9,  35.5,-2.0,  35.2, 0.0,  36.8, 2.4,
  37.1, 4.8,  36.9, 5.5,  37.1, 8.7,  37.4, 9.8,
  37.2,10.4,  37.3,11.1,
  37.5,11.5,  30.3,32.2,
  31.5,32.3,  30.0,32.6,  27.5,34.1,  23.0,37.3,
  18.0,41.5,  12.6,43.5,  11.6,43.2,
  11.5,51.3,   2.0,41.5,  -1.7,41.5,
  -4.1,39.6, -10.5,40.4,
  -14.8,40.5,-24.0,35.5,-26.5,34.9,
  -29.9,31.0,-31.5,29.6,-33.9,27.0,
  -34.8,20.0,-34.4,18.5,-33.0,17.9,-28.9,16.5,
  -22.2,14.5,-17.2,12.0,
  -12.0,12.0, -6.0,12.2,
  -4.9, 8.8,  -2.1, 9.3,  -0.7, 8.7,
   1.4, 9.5,   2.3, 9.9,
   4.3, 6.0,   5.0, 3.3,   6.3, 2.4,   6.2, 1.6,
   6.3, 1.2,   6.2, 0.4,
   6.0, 0.4,   5.1, 0.0,
   4.7,-1.6,   4.9,-2.5,   5.0,-3.1,
   4.5,-6.4,   5.3,-7.5,
   6.9,-8.5,   6.9,-11.3,
   8.5,-13.2,   9.5,-13.7,  10.7,-14.9,
  11.3,-15.8,  11.5,-16.7,  12.7,-16.7,
  14.8,-17.5,  14.4,-17.0,  13.6,-16.9,  13.8,-16.7,
  14.2,-16.6,
  16.0,-16.5,  20.8,-17.0,
  27.7,-13.2,  30.9,-9.8,   35.5,-6.2,   35.8,-5.9,
];
const MADAGASCAR: number[] = [
  -13.0,49.3, -16.5,44.5, -19.9,44.0, -25.6,44.5,
  -25.5,47.0, -24.9,47.5, -20.5,48.6, -15.5,50.4, -13.0,49.3,
];
const N_AMERICA: number[] = [
  71.3,-156, 70.5,-145, 60.0,-141,
  48.5,-124, 37.8,-122, 32.5,-117, 23.0,-110,
  18.4,-99,  15.9,-90,  15.7,-85,  10.0,-83,   8.4,-77,
  10.0,-62,  18.5,-66,  25.0,-77,  25.8,-80,
  29.0,-81,  30.4,-87,  29.0,-89,  26.0,-97,
  22.0,-98,  20.5,-97,  19.0,-91,  18.5,-88,
  16.0,-86,  10.0,-83,   8.4,-77,
  35.2,-75,  38.9,-77,  41.0,-73,  44.0,-67,
  47.0,-53,  52.0,-55,  50.0,-66,
  46.0,-72,  43.7,-79,  42.0,-83,
  46.7,-92,  48.0,-90,  48.0,-100, 55.0,-109,
  58.0,-93,  60.0,-94,  63.0,-86,  65.0,-87,
  68.0,-90,  71.0,-79,  73.0,-66,  67.0,-62,
  60.0,-64,  62.0,-78,  65.0,-101, 68.0,-114,
  70.0,-130, 71.3,-156,
];
const GREENLAND: number[] = [
  83.5,-30, 82.5,-18, 80.0,-18, 77.0,-22, 75.0,-18,
  72.0,-22, 68.0,-22, 65.0,-40, 60.0,-46, 62.0,-52,
  66.0,-54, 70.0,-52, 73.0,-56, 76.0,-52, 78.0,-44,
  80.5,-32, 83.5,-30,
];
const S_AMERICA: number[] = [
  12.4,-71.6, 11.0,-73.4,  8.5,-76.9,  4.9,-77.4,
   1.3,-78.5, -1.1,-80.2, -4.9,-81.3, -8.0,-78.6,
 -14.0,-76.2,-18.3,-70.5,-22.8,-70.8,-28.0,-71.4,
 -33.8,-71.6,-37.0,-73.5,-40.0,-73.2,-41.9,-74.5,
 -44.0,-65.4,-50.0,-68.5,-52.5,-69.6,-55.0,-64.0,
 -52.0,-58.5,-48.0,-55.0,-43.5,-48.5,-38.0,-48.0,
 -34.0,-52.5,-28.0,-50.0,-22.0,-43.2,-16.0,-39.0,
  -8.0,-35.2, -5.0,-35.1, -3.0,-38.5,  0.0,-50.0,
   3.0,-51.0,  6.5,-58.0,  8.0,-60.5, 11.0,-63.0,
  11.5,-72.0, 12.4,-71.6,
];
const EUROPE: number[] = [
  36.0,-5.6, 38.7,-9.5, 42.0,-9.0, 43.5,-8.0,
  43.8,-4.0, 43.5, 1.5, 42.5, 3.5, 41.3, 2.0,
  37.9, 0.7, 36.0,-5.6,
  43.5, 1.5, 47.5, 2.5, 49.0, 1.8, 51.0, 2.5,
  51.5, 4.0, 53.3, 6.5, 54.0, 9.0, 55.0,10.0,
  56.0,12.5, 57.5,10.0, 58.0,11.5, 60.0,11.0,
  60.0,18.5, 65.0,22.0, 68.0,14.4, 71.0,28.0,
  70.0,20.0, 68.0,14.4, 65.0,14.0, 63.0, 8.0,
  58.0, 5.0, 56.0, 8.0,
  54.5,12.0, 53.5,14.5, 51.0,15.0, 50.0,18.0,
  48.5,18.5, 47.5,22.0, 45.5,21.0, 44.0,22.0,
  42.0,22.5, 41.0,23.0, 40.5,24.0, 37.9,23.6,
  36.9,22.5, 36.5,28.0, 41.0,29.0, 41.5,28.0,
  43.0,28.5, 45.0,30.0, 46.5,30.5, 47.0,32.5,
  46.0,33.5, 44.5,34.0, 43.0,33.0, 42.0,36.0,
  41.5,37.0, 40.0,36.0, 36.0,36.0,
  36.0,26.0, 36.0,30.0, 38.0,36.0, 37.0,42.0,
  36.0,36.0, 36.0,26.0,
  43.5, 1.5,
];
const UK: number[] = [
  60.8,-1.2, 58.5, 0.1, 55.9, 0.5, 53.4, 0.3,
  51.4, 1.4, 51.4, 0.2, 50.9,-1.4, 50.1,-5.5,
  51.4,-5.2, 53.4,-4.6, 55.0,-5.7, 57.6,-5.6,
  58.7,-3.0, 59.9,-1.7, 60.8,-1.2,
];
const ASIA: number[] = [
  72.0,26,  72.0,60,  72.0,100, 72.0,140,
  70.0,142, 64.0,141, 60.0,140, 56.0,133,
  52.0,133, 48.0,140, 44.0,136, 44.0,132,
  38.0,128, 36.0,128, 34.0,126, 34.0,130,
  36.0,132, 32.0,132, 30.0,122, 26.0,120,
  22.0,114, 20.0,110, 18.0,110, 10.0,108,
   4.0,108,  4.0,104,  2.0,104,  0.0,104,
  -4.0,104, -6.0,106, -6.0,108,
  10.0,100, 16.0,100, 20.0,100, 22.0,106,
  20.0,108, 16.0,102, 12.0, 99, 10.0,100,
   8.0,77,  10.0,80,  14.0,80,  18.0,84,
  22.0,88,  24.0,92,  22.0,92,  16.0,80,  8.0,77,
  24.0,62,  28.0,64,  32.0,74,  24.0,68,  24.0,62,
  36.0,26,  36.0,30,  38.0,36,  37.0,42,
  36.0,43,  36.0,36,  36.0,26,
  30.0,32,  28.0,34,  22.0,37,  12.0,43,
  12.0,45,  14.0,48,  18.0,56,  22.0,60,
  26.0,56,  22.0,58,  20.0,58,  16.0,52,
  12.0,44,  12.0,43,
  36.0,43,  40.0,44,  44.0,50,  48.0,56,
  52.0,60,  56.0,60,  60.0,60,  64.0,64,
  68.0,70,  72.0,60,  72.0,26,
];
const JAPAN: number[] = [
  33.5,130, 34.0,131, 34.5,133, 34.0,135, 33.6,135,
  34.0,136, 35.0,137, 36.0,137, 38.0,141, 40.5,141,
  41.5,140, 43.5,142, 44.5,144, 43.0,144, 41.0,141,
  35.5,140, 34.5,132, 33.5,130,
];
const AUSTRALIA: number[] = [
  -10.7,142,-14.0,130,-14.0,126,-16.0,122,
  -22.0,114,-24.0,113,-29.0,115,-32.0,115,
  -34.5,118,-37.5,140,-38.5,142,-38.5,145,
  -37.5,148,-34.0,151,-30.0,153,-24.0,152,
  -19.0,147,-14.5,145,-10.7,142,
];
const NZ_N: number[] = [
  -34.5,173,-37.0,175,-38.5,177,-40.0,176,
  -41.0,175,-40.5,173,-39.0,174,-37.0,174,-34.5,173,
];
const NZ_S: number[] = [
  -40.5,172,-43.0,171,-46.5,168,-46.0,170,-44.0,172,-40.5,172,
];
const SUMATRA: number[] = [
   5.5,95,  4.0,96,  2.0,98, -1.0,100, -4.0,103,
  -5.9,105,-5.5,106,-2.0,104,  1.0,102,  3.5, 99,  5.5,95,
];
const BORNEO: number[] = [
   7.0,117, 6.0,116, 4.0,115, 2.0,111, 1.0,111,
  -1.0,110,-2.5,112,-4.0,115,-4.0,116,-2.0,118,
   1.0,119, 4.0,118, 7.0,117,
];

const AFRICA_BOX = { latMin:-36, latMax:38, lngMin:-18, lngMax:52 };
function isAfrica(lat: number, lng: number): boolean {
  if (lat < AFRICA_BOX.latMin || lat > AFRICA_BOX.latMax ||
      lng < AFRICA_BOX.lngMin || lng > AFRICA_BOX.lngMax) return false;
  return pip(lat, lng, AFRICA) || pip(lat, lng, MADAGASCAR);
}
const OTHER_POLYS = [
  N_AMERICA, GREENLAND, S_AMERICA, EUROPE, UK,
  ASIA, JAPAN, AUSTRALIA, NZ_N, NZ_S, SUMATRA, BORNEO,
];
function isLand(lat: number, lng: number): boolean {
  if (isAfrica(lat, lng)) return true;
  return OTHER_POLYS.some(p => pip(lat, lng, p));
}

/* ═══════════════════════════════════════════════
   BUILD ASCII CYLINDER TEXTURE
   Renders ASCII_LINES onto an offscreen canvas,
   returns a THREE.CanvasTexture that wraps the cylinder.
═══════════════════════════════════════════════ */
function buildAsciiTexture(isLight: boolean): THREE.CanvasTexture {
  const CW = 4096;      // canvas width  (circumference resolution)
  const CH = 512;       // canvas height (band height resolution)

  const canvas = document.createElement('canvas');
  canvas.width  = CW;
  canvas.height = CH;
  const ctx = canvas.getContext('2d')!;

  // Fully transparent background
  ctx.clearRect(0, 0, CW, CH);

  const fontSize = 38;
  ctx.font        = `bold ${fontSize}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textBaseline = 'top';

  // Sage green — brighter so it reads clearly
  ctx.fillStyle = isLight ? 'rgba(26,107,14,0.55)' : 'rgba(136,173,124,0.65)';

  const lineH    = CH / ASCII_LINES.length;
  const textW    = ctx.measureText(ASCII_LINES[0]).width;
  // Repeat the text horizontally to tile around full circumference
  const repeats  = Math.ceil(CW / textW) + 1;

  ASCII_LINES.forEach((line, i) => {
    for (let r = 0; r < repeats; r++) {
      ctx.fillText(line, r * textW, i * lineH);
    }
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS  = THREE.RepeatWrapping;
  tex.wrapT  = THREE.ClampToEdgeWrapping;
  // A single wrap around the cylinder
  tex.repeat.set(1, 1);
  return tex;
}

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
interface HackerGlobeProps {
  scale?: number;
}

const HackerGlobe: React.FC<HackerGlobeProps> = ({ scale = 0.88 }) => {
  const mountRef   = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { theme }  = useTheme();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const isLight = theme === 'light';
    let w = el.clientWidth, h = el.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '1';
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.z = 3.2;

    const globe = new THREE.Group();
    globe.scale.setScalar(scale);
    scene.add(globe);

    /* ── Ocean ── */
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.994, 64, 64),
      new THREE.MeshBasicMaterial({ color: isLight ? 0xf4f7f4 : 0x020403 }),
    ));

    /* ── Grid ── */
    const gridColor = isLight ? 0x88ad7c : 0x0a0f0d;
    const gridMat = new THREE.LineBasicMaterial({ color: gridColor, transparent: true, opacity: isLight ? 0.2 : 0.4 });
    for (let lat = -75; lat <= 75; lat += 20) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = Math.sin(phi), y = Math.cos(phi);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const t = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(t), y, r * Math.sin(t)));
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }
    for (let lng = 0; lng < 360; lng += 20) {
      const theta = (lng * Math.PI) / 180;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const phi = (i / 96) * Math.PI;
        pts.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta),
        ));
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    }

    /* ── Land poles ── */
    const STEP = 1.8;
    const worldSamples: THREE.Vector3[]  = [];
    const africaSamples: THREE.Vector3[] = [];

    for (let lat = -85; lat <= 85; lat += STEP) {
      for (let lng = -180; lng <= 180; lng += STEP) {
        const africa = isAfrica(lat, lng);
        if (!africa && !OTHER_POLYS.some(p => pip(lat, lng, p))) continue;
        const v = latLngToVec3(lat, lng, 1.0);
        if (africa) africaSamples.push(v);
        else        worldSamples.push(v);
      }
    }

    const buildPoles = (
      samples: THREE.Vector3[],
      color: number,
      height: number,
      radius: number,
      opacity: number,
    ): THREE.InstancedMesh => {
      const geo = new THREE.CylinderGeometry(radius * 0.3, radius, height, 5, 1);
      geo.translate(0, height / 2, 0);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity });
      const mesh = new THREE.InstancedMesh(geo, mat, samples.length);
      mesh.frustumCulled = false;
      const dummy = new THREE.Object3D();
      const up = new THREE.Vector3(0, 1, 0);
      samples.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.quaternion.setFromUnitVectors(up, pos.clone().normalize());
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      return mesh;
    };

    globe.add(buildPoles(
      worldSamples,
      isLight ? 0x5a9e50 : 0x2a3d28,
      isLight ? 0.028 : 0.022,
      0.0055,
      isLight ? 0.75 : 0.90,
    ));
    globe.add(buildPoles(
      africaSamples,
      isLight ? 0x1a6b0e : SAGE,
      isLight ? 0.042 : 0.036,
      0.0065,
      1.0,
    ));

    /* ── Ghana cluster ── */
    const ghanaSamples: THREE.Vector3[] = [];
    for (let dlat = -2.5; dlat <= 2.5; dlat += 0.7) {
      for (let dlng = -2.5; dlng <= 2.5; dlng += 0.7) {
        const la = 9.40 + dlat, ln = -0.85 + dlng;
        if (!isAfrica(la, ln)) continue;
        ghanaSamples.push(latLngToVec3(la, ln, 1.0));
      }
    }
    globe.add(buildPoles(
      ghanaSamples,
      isLight ? 0x1a6b0e : SAGE,
      isLight ? 0.065 : 0.055,
      0.0080,
      1.0,
    ));

    /* ════════════════════════════════════════════
       ASCII BAND — 3D cylinder wrapped around the
       globe, attached to the globe Group so it
       rotates with it exactly.

       CylinderGeometry(rTop, rBottom, height, segs)
       We use a tall-ish thin band above the equator.
       The cylinder is open-ended (openEnded=true),
       purely the curved surface face.
    ════════════════════════════════════════════ */
    const asciiBandRadius = 1.25;  // slightly outside the pole tips
    const asciiBandHeight = 1.10;  // band vertical extent — covers most of the globe height
    const asciiBandY      = 0.00;  // centred on equator

    const asciiTex = buildAsciiTexture(isLight);

    const bandGeo = new THREE.CylinderGeometry(
      asciiBandRadius,  // top radius
      asciiBandRadius,  // bottom radius (same = straight cylinder)
      asciiBandHeight,
      128,              // radial segments — smooth
      1,                // height segments
      true,             // open ended — no caps
    );

    const bandMat = new THREE.MeshBasicMaterial({
      map:         asciiTex,
      transparent: true,
      opacity:     1.0,
      side:        THREE.DoubleSide,   // visible from both inside and outside
      depthWrite:  false,
    });

    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.position.y = asciiBandY;
    // No extra rotation needed — it inherits globe.rotation.y automatically
    globe.add(bandMesh);   // ← attached to globe group = rotates with it

    /* ── Target pins ── */
    type PingObj = { ring: THREE.Mesh; phase: number; isHome: boolean };
    const pings: PingObj[]   = [];
    const hitMeshes: THREE.Mesh[] = [];

    TARGETS.forEach(({ lat, lng, status, region }) => {
      const pos    = latLngToVec3(lat, lng, 1.009);
      const col    = STATUS_COLOR[status];
      const isHome = status === 'home';
      const dotR   = isHome ? 0.013 : region === 'africa' ? 0.0095 : 0.0080;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(dotR, 8, 8),
        new THREE.MeshBasicMaterial({ color: col }),
      );
      dot.position.copy(pos);
      globe.add(dot);

      const ri = isHome ? 0.018 : 0.012;
      const ro = isHome ? 0.028 : 0.019;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(ri, ro, 24),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
      );
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globe.add(ring);
      pings.push({ ring, phase: Math.random() * Math.PI * 2, isHome });

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 6, 6),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
      );
      hit.position.copy(pos);
      globe.add(hit);
      hitMeshes.push(hit);
    });

    /* ── Arcs ── */
    type ArcObj = { curve: THREE.QuadraticBezierCurve3; geo: THREE.BufferGeometry; progress: number; speed: number };
    const arcs: ArcObj[] = [];

    const ARC_PAIRS: Array<[number, number]> = [
      [0, 1], [0, 3], [0, 5],
    ];

    ARC_PAIRS.forEach(([a, b]) => {
      const ta = TARGETS[a], tb = TARGETS[b];
      const s   = latLngToVec3(ta.lat, ta.lng, 1.01);
      const e_  = latLngToVec3(tb.lat, tb.lng, 1.01);
      const mid = s.clone().add(e_).normalize().multiplyScalar(1.15 + 0.1 * Math.random());
      const curve = new THREE.QuadraticBezierCurve3(s, mid, e_);
      const geo   = new THREE.BufferGeometry();
      const isAcc = a === 0 || b === 0;
      globe.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
        color:       isAcc ? (isLight ? 0x1a6b0e : SAGE) : (isLight ? 0x8ab88a : 0x1e2e24),
        transparent: true,
        opacity:     isAcc ? (isLight ? 0.25 : 0.15) : (isLight ? 0.10 : 0.20),
      })));
      arcs.push({ curve, geo, progress: Math.random(), speed: 0.001 + Math.random() * 0.0015 });
    });

    /* ── Satellites ── */
    type SatObj = {
      dot: THREE.Mesh; trailGeo: THREE.BufferGeometry;
      trailPts: THREE.Vector3[]; head: number;
      radius: number; inclination: number; phase: number; speed: number;
    };
    const sats: SatObj[] = [];
    const TRAIL = 20;

    [{ radius:1.35, inclination: Math.PI/4, speed:0.003, phase:0.0 }].forEach(cfg => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.002, 4, 4),
        new THREE.MeshBasicMaterial({ color: isLight ? 0x1a6b0e : 0xffffff, transparent: true, opacity: isLight ? 0.30 : 0.20 }),
      );
      scene.add(dot);
      const trailPts = Array.from({ length: TRAIL }, () => new THREE.Vector3());
      const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPts);
      scene.add(new THREE.Line(trailGeo,
        new THREE.LineBasicMaterial({ color: isLight ? 0x8ab88a : 0x2e4038, transparent: true, opacity: isLight ? 0.15 : 0.10 }),
      ));
      sats.push({ dot, trailGeo, trailPts, head: 0, ...cfg });
    });

    /* ── Tooltip ── */
    const raycaster = new THREE.Raycaster();
    const m2 = new THREE.Vector2();
    const onHover = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      m2.x =  ((e.clientX-rect.left)/rect.width)*2-1;
      m2.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(m2, camera);
      const hits = raycaster.intersectObjects(hitMeshes);
      const tip  = tooltipRef.current;
      if (!tip) return;
      if (hits.length) {
        const idx = hitMeshes.indexOf(hits[0].object as THREE.Mesh);
        if (idx < 0) { tip.style.display = 'none'; return; }
        const d = TARGETS[idx];
        if (!d.label) { tip.style.display = 'none'; return; }
        const sc = STATUS_HEX[d.status] || SAGE_HEX;
        tip.style.display = 'block';
        tip.style.left    = `${e.clientX-rect.left+16}px`;
        tip.style.top     = `${e.clientY-rect.top-12}px`;
        tip.textContent   = '';
        const lbl = Object.assign(document.createElement('span'), { textContent: d.label });
        lbl.style.cssText = `color:${d.status==='home'?SAGE_HEX:'#b0c8ab'};font-weight:600;letter-spacing:.09em`;
        const br  = document.createElement('br');
        const st  = Object.assign(document.createElement('span'), {
          textContent: d.status==='home' ? '◈ HQ · GHANA' : `● ${d.status.toUpperCase()}`,
        });
        st.style.cssText = `font-size:9px;letter-spacing:.12em;color:${sc}`;
        tip.append(lbl, br, st);
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
      last = now; tick += dt * 0.001;
      const rotStep = dt * 0.00035;  // very slow drift — fully readable
      globe.rotation.y += rotStep;

      pings.forEach(({ ring, isHome, phase }) => {
        const spd = isHome ? 1.3 : 1.9;
        const sc  = isHome ? 1.7 : 1.4;
        const s   = 1 + sc * ((Math.sin(tick * spd + phase) + 1) / 2);
        ring.scale.setScalar(s);
        (ring.material as THREE.MeshBasicMaterial).opacity = (isHome ? 0.80 : 0.65) * (1 - (s-1)/sc);
      });

      arcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        arc.geo.setFromPoints(arc.curve.getPoints(Math.max(2, Math.floor(arc.progress * 80))));
      });

      sats.forEach(sat => {
        const angle = tick * sat.speed * 60 + sat.phase;
        sat.dot.position.set(
          sat.radius * Math.cos(angle),
          sat.radius * Math.sin(angle) * Math.sin(sat.inclination),
          sat.radius * Math.sin(angle) * Math.cos(sat.inclination),
        );
        sat.trailPts[sat.head % TRAIL].copy(sat.dot.position);
        sat.head++;
        sat.trailGeo.setFromPoints([
          ...sat.trailPts.slice(sat.head % TRAIL),
          ...sat.trailPts.slice(0, sat.head % TRAIL),
        ]);
      });

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      w = el.clientWidth; h = el.clientHeight;
      if (h <= 0) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onHover);
      asciiTex.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [scale, theme]);

  return (
    <div className="relative h-full w-full overflow-visible">
      <div
        ref={mountRef}
        className="relative z-10 h-full w-full opacity-60"
        style={{ cursor: 'default', willChange: 'transform', contain: 'layout size style' }}
      >
        <div
          ref={tooltipRef}
          style={{
            display: 'none', position: 'absolute', pointerEvents: 'none',
            background: theme === 'light' ? 'rgba(232,237,231,0.95)' : 'rgba(3,5,4,0.92)',
            border: '1px solid rgba(136,173,124,0.20)',
            borderRadius: '3px', padding: '7px 12px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
            color: theme === 'light' ? '#1a6b0e' : '#8aab84',
            zIndex: 10, lineHeight: 1.75,
            whiteSpace: 'nowrap', backdropFilter: 'blur(6px)',
          }}
        />
      </div>
    </div>
  );
};

export default HackerGlobe;
