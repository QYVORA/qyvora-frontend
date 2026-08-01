import { useEffect, useMemo, useState } from 'react';

export interface GlobeFluid {
  scale: number;
  offset: [number, number, number];
}

const MIN_W = 360;
const MAX_W = 1440;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Fluid sizing for the HackerGlobe. Interpolates the globe scale and world
 * offset smoothly between the smallest supported viewport and a full desktop
 * width so the globe looks balanced at every screen size instead of snapping
 * between a fixed mobile/desktop pair.
 */
export function useFluidGlobe(): GlobeFluid {
  const [w, setW] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : MAX_W));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(window.innerWidth));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return useMemo(() => {
    const t = clamp((w - MIN_W) / (MAX_W - MIN_W), 0, 1);
    const scale = 0.55 + t * 0.45;
    const offsetX = 0.6 + t * 0.3;
    const offsetY = -0.3 - t * 0.4;
    return { scale, offset: [offsetX, offsetY, 0] as [number, number, number] };
  }, [w]);
}

export default useFluidGlobe;
