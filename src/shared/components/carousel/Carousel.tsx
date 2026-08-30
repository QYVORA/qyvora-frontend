import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { IconChevronRight } from '@/shared/components/icons';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import { useSwipeNav } from '@/core/hooks/useSwipeNav';

export interface CarouselProps<T extends { id: string }> {
  slides: readonly T[];
  renderCard: (slide: T, index: number) => React.ReactNode;
  className?: string;
  autoPlayInterval?: number;
  showArrows?: boolean;
}

function Carousel<T extends { id: string }>({
  slides,
  renderCard,
  className = '',
  autoPlayInterval = 5000,
  showArrows = true,
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = slides.length;
  const prefersReducedMotion = useReducedMotion();

  const next = useCallback(() => {
    const nextIndex = current + 1 >= total ? 0 : current + 1;
    setDirection(1);
    setCurrent(nextIndex);
  }, [current, total]);

  const prev = useCallback(() => {
    const prevIndex = current - 1 < 0 ? total - 1 : current - 1;
    setDirection(-1);
    setCurrent(prevIndex);
  }, [current, total]);

  const { containerProps } = useAutoPlay({
    onNext: next,
    duration: autoPlayInterval,
    disabled: total <= 1 || !!prefersReducedMotion,
  });

  // Drag/swipe the slide area to change slides (arrows stay as fallback).
  const swipeHandlers = useSwipeNav({ onPrevious: prev, onNext: next });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  if (!slides.length) return null;

  return (
    <div className={`relative group ${className}`} {...containerProps}>
      <div
        className="overflow-hidden rounded-2xl border border-border/50 bg-accent-dim cursor-grab touch-pan-y select-none active:cursor-grabbing"
        {...swipeHandlers}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slides[current].id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full"
          >
            {renderCard(slides[current], current)}
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && showArrows && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-[color,background-color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-[color,background-color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-smooth)] shadow-lg"
          >
            <IconChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default Carousel;
