import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';

export interface SharedCarouselProps<T extends { id: string }> {
  slides: readonly T[];
  renderCard?: (slide: T) => React.ReactNode;
  renderContent?: (slide: T) => React.ReactNode;
  renderIcon?: (slide: T) => React.ReactNode;
  renderImageOverlay?: (slide: T) => React.ReactNode;
  getImage?: (slide: T) => string | undefined | null;
  getImageAlt?: (slide: T) => string;
  autoPlayInterval?: number;
  containerClassName?: string;
  cardClassName?: string;
  imageHeightClasses?: string;
  showMobileNav?: boolean;
  slideOffset?: number;
  enableBlur?: boolean;
  disableAutoPlay?: boolean;
}

function SharedCarousel<T extends { id: string }>({
  slides,
  renderCard,
  renderContent,
  renderIcon,
  renderImageOverlay,
  getImage,
  getImageAlt,
  autoPlayInterval = 6000,
  containerClassName,
  cardClassName,
  imageHeightClasses,
  showMobileNav = true,
  slideOffset = 30,
  enableBlur = false,
  disableAutoPlay = false,
}: SharedCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleNext = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (slides.length <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const { containerProps } = useAutoPlay({
    onNext: handleNext,
    duration: autoPlayInterval,
    disabled: shouldReduceMotion || disableAutoPlay || slides.length <= 1,
  });

  useEffect(() => {
    if (slides.length > 0 && activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [slides.length]);

  const hasMultipleSlides = slides.length > 1;
  const current = slides[activeIndex];
  const useDefaultLayout = !renderCard;

  const blurEnter = enableBlur ? { filter: 'blur(8px)' } : {};
  const blurCenter = enableBlur ? { filter: 'blur(0px)' } : {};
  const blurExit = enableBlur ? { filter: 'blur(8px)' } : {};

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? slideOffset : -slideOffset,
      opacity: 0,
      ...blurEnter,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      ...blurCenter,
    },
    exit: (d: number) => ({
      zIndex: 0,
      x: d < 0 ? slideOffset : -slideOffset,
      opacity: 0,
      ...blurExit,
    }),
  };

  if (slides.length === 0) return null;

  const wrapperClasses = containerClassName !== undefined
    ? containerClassName
    : 'w-full px-4 sm:px-6 md:px-10 py-20 md:pt-28 lg:pt-32 md:pb-16';

  const defaultCardClasses = `flex flex-col lg:flex-row overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card/40 dark:backdrop-blur-sm dark:shadow-2xl ${cardClassName ?? 'min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] xl:min-h-[480px]'}`;

  return (
    <div className={wrapperClasses} {...containerProps}>
      <div className="max-w-[1600px] mx-auto w-full relative group/carousel">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              ...(enableBlur ? { filter: { duration: 0.4 } } : {}),
            }}
            className="relative w-full"
          >
            {useDefaultLayout ? (
              <div className="max-w-5xl xl:max-w-6xl mx-auto relative">
                <div className={defaultCardClasses}>
                  <div className={`w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden lg:self-stretch ${imageHeightClasses ?? 'h-[240px] sm:h-[300px] lg:h-full'} bg-accent/5`}>
                    {getImage && current && getImage(current) && (
                      <img
                        key={current.id}
                        src={getImage(current)!}
                        alt={getImageAlt ? getImageAlt(current) : ''}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    {renderIcon && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {renderIcon(current)}
                      </div>
                    )}
                    {renderImageOverlay && renderImageOverlay(current)}
                  </div>
                  <div className="flex-1 flex flex-col p-8 sm:p-10 lg:p-14 xl:p-16 justify-start lg:justify-center">
                    <div className="max-w-xl">
                      {renderContent && renderContent(current)}
                    </div>
                  </div>
                </div>

                {hasMultipleSlides && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-20">
                    <button
                      onClick={handlePrev}
                      className="-translate-x-1/2 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="translate-x-1/2 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-5xl xl:max-w-6xl mx-auto relative">
                {renderCard(current)}

                {hasMultipleSlides && (
                  <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-20">
                    <button
                      onClick={handlePrev}
                      className="-translate-x-1/2 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="translate-x-1/2 w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {hasMultipleSlides && (
          <>
            <div className="flex lg:hidden items-center justify-center gap-3 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    idx === activeIndex
                      ? 'w-6 h-2 bg-accent'
                      : 'w-2 h-2 bg-text-muted/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SharedCarousel;
