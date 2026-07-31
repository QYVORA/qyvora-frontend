import { Terminal, Download, ChevronRight, GitBranch } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import SEO from '@/shared/components/SEO';
import StudentHeroSection from '@/shared/components/StudentHeroSection';
import { PHASES } from '@/features/marketing/data/anansiData';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';

const RELEASES_URL = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';

const BINARY_DOWNLOADS = [
  { label: 'Linux (x86_64)', file: 'anansi-linux-amd64' },
  { label: 'Linux (arm64)', file: 'anansi-linux-arm64' },
  { label: 'macOS (Apple Silicon)', file: 'anansi-macos-arm64' },
  { label: 'macOS (Intel)', file: 'anansi-macos-amd64' },
];

const USAGE_EXAMPLES = [
  'anansi target.com',
  'anansi target.com --deep',
  'anansi target.com -v',
  'anansi target.com --modules discovery,tls,takeover',
  'anansi target.com --out json > results.json',
];

const AnansiPage = () => {
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Anansi - QYVORA" description="Anansi — Attack Surface Intelligence CLI for reconnaissance and surface mapping." />
      <div className="px-3 md:px-4 lg:px-6 pt-8 pb-20 lg:pb-24 space-y-8">
        <StudentHeroSection
          icon={<img src={anansiLogo} alt="Anansi" className="w-10 h-10 object-contain" />}
          title="Anansi"
          accentWord="CLI"
          description="Attack Surface Intelligence CLI — discover, probe, and map attack surfaces from the terminal."
          stats={[
            { label: 'Modules', value: PHASES.length },
            { label: 'Platform', value: 'CLI' },
          ]}
        >
          <a
            href="#install"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
          </a>
        </StudentHeroSection>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PHASES.map((phase) => (
              <ScrollReveal key={phase.id} amount={0.05}>
                <div className="rounded-2xl border border-border/30 bg-bg-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Terminal className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">{phase.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed flex-1">{phase.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── Install ─────────────────────────────────────────────────────── */}
        <div id="install" className="space-y-4 scroll-mt-28">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Install</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

            {/* Option 1 — Download binary */}
            <div className="rounded-2xl border border-border/30 bg-bg-card p-6 space-y-4 h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-primary leading-tight">Option 1 — Download Binary</h4>
                  <p className="text-[10px] font-mono text-text-muted mt-0.5">Single binary, no Go required.</p>
                </div>
              </div>
              <div className="space-y-3">
                {BINARY_DOWNLOADS.map(({ label, file }) => (
                  <div key={file} className="rounded-xl border border-border/20 bg-bg p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{label}</span>
                      <a
                        href={`${RELEASES_URL}/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                      >
                        Download
                      </a>
                    </div>
                    <code className="block text-[11px] md:text-xs font-mono text-text-secondary break-all">
                      curl -L {RELEASES_URL}/{file} -o anansi {'&&'} chmod +x anansi
                    </code>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                Move it into your PATH: <code className="text-accent">sudo mv anansi /usr/local/bin/</code>
              </p>
            </div>

            {/* Option 2 — Build from source */}
            <div className="rounded-2xl border border-border/30 bg-bg-card p-6 space-y-4 h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-primary leading-tight">Option 2 — Build From Source</h4>
                  <p className="text-[10px] font-mono text-text-muted mt-0.5">Requirements: Go 1.22+ and an active internet connection.</p>
                </div>
              </div>
              <div className="rounded-xl border border-border/20 bg-bg p-4 space-y-2">
                <code className="block text-[11px] md:text-xs font-mono text-text-secondary break-all">
                  git clone https://github.com/QYVORA/qyvora-anansi-cli
                </code>
                <code className="block text-[11px] md:text-xs font-mono text-text-secondary break-all">
                  cd qyvora-anansi-cli {'&&'} ./install.sh
                </code>
              </div>
              <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                The installer verifies dependencies, builds the stripped binary, and adds it to your PATH automatically. The result is a zero-runtime-dependency binary.
              </p>
              <a
                href="https://github.com/QYVORA/qyvora-anansi-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                GitHub Repository <IconArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Quick Start ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-primary">Quick Start</h3>
            </div>
          </div>
          <div className="bg-bg rounded-xl p-4 font-mono text-sm text-accent space-y-2">
            {USAGE_EXAMPLES.map((cmd) => (
              <div key={cmd} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                <span className="text-xs md:text-sm text-text-secondary break-all">{cmd}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-mono text-text-muted leading-relaxed">
            Only scan targets you own or have explicit written permission to test.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnansiPage;
