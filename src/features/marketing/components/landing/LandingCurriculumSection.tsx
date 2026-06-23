import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Layers, Clock } from 'lucide-react';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const LandingCurriculumSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const phasesWithRoomCount = PHASES.map((phase, idx) => {
    const config = BOOTCAMP_CONFIG.phases[idx];
    const roomCount = config?.rooms?.length || 0;
    const totalSteps = config?.rooms?.reduce((acc, r) => acc + (r.steps?.length || 0), 0) || 0;
    return { ...phase, roomCount, totalSteps };
  });

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % phasesWithRoomCount.length);
  }, [phasesWithRoomCount.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + phasesWithRoomCount.length) % phasesWithRoomCount.length);
  }, [phasesWithRoomCount.length]);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const phase = phasesWithRoomCount[activeIndex];
  const Icon = phase.icon;

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-black uppercase tracking-[0.35em] text-accent mb-4">
            The Curriculum
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tighter leading-none">
            What You'll <span className="text-accent">Learn</span>
          </h2>
          <p className="mt-4 text-sm md:text-lg text-text-muted max-w-xl mx-auto">
            Five phases — from hacker mindset to advanced social engineering
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Phase counter */}
          <div className="text-center mb-6">
            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-text-muted/50">
              Phase {phase.id} of 05
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card min-h-[320px] md:min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={phase.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="p-8 md:p-10 lg:p-14"
              >
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                  {/* Icon + number column */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-accent/10 flex items-center justify-center">
                        <Icon className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                        <span className="text-[11px] font-black text-bg">{phase.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary mb-3 tracking-tight">
                      {phase.name}
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg text-text-muted leading-relaxed mb-6">
                      {phase.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                        <Layers className="w-4 h-4 text-accent" />
                        <span className="text-xs md:text-sm font-bold text-text-primary">{phase.roomCount} rooms</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-xs md:text-sm font-bold text-text-primary">{phase.totalSteps} steps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20"
              aria-label="Previous phase"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20"
              aria-label="Next phase"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {phasesWithRoomCount.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-8 bg-accent'
                    : 'bg-border hover:bg-text-muted/40'
                }`}
                aria-label={`Phase ${p.id}: ${p.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCurriculumSection;
