import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { IconChevronRight } from '@/shared/components/icons';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';

export interface CarouselProps<T extends { id: string }> {
  slides: readonly T[];
  renderCard: (slide: T, index: number) => React.ReactNode;
  className?: string;
  autoPlayInterval?: number;
}

function Carousel<T extends { id: string }>({
  slides,
  renderCard,
  className = '',
  autoPlayInterval = 5000,
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

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
    disabled: total <= 1,
  });

  if (!slides.length) return null;

  return (
    <div className={`relative ${className}`} {...containerProps}>
      <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim">
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

      {total > 1 && (
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'bg-accent w-6'
                    : 'bg-border/50 w-2 hover:bg-accent/40'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent transition-colors"
            >
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
