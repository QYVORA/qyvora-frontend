import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import { PHASES } from '@/features/marketing/pages/LearnPage/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { useTranslation } from 'react-i18next';

const GROUP_SIZE = 3;
const CYCLE_MS = 4500;

const LandingBootcampSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [groupIndex, setGroupIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalGroups = Math.ceil(PHASES.length / GROUP_SIZE);

  const advance = useCallback(() => {
    setDirection(1);
    setGroupIndex((i) => (i + 1) % totalGroups);
  }, [totalGroups]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, shouldReduceMotion]);

  const start = groupIndex * GROUP_SIZE;
  const group = [
    ...PHASES.slice(start, start + GROUP_SIZE),
    ...PHASES.slice(0, Math.max(0, start + GROUP_SIZE - PHASES.length)),
  ].slice(0, GROUP_SIZE);

  const featured = group[0];
  const supporting = group.slice(1);
  const featuredConfig = BOOTCAMP_CONFIG.phases[PHASES.indexOf(featured)];
  const featuredRoomCount = featuredConfig?.rooms?.length || 0;

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

          {/* Bento grid: 3 columns on desktop — 1 featured + 2 supporting */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {/* Featured card — 2 cols, 2 rows */}
            <motion.div
              key={`featured-${groupIndex}`}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Link
                to="/hpb"
                className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 transition-all duration-300 hover:border-accent/30 overflow-hidden"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${featured.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/80 to-bg-card/40" />
                </div>
                <div className="relative h-full flex flex-col p-4 sm:p-8">
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border border-accent/30 bg-accent/15 flex items-center justify-center shrink-0">
                      {featured.icon && <featured.icon className="w-7 h-7 sm:w-9 sm:h-9 text-bg" />}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-bg/20 bg-bg/10 text-bg">
                      {t('landing.bootcamp.roomCount', { count: featuredRoomCount })}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3">
                    {t(`landing.bootcamp.phases.${featured.id}.name`)}
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-lg mb-3 sm:mb-6 line-clamp-3">
                    {t(`landing.bootcamp.phases.${featured.id}.desc`)}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bg text-[10px] font-black uppercase tracking-widest text-accent transition-all group-hover:gap-3">
                      {t('landing.bootcamp.startPhase')} {featured.id}
                      <IconArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Supporting cards — 1 col each */}
            {supporting.map((phase, idx) => {
              const phaseIdx = PHASES.indexOf(phase);
              const config = BOOTCAMP_CONFIG.phases[phaseIdx];
              const roomCount = config?.rooms?.length || 0;
              return (
                <motion.div
                  key={`support-${groupIndex}-${idx}`}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1), ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/hpb"
                    className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-accent/30 bg-accent/15 flex items-center justify-center shrink-0">
                          {phase.icon && <phase.icon className="w-6 h-6 sm:w-7 sm:h-7 text-bg" />}
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-bg/20 bg-bg/10 text-bg">
                          {t('landing.bootcamp.roomCount', { count: roomCount })}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                        {t(`landing.bootcamp.phases.${phase.id}.name`)}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                        {t(`landing.bootcamp.phases.${phase.id}.desc`)}
                      </p>

                      <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-bg transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.bootcamp.startPhase')} {phase.id}</span>
                        <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
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
