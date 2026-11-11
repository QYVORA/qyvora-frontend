import { useEffect } from 'react';

/**
 * Marks the document as a signed-in app surface.
 *
 * Sets `data-ui="app"` on <html> so the scoped token block in
 * `src/styles/index.css` flips radii, weights, fonts and micro-type across the
 * whole app — including Radix portals that render into <body>. Public marketing
 * pages never call this hook, so they keep the legacy look.
 */
export function useAppUiScope(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.ui = 'app';
    return () => {
      delete root.dataset.ui;
    };
  }, [enabled]);
}

export default useAppUiScope;
