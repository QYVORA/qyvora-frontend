import { Download, GitBranch, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Carousel } from '@/shared/components/carousel';
import { PHASES, RELEASES, ONE_LINER, BUILD_FROM_SOURCE, USAGE_EXAMPLES, SCAN_OUTPUT } from '@/features/marketing/data/anansiData';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';

const RELEASES_URL = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';
const GITHUB_URL = 'https://github.com/QYVORA/qyvora-anansi-cli';

const SectionHeader: React.FC<{ kicker: string; title: string; accent: string; description?: string }> = ({
  kicker,
  title,
  accent,
  description,
}) => (
  <div className="max-w-2xl">
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent">{kicker}</h3>
    <h4 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-tight mt-3">
      {title} <span className="text-accent">{accent}</span>
    </h4>
    {description && (
      <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 font-mono">{description}</p>
    )}
  </div>
);

const AnansiPage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Anansi - QYVORA" description="Anansi — Attack Surface Intelligence CLI. A nine-phase recon pipeline from subdomain discovery to exploit-chain analysis, all from the terminal." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Anansi"
          accentWord="CLI"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Attack Surface Intelligence Engine — a nine-phase recon pipeline that discovers, probes and maps attack surfaces from the terminal."
          stats={[
            { label: 'Modules', value: PHASES.length },
            { label: 'Platform', value: 'CLI' },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={anansiLogo}
                alt="Anansi"
                width={623}
                height={576}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <a
            href="#install"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
          </a>
        </StudentHeroSection>

        {/* ── Nine-phase pipeline carousel ─────────────────────────────── */}
        <PublicSnapSection>
          <div className="space-y-6 md:space-y-8">
            <SectionHeader
              kicker="Attack Surface Pipeline"
              title="Nine"
              accent="Phases"
              description="Anansi walks the full intelligence lifecycle as a single piped command — from subdomain discovery to exploit-chain analysis. Each module feeds the next."
            />
            <Carousel
              slides={PHASES}
              autoPlayInterval={6000}
              renderCard={(phase) => (
                <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 p-6 sm:p-10 md:p-14 min-h-[300px] sm:min-h-[340px] md:min-h-[360px] items-center">
                  <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-4 shrink-0">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <phase.icon size={28} className="text-accent" />
                    </div>
                    <span className="font-mono text-4xl md:text-6xl font-black text-accent/15 leading-none">{phase.id}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent/70">Module {phase.id}</span>
                    <h5 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-text-primary mt-2">
                      {phase.name}
                    </h5>
                    <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-mono mt-3 max-w-xl">
                      {phase.desc}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </PublicSnapSection>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install" className="scroll-mt-28">
          <div className="space-y-6 md:space-y-8">
            <SectionHeader
              kicker="Install"
              title="Ready in"
              accent="Minutes"
              description="A single static binary with zero runtime dependencies. One-liner install, manual download, or build from source."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Option 1 — One-liner */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-6 md:p-8 space-y-4 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary leading-tight">One-Line Installer</h4>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">Auto-detects OS, CPU and shell.</p>
                  </div>
                </div>
                <code className="block rounded-xl border border-border/20 bg-bg px-4 py-3 text-[10px] md:text-xs font-mono text-text-secondary break-all">
                  {ONE_LINER}
                </code>
                <ul className="space-y-1.5">
                  {[
                    'Downloads the matching binary from GitHub Releases',
                    'Verifies its SHA-256 against the published checksums',
                    'Falls back to building from source when offline',
                    'Installs to ~/.local/bin and adds it to your shell config',
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2 text-[10px] md:text-xs text-text-muted font-mono leading-relaxed">
                      <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" /> {line}
                    </li>
                  ))}
                </ul>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                >
                  GitHub Repository <IconArrowRight size={14} />
                </a>
              </div>

              {/* Option 2 — Build from source */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-6 md:p-8 space-y-4 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary leading-tight">Build From Source</h4>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">{BUILD_FROM_SOURCE.requirements}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {BUILD_FROM_SOURCE.steps.map(({ cmd, note }) => (
                    <div key={cmd} className="rounded-xl border border-border/20 bg-bg px-4 py-3">
                      <code className="block text-[10px] md:text-xs font-mono text-text-secondary break-all">$ {cmd}</code>
                      {note && (
                        <p className="text-[10px] font-mono text-text-muted mt-2 leading-relaxed">{note}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                  The binary has zero runtime dependencies.
                </p>
              </div>
            </div>

            {/* Download binaries */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-3 block">
                Direct Download
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {RELEASES.map((rel) => (
                  <a
                    key={rel.id}
                    href={`${RELEASES_URL}/${rel.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border/20 bg-bg px-4 py-3 transition-colors hover:border-accent/40"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                        {rel.label} <span className="text-text-muted">{rel.arch}</span>
                      </span>
                      <p className="text-[9px] font-mono text-text-muted mt-0.5 truncate">{rel.file}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-accent shrink-0">
                      {rel.size}
                      <IconArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="space-y-6 md:space-y-8">
            <SectionHeader
              kicker="Quick Start"
              title="Scan in"
              accent="One Line"
              description="Point Anansi at a target and watch it walk the full pipeline — only found assets are shown by default."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">anansi — zsh</span>
                </div>
                <div className="p-4 md:p-6 font-mono text-xs md:text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-primary">anansi target.com --deep</span>
                  </div>
                  <div className="pl-4 space-y-2 border-l border-accent/30">
                    {SCAN_OUTPUT.map((line) => (
                      <div key={line.label} className="flex items-start gap-2">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent shrink-0 pt-0.5">
                          [{line.label}]
                        </span>
                        <span className="text-text-muted leading-relaxed break-words">{line.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-primary animate-pulse">▋</span>
                  </div>
                </div>
              </div>

              {/* Usage commands */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-6 md:p-8 space-y-3 h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary leading-tight">Usage</h4>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">Flags and pipelines</p>
                  </div>
                </div>
                {USAGE_EXAMPLES.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 rounded-xl border border-border/20 bg-bg px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-accent shrink-0" />
                    <code className="text-xs md:text-sm text-text-secondary break-all">{cmd}</code>
                  </div>
                ))}
                <p className="text-[10px] font-mono text-text-muted leading-relaxed pt-1">
                  Only scan targets you own or have explicit written permission to test.
                </p>
              </div>
            </div>
          </div>
        </PublicSnapSection>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default AnansiPage;
