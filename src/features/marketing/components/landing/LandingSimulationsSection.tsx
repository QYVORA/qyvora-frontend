import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'motion/react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import DeviceShape from '@/features/student/components/tools/network/DeviceShape';
import { getDeviceDef } from '@/features/student/components/tools/network/devices';
import type { DeviceType } from '@/features/student/components/tools/network/types';

const SIMULATIONS = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
] as const;

/* Mirrors the Kali-style terminal chrome used by TerminalShell. */
const TerminalPreview: React.FC = () => (
  <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0c0c0c] shadow-inner">
    <div className="flex items-center justify-between border-b border-[#2a2a2a] bg-[#1a1a1a] px-3.5 py-2.5">
      <span className="font-mono text-[10px] tracking-[0.12em] text-white/30">_terminal <span className="text-white/20">v2.0</span></span>
      <div className="flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-white/15" /><span className="h-2 w-2 rounded-full bg-white/15" /></div>
    </div>
    <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-sm">
      <p><span className="text-accent">operator@qyvora</span><span className="text-white/50">:~$</span> nmap -sV 10.10.14.7</p>
      <p className="text-[#d4d4d4]">PORT&nbsp;&nbsp; STATE&nbsp; SERVICE</p>
      <p className="text-[#569cd6]">22/tcp open&nbsp;&nbsp;ssh</p>
      <p className="text-[#00ff41]">80/tcp open&nbsp;&nbsp;http</p>
      <p><span className="text-accent">operator@qyvora</span><span className="text-white/50">:~$</span> <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" /></p>
    </div>
  </div>
);

const EditorPreview: React.FC = () => (
  <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0c0c0c] shadow-inner">
    <div className="flex items-end border-b border-[#2a2a2a] bg-[#1a1a1a] px-3.5 pt-2.5">
      <span className="rounded-t-lg border border-b-0 border-[#2a2a2a] bg-[#0c0c0c] px-3 py-1.5 font-mono text-[11px] text-accent">recon.py</span>
    </div>
    <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-sm">
      <p><span className="text-[#c678dd]">def</span> <span className="text-accent">probe</span>(<span className="text-[#e5c07b]">host</span>):</p>
      <p className="pl-5 text-[#d4d4d4]">return scan(host)</p>
      <p className="mt-3"><span className="text-[#c678dd]">print</span>(<span className="text-accent">probe</span>(<span className="text-[#e5c07b]">&quot;target&quot;</span>))</p>
      <p className="mt-3 border-t border-white/10 pt-3 text-[#00ff41]">✓ host discovered</p>
    </div>
  </div>
);

