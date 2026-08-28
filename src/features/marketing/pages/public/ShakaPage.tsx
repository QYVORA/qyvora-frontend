import { Download, GitBranch, Terminal, ChevronRight } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { STAGES, RULES, GITHUB_URL, BUILD_FROM_SOURCE, QUICK_START, AUTHORIZED_WARNING, SOURCE_EXAMPLES } from '@/features/marketing/data/shakaData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const REQUIREMENTS = [
  'Windows Server Active Directory / LDAP target, or use the built-in offline simulator (--sim)',
  'Go 1.22+ toolchain to build from source',
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

const ShakaPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ToolDocPage
      toolName="SHAKA"
      accentWord="ActiveDirectory"
      seoTitle="SHAKA - QYVORA"
      seoDescription="SHAKA: Windows and Microsoft Active Directory security assessment framework in Go. Domain discovery, directory enumeration, relationship graphs, privilege analysis and evidence-driven reporting."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('shaka')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="SHAKA"
        accentWord="ActiveDirectory"
        description="Windows and Microsoft Active Directory security assessment framework in Go: domain discovery, object enumeration, relationship graphing, and evidence-driven findings with an offline simulator."
        stats={[
          { label: 'Pipeline Stages', value: STAGES.length },
          { label: 'Built-in Rules', value: RULES.length },
        ]}
        logo={
          <img
            src={shakaLogo}
            alt="SHAKA"
            width={500}
            height={500}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('shaka')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-[#00ADD8]">Go</span> 1.22+
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
              SHAKA assesses only explicitly authorized directory targets. Live targets require explicit authorization (--authorized/-y, config, or QYVORA_AUTHORIZED=true); the built-in demo directory is auto-authorized for safe offline exploration.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Assessment Guarantees</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Safe by Design</span>
            </div>
            {[
              'Explicit authorization gate prevents unintended scans on live corporate directories.',
              'Includes a deterministic offline simulation engine (--sim) for testing and training.',
              'Emits JSONL events and structured reports (JSON, Markdown, HTML, YAML) with full evidence hashes.',
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
        kicker="Assessment Pipeline"
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
                code={`shaka assess --sim\n# ${stage.name.toLowerCase()} stage`}
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
        title="Graph-Driven"
        accent="topology"
        description="Directory principals do not exist in isolation. SHAKA builds a typed directed graph connecting users, groups, computers, organizational units, and domains. Edges represent real directory relationships (member_of, joins, trusts, delegates) allowing precise attack-path analysis."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it matters</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Finding misconfigurations requires seeing indirect paths: nested group memberships, unconstrained delegation hops, and trust transitivity across forest boundaries.
            </p>
            <div className="space-y-2.5">
              {[
                'Deterministic graph deduplication prevents redundant findings.',
                'Nested group resolution reveals hidden Domain Admin access.',
                'Evidence-referenced edge weights prioritize high-risk attack paths.',
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
                'internal/graph/        directed graph structure & traversals',
                'internal/directory/    LDAP object normalization & offline simulator',
                'internal/analysis/     identity, trust, and attack-path analyzers',
                'internal/rules/        deterministic rule engine & builtins',
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
        kicker="Detection Engine"
        title="Built-in"
        accent="Rules"
        description="SHAKA includes deterministic detection rules targeting core Active Directory security hygiene, privilege escalation paths, and authentication exposures."
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
          description="SHAKA is built in modern Go with zero runtime dependencies. Single binary, fast concurrent LDAP evaluation, and strict safety contracts."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Installation"
        title="Get"
        accent="SHAKA"
        description="Single binary distribution for Linux, macOS, and Windows. Build from source or run via the official install helper."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Quick Install</h3>
            <CodeBlock
              code="curl -fsSL https://raw.githubusercontent.com/QYVORA/qyvora-shaka/main/install.sh | bash"
              lang="sh"
              badge="curl"
              copyable
            />
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openToolInstall('shaka')}
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
        accent="Execution"
        description="Run SHAKA against the offline simulator or point it at an authorized Active Directory domain controller."
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
              Running bare <code className="text-accent">shaka</code> launches the interactive console with the brand banner, command history, tab completion, and built-in offline demo exploration:
            </p>
            <CodeBlock
              code={`$ shaka\n\n[SHAKA BRAND BANNER]\n\nshaka> assess\nshaka> graph\nshaka> findings\nshaka> exit`}
              lang="text"
              badge="interactive"
            />
          </div>
        </div>
      </ToolDocSection>

      {/* ── Related Tools ────────────────────────────────────────────────── */}
      <div className="w-full px-3 md:px-4 lg:px-6 py-12">
        <RelatedContentSection items={getRelatedTools(t, '/shaka')} />
      </div>
    </ToolDocPage>
  );
};

export default ShakaPage;
