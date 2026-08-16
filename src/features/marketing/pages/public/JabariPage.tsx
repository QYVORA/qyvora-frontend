import { Download, GitBranch, Smartphone, Terminal, ChevronRight } from 'lucide-react';
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
import ToolModulesSection from '@/features/marketing/components/tools/ToolModulesSection';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import ToolSectionHeader from '@/features/marketing/components/tools/ToolSectionHeader';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, RULES, PROFILES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/jabariData';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';

const REQUIREMENTS = [
  'Android platform-tools (adb) — USB + network transports',
  'Go 1.21+ toolchain to build',
  'An authorized Android device or emulator to assess',
];

const JabariPage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Jabari - QYVORA" description="Jabari — Android security assessment framework in Go. USB and network (ADB) targets, a seven-stage pipeline, non-destructive rule engine and evidence-driven reporting." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Jabari"
          accentWord="AndroidSec"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Android security assessment framework in Go — a seven-stage pipeline from discovery to evidence-driven reporting across USB and specified-network targets."
          stats={[
            { label: 'Pipeline Stages', value: STAGES.length },
            { label: 'Profiles', value: PROFILES.length },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={jabariLogo}
                alt="Jabari"
                width={500}
                height={500}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openToolInstall('jabari')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.26+</span>
          </div>
        </StudentHeroSection>
        </section>

        {/* ── Authorized-use warning ─────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Authorization"
              title={AUTHORIZED_WARNING.title}
              accent={AUTHORIZED_WARNING.accent}
              description={AUTHORIZED_WARNING.description}
            />
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 md:px-8 py-5 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <AUTHORIZED_WARNING.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono max-w-2xl">
                Every run passes an authorization gate — an interactive{' '}
                <code className="text-amber-400">[y/N]</code> prompt on a TTY, or{' '}
                <code className="text-amber-400">-y</code> / <code className="text-amber-400">authorized: true</code>{' '}
                for non-interactive runs. The authorized flag is recorded on the session for the audit trail. Jabari is
                Android-centric by design: it assesses the single USB device or IP you point it at — never the
                surrounding subnet.
              </p>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Modules ────────────────────────────────────────────────────── */}
        <ToolModulesSection
          kicker="Assessment pipeline"
          title="Seven"
          accent="Stages"
          description="Jabari keeps each assessment step explicit, timed, and recorded so the final report explains what was actually observed and how the conclusion was reached."
          modules={STAGES.map((stage) => ({
            id: stage.id,
            index: stage.id,
            icon: stage.icon,
            title: stage.name,
            description: stage.desc,
            code: `jabari assess usb --profile standard\n# ${stage.name.toLowerCase()} recorded in the session`,
          }))}
        />

        <ToolDocumentationSection
          id="rules-and-evidence"
          index="RULE"
          icon={GitBranch}
          eyebrow="Non-destructive rule engine"
          title="Rules with"
          accent="evidence"
          description="The initial AND-001 through AND-007 rules examine Android posture such as debuggable builds, patch age, insecure ADB, root indicators, emulator signals, and ADB-over-TCP. Findings carry evidence, severity, confidence, and status."
          why="A useful assessment must distinguish an observed fact from a confident conclusion; evidence references and explicit confidence make findings reviewable."
          bullets={RULES.slice(0, 3).map((rule) => `${rule.id}: ${rule.title}.`)}
          code={'jabari assess usb -y --profile deep --json\njabari report --list'}
          codeLabel="Evidence and reporting"
          tree={['internal/rules/       rule interface + AND rules', 'internal/evidence/    hashing and evidence storage', 'internal/validation/  non-destructive confirmation', 'internal/risk/        severity × confidence', 'internal/reporting/   terminal, JSON, Markdown, HTML']}
        />

        <ToolDocumentationSection
          id="architecture"
          index="ARC"
          icon={GitBranch}
          eyebrow="How Jabari is built"
          title="Transport-aware"
          accent="pipeline"
          description="Go interfaces separate the assessment stages from device access. USB and specified-network targets share the same pipeline through a transport abstraction backed by a minimal, injectable ADB wrapper."
          why="Keeping transports separate makes the pipeline testable with fakes and ensures a network target remains one deliberate device, never a broad subnet scan."
          bullets={['Six core stages: discovery, enumeration, analysis, validation, risk, reporting.', 'Profiles select the pipeline shape, from quick posture reads to research fidelity.', 'Interactive and non-interactive authorization are enforced before assessment.']}
          tree={['cmd/jabari/            CLI entry point', 'internal/orchestration/ profile builder + runner', 'internal/transport/     USB and network transports', 'internal/core/          Stage and assessment environment', 'internal/reporting/     offline renderers', 'pkg/adb/                thin injectable ADB wrapper']}
        />

        {/* ── Go source ──────────────────────────────────────────────────── */}
        <ToolSourceSection
          id="go-source"
          kicker="Go source"
          title="Testable"
          accent="contracts"
          description="Small interfaces for stages and transports — the pipeline runs against fakes without a live device."
          examples={SOURCE_EXAMPLES}
        />

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install">
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Install"
              title="Build &"
              accent="Install"
              description="Built with make — produces the jabari binary plus the androidsec alias, installed with its logo and desktop entry."
            />

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-primary">Install automatically</h4>
                  <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
                    We detect your operating system and CPU architecture and download the matching prebuilt binary for you. A terminal command is included as a copyable alternative.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openToolInstall('jabari')}
                className="btn-primary inline-flex items-center gap-2 shrink-0 !px-6 !py-3"
              >
                <Download className="w-4 h-4" /> Auto-install
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
              {/* Option 1 — Build from source */}
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
                <div className="space-y-3">
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

              {/* Option 2 — Requirements & profiles */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-accent" />
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
                  <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1.5">Profiles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PROFILES.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-1 rounded-lg border border-border/20 bg-bg text-[9px] font-mono text-text-muted"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Quick Start"
              title="Assess in"
              accent="One Command"
              description="Point jabari at a connected device or an authorized IP — the authorization gate runs, then the pipeline begins."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">jabari — zsh</span>
                </div>
                <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-primary">jabari assess usb</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-accent">$</span>
                    <span className="text-text-muted">[authorized] target: device via USB — session recorded</span>
                  </div>
                  <div className="pl-4 space-y-1.5 border-l border-accent/30">
                    {[
                      { label: 'discovery', text: 'Galaxy S24 · Android 14 · patch 2024-11-01' },
                      { label: 'enumeration', text: 'package inventory + posture facts collected' },
                      { label: 'analysis', text: 'AND-001 debuggable (high) · AND-002 outdated patch (medium)' },
                      { label: 'risk', text: 'critical 0 · high 1 · medium 1 · low 0' },
                      { label: 'reporting', text: 'session saved → reports/session-<id>.json' },
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
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">USB, network and reporting</p>
                  </div>
                </div>
                <CodeBlock
                  code={QUICK_START.map((cmd) => `$ ${cmd}`).join('\n')}
                  lang="sh"
                  copyable
                  className="mt-auto"
                />
                <p className="text-[9px] font-mono text-text-muted leading-relaxed">
                  Only assess devices you own or have explicit written permission to test.
                </p>
              </div>
            </div>
          </div>
        </PublicSnapSection>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default JabariPage;
