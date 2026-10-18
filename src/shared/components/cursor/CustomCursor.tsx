import React, { useEffect, useRef } from 'react';
import { MousePointer2, Pointer as FingerPointer } from 'lucide-react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'summary',
  'label',
  'select',
  'input',
  '[role="button"]',
  '[role="link"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[data-cursor-hover]',
].join(',');

const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [contenteditable="true"]';

const DISABLED_SELECTOR = '[disabled], [aria-disabled="true"]';

const ROOT_CLASS = 'qyvora-cursor';
const BURST_LIMIT = 40;

/**
 * CustomCursor — site-wide desktop cursor (gamification layer).
 *
 * Mounted once in App.tsx. On fine-pointer devices (`pointer: fine`) it adds
 * `qyvora-cursor` to <html> (hiding the native cursor via index.css) and
 * renders an arrow-shaped pointer — lucide MousePointer2 filled with the
 * accent and stroked in on-accent, the same two-tone texture as .btn-primary.
 * Over interactive targets it morphs like a native cursor would: the arrow
 * swaps to a pointing finger (lucide Pointer) and a square HUD bracket frame
 * snaps on around the target. The glyph tracks the pointer 1:1 (no trailing
 * lag), squishes on press, and fires a click burst — square HUD flash plus
 * radiating pixel sparks, driven by CSS animations so the effect works in
 * browsers without the Web Animations API.
 *
 * Browser support: PointerEvent listeners fall back to mouse events, the
 * MediaQueryList listener falls back to the legacy addListener, and nothing
 * mounts when matchMedia is unavailable. Text-entry surfaces keep the native
 * I-beam; reduced-motion users get no bursts; disabled controls never lock
 * on; touch devices never see any of it.
 */
const CustomCursor: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const reducedRef = useRef(prefersReduced);
  const [enabled, setEnabled] = React.useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);
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
    const root = rootRef.current;
    const wrap = pointerRef.current;
    if (!root || !wrap) return;

    let hover = false;
    let press = false;

    const position = (x: number, y: number) => {
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const setHidden = (hidden: boolean) => {
      if ((root.dataset.hidden === 'true') !== hidden) root.dataset.hidden = String(hidden);
    };

    const applyState = () => {
      root.dataset.state = press ? 'press' : hover ? 'hover' : 'default';
      root.dataset.hover = String(hover);
    };

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

    const spawnBurst = (x: number, y: number, strong: boolean) => {
      if (reducedRef.current) return;
      const layer = burstRef.current;
      if (!layer) return;
      while (layer.childElementCount >= BURST_LIMIT) {
        const oldest = layer.firstElementChild;
        if (!oldest) break;
        oldest.remove();
      }

      const rippleDuration = strong ? 480 : 380;
      const rippleWrap = document.createElement('span');
      rippleWrap.className = 'cc-burst-wrap';
      rippleWrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const ripple = document.createElement('span');
      ripple.className = 'cc-ripple';
      ripple.style.setProperty('--cc-burst-duration', `${rippleDuration}ms`);
      ripple.style.setProperty('--cc-burst-scale', strong ? '2.2' : '1.5');
      rippleWrap.appendChild(ripple);
      layer.appendChild(rippleWrap);
      removeWhenDone(rippleWrap, ripple, rippleDuration);

      const count = strong ? 8 : 4;
      const radius = strong ? 34 : 20;
      const baseAngle = Math.random() * Math.PI * 2;
      for (let i = 0; i < count; i += 1) {
        const angle = baseAngle + (i / count) * Math.PI * 2;
        const sparkDuration = strong ? 440 : 360;
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

    const hasCoords = (e: MouseEvent) => Number.isFinite(e.clientX) && Number.isFinite(e.clientY);

    const onMove = (e: MouseEvent) => {
      if (!hasCoords(e)) return;
      const el = e.target instanceof Element ? e.target : null;
      position(e.clientX, e.clientY);

      if (el && el.closest(TEXT_SELECTOR)) {
        hover = false;
        applyState();
        setHidden(true);
        return;
      }

      setHidden(false);
      const interactive = el ? el.closest(INTERACTIVE_SELECTOR) : null;
      const disabled = el ? el.closest(DISABLED_SELECTOR) : null;
      hover = Boolean(interactive) && !disabled;
      applyState();
    };

    const onDown = (e: MouseEvent) => {
      if (!hasCoords(e)) return;
      position(e.clientX, e.clientY);
      press = true;
      setHidden(false);
      applyState();
      spawnBurst(e.clientX, e.clientY, hover);
    };

    const onUp = () => {
      if (!press) return;
      press = false;
      applyState();
    };

    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      press = false;
      hover = false;
      applyState();
      setHidden(true);
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') return;
      press = false;
      hover = false;
      applyState();
      setHidden(true);
    };

    root.dataset.hidden = 'true';
    root.dataset.state = 'default';
    root.dataset.hover = 'false';

    const hasPointerEvents = typeof window.PointerEvent === 'function';
    const moveType = hasPointerEvents ? 'pointermove' : 'mousemove';
    const downType = hasPointerEvents ? 'pointerdown' : 'mousedown';
    const outType = hasPointerEvents ? 'pointerout' : 'mouseout';

    window.addEventListener(moveType, onMove, { passive: true });
    window.addEventListener(downType, onDown, { passive: true });
    // Real browsers fire pointerup + a compatibility mouseup; listening to
    // both is safe (onUp is idempotent) and covers mouse-only fallback.
    window.addEventListener(hasPointerEvents ? 'pointerup' : 'mouseup', onUp, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener(outType, onOut, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener(moveType, onMove);
      window.removeEventListener(downType, onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener(outType, onOut);
      document.removeEventListener('visibilitychange', onVisibility);
      const layer = burstRef.current;
      if (layer) {
        if (typeof layer.replaceChildren === 'function') {
          layer.replaceChildren();
        } else {
          while (layer.firstChild) layer.removeChild(layer.firstChild);
        }
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="qyvora-cursor-root" data-hidden="true" data-state="default" data-hover="false" aria-hidden="true">
      <span ref={pointerRef} className="cc-pointer-wrap">
        <MousePointer2
          className="cc-pointer cc-arrow"
          width={30}
          height={30}
          fill="var(--color-accent)"
          stroke="var(--color-on-accent)"
          strokeWidth={2}
          aria-hidden="true"
        />
        <FingerPointer
          className="cc-pointer cc-finger"
          width={30}
          height={30}
          fill="var(--color-accent)"
          stroke="var(--color-on-accent)"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="cc-lock" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      <span ref={burstRef} className="cc-burst-layer" />
    </div>
  );
};

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
