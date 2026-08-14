import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import { DottedMapOverlay } from '@/shared/components/ui';

const SIMULATIONS = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
];

const MiniTerminal: React.FC = () => (
  <div className="rounded-xl border border-border/30 bg-[#0c0c0c] overflow-hidden pointer-events-none">
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
      <span className="w-2 h-2 rounded-full bg-red-400/70" />
      <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
      <span className="w-2 h-2 rounded-full bg-accent/70" />
    </div>
    <div className="px-3.5 py-3 font-mono text-[10px] leading-relaxed">
      <p>
        <span className="text-accent">operator@qyvora</span>
        <span className="text-text-muted">:~$</span> nmap -sV 10.10.14.7
      </p>
      <p className="text-text-muted">PORT   STATE SERVICE VERSION</p>
      <p className="text-text-muted">22/tcp open  ssh     OpenSSH 8.2p1</p>
      <p className="text-text-muted">80/tcp open  http    nginx 1.18.0</p>
    </div>
  </div>
);

const MiniEditor: React.FC = () => (
  <div className="rounded-xl border border-border/30 bg-[#0c0c0c] overflow-hidden pointer-events-none">
    <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
      <span className="text-[9px] font-mono text-accent px-2 py-0.5 rounded bg-accent/10">main.py</span>
    </div>
    <div className="px-3.5 py-3 font-mono text-[10px] leading-relaxed">
      <p>
        <span className="text-[#c678dd]">def</span> <span className="text-accent">greet</span>(<span className="text-[#e5c07b]">name</span>):
      </p>
      <p className="pl-4 text-text-muted">return f"Hello, {`{name}`}!"</p>
      <p className="text-[#c678dd]">print</p>
      <p className="text-text-muted">&gt; Hello, Hacker!</p>
    </div>
  </div>
);

const MiniTopology: React.FC = () => (
  <div className="rounded-xl border border-border/30 bg-bg-card overflow-hidden pointer-events-none">
    <div className="px-3.5 py-3 flex items-center justify-between gap-2">
      <span className="rounded-lg border border-accent/30 bg-accent/10 px-2 py-1 text-[9px] font-mono text-accent whitespace-nowrap">10.10.14.0/24</span>
      <span className="hidden sm:block h-px flex-1 bg-border" aria-hidden="true" />
      <span className="rounded-lg border border-border/30 bg-bg px-2 py-1 text-[9px] font-mono text-text-muted whitespace-nowrap">:22 :80</span>
    </div>
  </div>
);

const LandingSimulationsSection: React.FC = () => {
  const { t } = useTranslation();

  const visual = (id: string) => {
    if (id === 'terminal') return <MiniTerminal />;
    if (id === 'ide') return <MiniEditor />;
    return <MiniTopology />;
  };

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

          {/* Bento grid — terminal featured wide with live shell visual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {SIMULATIONS.map((sim, idx) => {
              const featured = sim.id === 'terminal';
              return (
                <motion.div
                  key={sim.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full ${featured ? 'lg:col-span-2' : ''}`}
                >
                  <Link
                    to={sim.slug}
                    className="group relative block h-full rounded-2xl border border-border/20 bg-bg/90 p-4 sm:p-6 transition-all duration-300 hover:border-accent/30 overflow-hidden"
                  >
                    {featured && <DottedMapOverlay className="rounded-2xl" />}
                    <div className={`relative h-full flex flex-col ${featured ? 'gap-4 sm:gap-5' : 'gap-3 sm:gap-4'}`}>
                      <div className="flex items-center justify-between shrink-0">
                        <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-border/30 bg-bg-elevated text-text-muted">
                          {t(`landing.simulations.list.${sim.id}.tag`)}
                        </span>
                        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <sim.icon className="w-5 h-5 text-accent" />
                        </span>
                      </div>

                      <div className={featured ? '' : 'flex-1'}>
                        <h3 className="text-base sm:text-lg font-black text-text-primary tracking-tight mb-1.5 sm:mb-2">
                          {t(`landing.simulations.list.${sim.id}.title`)}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                          {t(`landing.simulations.list.${sim.id}.desc`)}
                        </p>
                      </div>

                      <div className={featured ? '' : 'hidden sm:block'}>{visual(sim.id)}</div>

                      <div className="mt-auto flex items-center gap-2 text-text-muted group-hover:text-accent transition-colors shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {t('landing.simulations.launchDemo')}
                        </span>
                        <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
