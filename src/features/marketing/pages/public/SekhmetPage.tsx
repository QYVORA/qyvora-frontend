import { Download, GitBranch, Bug, Fence, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, DETECTORS, CONFIDENCE_STATES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/sekhmetData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import sekhmetLogo from '@/assets/sekhmet/sekhmet-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const REQUIREMENTS = [
  'Go 1.26+ toolchain to build',
  'No external runtime dependencies, a single static binary',
  'Explicit authorization is required for remote (HTTP) targets',
];

const DOC_SECTIONS: ToolDocSectionItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'source', label: 'Source' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
];

const SekhmetPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ToolDocPage
      toolName="sekhmet"
      seoTitle="sekhmet - QYVORA"
      seoDescription="sekhmet, baseline-aware, feedback-driven fuzzing & vulnerability discovery framework in Go. Classic execution modes, adaptive mutation, SHA-256 crash dedup and delta minimization."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('sekhmet')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="sekhmet"
        description="Baseline-aware, feedback-driven fuzzing and vulnerability discovery in Go. Profile normal behaviour, mutate, execute, and classify crashes, hangs and anomalies against the profile instead of fuzzing blindly."
        stats={[
          { label: 'Pipeline Stages', value: STAGES.length },
          { label: 'Mutation Operators', value: 17 },
        ]}
        logo={
          <img
            src={sekhmetLogo}
            alt="sekhmet"
            width={500}
            height={500}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('sekhmet')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-accent">Go</span> 1.26+
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
          <div className="rounded-2xl border border-warning/30 bg-warning/5 px-5 md:px-6 py-5 flex gap-4 items-start">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <AUTHORIZED_WARNING.icon className="w-5 h-5 md:w-6 md:h-6 text-warning" />
            </div>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono">
              sekhmet fuzzes only the target you explicitly declare. Local process targets are scoped to the declared path, remote HTTP targets require an explicit authorization acknowledgement, and --dry-run audits a campaign before anything executes.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Fuzzing guarantees</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">scoped by design</span>
            </div>
            {[
              'Never discovers or reaches out to unknown targets: every campaign runs against a declared target only.',
              'Command execution is shell-free; inputs arrive via {fuzz} / {stdin} templates so they cannot reach a shell.',
              'Execution budgets, size caps, concurrency limits and dry-run audits are enforced by a safety Guardian.',
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

      {/* ── Pipeline (Baseline) ─────────────────────────────────────────── */}
      <ToolDocSection
        id="baseline"
        kicker="Baseline-aware pipeline"
        title="Understand"
        accent="Before Fuzzing"
        description="SEKHMET first profiles a target's normal behaviour — exit codes, signals, runtime and output variance — then only mutates and executes against that understanding. Everything that follows is judged relative to the baseline, not guessed at."
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
                code={`sekhmet fuzz --target ./target\n# ${stage.name.toLowerCase()} stage active in the campaign`}
                lang="sh"
                badge="shell"
                copyable
              />
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Feedback ─────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="feedback"
        kicker="Feedback-driven mutation"
        title="Aimed"
        accent="not random"
        description="Novelty scoring over behavioral, edge, and block coverage keeps the campaign pointed at code it has not reached yet. The power scheduler — fast / explore / exploit / rare / balanced / adaptive — turns that feedback into allocation, not brute force."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Detector families</h3>
            <div className="space-y-2.5">
              {DETECTORS.map((detector) => (
                <div key={detector.id} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <p className="text-xs font-mono text-text-muted leading-relaxed">{detector.id}: {detector.title}.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Source layout</h3>
            <div className="font-mono text-[11px] space-y-1.5">
              {[
                'internal/baseline/     normal-behaviour profiling',
                'internal/mutation/     17 adaptive operators',
                'internal/detection/    crash/hang/anomaly classification',
                'internal/feedback/     novelty tracking (behavior/edges/blocks)',
                'internal/minimization/ delta-debugging reducer',
                'internal/safety/       execution budgets + authorization gates',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2 py-1 px-2 rounded bg-bg-elevated/50 min-w-0">
                  <span className="text-accent shrink-0">{'>'}</span>
                  <span className="text-text-muted min-w-0 break-words">{line}</span>
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
        title="Hot-path"
        accent="throughput"
        description="The hot loop is select → mutate → execute → classify → feedback, kept deliberately minimal for throughput, with deep analysis async off the critical path. Sessions persist every classified result so findings stay reproducible and auditable."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it exists</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              A fuzzer you can trust is one whose crash triage is honest: thousand-crash storms collapse to unique findings via SHA-256 signatures, minimized reproducers are delta-debugged down to a readable size, and every result carries a classifiable exit + signal signature.
            </p>
            <div className="space-y-2.5">
              {[
                'Confidence states low -> medium -> high -> confirmed with severity low -> informational -> high -> critical.',
                'Exit codes separate usage errors (2) from operational aborts (130) so orchestrators can classify outcomes.',
                'JSONL event stream uses the QYVORA envelope (schema_version, execution_id, framework) for agent/CI consumption.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <p className="text-xs font-mono text-text-muted leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Execution modes</h3>
            <div className="font-mono text-[11px] space-y-1.5">
              {[
                'process     {fuzz}/{stdin} argv templates, no shell',
                'http        payload delivery to a known endpoint',
                'simulation  deterministic in-process target for CI',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2 py-1 px-2 rounded bg-bg-elevated/50 min-w-0">
                  <span className="text-accent shrink-0">{'>'}</span>
                  <span className="text-text-muted min-w-0 break-words">{line}</span>
                </div>
              ))}
              <p className="text-[10px] font-mono text-text-muted leading-relaxed pt-1">
                Target type drives execution dispatch, so the same campaign engine works across all three modes.
              </p>
            </div>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Go Source ────────────────────────────────────────────────────── */}
      <div id="source">
        <ToolSourceSection
          kicker="Go source"
          title="Structured"
          accent="contracts"
          description="Results carry typed signals and classes, findings deduplicate by fingerprint, coverage hashes into affordable buckets — every stage is testable against fixtures, including the race detector."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Install"
        title="Build &"
        accent="Install"
        description="Built with make, produces the sekhmet binary installed with its logo, desktop entry and Start Menu shortcut; zero-config installers verify SHA-256 against published checksums."
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
                onClick={() => openToolInstall('sekhmet')}
                className="btn-primary inline-flex items-center gap-2 w-fit !px-6 !py-3"
              >
                <Download className="w-4 h-4" /> Auto-install
              </button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Bug className="w-4 h-4 text-accent" />
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
        title="Fuzz in"
        accent="One Command"
        description="Set a simulation target to see the whole pipeline offline, or register a process target and profile it before fuzzing."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-[9px] font-mono text-text-muted">sekhmet, zsh</span>
            </div>
            <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-primary">sekhmet fuzz --target sim --runs 100000</span>
              </div>
              <div className="pl-4 space-y-1.5 border-l border-accent/30">
                {[
                  { label: 'baseline', text: 'simulation target profiled - exit 0, ~1ms runtime, stable output' },
                  { label: 'corpus', text: '2 seeds loaded - SHA-256 dedup active' },
                  { label: 'mutate', text: '17 operators - seeded RNG (deterministic run)' },
                  { label: 'classify', text: 'SEKHMET_CRASH input -> signal "segmentation violation"' },
                  { label: 'dedup', text: '91 crashes collapsed to 1 unique finding' },
                  { label: 'report', text: 'critical 0 - high 1 - medium 0 - low 0 - informational 0' },
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
                <Fence className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                <p className="text-[9px] font-mono text-text-muted mt-0.5">Baseline, fuzz, triage, report</p>
              </div>
            </div>
            <CodeBlock
              code={QUICK_START.map((cmd) => `$ ${cmd}`).join('\n')}
              lang="sh"
              copyable
              className="mt-auto"
            />
            <p className="text-[9px] font-mono text-text-muted leading-relaxed">
              Fuzz only software you own or have explicit written permission to test.
            </p>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Related ──────────────────────────────────────────────────────── */}
      <div className="py-16 md:py-24 border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6">
          <RelatedContentSection items={getRelatedTools(t, '/sekhmet')} />
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-bg-alt border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary">
            Ready to <span className="text-accent">fuzz</span>?
          </h2>
          <p className="text-base text-text-secondary font-mono max-w-lg mx-auto">
            Install sekhmet and start baseline-aware campaigns from your terminal.
          </p>
          <button
            type="button"
            onClick={() => openToolInstall('sekhmet')}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <Download className="w-4 h-4" /> Get Started <IconArrowRight size={14} />
          </button>
        </div>
      </section>
    </ToolDocPage>
  );
};

export default SekhmetPage;