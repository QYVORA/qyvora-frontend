/**
 * Scroll-to-step navigation helper for walkthrough pages.
 *
 * Walkthrough steps render on a single page (courses, labs and bootcamp rooms all
 * keep every step mounted and just move which one is expanded), so "go to step
 * N" means scrolling to that step's anchor id rather than navigating.
 *
 * The retry matters: clicking Next updates the active step and React then swaps
 * which section is expanded. The target id only exists after that commit, so a
 * single immediate lookup usually finds nothing and the navigation silently does
 * nothing. We therefore retry on an interval until the element appears, and give
 * up after ~1s.
 */

/** Retry cadence and ceiling — ~20 attempts at 50ms gives React time to commit. */
const RETRY_LIMIT = 20;
const RETRY_INTERVAL_MS = 50;

/**
 * Scrolls to the element with the given id, retrying until React commits it.
 *
 * @param id       Element id to scroll to (e.g. `lesson-3`, `step-4`, `ws-step-2`).
 * @param behavior Scroll behavior; callers should pass 'auto' when the user has
 *                 asked for reduced motion.
 */
export function scrollToStepId(id: string, behavior: ScrollBehavior = 'smooth'): void {
  if (typeof document === 'undefined') return;

  const attempt = (tries: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    if (tries >= RETRY_LIMIT) return;
    window.setTimeout(() => attempt(tries + 1), RETRY_INTERVAL_MS);
  };

  requestAnimationFrame(() => attempt(0));
}