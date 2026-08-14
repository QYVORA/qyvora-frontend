import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';

const SIMULATIONS = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
];

const LandingSimulationsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-bg min-h-dvh lg:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 pt-24 md:pt-28 lg:pt-32 pb-6 md:pb-8 lg:pb-10 flex flex-col">
        <div className="w-full flex-1 flex flex-col min-h-0">
          <div className="shrink-0 mb-6 md:mb-8 lg:mb-10">
            <span className="inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent mb-4">
              {t('landing.simulations.badge')}
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-text-primary tracking-tighter leading-none">
              {t('landing.simulations.heading1')}{' '}
              <span className="text-accent">{t('landing.simulations.heading2')}</span>
            </h2>
            <p className="text-[10px] md:text-xs text-text-muted font-mono mt-2 max-w-xl leading-relaxed">
              {t('landing.simulations.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {SIMULATIONS.map((sim, idx) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  to={sim.slug}
                  className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 p-4 sm:p-6 transition-all duration-300 hover:border-accent/30"
                >
                  <div className="relative h-full flex flex-col">
                    <div className="flex items-center justify-between mb-3 sm:mb-5">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                        {t(`landing.simulations.list.${sim.id}.tag`)}
                      </span>
                      <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <sim.icon className="w-5 h-5 text-accent" />
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight mb-1.5 sm:mb-2">
                      {t(`landing.simulations.list.${sim.id}.title`)}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed mb-3 sm:mb-5 line-clamp-3">
                      {t(`landing.simulations.list.${sim.id}.desc`)}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t('landing.simulations.launchDemo')}
                      </span>
                      <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 shrink-0"
          >
            <Link
              to="/simulations"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
            >
              {t('landing.simulations.exploreAll')} <IconArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingSimulationsSection;
