import { Download, GitBranch, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, RULES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/nzingaData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const REQUIREMENTS = [
  'Public, open-source targets only. Live collection requires explicit authorization (--authorized / -y), or use the built-in offline simulator (--sim)',
  'Go 1.26+ toolchain to build from source',
  'No external runtime dependencies, a single static binary',
];

const DOC_SECTIONS: ToolDocSectionItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'graph', label: 'Graph' },
  { id: 'rules', label: 'Rules' },
  { id: 'source', label: 'Source' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
];

const NzingaPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ToolDocPage
      toolName="nzinga"
      seoTitle="nzinga - QYVORA"
      seoDescription="nzinga: authorized open-source intelligence (OSINT) collection, cross-source correlation and evidence-driven reporting in Go. Collect from public sources, normalize, correlate and report, all from the terminal."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('nzinga')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="nzinga"
        description="Authorized open-source intelligence framework in Go: public-source collection, cross-source correlation, and evidence-backed reporting with an offline simulator."
        stats={[
          { label: 'Pipeline Stages', value: STAGES.length },
          { label: 'Built-in Rules', value: RULES.length },
        ]}
        logo={
          <img
            src={nzingaLogo}
            alt="nzinga"
            width={1292}
            height={1218}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('nzinga')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-[#FFB000]">Go</span> 1.26+
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
              nzinga collects only from public, open sources and performs authorized reconnaissance only. Live collection requires explicit authorization (--authorized/-y, config, or QYVORA_AUTHORIZED=true); the built-in simulator (--sim) runs offline against a deterministic dataset.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Assessment Guarantees</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Safe by Design</span>
            </div>
            {[
              'Explicit authorization gate prevents live collection without operator authorization.',
              'Includes a deterministic offline simulation engine (--sim) with no network activity.',
              'Emits typed reports (terminal, JSON, Markdown, HTML, YAML) where every claim traces to evidence.',
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
        kicker="Intelligence Pipeline"
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
                code={`nzinga assess -y domain:example.com\n# ${stage.name.toLowerCase()} stage`}
                lang="sh"
                badge="shell"
                copyable
              />
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Graph ────────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="graph"
        kicker="Relationship modeling"
        title="Correlation"
        accent="graph"
        description="Intelligence does not live in one source. nzinga links observations across public sources into a typed directed graph connecting domains, emails, usernames, and infrastructure. Edges represent real correlations (resolves_to, shares_host, observed_on, part_of) exposing a single coherent estate."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it matters</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              The value is in connections across sources: a username on one platform linked to an email, linked to a domain, linked to shared infrastructure. nzinga attributes each edge to collected evidence.
            </p>
            <div className="space-y-2.5">
              {[
                'Deterministic correlation deduplicates observations into entities.',
                'Shared hosting across domains reveals common administration.',
                'Every claim carries confidence and provenance, never absence-as-proof.',
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
                'internal/pipeline/          ordered collection & analysis stages',
                'internal/intelligence/      sources, normalization, correlation',
                'internal/intelligence/sources/  crt.sh, domain, infrastructure, org',
                'internal/rules/             deterministic rule engine & builtins',
                'internal/reporting/         terminal, JSON, Markdown, HTML, YAML',
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

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="rules"
        kicker="Rule Engine"
        title="Built-in"
        accent="Rules"
        description="nzinga ships deterministic correlation rules (OSINT-001..004) that surface evidence-backed findings with confidence, severity, and remediation — never absence-as-proof."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RULES.map((rule) => (
            <div key={rule.id} className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-accent font-mono">{rule.id}</span>
              <h4 className="text-xs font-black text-text-primary">{rule.title}</h4>
              <p className="text-[11px] font-mono text-text-muted leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Go Source ────────────────────────────────────────────────────── */}
      <div id="source">
        <ToolSourceSection
          kicker="Go source"
          title="Engineered"
          accent="internals"
          description="nzinga is built in modern Go with zero runtime dependencies. Single binary, bounded-concurrency collection, honest confidence states, and strict safety contracts."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Installation"
        title="Get"
        accent="nzinga"
        description="Single binary distribution for Linux, macOS, and Windows. Build from source or run via the official install helper."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Quick Install</h3>
            <CodeBlock
              code="curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-nzinga/main/install.sh | bash"
              lang="sh"
              badge="curl"
              copyable
            />
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openToolInstall('nzinga')}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2 text-xs"
              >
                <Download size={14} /> Open Install Modal
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Build from Source</h3>
            <p className="text-xs font-mono text-text-muted">{BUILD_FROM_SOURCE.requirements}</p>
            <div className="space-y-2">
              {BUILD_FROM_SOURCE.steps.map((s, i) => (
                <CodeBlock key={i} code={s.cmd} lang="sh" copyable />
              ))}
            </div>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Quick Start ──────────────────────────────────────────────────── */}
      <ToolDocSection
        id="quickstart"
        kicker="Quick Start"
        title="Immediate"
        accent="Collection"
        description="Run nzinga against the offline simulator or point it at an authorized target with the authorization gate enabled."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-accent">Common Commands</h3>
            <div className="space-y-2">
              {QUICK_START.map((cmd, idx) => (
                <CodeBlock key={idx} code={cmd} lang="sh" copyable />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-accent">Interactive REPL</h3>
            <p className="text-xs font-mono text-text-muted leading-relaxed">
              Running bare <code className="text-accent">nzinga</code> launches the interactive console with the brand banner, command history, tab completion, and built-in offline demo exploration:
            </p>
            <CodeBlock
              code={`$ nzinga\n\n[NZINGA BRAND BANNER]\n\nnzinga> assess --sim\nnzinga> sources list\nnzinga> findings\nnzinga> relationship graph\nnzinga> exit`}
              lang="text"
              badge="interactive"
            />
          </div>
        </div>
      </ToolDocSection>

      {/* ── Related Tools ────────────────────────────────────────────────── */}
      <div className="w-full px-3 md:px-4 lg:px-6 py-12">
        <RelatedContentSection items={getRelatedTools(t, '/nzinga')} />
      </div>
    </ToolDocPage>
  );
};

export default NzingaPage;