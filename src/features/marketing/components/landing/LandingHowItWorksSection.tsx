import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Swords, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Master offensive security foundations with structured modules covering Linux, networking, and web exploitation.',
  },
  {
    icon: Swords,
    title: 'Practice',
    description: 'Execute real exploits in simulated attack labs. Capture flags and chain vulnerabilities in production-mirror environments.',
  },
  {
    icon: Award,
    title: 'Prove',
    description: 'Earn on-chain CP credentials that validate your expertise and build a verifiable track record of proficiency.',
  },
];

const LandingHowItWorksSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % STEPS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const step = STEPS[activeIndex];
  const Icon = step.icon;

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

        {/* Left — heading */}
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-6 md:mb-0">
          <span className="inline-block text-xs md:text-sm font-black uppercase tracking-[0.35em] text-accent mb-4">
            Your Path
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Learn. <span className="text-accent">Practice.</span> Prove.
          </h2>
        </div>

        {/* Right — carousel */}
        <div className="md:w-[65%] lg:w-[62%]">
          <div className="relative">
            <div className="text-center md:text-left mb-3">
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-text-muted/50">
                Step {activeIndex + 1} of 3
              </span>
            </div>

            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-bg-card min-h-[200px] md:min-h-[240px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                  className="p-8 md:p-10 lg:p-12"
                >
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={handlePrev}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-bg-card border border-border/40 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 mt-5">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-8 bg-accent' : 'bg-border hover:bg-text-muted/40'
                  }`}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingHowItWorksSection;
