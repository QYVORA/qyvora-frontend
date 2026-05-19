import { useEffect } from 'react';

/**
 * useScrollLock
 * ─────────────────────────────────────────────────────────────────────────────
 * Locks the body scroll when the component is mounted.
 * Useful for custom modals/overlays that don't use a library like Radix UI.
 */
export function useScrollLock(lock: boolean = true) {
  useEffect(() => {
    if (!lock) return;

    // Save original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Cleanup: restore original style
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}
