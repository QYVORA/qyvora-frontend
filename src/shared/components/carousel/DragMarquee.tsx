/**
 * DragMarquee.tsx
 * Location: src/shared/components/carousel/DragMarquee.tsx
 *
 * Infinite horizontal marquee whose strip can be grabbed and dragged.
 * Motion is rAF-driven instead of a CSS keyframe loop so dragging can take
 * over the offset mid-flight and hand it back smoothly: on release the strip
 * keeps its fling velocity and eases back to the base scroll speed.
 *
 * Content is rendered twice and the offset wraps at half the track width,
 * which produces a seamless loop as long as both copies are identical.
 *
 * Accessibility:
 *  - Decorative by itself; callers keep interactive content reachable.
 *  - A drag wider than the threshold suppresses the trailing click so a
 *    scrub does not activate a card link underneath the pointer.
 *  - honours prefers-reduced-motion: renders a static, natively scrollable row.
 *  - Pauses when offscreen or when the tab is hidden.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface DragMarqueeProps {
  children: React.ReactNode;
  /** Base auto-scroll speed in px/s. */
  speed?: number;
  /** Scroll right-to-left by default; true flips the direction. */
  reverse?: boolean;
  className?: string;
  /** Classes for each content copy (gaps, padding between cards). */
  trackClassName?: string;
}

const DRAG_CLICK_THRESHOLD_PX = 10;

const DragMarquee: React.FC<DragMarqueeProps> = ({ children, speed = 26, reverse = false, className, trackClassName }) => {
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const anim = useRef({
    offset: 0,
    halfWidth: 0,
    raf: 0,
    last: 0,
    visible: true,
    running: false,
    vel: 0,
    dragging: false,
    lastX: 0,
    moveVel: 0,
    lastMoveT: 0,
    dragDistance: 0,
  });
  const reverseRef = useRef(reverse);
  reverseRef.current = reverse;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    anim.current.halfWidth = track.scrollWidth / 2;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    const s = anim.current;
    if (!track || s.halfWidth <= 0) return;
    track.style.transform = `translate3d(${-s.offset}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || shouldReduceMotion) return;

    const s = anim.current;

    const startLoop = () => {
      if (s.running || !s.visible) return;
      s.running = true;
      s.last = 0;
      s.raf = requestAnimationFrame(step);
    };

    const stopLoop = () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
    };

    const step = (now: number) => {
      if (!s.running) return;
      s.raf = requestAnimationFrame(step);

      const dt = s.last > 0 ? Math.min(now - s.last, 64) : 16.667;
      s.last = now;

      if (!s.dragging) {
        // Ease the current velocity back to the base marquee speed.
        const target = speedRef.current * (reverseRef.current ? -1 : 1);
        s.vel += (target - s.vel) * Math.min(1, dt / 260);
        s.offset += (s.vel * dt) / 1000;
      }

      const hw = s.halfWidth;
      if (hw > 0) {
        if (s.offset >= hw) s.offset -= hw;
        if (s.offset < 0) s.offset += hw;
        applyTransform();
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const io = new IntersectionObserver((entries) => {
      s.visible = entries[0]?.isIntersecting ?? true;
      if (s.visible) startLoop();
      else stopLoop();
    }, { threshold: 0 });
    io.observe(viewport);

    const handleVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    startLoop();

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [applyTransform, measure, shouldReduceMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const s = anim.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.dragDistance = 0;
    s.moveVel = 0;
    s.vel = 0;
    viewportRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = anim.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.dragDistance += Math.abs(dx);
    s.offset -= dx;

    const now = performance.now();
    const dt = Math.max(s.lastMoveT > 0 ? now - s.lastMoveT : 16, 1);
    s.lastMoveT = now;
    // Smooth the instantaneous velocity so release momentum feels stable.
    s.moveVel = 0.8 * s.moveVel + 0.2 * ((-dx / dt) * 1000);
    applyTransform();
  };

  const endDrag = () => {
    const s = anim.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.vel = Math.abs(s.moveVel) > 40 ? s.moveVel : 0;
    s.lastMoveT = 0;
  };

  // Swallow the click that follows a real drag so cards do not navigate mid-scrub.
  const onClickCapture = (e: React.MouseEvent) => {
    if (anim.current.dragDistance > DRAG_CLICK_THRESHOLD_PX) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-x-auto no-scrollbar ${className ?? ''}`}>
        <div className={`flex w-max items-stretch ${trackClassName ?? ''}`}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className={`cursor-grab select-none touch-pan-y active:cursor-grabbing ${className ?? ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
    >
      <div ref={trackRef} className="flex w-max items-stretch will-change-transform">
        <div className={`flex items-stretch shrink-0 ${trackClassName ?? ''}`}>{children}</div>
        <div className={`flex items-stretch shrink-0 ${trackClassName ?? ''}`} aria-hidden="true" inert>{children}</div>
      </div>
    </div>
  );
};

export default DragMarquee;
