import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PHASES } from './anansiData';

const AnansiPipelineSection: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleNextPhase = useCallback(() => {
    setDirection(1);
    setActivePhaseIndex((prev) => (prev + 1) % PHASES.length);
  }, []);

  const handlePrevPhase = useCallback(() => {
    setDirection(-1);
    setActivePhaseIndex((prev) => (prev - 1 + PHASES.length) % PHASES.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(handleNextPhase, 6000);
    return () => clearInterval(interval);
  }, [handleNextPhase, shouldReduceMotion]);

  const carouselVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(8px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(8px)'
    })
  };

  const currentPhase = PHASES[activePhaseIndex];

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-20 md:py-0">
      <div className="max-w-[1600px] mx-auto w-full relative group/carousel">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activePhaseIndex}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              filter: { duration: 0.4 }
            }}
            className="relative w-full"
          >
            <div className="flex flex-col lg:flex-row w-full overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border border-border bg-bg-card/40 dark:backdrop-blur-sm backdrop-blur-none dark:shadow-2xl shadow-none lg:h-[480px] xl:h-[520px]">
              <div className="w-full lg:w-[48%] xl:w-[52%] relative overflow-hidden group h-[240px] sm:h-[300px] lg:h-full bg-accent/5">
                <div className="relative w-full h-full flex items-center justify-center">
                  {currentPhase.image ? (
                    <img
                      src={currentPhase.image}
                      alt={currentPhase.name}
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                  ) : (
                    <currentPhase.icon className="w-32 h-32 md:w-40 md:h-40 text-accent relative z-10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-bg-card/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-bg-card/20 hidden dark:block" />
                  <div className="absolute top-5 left-5 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-10">
                    <div className="px-6 py-3 bg-bg-card/90 backdrop-blur-xl dark:border border-white/10 border-none rounded-2xl dark:shadow-2xl shadow-none">
                      <span className="text-base sm:text-lg font-black text-accent uppercase tracking-widest whitespace-nowrap">
                        PHASE {currentPhase.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col p-8 sm:p-10 lg:p-14 xl:p-16 justify-center">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                      // PIPELINE LIFECYCLE
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-black text-text-primary uppercase tracking-tight leading-tight mb-6 lg:mb-8">
                    {currentPhase.name}
                  </h2>
                  <p className="text-base sm:text-lg lg:text-base xl:text-lg text-text-secondary font-mono leading-relaxed mb-8 lg:mb-10">
                    {currentPhase.desc}
                  </p>
                  <div className="flex items-center gap-3 text-accent/60">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-mono text-[11px] uppercase tracking-widest font-bold">Autonomous Execution</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-8 -right-8 items-center justify-between pointer-events-none z-20">
          <button
            onClick={handlePrevPhase}
            className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
            aria-label="Previous phase"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNextPhase}
            className="w-16 h-16 rounded-full bg-bg-card/90 backdrop-blur-xl border border-border text-text-secondary hover:text-bg hover:bg-accent hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto shadow-2xl opacity-0 group-hover/carousel:opacity-100 dark:border-white/10"
            aria-label="Next phase"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        <div className="flex lg:hidden items-center justify-center gap-3 mt-8">
          {PHASES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > activePhaseIndex ? 1 : -1);
                setActivePhaseIndex(idx);
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === activePhaseIndex
                  ? 'w-6 h-2 bg-accent'
                  : 'w-2 h-2 bg-text-muted/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnansiPipelineSection;
export { AnansiPipelineSection };
