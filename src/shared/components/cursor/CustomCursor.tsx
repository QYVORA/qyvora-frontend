import React, { useEffect, useRef } from 'react';
import { MousePointer2 } from 'lucide-react';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

const BUTTON_SELECTOR = 'button, [role="button"]';

const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"]), textarea, [contenteditable="true"]';

const DISABLED_SELECTOR = '[disabled], [aria-disabled="true"]';

const ROOT_CLASS = 'qyvora-cursor';
const BURST_LIMIT = 40;

/**
 * CustomCursor — site-wide desktop pointer with a button click animation.
 *
 * Mounted once in App.tsx. On fine-pointer devices (`pointer: fine`) it adds
 * `qyvora-cursor` to <html> (hiding the native cursor via index.css) and
 * renders an arrow-shaped pointer — lucide MousePointer2 filled with the
 * accent and stroked in on-accent, the same two-tone texture as .btn-primary.
 * The arrow tracks pointer movement directly. A square flash and small sparks
 * play only after a button is clicked.
 *
 * Browser support: PointerEvent listeners fall back to mouse events, the
 * MediaQueryList listener falls back to the legacy addListener, and nothing
 * mounts when matchMedia is unavailable. Text-entry surfaces keep the native
 * I-beam; reduced-motion users get no bursts; disabled controls do not animate;
 * touch devices never see any of it.
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

    const position = (x: number, y: number) => {
      wrap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const setHidden = (hidden: boolean) => {
      if ((root.dataset.hidden === 'true') !== hidden) root.dataset.hidden = String(hidden);
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
        setHidden(true);
        return;
      }

      setHidden(false);
    };

    const onClick = (e: MouseEvent) => {
      if (!hasCoords(e)) return;
      const el = e.target instanceof Element ? e.target : null;
      if (!el?.closest(BUTTON_SELECTOR) || el.closest(DISABLED_SELECTOR)) return;
      position(e.clientX, e.clientY);
      spawnBurst(e.clientX, e.clientY, true);
    };

    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      setHidden(true);
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'hidden') return;
      setHidden(true);
    };

    root.dataset.hidden = 'true';
    const hasPointerEvents = typeof window.PointerEvent === 'function';
    const moveType = hasPointerEvents ? 'pointermove' : 'mousemove';
    const outType = hasPointerEvents ? 'pointerout' : 'mouseout';

    window.addEventListener(moveType, onMove, { passive: true });
    document.addEventListener('click', onClick, { capture: true, passive: true });
    window.addEventListener(outType, onOut, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener(moveType, onMove);
      document.removeEventListener('click', onClick, true);
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
    <div ref={rootRef} className="qyvora-cursor-root" data-hidden="true" aria-hidden="true">
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
      </span>
      <span ref={burstRef} className="cc-burst-layer" />
    </div>
  );
};

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
