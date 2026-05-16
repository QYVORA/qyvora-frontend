/**
 * useCountUp.ts
 * Location: src/core/hooks/useCountUp.ts
 *
 * Hook that animates a number counting up from 0 to a target value.
 * Used by stat counters on the landing page (e.g. "1,200+ Students").
 *
 * The animation uses requestAnimationFrame for smooth, frame-rate-independent
 * rendering, and an easeOutExpo easing curve so the number accelerates quickly
 * and then decelerates as it approaches the final value — giving it a natural,
 * satisfying feel rather than a mechanical linear count.
 *
 * @param end      - The target number to count up to.
 * @param duration - Total animation duration in milliseconds (default: 2000 ms).
 * @param trigger  - When false the counter stays at 0 and does not animate.
 *                   Pass an IntersectionObserver-driven boolean to start the
 *                   animation only when the stat is scrolled into view.
 *
 * @returns The current animated count value as an integer.
 */

import { useState, useEffect } from 'react';

export const useCountUp = (end: number, duration: number = 2000, trigger: boolean = true) => {
  // Holds the currently displayed count. Starts at 0 and ticks up each frame.
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Do nothing until the trigger condition is met (e.g. element in viewport).
    if (!trigger) return;

    // `startTime` is null until the first animation frame fires, at which
    // point it is set to that frame's timestamp. All subsequent frame
    // calculations are relative to this moment.
    let startTime: number | null = null;

    // Stores the requestAnimationFrame handle so we can cancel it on cleanup.
    let animationFrame: number;

    /**
     * Called on every animation frame by the browser.
     *
     * @param timestamp - DOMHighResTimeStamp provided by the browser,
     *                    representing the time (in ms) since the page loaded.
     */
    const animate = (timestamp: number) => {
      // Capture the start time on the very first frame.
      if (!startTime) startTime = timestamp;

      // How many milliseconds have elapsed since the animation started.
      const progress = timestamp - startTime;

      // Normalise progress to a 0–1 range. Math.min clamps it at 1 so we
      // never overshoot even if a frame fires slightly late.
      const percentage = Math.min(progress / duration, 1);

      /**
       * easeOutExpo: 1 - 2^(-10 * t)
       *
       * This curve starts very fast (near 0) and asymptotically approaches 1,
       * making the number race up quickly then slow to a smooth stop at `end`.
       * The exponent -10 controls how aggressively it decelerates — higher
       * values produce a sharper deceleration.
       */
      const easing = 1 - Math.pow(2, -10 * percentage);

      // Apply easing to the target value and floor to an integer so the
      // displayed number is always whole (no decimals in the counter).
      setCount(Math.floor(easing * end));

      if (percentage < 1) {
        // Animation still in progress — request the next frame.
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Animation complete — set the exact target value to correct any
        // floating-point rounding error that Math.floor may have introduced
        // on the final frame.
        setCount(end);
      }
    };

    // Kick off the animation loop on the next available frame.
    animationFrame = requestAnimationFrame(animate);

    // Cleanup: cancel any pending frame when the component unmounts or when
    // `end`, `duration`, or `trigger` changes. Without this, a stale animation
    // loop would continue running and calling setState on an unmounted component.
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, trigger]);

  return count;
};