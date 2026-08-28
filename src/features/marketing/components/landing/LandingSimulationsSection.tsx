import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'motion/react';
import { IconArrowRight, IconTerminal, IconCode, IconNetwork } from '@/shared/components/icons';
import DeviceShape from '@/features/student/components/tools/network/DeviceShape';
import DeviceLeds from '@/features/student/components/tools/network/DeviceLeds';
import DragMarquee from '@/shared/components/carousel/DragMarquee';
import { getDeviceDef } from '@/features/student/components/tools/network/devices';
import type { DeviceType, TrafficLevel } from '@/features/student/components/tools/network/types';

const SIMULATIONS = [
  { id: 'terminal', slug: '/simulations/terminal', icon: IconTerminal },
  { id: 'ide', slug: '/simulations/ide', icon: IconCode },
  { id: 'network', slug: '/simulations/network-visualizer', icon: IconNetwork },
] as const;

/* Mirrors the Kali-style terminal chrome used by TerminalShell. */
const TerminalPreview: React.FC = () => (
  <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0c0c0c] shadow-inner">
    <div className="flex items-center justify-between bg-[#1a1a1a] px-3.5 py-2.5">
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
    <div className="flex items-end bg-[#1a1a1a] px-3.5 pt-2.5">
      <span className="rounded-t-lg border border-b-0 border-[#2a2a2a] bg-[#0c0c0c] px-3 py-1.5 font-mono text-[11px] text-accent">recon.py</span>
    </div>
    <div className="space-y-1.5 p-4 font-mono text-xs leading-relaxed sm:text-sm">
      <p><span className="text-[#c678dd]">def</span> <span className="text-accent">probe</span>(<span className="text-[#e5c07b]">host</span>):</p>
      <p className="pl-5 text-[#d4d4d4]">return scan(host)</p>
      <p className="mt-3"><span className="text-[#c678dd]">print</span>(<span className="text-accent">probe</span>(<span className="text-[#e5c07b]">&quot;target&quot;</span>))</p>
      <p className="mt-3 pt-3 text-[#00ff41]">✓ host discovered</p>
    </div>
  </div>
);

/* ── Network visualizer preview ────────────────────────────────────────────────
   One anchor table per breakpoint: nodes and SVG links read the exact same
   coordinates and every chip is centred on its anchor, so connections always
   land on hardware. The mobile layer spreads nodes wider and shrinks the
   chips, at ~320px card width the desktop spacing collapsed into overlap. */

type NodeKey = 'fw' | 'sw' | 'web' | 'op' | 'db';

const PREVIEW_NODES: Record<NodeKey, { type: DeviceType; label: string; ip: string; traffic?: TrafficLevel }> = {
  fw: { type: 'firewall', label: 'edge-fw', ip: '10.10.14.1' },
  sw: { type: 'switch', label: 'core-switch', ip: '10.10.14.2', traffic: 'medium' },
  web: { type: 'web-server', label: 'web-01', ip: '10.10.14.7', traffic: 'low' },
  op: { type: 'laptop', label: 'operator', ip: '10.10.14.21' },
  db: { type: 'database-server', label: 'db-01', ip: '10.10.14.12' },
};

interface PreviewLayout {
  compact: boolean;
  anchors: Record<NodeKey, { left: string; top: string }>;
}

const LAYOUT_MOBILE: PreviewLayout = {
  compact: true,
  anchors: {
    fw: { left: '12%', top: '50%' },
    sw: { left: '50%', top: '50%' },
    web: { left: '88%', top: '50%' },
    op: { left: '50%', top: '15%' },
    db: { left: '50%', top: '85%' },
  },
};

const LAYOUT_DESKTOP: PreviewLayout = {
  compact: false,
  anchors: {
    fw: { left: '18.3%', top: '50%' },
    sw: { left: '50%', top: '50%' },
    web: { left: '81.7%', top: '50%' },
    op: { left: '50%', top: '24%' },
    db: { left: '50%', top: '76%' },
  },
};

const PREVIEW_LINKS: { from: NodeKey; to: NodeKey; glow: string; dashed?: boolean }[] = [
  { from: 'fw', to: 'sw', glow: '#3b82f6' },
  { from: 'op', to: 'sw', glow: '#06b6d6', dashed: true },
  { from: 'sw', to: 'web', glow: '#3b82f6' },
  { from: 'sw', to: 'db', glow: '#3b82f6' },
];

/* Mirrors NetworkEdge styling: slate base stroke, tinted glow, dashed wireless.
   Packet dot rides the same coordinates as the base stroke. */
const PacketFlow: React.FC<{ x1: string; y1: string; x2: string; y2: string; delay: number }> = ({ x1, y1, x2, y2, delay }) => (
  <line
    x1={x1} y1={y1} x2={x2} y2={y2}
    pathLength={100}
    stroke="var(--color-accent)"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeDasharray="2.5 97.5"
  >
    <animate attributeName="stroke-dashoffset" values="2.5;-97.5" dur="1.8s" begin={`${(-delay * 0.45).toFixed(2)}s`} repeatCount="indefinite" />
  </line>
);

