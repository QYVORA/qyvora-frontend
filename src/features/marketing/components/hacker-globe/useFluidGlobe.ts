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
    let debounceTimer = 0;
    
    const onResize = () => {
      cancelAnimationFrame(raf);
      clearTimeout(debounceTimer);
      
      raf = requestAnimationFrame(() => {
        debounceTimer = window.setTimeout(() => {
          setVp((prev) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            // Ignore height-only changes (mobile URL-bar show/hide during scroll)
            // so the globe stays stable instead of nudging on every scroll tick.
            if (w === prev.w) return prev;
            
            // Sanity check viewport dimensions
            if (w <= 0 || h <= 0) return prev;
            
            return { w, h };
          });
        }, 50);
      });
    };
    
    window.addEventListener('resize', onResize, { passive: true });
    
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(debounceTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return useMemo(() => {
    const t = clamp((vp.w - MIN_W) / (MAX_W - MIN_W), 0, 1);
    const scale = 0.55 + t * 0.45;

    const aspect = vp.w / vp.h;
    const halfW = HALF_H * aspect;

    // On-screen centre of the globe as viewport fractions, pinned in the
    // bottom-right corner on every screen size. Keeping these constant means
    // the world offset scales with the aspect ratio so the big sphere's arc
    // hugs the corner at all widths instead of drifting toward the middle of
    // the page when the window is minimized.
    const centerX = 0.84;
    const centerY = 0.98;

    const offsetX = (2 * centerX - 1) * halfW;
    const offsetY = (1 - 2 * centerY) * HALF_H;

    return { scale, offset: [offsetX, offsetY, 0] as [number, number, number] };
  }, [vp]);
}

export default useFluidGlobe;
