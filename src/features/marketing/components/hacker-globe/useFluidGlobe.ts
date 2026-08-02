import { useEffect, useMemo, useState } from 'react';

export interface GlobeFluid {
  scale: number;
  offset: [number, number, number];
}

const MIN_W = 360;
const MAX_W = 1440;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Camera projection constant — must stay in sync with HackerGlobe.tsx
// (camera z = 2.1, vertical fov = 38°): half-height of the visible world
// volume at the globe plane.
const HALF_H = Math.tan((38 * Math.PI) / 360) * 2.1;

/**
 * Fluid sizing for the HackerGlobe. Interpolates the globe scale and world
 * offset smoothly between the smallest supported viewport and a full desktop
 * width so the globe looks balanced at every screen size instead of snapping
 * between a fixed mobile/desktop pair.
 */
export function useFluidGlobe(): GlobeFluid {
  const [vp, setVp] = useState<{ w: number; h: number }>(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : MAX_W,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setVp({ w: window.innerWidth, h: window.innerHeight }),
      );
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return useMemo(() => {
    const t = clamp((vp.w - MIN_W) / (MAX_W - MIN_W), 0, 1);
    const scale = 0.55 + t * 0.45;

    const aspect = vp.w / vp.h;
    const halfW = HALF_H * aspect;

    // On-screen centre of the globe as viewport fractions. The horizontal
    // offset is computed from the aspect ratio so the globe stays anchored in
    // the bottom-right area on every screen instead of being pushed off-screen
    // on narrow viewports.
    const centerX = 0.72 + t * 0.12;
    const centerY = 0.72 + t * 0.26;

    const offsetX = (2 * centerX - 1) * halfW;
    const offsetY = (1 - 2 * centerY) * HALF_H;

    return { scale, offset: [offsetX, offsetY, 0] as [number, number, number] };
  }, [vp]);
}

export default useFluidGlobe;
