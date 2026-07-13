import { useEffect, useRef, RefObject } from 'react';
import { gsap, ScrollTrigger } from '../utils/gsapSetup';

/* ──────────── Reveal ──────────── */
interface RevealOpts {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  scrollTrigger?: boolean;
  start?: string;
}

export function useGsapReveal<T extends HTMLElement>(
  opts: RevealOpts = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 30,
      x = 0,
      opacity = 0,
      duration = 0.7,
      delay = 0,
      ease = 'power3.out',
      stagger = 0,
      scrollTrigger = true,
      start = 'top 85%',
    } = opts;

    const children = stagger ? Array.from(el.children) : [el];
    const targets = children.length ? children : [el];

    const fromVars = { y, x, opacity: 0, duration: 0 };
    const toVars: gsap.TweenVars = {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease,
      stagger: stagger || undefined,
      overwrite: true,
    };

    if (scrollTrigger) {
      toVars.scrollTrigger = {
        trigger: el,
        start,
        once: true,
      };
    }

    const tween = gsap.fromTo(targets, fromVars, toVars);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/* ──────────── Counter ──────────── */
interface CounterOpts {
  duration?: number;
  ease?: string;
  prefix?: string;
  suffix?: string;
}

export function useGsapCounter<T extends HTMLElement>(
  endValue: number,
  opts: CounterOpts = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 1.5, ease = 'power2.out', prefix = '', suffix = '' } = opts;

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: endValue,
      duration,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        el.textContent = `${prefix}${Math.round(counter.value).toLocaleString()}${suffix}`;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [endValue]);

  return ref;
}

/* ──────────── Path Draw ──────────── */
interface PathDrawOpts {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export function useGsapPathDraw<T extends HTMLElement>(
  opts: PathDrawOpts = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 1, delay = 0, ease = 'power2.inOut', stagger = 0.1 } = opts;
    const tweens: gsap.core.Tween[] = [];

    // Stroke-based paths → dashoffset draw
    const strokeEls = el.querySelectorAll<SVGPathElement | SVGRectElement | SVGLineElement>(
      'path:not([fill]), path[fill="none"], rect:not([fill]), rect[fill="none"], line',
    );
    strokeEls.forEach((path) => {
      let length: number;
      if (path instanceof SVGLineElement) {
        const x1 = parseFloat(path.getAttribute('x1') || '0');
        const y1 = parseFloat(path.getAttribute('y1') || '0');
        const x2 = parseFloat(path.getAttribute('x2') || '0');
        const y2 = parseFloat(path.getAttribute('y2') || '0');
        length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      } else if (path instanceof SVGRectElement) {
        const w = parseFloat(path.getAttribute('width') || '0');
        const h = parseFloat(path.getAttribute('height') || '0');
        const rx = parseFloat(path.getAttribute('rx') || '0');
        length = 2 * (w + h - 2 * rx) + (rx > 0 ? 2 * Math.PI * rx : 0);
      } else {
        length = (path as SVGPathElement).getTotalLength?.() || 0;
      }
      if (length > 0) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        tweens.push(
          gsap.to(path, {
            strokeDashoffset: 0,
            duration,
            delay,
            ease,
            stagger,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        );
      }
    });

    // Filled circles → scale pop
    const filledDots = el.querySelectorAll<SVGCircleElement>('circle[fill="currentColor"], circle[fill="var(--color-accent)"]');
    filledDots.forEach((dot) => {
      const r = parseFloat(dot.getAttribute('r') || '0');
      if (r <= 3) {
        tweens.push(
          gsap.fromTo(dot, { scale: 0, transformOrigin: 'center center', opacity: 0 }, {
            scale: 1, opacity: 1, duration: 0.35,
            delay: delay + duration * 0.7, ease: 'back.out(2.5)',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        );
      }
    });

    // Text elements → fade + scale
    const textEls = el.querySelectorAll<SVGTextElement>('text');
    textEls.forEach((text) => {
      tweens.push(
        gsap.fromTo(text, { opacity: 0, scale: 0.5, transformOrigin: 'center center' }, {
          opacity: 1, scale: 1, duration: 0.4,
          delay: delay + duration * 0.6, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      );
    });

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return ref;
}

/* ──────────── Hover Lift ──────────── */
interface HoverOpts {
  scale?: number;
  y?: number;
  duration?: number;
  ease?: string;
  boxShadow?: string;
}

export function useGsapHover<T extends HTMLElement>(
  opts: HoverOpts = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { scale = 1.02, y = -4, duration = 0.3, ease = 'power2.out', boxShadow } = opts;

    const enter = () => {
      gsap.to(el, { scale, y, duration, ease, overwrite: true, ...(boxShadow ? { boxShadow } : {}) });
    };
    const leave = () => {
      gsap.to(el, { scale: 1, y: 0, duration, ease, overwrite: true, boxShadow: 'none' });
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);

    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return ref;
}
