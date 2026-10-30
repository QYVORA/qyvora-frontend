import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const BUTTON_SELECTOR = 'button, [role="button"]';

const DISABLED_SELECTOR = '[disabled], [aria-disabled="true"]';

const ROOT_CLASS = 'qyvora-cursor';
const BURST_LIMIT = 40;

/**
 * CustomCursor — site-wide desktop pointer with a button press animation.
 *
 * The pointer itself is a native CSS image cursor (`public/cursors/qyvora-arrow.svg`),
 * so the browser composites it without JavaScript, z-index overlays or per-frame
 * pointer tracking. This keeps it in sync with the OS pointer, preserves native
 * cursor semantics (text, select, grab, not-allowed), and means it cannot fall
 * behind modals or disappear when an overlay unmounts.
 *
 * This component only owns the decorative click/press burst. It mounts once in
 * App.tsx, self-gates on `(hover: hover) and (pointer: fine)`, and does nothing
 * on touch devices or when reduced motion is requested.
 */
const CustomCursor: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const reducedRef = useRef(prefersReduced);
  const [enabled, setEnabled] = React.useState(false);
  const burstRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    reducedRef.current = prefersReduced;
  }, [prefersReduced]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (typeof window.matchMedia !== 'function') return;
    const fineMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      setEnabled(fineMq.matches);
      document.documentElement.classList.toggle(ROOT_CLASS, fineMq.matches);
    };
    sync();
    if (typeof fineMq.addEventListener === 'function') {
      fineMq.addEventListener('change', sync);
    } else {
      // Legacy Safari (<14) — addListener is deprecated but the only option.
      fineMq.addListener(sync);
    }
    return () => {
      if (typeof fineMq.removeEventListener === 'function') {
        fineMq.removeEventListener('change', sync);
      } else {
        fineMq.removeListener(sync);
      }
      document.documentElement.classList.remove(ROOT_CLASS);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const layer = burstRef.current;
    if (!layer) return;

    const removeWhenDone = (holder: HTMLElement, animated: HTMLElement, duration: number) => {
      let removed = false;
      const remove = () => {
        if (removed) return;
        removed = true;
        holder.remove();
      };
      animated.addEventListener('animationend', remove, { once: true });
      window.setTimeout(remove, duration + 150);
    };

    const spawnBurst = (x: number, y: number) => {
      if (reducedRef.current) return;
      while (layer.childElementCount >= BURST_LIMIT) {
        const oldest = layer.firstElementChild;
        if (!oldest) break;
        oldest.remove();
      }

      const rippleDuration = 480;
      const rippleWrap = document.createElement('span');
      rippleWrap.className = 'cc-burst-wrap';
      rippleWrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const ripple = document.createElement('span');
      ripple.className = 'cc-ripple';
      ripple.style.setProperty('--cc-burst-duration', `${rippleDuration}ms`);
      ripple.style.setProperty('--cc-burst-scale', '2.2');
      rippleWrap.appendChild(ripple);
      layer.appendChild(rippleWrap);
      removeWhenDone(rippleWrap, ripple, rippleDuration);

      const count = 8;
      const radius = 34;
      const baseAngle = Math.random() * Math.PI * 2;
      for (let i = 0; i < count; i += 1) {
        const angle = baseAngle + (i / count) * Math.PI * 2;
        const sparkDuration = 440;
        const sparkWrap = document.createElement('span');
        sparkWrap.className = 'cc-burst-wrap';
        sparkWrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        const spark = document.createElement('span');
        spark.className = 'cc-spark';
        spark.style.setProperty('--cc-burst-duration', `${sparkDuration}ms`);
        spark.style.setProperty('--cc-dx', `${Math.cos(angle) * radius}px`);
        spark.style.setProperty('--cc-dy', `${Math.sin(angle) * radius}px`);
        sparkWrap.appendChild(spark);
        layer.appendChild(sparkWrap);
        removeWhenDone(sparkWrap, spark, sparkDuration);
      }
    };

    const onPress = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return;
      const el = e.target instanceof Element ? e.target : null;
      if (!el?.closest(BUTTON_SELECTOR) || el.closest(DISABLED_SELECTOR)) return;
      spawnBurst(e.clientX, e.clientY);
    };

    const hasPointerEvents = typeof window.PointerEvent === 'function';
    const pressType = hasPointerEvents ? 'pointerdown' : 'mousedown';

    document.addEventListener(pressType, onPress, { capture: true, passive: true });

    return () => {
      document.removeEventListener(pressType, onPress, true);
      if (typeof layer.replaceChildren === 'function') {
        layer.replaceChildren();
      } else {
        while (layer.firstChild) layer.removeChild(layer.firstChild);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="qyvora-cursor-root" aria-hidden="true">
      <span ref={burstRef} className="cc-burst-layer" />
    </div>
  );
};

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
