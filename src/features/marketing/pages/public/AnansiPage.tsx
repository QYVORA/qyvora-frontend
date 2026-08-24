import { Download, GitBranch, Loader2, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import ToolDocumentationSection from '@/shared/components/ToolDocumentationSection';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolsCarousel from '@/features/marketing/components/ToolsCarousel';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import ToolSectionHeader from '@/features/marketing/components/tools/ToolSectionHeader';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { useToolRelease } from '@/features/marketing/hooks/useToolRelease';
import { PHASES, RELEASES, ONE_LINER, BUILD_FROM_SOURCE, USAGE_EXAMPLES, SCAN_OUTPUT, SOURCE_EXAMPLES } from '@/features/marketing/data/anansiData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';

const GITHUB_URL = 'https://github.com/QYVORA/qyvora-anansi-cli';

const PHASE_MODULES = ['discovery', 'probe', 'tls', 'headers', 'paths', 'tech', 'takeover', 'osint', 'chain'];

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const AnansiPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const release = useToolRelease('anansi');
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Anansi - QYVORA" description="Anansi. Attack Surface Intelligence CLI. A nine-phase recon pipeline from subdomain discovery to exploit-chain analysis, all from the terminal." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Anansi"
          accentWord="CLI"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Attack Surface Intelligence Engine: a nine-phase recon pipeline that discovers, probes and maps attack surfaces from the terminal."
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
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openToolInstall('anansi')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.22+</span>
          </div>
        </StudentHeroSection>
        </section>

        {/* ── Modules Carousel ─────────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <ToolsCarousel
            kicker="Recon pipeline"
            title="Nine"
            accent="Phases"
            label="Phase"
            modules={PHASES.map((phase) => ({
              id: phase.id,
              index: phase.id,
              icon: phase.icon,
              title: phase.name,
              description: phase.desc,
              code: `anansi target.example --modules ${PHASE_MODULES[Number(phase.id) - 1]}`,
            }))}
          />
        </section>

        <ToolDocumentationSection
          id="architecture"
          index="ARC"
          icon={GitBranch}
          eyebrow="How Anansi is built"
          title="Concurrent"
          accent="by design"
          description="Anansi is a Go CLI built around shared HTTP transport, TTL DNS caching, fixed worker pools, and concurrent network checks so deep recon stays controlled and repeatable."
          why="A scanner that repeatedly opens connections or spawns unbounded work becomes slow and noisy; the architecture reuses connections, caches DNS answers, and bounds concurrency."
          bullets={['One process-wide HTTP transport reuses keep-alive connections.', 'A 60-second DNS cache prevents repeat lookups across recursive and TLS-SAN work.', 'Discovery, probing, paths, and tech-stack work use fixed worker pools.']}
          tree={['cmd/                 Cobra command layer', 'internal/discovery/  CT logs + DNS discovery', 'internal/probe/      live HTTP/HTTPS checks', 'internal/techstack/  platform fingerprinting', 'internal/chain/      exploit-path assembly', 'wordlists/           editable rules and fingerprints']}
        />

        {/* ── Go source ──────────────────────────────────────────────────── */}
        <ToolSourceSection
          id="go-source"
          kicker="Go source"
          title="Real engine"
          accent="code"
          description="Shared transport, TTL-cached resolution and dead-CNAME detection, lifted from the repository."
          examples={SOURCE_EXAMPLES}
        />

        {/* ── Install ─────────────────────────────────────────────────────
            Split into two snap sections: an oversized single section breaks
            strict y-mandatory snapping (snap area taller than the viewport). */}
        <PublicSnapSection id="install">
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Install"
              title="Ready in"
              accent="Minutes"
              description="Single static binary with zero runtime dependencies, one-liner install, manual download, or build from source."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 md:gap-6 items-stretch">
              {/* Auto-install */}
              <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6 flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-primary">Install automatically</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      We detect your operating system and CPU architecture and download the matching prebuilt binary for you.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openToolInstall('anansi')}
                  className="btn-primary inline-flex items-center gap-2 w-fit !px-6 !py-3"
                >
                  <Download className="w-4 h-4" /> Auto-install
                </button>
              </div>

              {/* Option 1 — One-liner */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-text-primary leading-tight">One-Line Installer</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Auto-detects OS, CPU and shell.</p>
                  </div>
                </div>
                <CodeBlock code={ONE_LINER} lang="sh" badge="shell" copyable />
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                >
                  GitHub Repository <IconArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Install · Build from source ─────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Option 2 — Build from source */}
            <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-text-primary leading-tight">Build From Source</h4>
                  <p className="text-[9px] font-mono text-text-muted mt-0.5">{BUILD_FROM_SOURCE.requirements}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {BUILD_FROM_SOURCE.steps.map(({ cmd, note }) => (
                  <div key={cmd} className="space-y-1.5">
                    <CodeBlock code={`$ ${cmd}`} lang="sh" copyable />
                    {note && (
                      <p className="text-[9px] font-mono text-text-muted leading-snug">{note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct downloads — compact horizontal row, verified against
                the latest GitHub release so missing builds never render */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-2">
                Direct Download{release.version ? ` · ${release.version}` : ''}
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {release.status === 'loading' && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/20 bg-bg px-3 py-2 text-[9px] uppercase tracking-widest text-text-muted">
                    <Loader2 className="h-3 w-3 animate-spin" /> Checking release…
                  </span>
                )}
                {release.status === 'unavailable' && (
                  <span className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[9px] uppercase tracking-widest text-text-muted">
                    No release published yet, use the installer above
                  </span>
                )}
                {release.status === 'ready' &&
                  RELEASES.filter((rel) => release.assetUrl(rel.file)).map((rel) => {
                    const size = release.assetSize(rel.file);
                    return (
                      <a
                        key={rel.id}
                        href={release.assetUrl(rel.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2 transition-colors hover:border-accent/40"
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">
                          {rel.label} <span className="text-text-muted">{rel.arch}</span>
                        </span>
                        {size ? (
                          <span className="text-[9px] font-mono text-accent">{formatBytes(size)}</span>
                        ) : null}
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Quick Start"
              title="Scan in"
              accent="One Line"
              description="Point Anansi at a target and watch it walk the full pipeline."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">anansi, zsh</span>
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
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 h-full flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Flags and pipelines</p>
                  </div>
                </div>
                <CodeBlock
                  code={USAGE_EXAMPLES.map((cmd) => `$ ${cmd}`).join('\n')}
                  lang="sh"
                  copyable
                  className="mt-auto"
                />
                <p className="text-[9px] font-mono text-text-muted leading-relaxed">
                  Only scan targets you own or have explicit written permission to test.
                </p>
              </div>
            </div>
          </div>
        </PublicSnapSection>

        <RelatedContentSection items={getRelatedTools(t, '/anansi')} />

        <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default AnansiPage;
