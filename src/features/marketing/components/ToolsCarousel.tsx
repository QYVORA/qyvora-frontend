import React, { useState, useCallback, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import { useSwipeNav } from '@/core/hooks/useSwipeNav';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import CodeBlock from '@/shared/components/CodeBlock';

export interface ToolCarouselItem {
  id: string;
  index: string;
  icon: LucideIcon | React.FC<{ size?: number | string; className?: string }>;
  title: string;
  description: string;
  meta?: string;
  code: string;
}

interface ToolsCarouselProps {
  modules: ToolCarouselItem[];
  kicker?: string;
  title?: string;
  accent?: string;
  label?: string;
  className?: string;
}

const ToolsCarousel: React.FC<ToolsCarouselProps> = ({
  modules,
  kicker,
  title,
  accent,
  label = 'Module',
  className = '',
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = modules.length;
  const prefersReduced = useReducedMotion();

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1 >= total ? 0 : prev + 1));
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 < 0 ? total - 1 : prev - 1));
  }, [total]);

  const { containerProps } = useAutoPlay({
    onNext: next,
    duration: 8000,
    disabled: total <= 1 || prefersReduced,
  });

  const swipeHandlers = useSwipeNav({ onPrevious: prev, onNext: next });

  useEffect(() => {
    if (prefersReduced) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, prefersReduced]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '4%' : '-4%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-4%' : '4%',
      opacity: 0,
    }),
  };

  if (!modules.length) return null;

  const module = modules[current];
  const Icon = module.icon;

  return (
    <div
      className={`relative w-full min-h-dvh flex flex-col ${className}`}
      {...containerProps}
    >
      <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 my-auto">
        <div className="overflow-x-clip touch-pan-y select-none cursor-grab active:cursor-grabbing" {...swipeHandlers}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={module.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-8 lg:gap-12">
              {/* Left column — module details */}
              <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
                {kicker && title && accent && current === 0 && (
                  <div className="mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                      {kicker}
                    </span>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tight leading-none mt-1">
                      {title} <span className="text-accent">{accent}</span>
                    </h2>
                  </div>
                )}

                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                  {label} {module.index}
                </span>

                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-tight mt-3">
                  {module.title}
                </h3>

                <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 max-w-xl line-clamp-3">
                  {module.description}
                </p>

                {module.meta && (
                  <span className="mt-4 inline-flex w-fit items-center rounded-lg border border-accent/30 bg-accent/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-accent">
                    {module.meta}
                  </span>
                )}

                <div className="mt-6">
                  <CodeBlock code={module.code} lang="sh" />
                </div>
              </div>

              {/* Right column — module icon (first-class section visual) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-accent/5" />
                  <div className="absolute inset-[15%] rounded-full bg-accent/10" />
                  <div className="absolute inset-[30%] rounded-full bg-accent/15" />
                  <Icon className="relative z-10 w-24 h-24 text-accent" />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Navigation — arrows + dots */}
        {total > 1 && (
          <div className="flex items-center justify-between mt-10 md:mt-14">
            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label={`Previous ${label.toLowerCase()}`}
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label={`Next ${label.toLowerCase()}`}
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {modules.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Go to ${label.toLowerCase()} ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-accent w-5'
                      : 'bg-border hover:bg-text-muted'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
              {current + 1} / {total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsCarousel;
