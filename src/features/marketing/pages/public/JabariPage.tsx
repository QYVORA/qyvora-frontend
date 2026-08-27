import { Download, GitBranch, Smartphone, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, RULES, PROFILES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/jabariData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const REQUIREMENTS = [
  'Android platform-tools (adb) - USB + network transports',
  'Go 1.21+ toolchain to build',
  'An authorized Android device or emulator to assess',
];

const DOC_SECTIONS: ToolDocSectionItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'rules', label: 'Rules' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'source', label: 'Source' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
];

const JabariPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ToolDocPage
      toolName="Jabari"
      accentWord="AndroidSec"
      seoTitle="Jabari - QYVORA"
      seoDescription="Jabari. Android security assessment framework in Go. USB and network (ADB) targets, a seven-stage pipeline, non-destructive rule engine and evidence-driven reporting."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('jabari')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="Jabari"
        accentWord="AndroidSec"
        description="Android security assessment framework in Go, a seven-stage pipeline from discovery to evidence-driven reporting across USB and specified-network targets."
        stats={[
          { label: 'Pipeline Stages', value: STAGES.length },
          { label: 'Profiles', value: PROFILES.length },
        ]}
        logo={
          <img
            src={jabariLogo}
            alt="Jabari"
            width={500}
            height={500}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('jabari')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-[#00ADD8]">Go</span> 1.26+
            </span>
          </>
        }
      />

      {/* ── Authorized-use warning ──────────────────────────────────────── */}
      <ToolDocSection
        id="overview"
        kicker="Authorization"
        title={AUTHORIZED_WARNING.title}
        accent={AUTHORIZED_WARNING.accent}
        description={AUTHORIZED_WARNING.description}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 md:px-6 py-5 flex gap-4 items-start">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <AUTHORIZED_WARNING.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono">
              Every run passes an authorization gate, an interactive{' '}
              <code className="text-amber-400">[y/N]</code> prompt on a TTY, or{' '}
              <code className="text-amber-400">-y</code> / <code className="text-amber-400">authorized: true</code>{' '}
              for non-interactive runs. The authorized flag is recorded on the session for the audit trail. Jabari is
              Android-centric by design: it assesses the single USB device or IP you point it at, never the
              surrounding subnet.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Session guarantees</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">recorded per run</span>
            </div>
            {[
              'Interactive [y/N] authorization gate before any assessment stage runs.',
              'The authorized flag is written to the session record for the audit trail.',
              'One deliberate target, a single USB device or IP, never the surrounding subnet.',
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
      </ToolDocSection>

      {/* ── Pipeline ─────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="pipeline"
        kicker="Assessment pipeline"
        title="Seven"
        accent="Stages"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <stage.icon size={16} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">
                    Stage {stage.id}
                  </span>
                  <h4 className="text-xs font-black text-text-primary leading-tight">
                    {stage.name}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] font-mono text-text-muted leading-relaxed">
                {stage.desc}
              </p>
              <CodeBlock
                code={`jabari assess usb --profile standard\n# ${stage.name.toLowerCase()} recorded in the session`}
                lang="sh"
                badge="shell"
                copyable
              />
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="rules"
        kicker="Non-destructive rule engine"
        title="Rules with"
        accent="evidence"
        description="The initial AND-001 through AND-007 rules examine Android posture such as debuggable builds, patch age, insecure ADB, root indicators, emulator signals, and ADB-over-TCP. Findings carry evidence, severity, confidence, and status."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it exists</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              A useful assessment must distinguish an observed fact from a confident conclusion; evidence references and explicit confidence make findings reviewable.
            </p>
            <div className="space-y-2.5">
              {RULES.slice(0, 3).map((rule) => (
                <div key={rule.id} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <p className="text-xs font-mono text-text-muted leading-relaxed">{rule.id}: {rule.title}.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Source layout</h3>
            <div className="font-mono text-[11px] space-y-1.5">
              {[
                'internal/rules/       rule interface + AND rules',
                'internal/evidence/    hashing and evidence storage',
                'internal/validation/  non-destructive confirmation',
                'internal/risk/        severity x confidence',
                'internal/reporting/   terminal, JSON, Markdown, HTML',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2 py-1 px-2 rounded bg-bg-elevated/50">
                  <span className="text-accent shrink-0">{'>'}</span>
                  <span className="text-text-muted">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Architecture ─────────────────────────────────────────────────── */}
      <ToolDocSection
        id="architecture"
        kicker="Architecture"
        title="Transport-aware"
        accent="pipeline"
        description="Go interfaces separate the assessment stages from device access. USB and specified-network targets share the same pipeline through a transport abstraction backed by a minimal, injectable ADB wrapper."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it exists</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Keeping transports separate makes the pipeline testable with fakes and ensures a network target remains one deliberate device, never a broad subnet scan.
            </p>
            <div className="space-y-2.5">
              {[
                'Six core stages: discovery, enumeration, analysis, validation, risk, reporting.',
                'Profiles select the pipeline shape, from quick posture reads to research fidelity.',
                'Interactive and non-interactive authorization are enforced before assessment.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <p className="text-xs font-mono text-text-muted leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Source layout</h3>
            <div className="font-mono text-[11px] space-y-1.5">
              {[
                'cmd/jabari/            CLI entry point',
                'internal/orchestration/ profile builder + runner',
                'internal/transport/     USB and network transports',
                'internal/core/          Stage and assessment environment',
                'internal/reporting/     offline renderers',
                'pkg/adb/                thin injectable ADB wrapper',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2 py-1 px-2 rounded bg-bg-elevated/50">
                  <span className="text-accent shrink-0">{'>'}</span>
                  <span className="text-text-muted">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Go Source ────────────────────────────────────────────────────── */}
      <div id="source">
        <ToolSourceSection
          kicker="Go source"
          title="Testable"
          accent="contracts"
          description="Small interfaces for stages and transports, the pipeline runs against fakes without a live device."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Install"
        title="Build &"
        accent="Install"
        description="Built with make, produces the jabari binary plus the androidsec alias, installed with its logo and desktop entry."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 md:gap-6">
            <div className="rounded-2xl border border-accent/50 bg-accent/5 p-5 md:p-6 flex flex-col justify-between gap-4">
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
                onClick={() => openToolInstall('jabari')}
                className="btn-primary inline-flex items-center gap-2 w-fit !px-6 !py-3"
              >
                <Download className="w-4 h-4" /> Auto-install
              </button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
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

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
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
        </div>
      </ToolDocSection>

      {/* ── Quick Start ──────────────────────────────────────────────────── */}
      <ToolDocSection
        id="quickstart"
        kicker="Quick Start"
        title="Assess in"
        accent="One Command"
        description="Point jabari at a connected device or an authorized IP: the authorization gate runs, then the pipeline begins."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-[9px] font-mono text-text-muted">jabari, zsh</span>
            </div>
            <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-primary">jabari assess usb</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-muted">[authorized] target: device via USB: session recorded</span>
              </div>
              <div className="pl-4 space-y-1.5 border-l border-accent/30">
                {[
                  { label: 'discovery', text: 'Galaxy S24 - Android 14 - patch 2024-11-01' },
                  { label: 'enumeration', text: 'package inventory + posture facts collected' },
                  { label: 'analysis', text: 'AND-001 debuggable (high) - AND-002 outdated patch (medium)' },
                  { label: 'risk', text: 'critical 0 - high 1 - medium 1 - low 0' },
                  { label: 'reporting', text: 'session saved -> reports/session-<id>.json' },
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
                <span className="text-text-primary animate-pulse">{'\u258B'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
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
      </ToolDocSection>

      {/* ── Related ──────────────────────────────────────────────────────── */}
      <div className="py-16 md:py-24 border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6">
          <RelatedContentSection items={getRelatedTools(t, '/jabari')} />
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-bg-alt border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary">
            Ready to <span className="text-accent">assess</span>?
          </h2>
          <p className="text-base text-text-secondary font-mono max-w-lg mx-auto">
            Install Jabari and start assessing Android devices from your terminal.
          </p>
          <button
            type="button"
            onClick={() => openToolInstall('jabari')}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <Download className="w-4 h-4" /> Get Started <IconArrowRight size={14} />
          </button>
        </div>
      </section>
    </ToolDocPage>
  );
};

export default JabariPage;
