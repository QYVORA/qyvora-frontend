import { Download, GitBranch, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import FeatureMarquee from '@/shared/components/FeatureMarquee';
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
    <h4 className="text-xl md:text-3xl lg:text-4xl font-black text-text-primary tracking-tighter leading-tight mt-2">
      {title} <span className="text-accent">{accent}</span>
    </h4>
    {description && (
      <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-3 font-mono">{description}</p>
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

        {/* ── Nine-phase capability marquee ─────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              kicker="Attack Surface Pipeline"
              title="Nine"
              accent="Phases"
              description="From subdomain discovery to exploit-chain analysis — each module feeds the next."
            />
            <FeatureMarquee
              items={PHASES.map((phase) => ({
                id: phase.id,
                meta: `Module ${phase.id}`,
                icon: <phase.icon className="w-5 h-5 text-accent" />,
                title: phase.name,
                description: phase.desc,
              }))}
            />
          </div>
        </PublicSnapSection>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install" className="scroll-mt-28">
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              kicker="Install"
              title="Ready in"
              accent="Minutes"
              description="Single static binary with zero runtime dependencies — one-liner install, manual download, or build from source."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Option 1 — One-liner */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-text-primary leading-tight">One-Line Installer</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Auto-detects OS, CPU and shell.</p>
                  </div>
                </div>
                <code className="block rounded-xl border border-border/20 bg-bg px-4 py-2.5 text-[10px] md:text-xs font-mono text-text-secondary break-all">
                  {ONE_LINER}
                </code>
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
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-text-primary leading-tight">Build From Source</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">{BUILD_FROM_SOURCE.requirements}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {BUILD_FROM_SOURCE.steps.map(({ cmd }) => (
                    <div key={cmd} className="rounded-lg border border-border/20 bg-bg px-3 py-2">
                      <code className="block text-[10px] md:text-[11px] font-mono text-text-secondary break-all">$ {cmd}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct downloads — compact horizontal row */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                Direct Download
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {RELEASES.map((rel) => (
                  <a
                    key={rel.id}
                    href={`${RELEASES_URL}/${rel.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2 transition-colors hover:border-accent/40"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">
                      {rel.label} <span className="text-text-muted">{rel.arch}</span>
                    </span>
                    <span className="text-[9px] font-mono text-accent">{rel.size}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              kicker="Quick Start"
              title="Scan in"
              accent="One Line"
              description="Point Anansi at a target and watch it walk the full pipeline."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/20 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">anansi — zsh</span>
                </div>
                <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-primary">anansi target.com --deep</span>
                  </div>
                  <div className="pl-4 space-y-1.5 border-l border-accent/30">
                    {SCAN_OUTPUT.slice(0, 5).map((line) => (
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
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-2 h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Flags and pipelines</p>
                  </div>
                </div>
                {USAGE_EXAMPLES.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />
                    <code className="text-[10px] md:text-xs text-text-secondary break-all">{cmd}</code>
                  </div>
                ))}
                <p className="text-[9px] font-mono text-text-muted leading-relaxed pt-1">
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
