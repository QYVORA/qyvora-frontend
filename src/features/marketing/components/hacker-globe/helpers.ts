import * as THREE from 'three';
import { ACCENT_COLOR, ACCENT_COLOR_HEX, MAP_COLOR_HEX } from './data';

export type BBox = { minLat: number; maxLat: number; minLng: number; maxLng: number };

export function getBBox(poly: number[]): BBox {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (let i = 0; i < poly.length; i += 2) {
    const lat = poly[i], lng = poly[i+1];
    if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

export function latLngToVec3(lat: number, lng: number, r = 1): THREE.Vector3 {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function pip(lat: number, lng: number, poly: number[], bbox?: BBox): boolean {
  if (bbox) {
    if (lat < bbox.minLat || lat > bbox.maxLat || lng < bbox.minLng || lng > bbox.maxLng) return false;
  }
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

const AFRICA_BBOX = getBBox(AFRICA);
const MADAGASCAR_BBOX = getBBox(MADAGASCAR);
const N_AMERICA_BBOX = getBBox(N_AMERICA);
const GREENLAND_BBOX = getBBox(GREENLAND);
const S_AMERICA_BBOX = getBBox(S_AMERICA);
const EUROPE_BBOX = getBBox(EUROPE);
const ASIA_BBOX = getBBox(ASIA);
const JAPAN_BBOX = getBBox(JAPAN);
const AUSTRALIA_BBOX = getBBox(AUSTRALIA);
const NZ_N_BBOX = getBBox(NZ_N);
const NZ_S_BBOX = getBBox(NZ_S);
const SUMATRA_BBOX = getBBox(SUMATRA);
const BORNEO_BBOX = getBBox(BORNEO);

function isAfrica(lat: number, lng: number): boolean {
  if (lat < -36 || lat > 38 || lng < -18 || lng > 52) return false;
  return pip(lat, lng, AFRICA, AFRICA_BBOX) || pip(lat, lng, MADAGASCAR, MADAGASCAR_BBOX);
}

const OTHER_POLYS = [
  { p: N_AMERICA, b: N_AMERICA_BBOX },
  { p: GREENLAND, b: GREENLAND_BBOX },
  { p: S_AMERICA, b: S_AMERICA_BBOX },
  { p: EUROPE,    b: EUROPE_BBOX    },
  { p: ASIA,      b: ASIA_BBOX      },
  { p: JAPAN,     b: JAPAN_BBOX     },
  { p: AUSTRALIA, b: AUSTRALIA_BBOX },
  { p: NZ_N,      b: NZ_N_BBOX      },
  { p: NZ_S,      b: NZ_S_BBOX      },
  { p: SUMATRA,   b: SUMATRA_BBOX   },
  { p: BORNEO,    b: BORNEO_BBOX    },
];

function isLand(lat: number, lng: number): boolean {
  return isAfrica(lat, lng) || OTHER_POLYS.some(({ p, b }) => pip(lat, lng, p, b));
}

const TEXTURE_CACHE = new Map<string, THREE.CanvasTexture>();

export function buildDotMapTexture(isLight: boolean, step = 1.8): THREE.CanvasTexture {
  const cacheKey = `${isLight}-${step}`;
  if (TEXTURE_CACHE.has(cacheKey)) return TEXTURE_CACHE.get(cacheKey)!;

  const W = step > 2 ? 1024 : 2048, H = step > 2 ? 512 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, W, H);

  const dotR      = (step / 180) * H * (step > 2 ? 0.50 : 0.38);
  const landFill  = MAP_COLOR_HEX;

  for (let lat = 89; lat >= -89; lat -= step) {
    for (let lng = -179; lng <= 179; lng += step) {
      if (!isLand(lat, lng)) continue;

      const x = ((lng + 180) / 360) * W;
      const y = ((90 - lat) / 180) * H;

      ctx.globalAlpha = 1.0;
      ctx.fillStyle   = landFill;

      ctx.beginPath();
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  TEXTURE_CACHE.set(cacheKey, tex);
  return tex;
}
