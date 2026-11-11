import { useEffect, useState } from 'react';

interface ScrollDirectionOptions {
  /** Distance from the top before hiding is allowed. */
  threshold?: number;
  /** Minimum pixel delta before a direction change counts (ignores jitter). */
  delta?: number;
  /** Disable hiding entirely (e.g. while an overlay is open). */
  disabled?: boolean;
  /** Force the bar visible (menus, focus, dialogs). */
  forceVisible?: boolean;
  /** Reset to visible whenever this changes (route changes). */
  resetKey?: unknown;
}

/**
 * useScrollDirection — hides on scroll down, reveals on scroll up.
 *
 * One passive scroll listener throttled with requestAnimationFrame; no layout
 * reads inside the loop beyond `scrollY`. Also publishes
 * `--app-topbar-offset` on <html> so sticky rails can follow the bar.
 */
export function useScrollDirection({
  threshold = 80,
  delta = 6,
  disabled = false,
  forceVisible = false,
  resetKey,
}: ScrollDirectionOptions = {}): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [resetKey]);

  useEffect(() => {
    if (disabled || forceVisible) {
      setHidden(false);
      return;
    }

    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const diff = y - lastY;

      if (y < threshold) {
        setHidden(false);
      } else if (diff > delta) {
        setHidden(true);
      } else if (diff < -delta) {
        setHidden(false);
      }

      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold, delta, disabled, forceVisible]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-topbar-offset', hidden ? '0px' : 'var(--app-topbar-h)');
    return () => {
      root.style.removeProperty('--app-topbar-offset');
    };
  }, [hidden]);

  return hidden;
}
