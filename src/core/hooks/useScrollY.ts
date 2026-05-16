/**
 * useScrollY.ts
 * Location: src/core/hooks/useScrollY.ts
 *
 * Hook that tracks the current vertical scroll position.
 *
 * Handles two scroll sources:
 *   - Window-level scroll  (the user scrolling the whole page)
 *   - Element-level scroll (an inner scrollable div, e.g. a modal or sidebar)
 *
 * Both are unified into a single `scrollY` number so consumers do not need
 * to care about which scroll container is active.
 *
 * @returns The current scroll position in pixels (integer, ≥ 0).
 *
 * Performance notes:
 *   passive: true  — tells the browser this listener will never call
 *                    event.preventDefault(). This allows the browser to
 *                    optimise scroll handling on the GPU thread without
 *                    waiting for the JS listener to finish. Always use this
 *                    for scroll listeners that only read scroll position.
 *
 *   capture: true  — registers the listener on the capture phase rather than
 *                    the bubble phase. Scroll events do not bubble in the
 *                    standard DOM, so capture phase is required to intercept
 *                    scroll events from nested scrollable elements. Without
 *                    this, only window-level scrolls would be detected.
 */

import { useState, useEffect } from 'react';

export const useScrollY = () => {
  // Initialised to 0 — the page starts at the top before any scrolling occurs.
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    /**
     * Fires on every scroll event anywhere in the document tree.
     *
     * The event target can be either the Document (for window scrolls) or
     * an HTMLElement (for element-level scrolls). We discriminate between
     * them using instanceof to read the correct scroll position property:
     *
     *   Document    → window.scrollY    (the page's own scroll offset)
     *   HTMLElement → element.scrollTop (the element's internal scroll offset)
     */
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document;

      if (target instanceof Document) {
        // Window-level scroll — read from window, not document, because
        // document.scrollTop is unreliable across browsers.
        setScrollY(window.scrollY);
      } else if (target instanceof HTMLElement) {
        // Element-level scroll (e.g. a scrollable container inside the page)
        setScrollY(target.scrollTop);
      }
    };

    // Register in the capture phase (capture: true) so scroll events from
    // nested scrollable elements are also intercepted. passive: true allows
    // the browser to optimise scroll rendering without blocking on this handler.
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    // Cleanup: remove the listener on unmount. capture: true must be passed
    // here as well — removeEventListener requires the same options object
    // that was used during addEventListener to correctly identify and remove
    // the right listener.
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, []); // Empty dependency array — the listener is set up once on mount.

  return scrollY;
};