import { useEffect, useState } from 'react';

/**
 * Detects whether any element with `data-nav-invert` attribute overlaps
 * with the fixed Navbar (80px tall at the top of the viewport).
 *
 * Uses IntersectionObserver + MutationObserver + rAF delay to
 * reliably track elements regardless of render timing.
 */
export function useNavInvert(): boolean {
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    const navHeight = 80;
    const observed = new Set<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        const anyIntersecting = entries.some((e) => e.isIntersecting);
        setInverted(anyIntersecting);
      },
      {
        rootMargin: `-${navHeight}px 0px -100% 0px`,
        threshold: 0,
      },
    );

    const observeAll = () => {
      document.querySelectorAll('[data-nav-invert]').forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    // Delay initial observe to let React finish mounting accent sections
    const raf = requestAnimationFrame(() => {
      observeAll();
      // Second pass for elements that mounted after the first rAF
      requestAnimationFrame(observeAll);
    });

    // Watch for DOM changes (dynamic elements)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return inverted;
}
