import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Layers, Clock } from 'lucide-react';
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
      y: d > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      y: d > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

        {/* Left — vertical carousel */}
        <div className="md:w-[65%] lg:w-[62%]">
          <div className="relative">
            <div className="text-center md:text-left mb-3">
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-text-muted/50">
                Phase {phase.id} of 05
              </span>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Up arrow */}
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Previous phase"
              >
                <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>

              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card w-full min-h-[40svh] md:min-h-[35svh]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={phase.id}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="h-full"
                  >
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-[38%] lg:w-[42%] h-40 md:h-auto bg-bg-elevated overflow-hidden">
                        <img
                          src={phase.image}
                          alt={phase.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-accent" />
                          </div>
                          <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
                            <span className="text-[10px] font-black text-bg">{phase.id}</span>
                          </div>
                        </div>
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-text-primary mb-2 tracking-tight">
                          {phase.name}
                        </h3>
                        <p className="text-sm md:text-base text-text-muted leading-relaxed mb-4 line-clamp-3">
                          {phase.desc}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10">
                            <Layers className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-bold text-text-primary">{phase.roomCount} rooms</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-bold text-text-primary">{phase.totalSteps} steps</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Down arrow */}
              <button
                onClick={handleNext}
                className="hidden md:flex absolute -bottom-5 left-1/2 -translate-x-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Next phase"
              >
                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            {/* Mobile arrows + dots */}
            <div className="flex md:hidden items-center justify-center gap-4 mt-5">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Previous phase"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                {phasesWithRoomCount.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-8 bg-accent' : 'bg-border hover:bg-text-muted/40'
                    }`}
                    aria-label={`Phase ${p.id}: ${p.name}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Next phase"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right — heading */}
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-right mb-6 md:mb-0">
          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-accent mb-4 block">
            Curriculum
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-4">
            What You'll <span className="text-accent">Learn</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-sm mx-auto md:ml-auto md:mr-0">
            Five phases of structured offensive-security training, from foundations to advanced exploitation.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingCurriculumSection;
