/**
 * useAdaptiveUi.ts
 * Location: src/core/hooks/useAdaptiveUi.ts
 *
 * Hook that detects the user's device capabilities and accessibility
 * preferences and returns a profile that components can use to decide
 * how much visual complexity to render.
 *
 * The returned `constrainedDevice` flag is the primary signal — when true,
 * components should prefer simpler rendering: fewer particles, no heavy
 * Three.js scenes, reduced animation, lower-resolution assets, etc.
 *
 * Four signals contribute to `constrainedDevice`:
 *   isMobile           — viewport width ≤ 767 px (reactive to resize)
 *   saveData           — user has enabled "Data Saver" in their browser/OS
 *   lowMemory          — device has ≤ 4 GB RAM (Network Information API)
 *   reduceMotionPreference — user has enabled "Reduce Motion" in OS settings
 *
 * Any one of these being true causes `constrainedDevice` to be true.
 * This is intentionally conservative — it is better to under-render on a
 * capable device than to over-render on a constrained one.
 *
 * Browser API compatibility notes:
 *   - navigator.deviceMemory is a non-standard API (Chrome/Edge only).
 *     The typeof guard means it is safely ignored on Firefox/Safari.
 *   - navigator.connection.saveData is also non-standard.
 *     Both are progressive enhancements — the hook works without them.
 */

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Extends the standard Navigator type to include non-standard properties
 * that are available in Chromium-based browsers only.
 * Typed as optional so all accesses are forced to check for existence.
 */
type DeviceMemoryNavigator = Navigator & {
  deviceMemory?: number;                     // RAM in GB (Chromium only)
  connection?: { saveData?: boolean };       // Data Saver flag (Chromium only)
};

export function useAdaptiveUi() {
  // useReducedMotion() reads the prefers-reduced-motion CSS media query and
  // returns true when the user has enabled Reduce Motion in their OS settings.
  // Sourced from Framer Motion so it stays in sync with MotionConfig.
  const reduceMotionPreference = useReducedMotion();

  // Initialise isMobile from the current viewport width synchronously so the
  // very first render already has the correct value — no flash of wrong layout.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');

    // Update state whenever the viewport crosses the 767 px breakpoint.
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    // Re-read the current value on mount in case it changed between the
    // useState initialiser and this effect running (rare but possible).
    setIsMobile(media.matches);

    media.addEventListener('change', onChange);

    // Remove the listener on unmount to prevent a memory leak.
    return () => media.removeEventListener('change', onChange);
  }, []); // Empty dependency array — the media query listener is set up once.

  /**
   * Computes the full device profile. Memoized so the object reference is
   * stable between renders unless isMobile or reduceMotionPreference changes,
   * preventing unnecessary re-renders in components that consume this hook.
   *
   * saveData and lowMemory are read inside useMemo rather than useState
   * because they do not change during a session — no reactive listener is
   * needed for them.
   */
  const profile = useMemo(() => {
    const nav = navigator as DeviceMemoryNavigator;

    // True if the user has enabled Data Saver mode in their browser or OS.
    const saveData = Boolean(nav.connection?.saveData);

    // True if the device reports ≤ 4 GB of RAM. The typeof guard is critical
    // here — on browsers that do not implement deviceMemory, the property is
    // undefined and the comparison would produce NaN without the guard.
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;

    // The master "should we simplify rendering?" flag. We no longer include
    // isMobile here by default, as modern mobile devices are highly capable.
    // Constrained mode is now only triggered by explicit "low end" signals.
    const constrainedDevice = saveData || lowMemory || Boolean(reduceMotionPreference);

    return {
      isMobile,
      saveData,
      lowMemory,
      reduceMotionPreference: Boolean(reduceMotionPreference),
      constrainedDevice,
    };
  }, [isMobile, reduceMotionPreference]);
  // saveData and lowMemory are intentionally omitted from deps — they are
  // static for the session and do not need to trigger recomputation.

  return profile;
}