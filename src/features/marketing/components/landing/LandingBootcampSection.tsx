import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { PHASES } from '@/features/marketing/data/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';
import { useSwipeNav } from '@/core/hooks/useSwipeNav';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import { useTranslation } from 'react-i18next';

const GROUP_SIZE = 3;
const CYCLE_MS = 4500;

const LandingBootcampSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { isLg } = useAdaptiveUi();
  const [groupIndex, setGroupIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  // Mobile cycles one broad phase card at a time instead of a batch of strips.
  const [phaseIndex, setPhaseIndex] = useState(0);

  const totalGroups = Math.ceil(PHASES.length / GROUP_SIZE);

  const advanceGroup = useCallback(() => {
    setDirection(1);
    setGroupIndex((i) => (i + 1) % totalGroups);
  }, [totalGroups]);

  useEffect(() => {
    if (shouldReduceMotion || !isLg) return;
    const id = setInterval(advanceGroup, CYCLE_MS);
    return () => clearInterval(id);
  }, [advanceGroup, shouldReduceMotion, isLg]);

  const advancePhase = useCallback(() => {
    setDirection(1);
    setPhaseIndex((i) => (i + 1) % PHASES.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isLg) return;
    const id = setInterval(advancePhase, CYCLE_MS);
    return () => clearInterval(id);
  }, [advancePhase, shouldReduceMotion, isLg]);

  const start = groupIndex * GROUP_SIZE;
  const group = [
    ...PHASES.slice(start, start + GROUP_SIZE),
    ...PHASES.slice(0, Math.max(0, start + GROUP_SIZE - PHASES.length)),
  ].slice(0, GROUP_SIZE);

  const featured = group[0];
  const supporting = group.slice(1);
  const featuredConfig = BOOTCAMP_CONFIG.phases[PHASES.indexOf(featured)];
  const featuredRoomCount = featuredConfig?.rooms?.length || 0;
  const featuredHref = featuredConfig ? `/hpb/${featuredConfig.id}` : '/hpb';

  const mobilePhase = PHASES[phaseIndex];
  const mobileConfig = BOOTCAMP_CONFIG.phases[PHASES.indexOf(mobilePhase)];
  const mobileRoomCount = mobileConfig?.rooms?.length || 0;
  const mobileHref = mobileConfig ? `/hpb/${mobileConfig.id}` : '/hpb';
  const goPrevPhase = useCallback(() => {
    setDirection(-1);
    setPhaseIndex((i) => (i - 1 < 0 ? PHASES.length - 1 : i - 1));
  }, []);
  const swipeHandlers = useSwipeNav({ onPrevious: goPrevPhase, onNext: advancePhase });

  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-hidden" >
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none mb-6 md:mb-8 lg:mb-10 shrink-0">
            {t('landing2.bootcamp.heading1')} <span className="text-accent">{t('landing2.bootcamp.heading2')}</span>
          </h2>

          {/* Desktop bento — 3 columns, 1 featured + 2 supporting (desktop only) */}
          <div className="hidden lg:grid grid-cols-3 gap-2 md:gap-4 flex-1 auto-rows-fr min-h-0">
            {/* Featured card — 2 cols, 2 rows */}
            <motion.div
              key={`featured-${groupIndex}`}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Link
                to={featuredHref}
                className="group relative block h-full card-accent bg-bg-card transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-full flex flex-col sm:flex-row p-4 sm:p-8 gap-5 sm:gap-6">
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-end mb-3 sm:mb-6">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
                        {t('landing.bootcamp.roomCount', { count: featuredRoomCount })}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-2 sm:mb-3">
                      {t(`landing.bootcamp.phases.${featured.id}.name`)}
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-lg line-clamp-3">
                      {t(`landing.bootcamp.phases.${featured.id}.desc`)}
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-4 sm:pt-6">
                      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bg text-[10px] font-black uppercase tracking-widest text-accent transition-all group-hover:gap-3">
                        {t('landing.bootcamp.startPhase')} {featured.id}
                        <IconArrowRight size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-[200px] sm:w-[42%] lg:w-[44%] xl:w-[46%] sm:h-auto shrink-0 min-h-0 flex items-center justify-center">
                    <HpbAvatar
                      variant={`phase${Number(featured.id)}` as HpbVariant}
                      className="h-full sm:h-[90%] w-auto max-h-full max-w-full"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Supporting cards — 1 col each */}
            {supporting.map((phase, idx) => {
              const phaseIdx = PHASES.indexOf(phase);
              const config = BOOTCAMP_CONFIG.phases[phaseIdx];
              const roomCount = config?.rooms?.length || 0;
              const supportHref = config ? `/hpb/${config.id}` : '/hpb';
              return (
                <motion.div
                  key={`support-${groupIndex}-${idx}`}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (idx + 1), ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={supportHref}
                    className="group relative block h-full card-accent bg-bg-card p-3 sm:p-5 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-full flex flex-row items-stretch gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                          {t(`landing.bootcamp.phases.${phase.id}.name`)}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-2">
                          {t(`landing.bootcamp.phases.${phase.id}.desc`)}
                        </p>

                        <div className="mt-auto pt-2 sm:pt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent">
                            {t('landing.bootcamp.startPhase')} {phase.id}
                            <IconArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                          </span>
                          <span className="inline-flex text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/50 bg-bg-elevated text-text-muted shrink-0">
                            {t('landing.bootcamp.roomCount', { count: roomCount })}
                          </span>
                        </div>
                      </div>

                      <div className="w-[40%] sm:w-[42%] shrink-0 min-h-0 flex items-center justify-center">
                        <HpbAvatar
                          variant={`phase${Number(phase.id)}` as HpbVariant}
                          className="h-full sm:h-[90%] w-auto max-h-full max-w-full"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile — one broad phase card at a time, swipeable, auto-rotating */}
          <div className="lg:hidden w-full flex-1 min-h-0 mt-2 flex flex-col">
            <div
              className="flex-1 min-h-0 flex flex-col justify-center touch-pan-y select-none cursor-grab active:cursor-grabbing"
              {...swipeHandlers}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={mobilePhase.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 120 : -120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -120 : 120 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full overflow-x-clip"
                >
                  <Link
                    to={mobileHref}
                    aria-label={t(`landing.bootcamp.phases.${mobilePhase.id}.name`)}
                    className="group relative block w-full card-accent bg-bg-card overflow-hidden transition-all duration-300"
                  >
                    {/* Avatar as the card's visual header */}
                    <div className="relative h-[150px] sm:h-[180px] flex items-end justify-center border-b border-border/50 bg-bg-elevated/40 overflow-hidden">
                      <HpbAvatar
                        variant={`phase${Number(mobilePhase.id)}` as HpbVariant}
                        className="h-[92%] w-auto max-w-full"
                      />
                      <span className="absolute top-3 right-3 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-border/50 bg-bg-elevated text-text-muted">
                        {t('landing.bootcamp.roomCount', { count: mobileRoomCount })}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-black text-text-primary tracking-tighter leading-none mb-1.5">
                        {t(`landing.bootcamp.phases.${mobilePhase.id}.name`)}
                      </h3>
                      <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 min-h-[2.6em]">
                        {t(`landing.bootcamp.phases.${mobilePhase.id}.desc`)}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-bg text-[9px] font-black uppercase tracking-widest text-accent transition-all group-hover:gap-2">
                          {t('landing.bootcamp.startPhase')} {mobilePhase.id}
                          <IconArrowRight size={11} />
                        </span>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-text-muted">
                          {phaseIndex + 1} / {PHASES.length}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Phase indicator dots on mobile */}
            <div className="flex justify-center gap-1.5 py-2" role="tablist" aria-label={t('landing.bootcamp.heading1')}>
              {PHASES.map((phase, i) => (
                <button
                  key={phase.id}
                  onClick={() => {
                    setDirection(i > phaseIndex ? 1 : -1);
                    setPhaseIndex(i);
                  }}
                  aria-label={`${i + 1}`}
                  aria-current={i === phaseIndex}
                  className={`min-h-[24px] min-w-[24px] flex items-center justify-center p-0 rounded-full`}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === phaseIndex ? 'w-5 bg-accent' : 'w-1.5 bg-text-muted/30'
                    }`}
                  />
                </button>
              ))}
            </div>
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
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
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
