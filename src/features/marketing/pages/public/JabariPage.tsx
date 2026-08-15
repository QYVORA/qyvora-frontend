import { Download, GitBranch, Terminal, ChevronRight, Smartphone } from 'lucide-react';
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
import { STAGES, RULES, PROFILES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING } from '@/features/marketing/data/jabariData';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';

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

const JabariPage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Jabari - QYVORA" description="Jabari — Android security assessment framework in Go. USB and network (ADB) targets, a seven-stage pipeline, non-destructive rule engine and evidence-driven reporting." />
      <PublicSnapLayout>
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
            <a href="#install" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></a>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.26+</span>
          </div>
        </StudentHeroSection>

        {/* ── Authorized-use warning ─────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
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

        {STAGES.map((stage) => (
          <ToolDocumentationSection
            key={stage.id}
            id={`stage-${stage.id}`}
            index={stage.id}
            icon={stage.icon}
            eyebrow="Jabari assessment pipeline"
            title={stage.name}
            accent="stage"
            description={stage.desc}
            why="Jabari keeps each assessment step explicit, timed, and recorded so the final report explains what was actually observed and how the conclusion was reached."
            bullets={['Works on one authorised USB or specified-network Android target.', 'Reads and writes through the shared assessment environment, not directly into reports.', 'Partial evidence remains available if a later stage fails or is cancelled.']}
            code={`jabari assess usb --profile standard\n# ${stage.name.toLowerCase()} is recorded in the session`}
            codeLabel="Assessment flow"
          />
        ))}

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

        <PublicSnapSection id="go-source" fitViewport>
          <div className="flex h-full min-h-0 flex-col justify-center gap-5">
            <SectionHeader kicker="Go source" title="Testable" accent="contracts" description="Jabari uses small interfaces for its assessment stages and transports, allowing the pipeline to be tested without a live device." />
            <GoCodeCarousel examples={[
              { 
                id: 'stage-interface', 
                filename: 'internal/core/stage.go', 
                label: 'Assessment stage interface', 
                description: 'Every stage receives the shared environment rather than reaching into a device directly.', 
                code: 'type Stage interface {\n    Name() string\n    Run(ctx context.Context, env *Env) error\n}\n\ntype Env struct {\n    Device    DeviceInfo\n    Transport Transport\n    Store     *Store\n    Config    *Config\n}' 
              },
              { 
                id: 'transport', 
                filename: 'internal/transport/transport.go', 
                label: 'Transport interface', 
                description: 'USB and specified-network Android targets implement the same connection boundary.', 
                code: 'type Transport interface {\n    Connect(ctx context.Context) error\n    Disconnect() error\n    Info(ctx context.Context) (*models.DeviceInfo, error)\n    Execute(ctx context.Context, req models.Request) (models.Response, error)\n}' 
              },
              { 
                id: 'rule', 
                filename: 'internal/rules/rule.go', 
                label: 'Rule interface', 
                description: 'Rules assess a single security aspect and return a finding with evidence, severity, and confidence.', 
                code: 'type Rule interface {\n    ID() string\n    Title() string\n    Assess(ctx context.Context, env *core.Env) (*Finding, error)\n}\n\ntype Finding struct {\n    RuleID     string\n    Status     Status\n    Severity   Severity\n    Confidence Confidence\n    Evidence   []Evidence\n}' 
              },
              { 
                id: 'authorization', 
                filename: 'internal/auth/gate.go', 
                label: 'Authorization gate', 
                description: 'Every assessment passes through an authorization check before the pipeline starts.', 
                code: 'func Authorize(ctx context.Context, target string) error {\n    if !isInteractive() {\n        if !flags.Authorized {\n            return ErrNotAuthorized\n        }\n        return nil\n    }\n    \n    fmt.Printf("Authorize assessment of %s? [y/N]: ", target)\n    var response string\n    fmt.Scanln(&response)\n    \n    if strings.ToLower(response) != "y" {\n        return ErrNotAuthorized\n    }\n    return nil\n}' 
              },
            ]} />
          </div>
        </PublicSnapSection>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install" className="scroll-mt-28">
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              kicker="Install"
              title="Build &"
              accent="Install"
              description="Built with make — produces the jabari binary plus the androidsec alias, installed with its logo and desktop entry."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
              {/* Option 1 — Build from source */}
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
                  {BUILD_FROM_SOURCE.steps.map(({ cmd, note }) => (
                    <div key={cmd} className="rounded-lg border border-border/20 bg-bg px-3 py-2">
                      <code className="block text-[10px] md:text-[11px] font-mono text-text-secondary break-all">$ {cmd}</code>
                      {note && (
                        <p className="text-[9px] font-mono text-text-muted mt-1 leading-snug">{note}</p>
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
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-3">
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
                  {['Android platform-tools (adb) — USB + network transports', 'Go 1.21+ toolchain to build', 'An authorized Android device or emulator to assess'].map((req) => (
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
            <SectionHeader
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
                      { label: 'reporting', text: 'session saved → reports/session-&lt;id&gt;.json' },
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
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-2 h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">USB, network and reporting</p>
                  </div>
                </div>
                {QUICK_START.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />
                    <code className="text-[10px] md:text-xs text-text-secondary break-all">{cmd}</code>
                  </div>
                ))}
                <p className="text-[9px] font-mono text-text-muted leading-relaxed pt-1">
                  Only assess devices you own or have explicit written permission to test.
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

export default JabariPage;
