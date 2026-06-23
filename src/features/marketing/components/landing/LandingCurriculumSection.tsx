import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ChevronRight, Layers, Clock } from 'lucide-react';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const LandingCurriculumSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const phasesWithRoomCount = PHASES.map((phase, idx) => {
    const config = BOOTCAMP_CONFIG.phases[idx];
    const roomCount = config?.rooms?.length || 0;
    const totalSteps = config?.rooms?.reduce((acc, r) => acc + (r.steps?.length || 0), 0) || 0;
    return { ...phase, roomCount, totalSteps };
  });

  return (
    <div ref={ref} className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.span className="inline-block text-xs font-black uppercase tracking-[0.35em] text-accent mb-3">
          The Curriculum
        </motion.span>
        <motion.h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
          What You'll <span className="text-accent">Learn</span>
        </motion.h2>
        <motion.p className="mt-3 text-sm md:text-base text-text-muted max-w-2xl mx-auto">
          Five phases — from hacker mindset to advanced social engineering
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4">
        {phasesWithRoomCount.map((phase, idx) => {
          const Icon = phase.icon;
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              key={phase.id}
              custom={idx}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`relative rounded-2xl border border-border/30 bg-bg-card p-4 md:p-5 h-full transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 overflow-hidden ${isEven ? 'md:mt-4' : 'md:mt-0'}`}>
                {/* Number badge */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center">
                  <span className="text-[10px] font-black text-accent">{phase.id}</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>

                <h3 className="text-sm font-black text-text-primary mb-1 tracking-tight leading-snug">
                  {phase.name}
                </h3>
                <p className="text-[11px] leading-relaxed text-text-muted/70 line-clamp-3 mb-3">
                  {phase.desc}
                </p>

                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-muted/40">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" /> {phase.roomCount} rooms
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {phase.totalSteps} steps
                  </span>
                </div>
              </div>

              {/* Connector between phases */}
              {idx < phasesWithRoomCount.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-2.5 z-10 translate-y-[-50%]">
                  <ChevronRight className="w-4 h-4 text-accent/30" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingCurriculumSection;
