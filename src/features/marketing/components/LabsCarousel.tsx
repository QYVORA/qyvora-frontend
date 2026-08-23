import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Star, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

interface Lab {
  id: string;
  route: string;
  accentColor: string;
  difficulty: string;
  cpReward: string;
}

interface LabsCarouselProps {
  labs: readonly Lab[];
  getLabTitle: (id: string) => string;
  getLabDescription: (id: string) => string;
  className?: string;
}

const DIFFICULTY_BASE: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-accent border-accent/30 bg-accent/10',
  intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
};

const LabsCarousel: React.FC<LabsCarouselProps> = ({
  labs,
  getLabTitle,
  getLabDescription,
  className = '',
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = labs.length;
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

  if (!labs.length) return null;

  const lab = labs[current];
  const baseDiff = lab.difficulty.split('-')[0];
  const diffLabel = DIFFICULTY_BASE[baseDiff] || baseDiff;
  const diffColor = DIFFICULTY_COLORS[baseDiff] || DIFFICULTY_COLORS.beginner;

  return (
    <div
      className={`relative w-full min-h-dvh flex flex-col ${className}`}
      {...containerProps}
    >
      <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 my-auto">
        <div className="overflow-x-clip">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={lab.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-8 lg:gap-12">
              {/* Left column — lab details */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                  Lab {String(current + 1).padStart(2, '0')}
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-tight mt-3">
                  {getLabTitle(lab.id)}
                </h2>

                <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 max-w-xl line-clamp-3">
                  {getLabDescription(lab.id)}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${diffColor}`}>
                    <Star className="h-2.5 w-2.5" /> {diffLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft size={14} className="text-text-muted" />
                    <span className="font-mono text-sm font-black text-text-primary">
                      {lab.cpReward} CP
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to={lab.route}
                  className="btn-primary inline-flex items-center gap-2 mt-8 self-start px-6 py-2.5"
                >
                  <Zap className="w-4 h-4" /> Launch Lab <IconArrowRight size={14} />
                </Link>
              </div>

              {/* Right column — lab visual (first-class section element) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                  {/* Large accent-colored visual using lab's brand color */}
                  <div
                    className="absolute inset-0 rounded-full opacity-10"
                    style={{ backgroundColor: lab.accentColor }}
                  />
                  <div
                    className="absolute inset-[15%] rounded-full opacity-20"
                    style={{ backgroundColor: lab.accentColor }}
                  />
                  <div
                    className="absolute inset-[30%] rounded-full opacity-30"
                    style={{ backgroundColor: lab.accentColor }}
                  />
                  {/* Lab icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 w-24 h-24"
                    style={{ color: lab.accentColor }}
                  >
                    <path d="M9 3h6v7.8L20.4 19.2a1 1 0 0 1-.8 1.6H4.4a1 1 0 0 1-.8-1.6L9 10.8V3z" />
                    <path d="M9 3h6" />
                  </svg>
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
                aria-label="Previous lab"
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next lab"
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {labs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Go to lab ${i + 1}`}
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

export default LabsCarousel;
