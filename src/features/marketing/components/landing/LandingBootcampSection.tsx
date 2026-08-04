import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { IconArrowRight } from '@/shared/components/icons';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { PHASES } from '@/features/marketing/data/learnData';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampConfig';
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
  const featuredHref = featuredConfig ? `/hpb/${featuredConfig.id}` : '/hpb';

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none mb-2 md:mb-3 shrink-0">
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
                className="group relative block h-full rounded-2xl border border-border/20 bg-bg-card transition-all duration-300 hover:border-accent/30 overflow-hidden"
              >
                <div className="relative h-full flex flex-col sm:flex-row p-4 sm:p-8 gap-5 sm:gap-6">
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-end mb-3 sm:mb-6">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
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
                    className="group relative block h-full rounded-2xl border border-border/20 bg-bg-card p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="flex items-center justify-end mb-2 sm:mb-3">
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                          {t('landing.bootcamp.roomCount', { count: roomCount })}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                        {t(`landing.bootcamp.phases.${phase.id}.name`)}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-2">
                        {t(`landing.bootcamp.phases.${phase.id}.desc`)}
                      </p>

                      <div className="flex-1 min-h-0 my-2 sm:my-3 w-full flex items-center justify-center">
                        <HpbAvatar
                          variant={`phase${Number(phase.id)}` as HpbVariant}
                          className="h-full w-auto max-w-full max-h-[110px] sm:max-h-[140px]"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.bootcamp.startPhase')} {phase.id}</span>
                        <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile — static list of all 5 phases, styled like the featured card (no switching) */}
          <div className="lg:hidden w-full flex-1 min-h-0 mt-2 md:mt-3 overflow-y-auto no-scrollbar flex flex-col gap-2 md:gap-3">
            {PHASES.map((phase) => {
              const phaseIdx = PHASES.indexOf(phase);
              const config = BOOTCAMP_CONFIG.phases[phaseIdx];
              const roomCount = config?.rooms?.length || 0;
              const href = config ? `/hpb/${config.id}` : '/hpb';
              return (
                <Link
                  key={phase.id}
                  to={href}
                  className="group relative block w-full shrink-0 rounded-2xl border border-border/20 bg-bg-card overflow-hidden transition-all duration-300 hover:border-accent/30"
                >
                  <div className="relative w-full flex flex-row items-stretch gap-3 md:gap-4 p-3 md:p-4">
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-end mb-1.5 md:mb-2">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                          {t('landing.bootcamp.roomCount', { count: roomCount })}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-black text-text-primary tracking-tighter leading-none mb-1 md:mb-1.5">
                        {t(`landing.bootcamp.phases.${phase.id}.name`)}
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                        {t(`landing.bootcamp.phases.${phase.id}.desc`)}
                      </p>
                      <div className="mt-auto pt-2 md:pt-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg text-[9px] font-black uppercase tracking-widest text-accent transition-all group-hover:gap-2.5">
                          {t('landing.bootcamp.startPhase')} {phase.id}
                          <IconArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                    <div className="w-[34%] md:w-[36%] shrink-0 min-h-0 flex items-center justify-center">
                      <HpbAvatar
                        variant={`phase${Number(phase.id)}` as HpbVariant}
                        className="w-full h-auto max-w-full max-h-[110px] md:max-h-[140px]"
                      />
                    </div>
                  </div>
                </Link>
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
