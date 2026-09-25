import React, { useEffect, useState } from 'react';
import QyvoraMark from '@/shared/components/brand/QyvoraMark';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const SPLASH_HOLD_MS = 1100;
const SPLASH_FADE_MS = 420;
const REDUCED_HOLD_MS = 250;
const DELAYED_LOADER_MS = 140;

/**
 * Minimal full-screen QYVORA loader.
 *
 * A single accent ring spinning around the QYVORA mark on a flat black
 * backdrop — no text, no terminal chrome, nothing to read. Cheap for every
 * device (pure CSS animation) and identically good on mobile and desktop.
 *
 * This component is the visual only and stays mounted until its parent
 * unmounts it (Suspense fallback, auth gates).
 */
const PageLoader: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg"
  >
    <span className="sr-only">Loading QYVORA</span>
    <div className="relative flex h-28 w-28 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full border-2 border-accent/15 border-t-accent animate-spin"
        aria-hidden="true"
      />
      <QyvoraMark className="h-10 w-10" aria-hidden="true" />
    </div>
  </div>
);

/**
 * Suspense fallback variant — defers mounting so sub-140 ms fast loads never
 * flash the loader.
 */
export const DelayedPageLoader: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShow(true), DELAYED_LOADER_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return show ? <PageLoader /> : null;
};

/**
 * App boot splash — the reload experience.
 *
 * Mounted once at the very top of the app tree (independent of Suspense and
 * auth), it ALWAYS completes its own animation timeline (hold → fade → remove)
 * regardless of how fast the page underneath finishes loading. This is what
 * guarantees the loader never "just flashes" on refresh.
 */
export const SplashLoader: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  const hold = prefersReduced ? REDUCED_HOLD_MS : SPLASH_HOLD_MS;
  const fade = prefersReduced ? REDUCED_HOLD_MS : SPLASH_FADE_MS;

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), hold);
    const hideTimer = window.setTimeout(() => setGone(true), hold + fade);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [hold, fade]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ transitionDuration: `${fade}ms` }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-bg transition-opacity ease-[var(--ease-smooth)] ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="sr-only">Loading QYVORA</span>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-accent/15 border-t-accent animate-spin"
          aria-hidden="true"
        />
        <QyvoraMark className="h-10 w-10" aria-hidden="true" />
      </div>
    </div>
  );
};

export default PageLoader;