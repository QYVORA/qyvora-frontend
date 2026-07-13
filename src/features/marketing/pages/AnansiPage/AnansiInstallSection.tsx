import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Apple, Copy } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import { RELEASES, BUILD_FROM_SOURCE, type AnansiRelease } from './anansiData';

const TUX = (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 1.5C9 1.5 6.5 3.2 5.5 6c-.7 1.8-.3 3.8.5 5-.5.5-1 1.2-1 2.2-.3 1.8 1 3.8 2.5 4.8.7.5 1.8 1 3 1.5h3c1.2-.5 2.3-1 3-1.5 1.5-1 2.8-3 2.5-4.8 0-1-.5-1.7-1-2.2.8-1.2 1.2-3.2.5-5C17.5 3.2 15 1.5 12 1.5zm0 2c1.8 0 3.5 1 4.2 2.5.5 1 .5 2.2 0 3-.3.5-.7.8-1.2.8s-1-.3-1.5-.5c-.5-.3-1-.5-1.5-.5s-1 .2-1.5.5c-.5.2-1 .5-1.5.5s-.9-.3-1.2-.8c-.5-.8-.5-2 0-3C8.5 4.5 10.2 3.5 12 3.5zM8.5 8c1 0 2 .8 2 2s-1 2-2 2-2-.8-2-2 1-2 2-2zm7 0c1 0 2 .8 2 2s-1 2-2 2-2-.8-2-2 1-2 2-2zM12 13c1.5 0 3 .5 3.5 1.5.3.5.3 1 0 1.5-.5.5-2 1.2-3.5 1.2s-3-.7-3.5-1.2c-.3-.5-.3-1 0-1.5C9 13.5 10.5 13 12 13z"/>
  </svg>
);

const WINDOWS_LOGO = (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
  </svg>
);

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  linux: TUX,
  apple: <Apple className="w-5 h-5" />,
  windows: WINDOWS_LOGO,
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors text-text-muted hover:text-accent shrink-0"
      aria-label="Copy command"
    >
      {copied ? <IconCheck size={14} className="text-accent" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

const AnansiInstallSection: React.FC = () => {
  const [selected, setSelected] = useState<AnansiRelease>(RELEASES[0]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start"
      >
        {/* Left: Header + platform pills */}
        <div className="text-left lg:sticky lg:top-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">
            Download <span className="text-accent">Anansi CLI</span>
          </h2>
          <p className="mt-4 text-text-secondary font-mono text-sm md:text-base leading-relaxed max-w-2xl">
            Pre-compiled binaries for every platform. Zero dependencies.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {RELEASES.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selected.id === r.id
                    ? 'bg-accent text-bg shadow-[0_0_20px_-5px_rgba(6,182,111,0.3)]'
                    : 'bg-bg-card text-text-muted hover:text-text-primary hover:bg-bg-elevated border border-border/30'
                }`}
              >
                <span className={selected.id === r.id ? 'text-bg' : 'text-accent'}>{PLATFORM_ICONS[r.icon]}</span>
                {r.label}
                <span className={selected.id === r.id ? 'text-bg/60' : 'text-text-muted'}>{r.arch}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Download card + build from source */}
        <div className="space-y-8">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="bg-bg-card border border-border/30 rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent shrink-0">{PLATFORM_ICONS[selected.icon]}</span>
                    <span className="text-text-primary font-bold text-lg truncate">{selected.label}</span>
                    <span className="text-text-muted font-mono text-sm shrink-0">{selected.arch}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono text-text-muted">
                    <span className="truncate">Binary: <span className="text-text-secondary">{selected.file}</span></span>
                    <span className="hidden sm:inline shrink-0">Size: {selected.size}</span>
                  </div>
                </div>
                <a
                  href={`https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/${selected.file}`}
                  className="hidden sm:inline-flex items-center gap-2 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-6 py-3 text-xs hover:brightness-110 active:scale-95 transition-all shrink-0"
                >
                  Download
                </a>
              </div>

              <div className="space-y-3">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="flex-1 flex items-center gap-2 bg-bg-elevated rounded-lg px-4 py-2.5 border border-border/30 min-w-0">
                      <span className="text-accent font-bold shrink-0">$</span>
                      <code className="text-text-primary font-mono text-sm truncate">{step.cmd}</code>
                      <CopyButton text={step.cmd} />
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={`https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/${selected.file}`}
                className="sm:hidden mt-6 flex items-center justify-center gap-2 bg-accent text-bg font-black uppercase tracking-[0.12em] rounded-xl px-6 py-3.5 text-xs hover:brightness-110 active:scale-95 transition-all"
              >
                Download for {selected.label} ({selected.arch})
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-text-muted font-mono text-xs uppercase tracking-widest mb-4">
              ── or build from source ──
            </p>
            <div className="bg-bg-elevated border border-border/30 rounded-xl inline-block max-w-full overflow-hidden">
              <div className="px-6 py-4 sm:px-8 space-y-2">
                {BUILD_FROM_SOURCE.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-accent font-bold shrink-0 font-mono text-sm">$</span>
                    <code className="text-text-secondary font-mono text-sm truncate">{s.cmd}</code>
                    {s.note && <span className="text-text-muted font-mono text-[10px] hidden sm:inline shrink-0">// {s.note}</span>}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-text-muted font-mono text-xs px-4">
              Requires Go 1.22+. Runs on any Linux, macOS, or Windows with Go installed.
            </p>
          </div>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnansiInstallSection;
export { AnansiInstallSection };
