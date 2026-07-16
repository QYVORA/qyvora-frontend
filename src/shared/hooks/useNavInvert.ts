import { useEffect, useState } from 'react';

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

  useEffect(() => {
    let ticking = false;

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

      setInverted(found);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);

    const observer = new MutationObserver(() => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-nav-invert']
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [navHeight]);

  return inverted;
}
