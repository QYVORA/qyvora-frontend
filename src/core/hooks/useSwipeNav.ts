/**
 * useSwipeNav.ts
 * Location: src/core/hooks/useSwipeNav.ts
 *
 * Threshold-based horizontal swipe navigation for slide carousels.
 * Returns pointer handlers to spread onto the slide viewport; when the
 * gesture is predominantly horizontal and passes the threshold the matching
 * callback fires and the trailing click is suppressed so the swipe does not
 * activate a link inside the slide.
 *
 * Vertical scrolling stays native: `touch-pan-y` keeps vertical pans on the
 * browser while horizontal moves are delivered here.
 */

import { useRef } from 'react';

interface SwipeNavOptions {
  onPrevious: () => void;
  onNext: () => void;
  /** Minimum horizontal distance in px before a swipe registers. */
  threshold?: number;
}

interface SwipeNavHandlers {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: () => void;
  onClickCapture: (e: React.MouseEvent) => void;
}

export function useSwipeNav({ onPrevious, onNext, threshold = 48 }: SwipeNavOptions): SwipeNavHandlers {
  const origin = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!e.isPrimary || e.button > 0) return;
    origin.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };

  const resolve = (e: React.PointerEvent<HTMLElement>) => {
    const start = origin.current;
    origin.current = null;
    if (!start || !e.isPrimary) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // Predominantly horizontal gestures only — leave vertical scrolls alone.
    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swiped.current = true;
      if (dx < 0) onNext();
      else onPrevious();
    }
  };

  return {
    onPointerDown,
    onPointerUp: resolve,
    onPointerCancel: () => {
      origin.current = null;
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (swiped.current) {
        e.preventDefault();
        e.stopPropagation();
        swiped.current = false;
      }
    },
  };
}
