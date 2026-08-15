import { Download, GitBranch, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import ToolDocumentationSection from '@/shared/components/ToolDocumentationSection';
import GoCodeCarousel from '@/shared/components/GoCodeCarousel';
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
          <div className="flex flex-wrap items-center gap-3">
            <a href="#install" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></a>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.22+</span>
          </div>
        </StudentHeroSection>

        {PHASES.map((phase) => (
          <ToolDocumentationSection
            key={phase.id}
            id={`phase-${phase.id}`}
            index={phase.id}
            icon={phase.icon}
            eyebrow="Anansi pipeline"
            title={phase.name}
            accent="module"
            description={phase.desc}
            why="This phase turns one part of a target's public attack surface into evidence the next phase can use, keeping reconnaissance structured instead of ad hoc."
            bullets={['Runs as part of a nine-phase, terminal-first intelligence pipeline.', 'Shares results with later phases instead of treating findings as isolated output.', 'Only reports assets and checks that the scanner can substantiate by default.']}
            code={`anansi target.example --modules ${['discovery', 'probe', 'tls', 'headers', 'paths', 'tech', 'takeover', 'osint', 'chain'][Number(phase.id) - 1]}`}
            codeLabel="Run this phase"
          />
        ))}

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

        <PublicSnapSection id="go-source" fitViewport>
          <div className="flex h-full min-h-0 flex-col justify-center gap-5">
            <SectionHeader kicker="Go source" title="Small" accent="entry point" description="The executable delegates to the Cobra command package; the larger pipeline is split into focused internal packages." />
            <GoCodeCarousel examples={[
              { 
                id: 'entry', 
                filename: 'main.go', 
                label: 'CLI entry point', 
                description: 'The binary stays intentionally thin and hands control to the command layer.', 
                code: 'package main\n\nimport "github.com/QYVORA/qyvora-anansi-cli/cmd"\n\nfunc main() {\n    cmd.Execute()\n}' 
              },
              { 
                id: 'pipeline', 
                filename: 'internal/', 
                label: 'Pipeline boundaries', 
                description: 'Recon capabilities are separated by domain so discovery, probing, TLS, paths, and reporting can evolve independently.', 
                code: '// internal/discovery  — CT logs + DNS\n// internal/probe      — live HTTP/HTTPS\n// internal/tls        — certificate analysis\n// internal/techstack  — platform audit\n// internal/chain      — exploit-path assembly' 
              },
              { 
                id: 'transport', 
                filename: 'internal/probe/client.go', 
                label: 'Shared HTTP transport', 
                description: 'One process-wide HTTP client reuses keep-alive connections across all HTTP/HTTPS probing work.', 
                code: 'var httpClient = &http.Client{\n    Transport: &http.Transport{\n        MaxIdleConns:        100,\n        MaxIdleConnsPerHost: 10,\n        IdleConnTimeout:     90 * time.Second,\n    },\n    Timeout: 10 * time.Second,\n}' 
              },
              { 
                id: 'worker', 
                filename: 'internal/discovery/workers.go', 
                label: 'Worker pool pattern', 
                description: 'Fixed-size worker pools process subdomain discovery without spawning unbounded goroutines.', 
                code: 'func processSubdomains(targets []string, workers int) {\n    jobs := make(chan string, len(targets))\n    results := make(chan Result, len(targets))\n    \n    for w := 0; w < workers; w++ {\n        go worker(jobs, results)\n    }\n    \n    for _, target := range targets {\n        jobs <- target\n    }\n    close(jobs)\n}' 
              },
            ]} />
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
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
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
