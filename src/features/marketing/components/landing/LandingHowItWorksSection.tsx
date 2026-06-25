import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Swords, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAutoPlay } from '@/core/hooks/useAutoPlay';

const STEPS = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Master offensive security foundations with structured modules covering Linux, networking, and web exploitation.',
    bgImage: '/assets/sections/how-it-works/learn-bg.png',
  },
  {
    icon: Swords,
    title: 'Practice',
    description: 'Execute real exploits in simulated attack labs. Capture flags and chain vulnerabilities in production-mirror environments.',
    bgImage: '/assets/sections/how-it-works/practice-bg.png',
  },
  {
    icon: Award,
    title: 'Prove',
    description: 'Earn on-chain CP credentials that validate your expertise and build a verifiable track record of proficiency.',
    bgImage: '/assets/sections/how-it-works/prove-bg.png',
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

  const { containerProps } = useAutoPlay({ onNext: handleNext, duration: 5000 });

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
    <div className="w-full h-full flex flex-col justify-center px-4 md:px-12 lg:px-16" {...containerProps}>
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

        {/* Left — heading */}
        <div className="md:w-[35%] lg:w-[38%] text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Learn. <span className="text-accent">Practice.</span> Prove.
          </h2>
        </div>

        {/* Right — carousel */}
        <div className="md:w-[65%] lg:w-[62%]">
          <div className="relative">
            <div className="relative">
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>

              <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-border/30 bg-accent-dim min-h-[35svh] md:min-h-[30svh]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="relative p-6 sm:p-8 md:p-10 lg:p-12 bg-cover bg-center"
                    style={{ backgroundImage: `url(${step.bgImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-bg-card via-bg-card/60 to-transparent" />
                    <div className="relative z-10 flex flex-col items-start text-left">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-accent" />
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-lg">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleNext}
                className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-bg-card border border-border/40 items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all z-20 shadow-lg"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>

            {/* Mobile position indicator */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-5">
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
