import { Download, GitBranch, Binary, Terminal, ChevronRight } from 'lucide-react';
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
import { STAGES, CHECKS, CONFIDENCE_STATES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/aksumData';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';

const REQUIREMENTS = [
  'Linux ELF binaries (x86/x86-64) — other formats degrade honestly to strings-only RAW mode',
  'Go 1.22+ toolchain to build',
  'No external runtime dependencies — a single static binary',
];

const AksumPage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Aksum - QYVORA" description="Aksum — binary security assessment & reverse-engineering framework in Go. Identification, disassembly, function discovery, dataflow-corroborated findings and honest confidence states." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Aksum"
          accentWord="BinarySec"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Binary security assessment & reverse-engineering platform in Go — identification, disassembly, function discovery and evidence-backed findings that escalate only when independently corroborated."
          stats={[
            { label: 'Pipeline Stages', value: STAGES.length },
            { label: 'Static Rules', value: CHECKS.length },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={aksumLogo}
                alt="Aksum"
                width={500}
                height={500}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openToolInstall('aksum')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.22+</span>
          </div>
        </StudentHeroSection>
        </section>

        {/* ── Authorized-use warning ─────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
            <div className="flex flex-col gap-6 lg:gap-8">
              <ToolSectionHeader
                kicker="Authorization"
                title={AUTHORIZED_WARNING.title}
                accent={AUTHORIZED_WARNING.accent}
                description={AUTHORIZED_WARNING.description}
              />
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 md:px-6 py-5 flex gap-4 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AUTHORIZED_WARNING.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono">
                  Aksum reads the file you point it at and nothing else. It never executes the target and never touches a network — dynamic planning is policy-bounded architecture that refuses without an explicit consent flag, and this build ships no executor at all.
                </p>
              </div>
            </div>

            {/* Static-analysis guarantees */}
            <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Analysis guarantees</span>
                <span className="h-px flex-1 bg-border/30" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">read-only by design</span>
              </div>
              {[
                'Reads only the file you point it at — no side channels, no discovery.',
                'Never executes the target and never touches a network.',
                'Ships no executor; dynamic planning refuses without an explicit consent flag.',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-3 rounded-xl border border-border/20 bg-bg-elevated px-4 py-3">
                  <span className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  </span>
                  <span className="text-xs font-mono text-text-secondary leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Stages Carousel ─────────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <ToolsCarousel
            kicker="Assessment pipeline"
            title="Ten"
            accent="Stages"
            label="Stage"
            modules={STAGES.map((stage) => ({
              id: stage.id,
              index: stage.id,
              icon: stage.icon,
              title: stage.name,
              description: stage.desc,
              code: `aksum analyze ./target\n# ${stage.name.toLowerCase()} recorded in the report`,
            }))}
          />
        </section>

        <ToolDocumentationSection
          id="dataflow-and-validation"
          index="EVD"
          icon={GitBranch}
          eyebrow="Evidence over assertion"
          title="Corroborated"
          accent="findings"
          description="A dangerous import alone is a CANDIDATE, never a verdict. The dataflow engine tracks register and stack state through each function body, resolves PLT stubs to real import names via relocations, and recovers string arguments where they are statically materialized. When resolved call sites corroborate a rule's claim, validation escalates the finding to VALIDATED and attaches the callsite evidence."
          why="Confidence must mean something actionable. Escalation is mechanical and one-directional — findings never downgrade within a run, and runtime-computed arguments stay honestly unproven."
          bullets={CHECKS.slice(0, 4).map((check) => `${check.id}: ${check.title}.`)}
          code={'aksum analyze ./target --report report.json\n# "confidence": "VALIDATED" only with callsite corroboration'}
          codeLabel="Dataflow-corroborated escalation"
          tree={['internal/dataflow/    call-site argument tracking + PLT resolution', 'internal/checks/      static security rules (7 rule families)', 'internal/validation/  confidence escalation engine', 'internal/surface/     attack-surface aggregation']}
        />

        <ToolDocumentationSection
          id="architecture"
          index="ARC"
          icon={GitBranch}
          eyebrow="How Aksum is built"
          title="Honest"
          accent="degradation"
          description="Every stage consumes structured output from the previous one — loader, structure, disassembly, functions, graphs, dataflow, checks, validation. When a capability is missing (another CPU, another container format), Aksum says so with a typed error or degrades to strings-only RAW mode instead of guessing."
          why="A binary analyzer users can trust is one whose limits are visible in the output: unknown hardening properties print as unknown, unsupported targets exit with a dedicated code, and identification is never half-guessed."
          bullets={['Confidence states OBSERVED → CANDIDATE → SUSPECTED → VALIDATED; CONFIRMED reserved for a future dynamic executor.', 'Exit codes separate usage errors (2) from unsupported targets (3) so orchestrators can skip, not retry.', 'Deterministic finding IDs anchor to the target SHA-256 — identical input yields identical reports.']}
          tree={['internal/loader/       format dispatch + SHA-256 anchoring', 'internal/structure/    ELF parsing, sections, relocations, hardening', 'internal/functions/    multi-source discovery with provenance', 'internal/dynamic/      policy-bounded execution plans (no bundled executor)']}
        />

        {/* ── Go source ──────────────────────────────────────────────────── */}
        <ToolSourceSection
          id="go-source"
          kicker="Go source"
          title="Structured"
          accent="contracts"
          description="Instructions decode into data, functions carry provenance, call sites carry arguments — every stage is testable against crafted fixtures, no checked-in binaries."
          examples={SOURCE_EXAMPLES}
        />

        {/* ── Install ─────────────────────────────────────────────────────
            Split into two snap sections: an oversized single section breaks
            strict y-mandatory snapping (snap area taller than the viewport). */}
        <PublicSnapSection id="install">
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Install"
              title="Build &"
              accent="Install"
              description="Built with make — produces the aksum binary installed with its logo and desktop entry."
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
                  onClick={() => openToolInstall('aksum')}
                  className="btn-primary inline-flex items-center gap-2 w-fit !px-6 !py-3"
                >
                  <Download className="w-4 h-4" /> Auto-install
                </button>
              </div>

              {/* Requirements & confidence states */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Binary className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">Requirements</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">What you need on PATH</p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {REQUIREMENTS.map((req) => (
                    <li key={req} className="flex items-start gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2">
                      <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-[10px] md:text-xs text-text-secondary leading-snug">{req}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1.5">Confidence states</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CONFIDENCE_STATES.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg border border-border/20 bg-bg text-[9px] font-mono text-text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Install · Build from source ─────────────────────────────────── */}
        <PublicSnapSection>
          {/* Build from source */}
          <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4 max-w-full">
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
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
            >
              GitHub Repository <IconArrowRight size={14} />
            </a>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Quick Start"
              title="Analyze in"
              accent="One Command"
              description="Point aksum at any binary — identification runs first, then the full pipeline down to evidence-backed findings."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">aksum — zsh</span>
                </div>
                <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-primary">aksum analyze /usr/bin/ls</span>
                  </div>
                  <div className="pl-4 space-y-1.5 border-l border-accent/30">
                    {[
                      { label: 'identify', text: 'ELF x86-64 · PIE enabled · NX enabled · RELRO full' },
                      { label: 'functions', text: '259 functions discovered · symbols + entry + call targets' },
                      { label: 'dataflow', text: '168 call sites resolved through .plt to import names' },
                      { label: 'checks', text: 'hardening-properties OBSERVED · dangerous-imports CANDIDATE' },
                      { label: 'validated', text: 'system() called with static string — escalated VALIDATED' },
                      { label: 'summary', text: 'critical 0 · high 1 · medium 1 · low 2 · info 3' },
                    ].map((line) => (
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
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Analysis, surface, reporting</p>
                  </div>
                </div>
                <CodeBlock
                  code={QUICK_START.map((cmd) => `$ ${cmd}`).join('\n')}
                  lang="sh"
                  copyable
                  className="mt-auto"
                />
                <p className="text-[9px] font-mono text-text-muted leading-relaxed">
                  Only analyze software you own or have explicit written permission to assess.
                </p>
              </div>
            </div>
          </div>
        </PublicSnapSection>
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

export default AksumPage;
