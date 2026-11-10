import { useState, useEffect } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getReducedMotionQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY);
}

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(
    () => getReducedMotionQuery()?.matches ?? false,
  );

  useEffect(() => {
    const mq = getReducedMotionQuery();
    if (!mq) return;

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
