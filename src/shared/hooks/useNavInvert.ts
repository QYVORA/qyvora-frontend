import { useEffect, useState } from 'react';

/**
 * Detects whether any element with `data-nav-invert` attribute overlaps
 * with the fixed Navbar (80px tall at the top of the viewport).
 *
 * Uses scroll + resize listener with getBoundingClientRect for
 * reliable detection, plus MutationObserver to catch DOM changes.
 */
export function useNavInvert(): boolean {
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    const navHeight = 80;
    let ticking = false;

    const check = () => {
      const els = document.querySelectorAll<HTMLElement>('[data-nav-invert]');
      let found = false;

      for (const el of els) {
        const rect = el.getBoundingClientRect();
        // Check if element overlaps the navbar zone (top 0 → navHeight)
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

    // Initial check after a frame to let React mount
    requestAnimationFrame(check);

    // Also check on DOM mutations (for lazy-loaded components)
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
  }, []);

  return inverted;
}
