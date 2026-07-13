import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight, IconShield } from '@/shared/components/icons';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG, PHASE_COLORS } from '@/features/student/constants/bootcampConfig';

const CYCLE_MS = 4500;

const LandingBootcampSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [featuredSlot, setFeaturedSlot] = useState(0);

  const advance = useCallback(() => {
    setFeaturedSlot((s) => (s + 1) % PHASES.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, shouldReduceMotion]);

  const phaseOrder = PHASES.map((_, i) => i);
  const featured = phaseOrder[featuredSlot];
  const others = phaseOrder.filter((i) => i !== featured);
  const visible = [featured, ...others];

  return (
    <div className="bg-accent" data-nav-invert>
      <div className="w-full px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="w-full lg:max-w-6xl lg:mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-bg/20 bg-bg/10 text-[10px] font-black uppercase tracking-[0.25em] text-bg mb-3">
              <IconShield size={12} /> Structured Program
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-bg tracking-tighter leading-none mb-2">
              Hacker Protocol <span className="text-bg/70">Bootcamp</span>
            </h2>
            <p className="text-xs md:text-sm text-bg/60 leading-relaxed max-w-xl">
              5 phases. From mindset to exploitation. A guided path from zero to operator.
            </p>
          </motion.div>

          {/* Unified grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
            {visible.map((phaseIdx, slot) => {
              const phase = PHASES[phaseIdx];
              const config = BOOTCAMP_CONFIG.phases[phaseIdx];
              const color = PHASE_COLORS[config?.id] || '#06B66F';
              const roomCount = config?.rooms?.length || 0;
              const Icon = phase.icon;
              const isFeatured = slot === 0;

              return (
                <motion.div
                  key={phaseIdx}
                  layout
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={isFeatured ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                >
                  <Link
                    to="/hpb"
                    className="group relative block rounded-2xl border border-border/20 bg-bg/90 transition-all duration-300 hover:border-accent/30 overflow-hidden h-full"
                  >
                    {isFeatured ? (
                      <div className="relative flex flex-col h-full">
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${phase.image})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/80 to-bg-card/40" />
                        </div>
                        <div className="relative flex-1 flex flex-col p-5 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}25` }}>
                                <Icon className="w-5 h-5" style={{ color }} />
                              </div>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color }}>
                                <span className="text-xs font-black text-bg">{phase.id}</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
                              {roomCount} rooms
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary tracking-tighter leading-none mb-2">
                            {phase.name}
                          </h3>
                          <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                            {phase.desc}
                          </p>
                          <div className="mt-auto flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all group-hover:gap-2.5" style={{ background: color, color: '#000' }}>
                              Start Phase {phase.id}
                               <IconArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 flex flex-col h-full">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color }}>Phase {phase.id}</span>
                              <span className="text-[7px] font-black text-text-muted uppercase tracking-widest">{roomCount} rooms</span>
                            </div>
                            <h3 className="text-xs sm:text-sm font-black text-text-primary mb-0.5 tracking-tight group-hover:text-accent transition-colors leading-snug">
                              {phase.name}
                            </h3>
                            <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                              {phase.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5"
          >
            <Link
              to="/hpb"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-bg/60 hover:text-bg transition-colors"
            >
              View Full Curriculum <IconArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingBootcampSection;
