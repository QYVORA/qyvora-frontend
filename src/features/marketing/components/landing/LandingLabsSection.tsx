import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Zap } from 'lucide-react';

import { IconArrowRight } from '@/shared/components/icons';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import Identicon from '@/shared/components/Identicon';
import { useTranslation } from 'react-i18next';

const LABS = [
  { id: 'privesc' },
  { id: 'passwords' },
  { id: 'sqli' },
  { id: 'osint' },
  { id: 'killchain' },
];

const GROUP_SIZE = 3;
const CYCLE_MS = 4000;

const LandingLabsSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [groupIndex, setGroupIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalGroups = Math.ceil(LABS.length / GROUP_SIZE);

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
    ...LABS.slice(start, start + GROUP_SIZE),
    ...LABS.slice(0, Math.max(0, start + GROUP_SIZE - LABS.length)),
  ].slice(0, GROUP_SIZE);

  const featured = group[0];
  const supporting = group.slice(1);

  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
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
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-none mb-2">
              {t('landing.labs.heading')}
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-xl">
              {t('landing.labs.description')}
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
                to="/dashboard/labs"
                className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 p-4 sm:p-8 transition-all duration-300 hover:border-accent/30"
              >
                <div className="relative h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/10 overflow-hidden flex items-center justify-center shrink-0">
                      <Identicon value={featured.id} size={64} className="w-12 h-12 sm:w-16 sm:h-16 border-black" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                      {t(`landing.labs.list.${featured.id}.cp`)}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-none mb-3">
                    {t(`landing.labs.list.${featured.id}.title`)}
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-lg mb-3 sm:mb-6 line-clamp-3">
                    {t(`landing.labs.list.${featured.id}.desc`)}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-[10px] font-black uppercase tracking-widest text-bg transition-all group-hover:gap-3">
                      <Zap className="w-3.5 h-3.5" />
                      {t('landing.labs.launchLab')}
                      <IconArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Supporting cards — 1 col each */}
            {supporting.map((lab, idx) => (
              <motion.div
                key={`support-${groupIndex}-${idx}`}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1), ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/dashboard/labs"
                  className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 p-3 sm:p-5 transition-all duration-300 hover:border-accent/30"
                >
                  <div className="relative h-full flex flex-col">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-accent/10 overflow-hidden flex items-center justify-center shrink-0">
                        <Identicon value={lab.id} size={48} className="w-9 h-9 sm:w-11 sm:h-11 border-black" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                        {t(`landing.labs.list.${lab.id}.cp`)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-text-primary tracking-tight mb-1 sm:mb-1.5">
                      {t(`landing.labs.list.${lab.id}.title`)}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                      {t(`landing.labs.list.${lab.id}.desc`)}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('landing.labs.launchLab')}</span>
                      <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
              to="/dashboard/labs"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
              {t('landing.labs.viewAll')} <IconArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingLabsSection;