const VisualizerChip: React.FC<{ nodeKey: NodeKey; layout: PreviewLayout }> = ({ nodeKey, layout }) => {
  const def = getDeviceDef(PREVIEW_NODES[nodeKey].type);
  const { left, top } = layout.anchors[nodeKey];
  const { label, ip, traffic } = PREVIEW_NODES[nodeKey];

  return (
    <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
      {/* Shape box — centred exactly on the anchor point */}
      <div className={`relative flex items-center justify-center ${layout.compact ? 'scale-[0.7]' : ''}`}>
        <DeviceShape shape={def.shape} color={def.color} icon={def.icon} selected={false} hovered={false} status="online" traffic={traffic} />
        <span className="absolute -right-1 -top-1"><DeviceLeds status="online" traffic={traffic} compact /></span>
      </div>
      {/* Label + IP hang below the connection point */}
      <span className={`flex flex-col items-center leading-tight ${layout.compact ? 'mt-0.5' : 'mt-1'}`}>
        <span className={`whitespace-nowrap rounded bg-bg px-1 font-bold text-text-primary ${layout.compact ? 'text-[8px]' : 'text-[9px]'}`}>{label}</span>
        <span className={`whitespace-nowrap rounded bg-bg px-1 font-mono text-text-muted ${layout.compact ? 'text-[7px]' : 'text-[8px]'}`}>{ip}</span>
      </span>
    </div>
  );
};

const NetworkLayer: React.FC<{ layout: PreviewLayout; className: string; reduceMotion: boolean }> = ({ layout, className, reduceMotion }) => (
  <div className={`absolute inset-0 ${className}`}>
    <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
      {PREVIEW_LINKS.map((link, i) => {
        const a = layout.anchors[link.from];
        const b = layout.anchors[link.to];
        return (
          <g key={`${layout.compact ? 'm' : 'd'}-${i}`}>
            <line x1={a.left} y1={a.top} x2={b.left} y2={b.top} stroke={link.glow} strokeWidth={6} opacity={0.06} />
            <line x1={a.left} y1={a.top} x2={b.left} y2={b.top} stroke="#334155" strokeWidth={1.5} opacity={0.6} strokeDasharray={link.dashed ? '6 4' : undefined} />
            {!reduceMotion && (
              <PacketFlow x1={a.left} y1={a.top} x2={b.left} y2={b.top} delay={i} />
            )}
          </g>
        );
      })}
    </svg>
    {(Object.keys(PREVIEW_NODES) as NodeKey[]).map((key) => (
      <VisualizerChip key={`${layout.compact ? 'm' : 'd'}-${key}`} nodeKey={key} layout={layout} />
    ))}
  </div>
);

const NetworkPreview: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-bg">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]" />
      <NetworkLayer layout={LAYOUT_MOBILE} className="sm:hidden" reduceMotion={!!shouldReduceMotion} />
      <NetworkLayer layout={LAYOUT_DESKTOP} className="hidden sm:block" reduceMotion={!!shouldReduceMotion} />
    </div>
  );
};

const SimulationCard: React.FC<{ sim: (typeof SIMULATIONS)[number]; tabIndex?: -1 }> = ({ sim, tabIndex }) => {
  const { t } = useTranslation();
  const Preview = sim.id === 'terminal' ? TerminalPreview : sim.id === 'ide' ? EditorPreview : NetworkPreview;
  const isTerminal = sim.id === 'terminal';

  return (
    <Link
      to={sim.slug}
      tabIndex={tabIndex}
      className="group flex h-[460px] w-[min(88vw,620px)] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[var(--card-shadow)] sm:h-[460px] sm:w-[min(72vw,680px)] lg:h-[410px] lg:w-[min(48vw,700px)]"
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
      <div className="mt-4 flex items-center justify-between">
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
    <div className="relative flex min-h-dvh flex-col overflow-x-clip overflow-hidden bg-bg" >
      <div className="relative z-10 flex h-full w-full flex-1 flex-col px-3 pb-6 pt-24 md:px-4 md:pb-8 lg:px-6 lg:pb-10">
        <div className="mb-8 shrink-0 md:mb-10 lg:mb-14">
          <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-accent">{t('landing.simulations.badge')}</span>
          <h2 className="text-xl font-black leading-none tracking-tighter text-text-primary md:text-2xl lg:text-3xl">
            {t('landing.simulations.heading1')} <span className="text-accent">{t('landing.simulations.heading2')}</span>
          </h2>
          <p className="mt-2 font-mono text-xs leading-relaxed text-text-secondary">{t('landing.simulations.description')}</p>
        </div>

        <div className="relative -translate-y-2 sm:-translate-y-3 lg:-translate-y-4">
          {shouldReduceMotion ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {SIMULATIONS.map((sim) => <SimulationCard key={sim.id} sim={sim} />)}
            </div>
          ) : (
            <div className="relative -mx-3 h-[460px] shrink-0 md:-mx-4 sm:h-[460px] lg:-mx-6 lg:h-[410px]">
              <DragMarquee speed={22} trackClassName="gap-4 pr-4 md:gap-5 md:pr-5" className="h-full">
                {SIMULATIONS.map((sim) => <SimulationCard key={sim.id} sim={sim} />)}
              </DragMarquee>
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

export default React.memo(LandingSimulationsSection);
