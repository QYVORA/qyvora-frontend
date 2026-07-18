import { useEffect, useRef, RefObject } from 'react';

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
      stagger = 0,
    } = opts;

    const targets = stagger ? Array.from(el.children) : [el];
    const effectiveTargets = targets.length ? targets : [el];

    effectiveTargets.forEach((target, i) => {
      const t = target as HTMLElement;
      t.style.opacity = String(opacity);
      t.style.transform = `translate(${x}px, ${y}px)`;
      t.style.transition = `none`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          effectiveTargets.forEach((target, i) => {
            const t = target as HTMLElement;
            t.style.transition = `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay + (stagger ? i * stagger : 0)}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay + (stagger ? i * stagger : 0)}s`;
            t.style.opacity = '1';
            t.style.transform = 'translate(0, 0)';
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);

    return () => observer.disconnect();
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

    const { duration = 1.5, prefix = '', suffix = '' } = opts;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * endValue);
            el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);

    return () => observer.disconnect();
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

    const { duration = 1, delay = 0, stagger = 0.1 } = opts;

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
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
      }
    });

    const filledDots = el.querySelectorAll<SVGCircleElement>('circle[fill="currentColor"], circle[fill="var(--color-accent)"]');
    filledDots.forEach((dot) => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0)';
      dot.style.transformOrigin = 'center center';
      dot.style.transition = `transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + duration * 0.7}s, opacity 0.35s ease ${delay + duration * 0.7}s`;
    });

    const textEls = el.querySelectorAll<SVGTextElement>('text');
    textEls.forEach((text) => {
      text.style.opacity = '0';
      text.style.transform = 'scale(0.5)';
      text.style.transformOrigin = 'center center';
      text.style.transition = `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + duration * 0.6}s, opacity 0.4s ease ${delay + duration * 0.6}s`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          strokeEls.forEach((path, i) => {
            path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay + i * stagger}s`;
            path.style.strokeDashoffset = '0';
          });

          filledDots.forEach((dot) => {
            dot.style.opacity = '1';
            dot.style.transform = 'scale(1)';
          });

          textEls.forEach((text) => {
            text.style.opacity = '1';
            text.style.transform = 'scale(1)';
          });

          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);

    return () => observer.disconnect();
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

    const { scale = 1.02, y = -4, duration = 0.3, boxShadow } = opts;

    el.style.transition = `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`;

    const enter = () => {
      el.style.transform = `scale(${scale}) translateY(${y}px)`;
      if (boxShadow) el.style.boxShadow = boxShadow;
    };
    const leave = () => {
      el.style.transform = 'scale(1) translateY(0)';
      el.style.boxShadow = 'none';
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
