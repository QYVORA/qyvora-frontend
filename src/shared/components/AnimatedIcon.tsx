import React, { useRef, useEffect } from 'react';
import { gsap } from '@/shared/utils/gsapSetup';

interface AnimatedIconProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'hover';
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  className = '',
  duration = 0.8,
  delay = 0,
  trigger = 'mount',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const animate = () => {
    const el = containerRef.current;
    if (!el || (hasAnimated.current && trigger === 'mount')) return;

    const svg = el.querySelector('svg');
    if (!svg) return;

    hasAnimated.current = true;
    const tweens: gsap.core.Tween[] = [];

    // 1. Stroke-based elements → path-draw via strokeDashoffset
    const strokeEls = svg.querySelectorAll<SVGPathElement | SVGRectElement | SVGLineElement>(
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
            ease: 'power2.inOut',
          })
        );
      }
    });

    // 2. Filled paths (fill="currentColor") → clip-path reveal from top
    const filledPaths = svg.querySelectorAll<SVGPathElement>('path[fill="currentColor"], path[fill="var(--color-accent)"]');
    filledPaths.forEach((path) => {
      // Get bounding box for clip-path
      try {
        const bbox = path.getBBox();
        const clipId = `clip-${Math.random().toString(36).slice(2, 8)}`;
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.id = clipId;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', String(bbox.x));
        rect.setAttribute('y', String(bbox.y));
        rect.setAttribute('width', String(bbox.width));
        rect.setAttribute('height', String(bbox.height));
        clipPath.appendChild(rect);
        svg.appendChild(clipPath);
        path.setAttribute('clip-path', `url(#${clipId})`);

        tweens.push(
          gsap.fromTo(rect, { attr: { height: 0 } }, {
            attr: { height: bbox.height },
            duration: duration * 0.8,
            delay: delay + duration * 0.3,
            ease: 'power2.out',
          })
        );
      } catch { /* getBBox can fail on hidden elements */ }
    });

    // 3. Stroke-based circles → path-draw
    const strokeCircles = svg.querySelectorAll<SVGCircleElement>('circle:not([fill]), circle[fill="none"]');
    strokeCircles.forEach((circle) => {
      const r = parseFloat(circle.getAttribute('r') || '0');
      const length = 2 * Math.PI * r;
      if (length > 0) {
        gsap.set(circle, { strokeDasharray: length, strokeDashoffset: length });
        tweens.push(
          gsap.to(circle, {
            strokeDashoffset: 0,
            duration,
            delay,
            ease: 'power2.inOut',
          })
        );
      }
    });

    // 4. Filled dots (small circles with fill="currentColor") → scale pop
    const filledDots = svg.querySelectorAll<SVGCircleElement>('circle[fill="currentColor"], circle[fill="var(--color-accent)"]');
    filledDots.forEach((dot) => {
      const r = parseFloat(dot.getAttribute('r') || '0');
      if (r <= 3) {
        tweens.push(
          gsap.fromTo(dot, { scale: 0, transformOrigin: 'center center', opacity: 0 }, {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            delay: delay + duration * 0.7,
            ease: 'back.out(2.5)',
          })
        );
      }
    });

    // 5. Text elements → fade + slight scale
    const textEls = svg.querySelectorAll<SVGTextElement>('text');
    textEls.forEach((text) => {
      tweens.push(
        gsap.fromTo(text, { opacity: 0, scale: 0.5, transformOrigin: 'center center' }, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          delay: delay + duration * 0.6,
          ease: 'back.out(1.8)',
        })
      );
    });

    return () => tweens.forEach((t) => t.kill());
  };

  useEffect(() => {
    if (trigger === 'mount') {
      return animate();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={trigger === 'hover' ? animate : undefined}
    >
      {children}
    </div>
  );
};

export default AnimatedIcon;