const VisualizerNode: React.FC<{ type: DeviceType; label: string; ip: string; className: string }> = ({ type, label, ip, className }) => {
  const device = getDeviceDef(type);

  return (
    <div className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center ${className}`}>
      <div className="relative">
        <DeviceShape shape={device.shape} color={device.color} icon={device.icon} selected={type === 'switch'} hovered={false} status="online" traffic={type === 'switch' ? 'medium' : 'idle'} />
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border border-bg bg-[#22c55e]" />
      </div>
      <span className="mt-1 whitespace-nowrap text-[9px] font-bold text-text-primary">{label}</span>
      <span className="whitespace-nowrap text-[8px] font-mono text-text-muted">{ip}</span>
    </div>
  );
};

const NetworkPreview: React.FC = () => (
  <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden rounded-xl border border-border/30 bg-bg">
    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]" />
    <svg viewBox="0 0 600 240" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M110 120H270M330 120H490M300 82V168" stroke="#3b82f6" strokeOpacity=".7" strokeWidth="2" />
      <path d="M110 120H270M330 120H490M300 82V168" stroke="#3b82f6" strokeOpacity=".18" strokeWidth="7" />
    </svg>
    <VisualizerNode type="firewall" label="edge-fw" ip="10.10.14.1" className="left-[18.3%] top-1/2" />
    <VisualizerNode type="switch" label="core-switch" ip="10.10.14.2" className="left-1/2 top-1/2" />
    <VisualizerNode type="web-server" label="web-01" ip="10.10.14.7" className="left-[81.7%] top-1/2" />
    <VisualizerNode type="laptop" label="operator" ip="10.10.14.21" className="left-1/2 top-[24%]" />
    <VisualizerNode type="database-server" label="db-01" ip="10.10.14.12" className="left-1/2 top-[76%]" />
  </div>
);

const SimulationCard: React.FC<{ sim: (typeof SIMULATIONS)[number]; tabIndex?: -1 }> = ({ sim, tabIndex }) => {
  const { t } = useTranslation();
  const Preview = sim.id === 'terminal' ? TerminalPreview : sim.id === 'ide' ? EditorPreview : NetworkPreview;
  const isTerminal = sim.id === 'terminal';

  return (
    <Link
      to={sim.slug}
      tabIndex={tabIndex}
      className="group flex h-[350px] w-[min(88vw,620px)] shrink-0 flex-col rounded-2xl border border-border/30 bg-bg-card p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--card-shadow)] sm:h-[390px] sm:w-[min(72vw,680px)] lg:h-[410px] lg:w-[min(48vw,700px)]"
    >
      {isTerminal ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col justify-between py-1 lg:max-w-[38%]">
            <div>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10"><sim.icon className="h-5 w-5 text-accent" /></span>
              <p className="text-[9px] font-black uppercase tracking-widest text-accent">{t(`landing.simulations.list.${sim.id}.tag`)}</p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-text-primary sm:text-2xl">{t(`landing.simulations.list.${sim.id}.title`)}</h3>
              <p className="mt-3 text-xs leading-relaxed text-text-secondary line-clamp-2">{t(`landing.simulations.list.${sim.id}.desc`)}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary">{t('landing.simulations.launchDemo')} <IconArrowRight size={14} /></span>
          </div>
          <div className="flex min-h-[190px] flex-1 lg:min-h-0"><TerminalPreview /></div>
        </div>
      ) : (
      <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10"><sim.icon className="h-5 w-5 text-accent" /></span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-accent">{t(`landing.simulations.list.${sim.id}.tag`)}</p>
            <h3 className="mt-0.5 text-lg font-black tracking-tight text-text-primary sm:text-xl">{t(`landing.simulations.list.${sim.id}.title`)}</h3>
          </div>
        </div>
        <IconArrowRight className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <Preview />
      <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t('landing.simulations.launchDemo')}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      </div>
      </>
      )}
    </Link>
  );
};

const LandingSimulationsSection: React.FC = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip overflow-y-visible bg-bg" data-nav-invert>
      <div className="relative z-10 flex h-full w-full flex-1 flex-col px-3 pb-6 pt-24 md:px-4 md:pb-8 md:pt-28 lg:px-6 lg:pb-10 lg:pt-32">
        <div className="mb-5 shrink-0 md:mb-6">
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-accent">{t('landing.simulations.badge')}</span>
          <h2 className="text-xl font-black leading-none tracking-tighter text-text-primary md:text-2xl lg:text-3xl">
            {t('landing.simulations.heading1')} <span className="text-accent">{t('landing.simulations.heading2')}</span>
          </h2>
          <p className="mt-2 font-mono text-xs leading-relaxed text-text-secondary">{t('landing.simulations.description')}</p>
        </div>

        <div className="relative -translate-y-4 sm:-translate-y-5 lg:-translate-y-6">
          {shouldReduceMotion ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {SIMULATIONS.map((sim) => <SimulationCard key={sim.id} sim={sim} />)}
            </div>
          ) : (
            <div className="relative -mx-3 h-[350px] shrink-0 overflow-x-clip overflow-y-visible md:-mx-4 sm:h-[390px] lg:-mx-6 lg:h-[410px]">
              <div className="marquee-track">
                {[0, 1].map((copy) => (
                  <div key={copy} aria-hidden={copy === 1} className="flex h-full shrink-0 items-stretch gap-4 pr-4 md:gap-5 md:pr-5">
                    {SIMULATIONS.map((sim) => <SimulationCard key={`${copy}-${sim.id}`} sim={sim} tabIndex={copy === 1 ? -1 : undefined} />)}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to="/simulations" className="mt-4 inline-flex w-fit shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted transition-colors hover:text-text-primary">
            {t('landing.simulations.exploreAll')} <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingSimulationsSection;
