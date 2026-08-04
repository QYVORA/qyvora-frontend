import { Terminal, Download, ChevronRight, GitBranch } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { Carousel } from '@/shared/components/carousel';
import { PHASES, RELEASES, BUILD_FROM_SOURCE } from '@/features/marketing/data/anansiData';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';

const RELEASES_URL = 'https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download';

const USAGE_EXAMPLES = [
  'anansi target.com',
  'anansi target.com --deep',
  'anansi target.com -v',
  'anansi target.com --modules discovery,tls,takeover',
  'anansi target.com --out json > results.json',
];

const SCAN_OUTPUT = [
  { label: 'discovery', text: '312 subdomains resolved via crt.sh + brute-force' },
  { label: 'probe', text: '48 live hosts — status codes and titles extracted' },
  { label: 'tls', text: '3 SANs mapped · weak protocol flagged' },
  { label: 'headers', text: '12 security header misconfigurations found' },
  { label: 'paths', text: '.env exposed · backup archive discoverable' },
  { label: 'takeover', text: '1 dangling CNAME pointing to AWS S3' },
];

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
      <SEO title="Anansi - QYVORA" description="Anansi — Attack Surface Intelligence CLI for reconnaissance and surface mapping." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Anansi"
          accentWord="CLI"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Attack Surface Intelligence CLI — discover, probe, and map attack surfaces from the terminal."
          stats={[
            { label: 'Modules', value: PHASES.length },
            { label: 'Platform', value: 'CLI' },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={anansiLogo}
                alt="Anansi"
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain drop-shadow-[0_0_50px_rgba(6,182,111,0.35)]"
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

        {/* ── Modules pipeline carousel ─────────────────────────────────── */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Attack Surface Pipeline"
                title="Modules"
                accent={String(PHASES.length).padStart(2, '0')}
                description="Anansi walks the full attack-surface lifecycle as a single piped command — from subdomain discovery to dangling CNAME takeover detection."
              />
              <Carousel
                slides={PHASES}
                renderCard={(phase) => (
                  <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[460px] overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10 bg-bg rounded-2xl">
                    <div className="absolute inset-0">
                      <img src={phase.image} alt={phase.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/30" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-center min-h-[260px] sm:min-h-[320px] md:min-h-[396px]">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <phase.icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-accent">
                          Module {phase.id}
                        </span>
                      </div>
                      <h5 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-text-primary mb-3 md:mb-4">
                        {phase.name}
                      </h5>
                      <p className="max-w-xl text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed font-mono">
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <div id="install" className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6 scroll-mt-28">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Install"
                title="Ready in"
                accent="Minutes"
                description="Download a single static binary or build from source. The result is a zero-runtime-dependency binary."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Option 1 — Download binary */}
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">Option 1 — Download Binary</h4>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">Single binary, no Go required.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {RELEASES.map(({ id, label, arch, file, size }) => (
                      <a
                        key={id}
                        href={`${RELEASES_URL}/${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/rel rounded-xl border border-border/20 bg-bg p-4 space-y-2 transition-colors hover:border-accent/30"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                            {label} <span className="text-text-muted">{arch}</span>
                          </span>
                          <span className="text-[9px] font-mono text-text-muted">{size}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <code className="text-[10px] md:text-[11px] font-mono text-text-secondary break-all">
                            curl -L {RELEASES_URL}/{file} -o anansi
                          </code>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent shrink-0 group-hover/rel:gap-2 transition-all">
                            Download <IconArrowRight size={12} />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                    Move it into your PATH: <code className="text-accent">sudo mv anansi /usr/local/bin/</code>
                  </p>
                </div>

                {/* Option 2 — Build from source */}
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <GitBranch className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">Option 2 — Build From Source</h4>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">Requirements: Go 1.22+ and an active internet connection.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {BUILD_FROM_SOURCE.steps.map(({ cmd, note }) => (
                      <div key={cmd} className="rounded-xl border border-border/20 bg-bg p-4">
                        <code className="block text-[11px] md:text-xs font-mono text-text-secondary break-all">
                          {cmd}
                        </code>
                        {note && (
                          <p className="text-[10px] font-mono text-text-muted mt-2 leading-relaxed">{note}</p>
                        )}
                      </div>
                    ))}
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
          </div>
        </div>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Quick Start"
                title="Scan in"
                accent="One Line"
                description="Point Anansi at a target and watch it walk the full pipeline — each module feeds the next."
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
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-3 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
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
          </div>
        </div>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default AnansiPage;
