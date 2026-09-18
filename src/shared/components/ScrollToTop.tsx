import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — resets window scroll to the top on every route change.
 * (The floating scroll-to-top button was intentionally removed — the fixed
 * student sidebar is the only persistent dashboard chrome.)
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.documentElement.scrollTo({ top: 0, behavior: 'auto' });
      document.body.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
