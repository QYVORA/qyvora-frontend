import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';
import { useSwipeNav } from '@/core/hooks/useSwipeNav';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { getCategoryById, getCourseIconConfig } from '@/features/student/data/courses';
import type { Course, SkillLevel } from '@/features/student/data/courses';

const SKILL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: 'text-accent border-accent/30 bg-accent/10',
  intermediate: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  advanced: 'text-red-400 border-red-400/30 bg-red-400/10',
};

interface CoursesCarouselProps {
  courses: readonly Course[];
  className?: string;
  /** Optional header rendered above the slides, inside the section padding. */
  heading?: React.ReactNode;
}

const CoursesCarousel: React.FC<CoursesCarouselProps> = ({ courses, className = '', heading }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = courses.length;
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

  if (!courses.length) return null;

  const course = courses[current];
  const category = getCategoryById(course.categoryId);

  return (
    <div
      className={`relative w-full min-h-dvh flex flex-col ${className}`}
      {...containerProps}
    >
      <div className="w-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 my-auto">
        <div className="overflow-x-clip touch-pan-y select-none cursor-grab active:cursor-grabbing" {...swipeHandlers}>
        {heading}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={course.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-8 lg:gap-12">
              {/* Left column — course details */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">
                  Course {String(current + 1).padStart(2, '0')}
                </span>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-tight mt-3">
                  {course.title}
                </h2>

                <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 max-w-xl line-clamp-3">
                  {course.description}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl md:text-2xl font-black text-text-primary">
                      {course.lessons.length || 0}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                      Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-muted" />
                    <span className="font-mono text-sm font-black text-text-primary">
                      {course.estimatedMinutes}min
                    </span>
                  </div>
                  {category && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 text-[9px] font-black uppercase tracking-widest text-accent border border-accent/20">
                      {category.name}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${SKILL_COLORS[course.skillLevel]}`}>
                    {SKILL_LABELS[course.skillLevel]}
                  </span>
                </div>

                {/* Tags / learning objectives */}
                {course.learningObjectives.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {course.learningObjectives.slice(0, 3).map((obj, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-bg-elevated text-[9px] font-black uppercase tracking-widest text-text-muted border border-border/20"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Link
                  to={`/courses/${course.id}`}
                  className="btn-primary inline-flex items-center gap-2 mt-8 self-start px-6 py-2.5"
                >
                  <Zap className="w-4 h-4" /> View Course <IconArrowRight size={14} />
                </Link>
              </div>

              {/* Right column — course visual (first-class section element) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                  {(() => {
                    const iconConfig = getCourseIconConfig(course.id);
                    if (!iconConfig) return null;
                    const Icon = iconConfig.icon;
                    return <Icon className="w-full h-full text-accent/25" />;
                  })()}
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
                aria-label="Previous course"
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next course"
                className="w-9 h-9 rounded-full border border-border/50 bg-bg-card flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent active:scale-95 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {courses.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`Go to course ${i + 1}`}
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

export default CoursesCarousel;
