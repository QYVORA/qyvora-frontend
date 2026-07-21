import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useTranslation } from 'react-i18next';

const CYCLE_MS = 4500;

const LandingBootcampSection: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="relative bg-accent min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="none" />
      <div className="relative z-10 w-full h-full px-6 md:px-16 lg:px-24 py-6 md:py-8 lg:py-10 flex flex-col">
        <div className="w-full lg:max-w-6xl lg:mx-auto flex-1 flex flex-col min-h-0">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 md:mb-8 shrink-0"
          >

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-bg tracking-tighter leading-none mb-2">
              {t('landing2.bootcamp.heading1')} <span className="text-bg">{t('landing2.bootcamp.heading2')}</span>
            </h2>
            <p className="text-xs md:text-sm text-bg/70 leading-relaxed max-w-xl">
              {t('landing.bootcamp.description')}
            </p>
          </motion.div>

          {/* Unified grid — fills remaining space */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 flex-1">
            {visible.map((phaseIdx, slot) => {
              const phase = PHASES[phaseIdx];
              const config = BOOTCAMP_CONFIG.phases[phaseIdx];
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
                    className="group relative block rounded-2xl border border-border/20 bg-bg/90 transition-all duration-300 hover:border-accent/30 overflow-hidden"
                  >
                    {isFeatured ? (
                      <div className="relative">
                        <div className="absolute inset-0">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${phase.image})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/80 to-bg-card/40" />
                        </div>
                        <div className="relative p-3 sm:p-6">
                           <div className="flex items-center justify-between mb-2 sm:mb-4 shrink-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent/15 border border-accent/25">
                              <Icon className="w-5 h-5 text-bg" />
                            </div>
                             <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-bg/20 bg-bg/10 text-bg">
                               {t('landing.bootcamp.roomCount', { count: roomCount })}
                             </span>
                          </div>
                           <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary tracking-tighter leading-none mb-2">
                             {t(`landing.bootcamp.phases.${phase.id}.name`)}
                           </h3>
                           <p className="text-[11px] sm:text-xs md:text-sm text-text-secondary leading-relaxed mb-2 sm:mb-4 line-clamp-3">
                             {t(`landing.bootcamp.phases.${phase.id}.desc`)}
                           </p>
                          <div className="flex items-center gap-2">
                             <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bg text-[9px] font-black uppercase tracking-widest text-accent transition-all group-hover:gap-2.5">
                               {t('landing.bootcamp.startPhase')} {phase.id}
                               <IconArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-3 sm:p-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent/15 border border-accent/25">
                            <Icon className="w-4 h-4 text-bg" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-1.5 mb-0.5 shrink-0">
                               <span className="text-[8px] font-black uppercase tracking-widest text-bg">{t('landing.bootcamp.phaseLabel')} {phase.id}</span>
                               <span className="text-[7px] font-black text-bg/60 uppercase tracking-widest">{t('landing.bootcamp.roomCount', { count: roomCount })}</span>
                             </div>
                            <h3 className="text-xs sm:text-sm font-black text-text-primary mb-0.5 tracking-tight group-hover:text-accent transition-colors leading-snug">
                              {t(`landing.bootcamp.phases.${phase.id}.name`)}
                            </h3>
                            <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2">
                              {t(`landing.bootcamp.phases.${phase.id}.desc`)}
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
            className="mt-4 shrink-0"
          >
            <Link
              to="/hpb"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-bg/60 hover:text-bg transition-colors"
            >
               {t('landing.bootcamp.viewCurriculum')} <IconArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingBootcampSection;
