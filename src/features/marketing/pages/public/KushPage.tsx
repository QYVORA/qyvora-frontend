import { Download, GitBranch, ShieldCheck, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import Callout from '@/features/marketing/components/tools/Callout';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, RULES, RULE_CATEGORIES, CONFIDENCE_STATES, RISK_THRESHOLDS, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/kushData';
import DocFooterNav from '@/features/marketing/components/tools/DocFooterNav';
import kushLogo from '@/assets/kush/kush-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const REQUIREMENTS = [
  'Go 1.26+ toolchain to build',
  'No external runtime dependencies, a single static binary',
  'Static analysis only — samples are never executed on the developer host',
];

const STAGE_EVENTS = [
  'sample.intaked',
  'hash.calculated',
  'metadata.extracted',
  'static.analyzed',
  'strings.analyzed',
  'behavior.analyzed',
  'network.indicators',
  'ioc.extracted',
];

const DOC_SECTIONS: ToolDocSectionItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'rules', label: 'Rules' },
  { id: 'risk', label: 'Risk' },
  { id: 'source', label: 'Source' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
];

const KushPage = () => {
  return (
    <ToolDocPage
      toolName="kush"
      seoTitle="kush - QYVORA"
      seoDescription="kush, offline malware sample analysis framework in Go. Hashes, metadata, static posture, strings, network indicators, IOC extraction and threat classification without executing samples."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('kush')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="kush"
        description="Malware sample analysis in Go. Analyze offline sample documents for hashes, metadata, static posture, strings, network indicators, IOC extraction and threat classification — without ever executing the sample on the developer host."
        stats={[
          { label: 'Pipeline Stages', value: STAGES.length },
          { label: 'Rules', value: RULES.length },
        ]}
        logo={
          <img
            src={kushLogo}
            alt="kush"
            width={512}
            height={512}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('kush')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-accent">Go</span> 1.26+
            </span>
          </>
        }
      />

      {/* ── Static-scope warning ──────────────────────────────────────────── */}
      <ToolDocSection
        id="overview"
        kicker="Honest scope"
        title={AUTHORIZED_WARNING.title}
        accent={AUTHORIZED_WARNING.accent}
        description={AUTHORIZED_WARNING.description}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <Callout
            variant="warning"
            icon={AUTHORIZED_WARNING.icon}
            eyebrow="Never executes"
            title="Static analysis by design"
            className="lg:self-start"
          >
            Samples are never executed on the developer host. Dynamic execution is not implemented
            and is refused honestly; behavioral findings may only come from sandbox observations you
            attach explicitly.
          </Callout>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Assessment guarantees</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">static by design</span>
            </div>
            {[
              'Samples are hashed and analyzed statically — nothing is executed on the developer host.',
              'Deterministic rule engine — every rule is a pure function, so identical input produces identical findings.',
              'Risk scores are transparent and auditable: severity × confidence × exposure, capped at 100.',
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
        kicker="Nine-stage pipeline"
        title="Analyze"
        accent="End to End"
        description="From sample intake to IOC extraction, every stage writes to the session and emits a machine-readable event. Each event records exactly what the stage observed."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STAGES.map((stage, i) => (
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
                code={`${STAGE_EVENTS[i]}\n# emitted by the ${stage.name.toLowerCase()} stage`}
                lang="sh"
                badge="event"
                copyable
              />
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="rules"
        kicker="Deterministic rule engine"
        title="Malware"
        accent="Rules"
        description="Kush applies a fixed, deterministic rule set against the sample in each session. Exact observation matching means a C2 indicator triggers KSH-005, never a weaker neighbor."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest text-accent">Rule catalog</h3>
            </div>
            <div className="divide-y divide-border/10">
              {RULES.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 px-5 py-3">
                  <span className="w-20 shrink-0 text-[10px] font-black text-accent font-mono pt-0.5">
                    {rule.id}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-text-secondary leading-relaxed">{rule.name}</p>
                    <p className="text-[10px] font-mono text-text-muted mt-0.5">{rule.checks}</p>
                  </div>
                  <span
                    className={`ml-auto shrink-0 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${
                      rule.severity === 'critical' ? 'border-danger/40 text-danger' : rule.severity === 'high' ? 'border-warning/40 text-warning' : rule.severity === 'informational' ? 'border-border/30 text-text-muted/70' : 'border-border/40 text-text-muted'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Rule families</h3>
            <div className="space-y-2.5">
              {RULE_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center justify-between rounded-xl border border-border/20 bg-bg-elevated px-4 py-2.5">
                  <span className="text-xs font-mono text-text-secondary">{cat}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                </div>
              ))}
            </div>
            <p className="text-[11px] font-mono text-text-muted leading-relaxed">
              Every finding carries a deterministic ID derived from the rule: KSH-&lt;nnn&gt;, with at least one Evidence record capturing the exact observation that triggered it. KSH-010 lists IOCs verified against the sample surfaces (hash, domain, ip).
            </p>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block mb-1.5">Confidence</span>
              <div className="flex flex-wrap gap-1.5">
                {CONFIDENCE_STATES.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg border border-border/20 bg-bg text-[9px] font-mono text-text-muted">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Risk ─────────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="risk"
        kicker="Transparent scoring"
        title="Risk"
        accent="On the Record"
        description="Scores are computed from severity weight, confidence and a per-category exposure heuristic — every number is traceable back to the evidence that produced it."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Formula</h3>
            <CodeBlock
              code="score = severity_weight × confidence × (exposure ÷ 5) × 40"
              lang="text"
              copyable={false}
            />
            <div className="space-y-2.5">
              {[
                'severity_weight: critical=4, high=3, medium=2, low=1, else 0',
                'confidence: confirmed=1.0, observed=0.9, probable=0.7, possible=0.5, unknown=0.3, not_observed=0.1',
                'exposure (0–5): per-category heuristic — command-and-control, persistence and exfiltration score higher',
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <p className="text-xs font-mono text-text-muted leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-text-muted leading-relaxed">
              Raw scores are capped at 100. Reproduce any number exactly by running the same session again — the formula is a pure function of the recorded evidence.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Level thresholds</h3>
            <div className="space-y-2">
              {RISK_THRESHOLDS.map((th) => (
                <div key={th.level} className="flex items-center justify-between rounded-xl border border-border/20 bg-bg-elevated px-4 py-2.5">
                  <span className="text-xs font-black uppercase tracking-widest text-text-secondary">{th.level}</span>
                  <span className="font-mono text-[11px] text-accent">{th.range}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-text-muted leading-relaxed">
              Aggregate risk is the mean per-finding score across the session, so a single cluster of critical findings cannot inflate the summary.
            </p>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Go Source ────────────────────────────────────────────────────── */}
      <div id="source">
        <ToolSourceSection
          kicker="Go source"
          title="Structured"
          accent="contracts"
          description="Stages, rules, evidence and risk are all typed contracts — a rule is a pure function, a finding carries evidence, and the pipeline can stop after any stage."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Install"
        title="Build &"
        accent="Install"
        description="kush ships as source today — build a single static binary with Go 1.26+ and install it to your PATH. Prebuilt release downloads are wired in but not yet published."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 md:gap-6">
            <div className="rounded-2xl border border-accent/50 bg-accent/5 p-5 md:p-6 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-primary">Build from source</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    No package manager or prebuilt download needed — a plain Go build produces the kush binary.
                  </p>
                </div>
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:underline w-fit"
              >
                GitHub Repository <IconArrowRight size={14} />
              </a>
            </div>

            <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-accent" />
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
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <GitBranch className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-text-primary leading-tight">Build steps</h4>
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
        </div>
      </ToolDocSection>

      {/* ── Quick Start ──────────────────────────────────────────────────── */}
      <ToolDocSection
        id="quickstart"
        kicker="Quick Start"
        title="Analyze in"
        accent="One Command"
        description="Run the whole offline pipeline with --sim, or point it at your own sample document with --sample."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-[9px] font-mono text-text-muted">kush, zsh</span>
            </div>
            <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-primary">kush assess --sim</span>
              </div>
              <div className="pl-4 space-y-1.5 border-l border-accent/30">
                {[
                  { label: 'intake', text: 'invoice-1147_2310.doc.exe - exe - email attachment' },
                  { label: 'hash', text: 'md5 + sha1 + sha256 fingerprints computed' },
                  { label: 'metadata', text: 'windows x86 - mingw32 - upx packed (7.42 entropy)' },
                  { label: 'static', text: '6 sections, 3 suspicious imports, 3 embedded' },
                  { label: 'strings', text: 'encoded command launcher present, 7 notable strings' },
                  { label: 'behavior', text: '5 sandbox observations - no local execution' },
                  { label: 'network', text: '2 C2 indicators out of 4 network artifacts' },
                  { label: 'risk', text: 'level high - score 73 - findings 16' },
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
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                <p className="text-[9px] font-mono text-text-muted mt-0.5">Assess, inspect, report</p>
              </div>
            </div>
            <CodeBlock
              code={QUICK_START.map((cmd) => `$ ${cmd}`).join('\n')}
              lang="sh"
              copyable
              className="mt-auto"
            />
            <p className="text-[9px] font-mono text-text-muted leading-relaxed">
              Analyze only samples you are explicitly authorized to handle.
            </p>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Related + Continue reading ───────────────────────────────────── */}
      <DocFooterNav currentPath="/kush" />
    </ToolDocPage>
  );
};

export default KushPage;