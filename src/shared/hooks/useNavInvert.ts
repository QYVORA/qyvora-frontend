import { useEffect, useRef, useState } from 'react';

interface UseNavInvertOptions {
  navHeight?: number;
}

/**
 * Detects whether any element with `data-nav-invert` attribute overlaps
 * with the fixed navbar at the top of the viewport.
 *
 * Uses scroll + resize listener with getBoundingClientRect for
 * reliable detection, plus MutationObserver to catch DOM changes.
 *
 * Any section that needs to trigger navbar color inversion should add
 * `data-nav-invert` to its root element. This hook scans for those
 * elements and returns `true` when one overlaps the navbar zone.
 *
 * @param options.navHeight - Height of the navbar in px (default: 80)
 */
export function useNavInvert(options?: UseNavInvertOptions): boolean {
  const [inverted, setInverted] = useState(false);
  const navHeight = options?.navHeight ?? 80;
  const rafId = useRef(0);

  useEffect(() => {
    let lastResult = false;

    const check = () => {
      const els = document.querySelectorAll<HTMLElement>('[data-nav-invert]');
      let found = false;

      for (const el of els) {
        const rect = el.getBoundingClientRect();
        if (rect.top < navHeight && rect.bottom > 0) {
          found = true;
          break;
        }
      }

      if (found !== lastResult) {
        lastResult = found;
        setInverted(found);
      }

      rafId.current = 0;
    };

    const scheduleCheck = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(check);
    };

    // Run once synchronously on mount to avoid flash
    check();

    const observer = new MutationObserver(scheduleCheck);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      observer.disconnect();
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
    };
  }, [navHeight]);

  return inverted;
}
