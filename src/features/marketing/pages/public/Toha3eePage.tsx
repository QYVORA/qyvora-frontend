import { Download, GitBranch, ShieldAlert, ShieldCheck, Terminal } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import { useAuth } from '@/core/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import CodeBlock from '@/shared/components/CodeBlock';
import ToolSourceSection from '@/features/marketing/components/tools/ToolSourceSection';
import { openToolInstall } from '@/features/marketing/components/ToolInstallModal';
import { MODULES, INSTALLERS, BUILD_FROM_SOURCE, QUICK_START, CONSOLE_SESSION, GITHUB_URL, SOURCE_EXAMPLES } from '@/features/marketing/data/toha3eeData';
import { getRelatedTools } from '@/features/marketing/data/relatedTools';
import RelatedContentSection from '@/shared/components/RelatedContentSection';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import { ToolDocPage, ToolDocSection, ToolDocHero } from '@/shared/components/tools';
import type { ToolDocSectionItem } from '@/shared/components/tools';

const DOC_SECTIONS: ToolDocSectionItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'source', label: 'Source' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quick Start' },
];

const Toha3eePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ToolDocPage
      toolName="Toha3ee"
      accentWord="Security"
      seoTitle="Toha3ee - QYVORA"
      seoDescription="Toha3ee: local & network security assessment framework in Go. Host and service discovery, enumeration, credential auditing, wireless, MITM and post-exploitation modules from an interactive REPL."
      sections={DOC_SECTIONS}
      githubUrl={GITHUB_URL}
      installLabel="Install"
      onInstall={() => openToolInstall('toha3ee')}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <ToolDocHero
        toolName="Toha3ee"
        accentWord="Security"
        description="Local & network security assessment framework in Go - 73 modules across ten categories (recon, enumeration, OSINT, wireless, MITM and more), driven from an interactive REPL, a guided wizard, or one-shot scripts."
        stats={[
          { label: 'Categories', value: MODULES.length },
          { label: 'Modules', value: 73 },
        ]}
        logo={
          <img
            src={toha3eeLogo}
            alt="Toha3ee"
            width={1024}
            height={1024}
            className="w-full max-h-[50vh] object-contain"
          />
        }
        actions={
          <>
            <button type="button" onClick={() => openToolInstall('toha3ee')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
              <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
            </button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/50 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted">
              <span className="font-black text-[#00ADD8]">Go</span> 1.26+
            </span>
          </>
        }
      />

      {/* ── Authorised-use warning ──────────────────────────────────────── */}
      <ToolDocSection
        id="overview"
        kicker="Warning"
        title="Authorised"
        accent="Use Only"
        description="Toha3ee actively redirects, poisons, decrypts and intercepts network traffic. Use it only on networks you own or are explicitly authorised to test."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-2xl border border-warning/30 bg-warning/5 px-5 md:px-6 py-5 flex gap-4 items-start">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-warning" />
            </div>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono">
              Running these modules against networks you do not own is illegal in most jurisdictions. Most attack
              modules require root, raw sockets, packet capture and IP forwarding. The tool re-executes itself under
              sudo by default; pass <code className="text-warning">--no-sudo</code> for unprivileged commands.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Safety layer</span>
              <span className="h-px flex-1 bg-border/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">enforced, not promised</span>
            </div>
            {[
              'Preflight refuses execution while required checks are blocked.',
              'Run loops receive cancellation and must heartbeat while active.',
              'Cleanup handlers are run even after panic or SIGINT.',
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-3 rounded-xl border border-border/20 bg-bg-elevated px-4 py-3">
                <span className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                </span>
                <span className="text-xs font-mono text-text-secondary leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </ToolDocSection>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <ToolDocSection
        id="categories"
        kicker="Framework"
        title="Attack"
        accent="Categories"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map((category, i) => (
            <div
              key={category.id}
              className="rounded-2xl border border-border/50 bg-bg-card p-4 md:p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <category.icon size={16} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-xs font-black text-text-primary leading-tight">
                    {category.name}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] font-mono text-text-muted leading-relaxed">
                {category.desc}
              </p>
              <CodeBlock
                code={`toha3ee > modules ${category.id}\ntoha3ee > on ${category.modules[0]}`}
                lang="sh"
                badge="shell"
                copyable
              />
            </div>
          ))}
        </div>
      </ToolDocSection>

      {/* ── Architecture ─────────────────────────────────────────────────── */}
      <ToolDocSection
        id="architecture"
        kicker="Architecture"
        title="Safe module"
        accent="lifecycle"
        description="Every module self-registers and implements metadata, preflight, run, verify, and cleanup. The safety layer tracks cleanup handlers and heartbeats so network changes are restored after stop signals or failures."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent">Why it exists</h3>
            <p className="text-sm font-mono text-text-secondary leading-relaxed">
              Network testing can alter live traffic; a central lifecycle makes cleanup and risk gating part of the framework rather than a promise each module has to remember.
            </p>
            <div className="space-y-2.5">
              {[
                'Preflight refuses execution while required checks are blocked.',
                'Run loops receive cancellation and must heartbeat while active.',
                'Cleanup handlers are run even after panic or SIGINT.',
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
                'cmd/toha3ee/       CLI, REPL, wizard, scripts',
                'internal/attacks/    self-registering modules',
                'internal/safety/     preflight, risk gates, cleanup',
                'internal/netx/       protocol primitives',
                'internal/store/      host, credential, event state',
                'internal/script/     .toha3ee language',
                'pkg/certutil/        CA and TLS certificates',
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

      {/* ── Go Source ────────────────────────────────────────────────────── */}
      <div id="source">
        <ToolSourceSection
          kicker="Go source"
          title="Real module"
          accent="code"
          description="Every capability follows the same self-registering lifecycle contract, lifted from the repository."
          examples={SOURCE_EXAMPLES}
        />
      </div>

      {/* ── Install ──────────────────────────────────────────────────────── */}
      <ToolDocSection
        id="install"
        kicker="Install"
        title="Ready in"
        accent="One Line"
        description="One-liner installers fetch the prebuilt binary, verify its SHA-256 checksum and register the desktop icon."
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
                onClick={() => openToolInstall('toha3ee')}
                className="btn-primary inline-flex items-center gap-2 w-fit !px-6 !py-3"
              >
                <Download className="w-4 h-4" /> Auto-install
              </button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-bg-card p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-text-primary leading-tight">One-Line Installers</h4>
                  <p className="text-[9px] font-mono text-text-muted mt-0.5">Prebuilt binary, checksum-verified.</p>
                </div>
              </div>
              <div className="space-y-3">
                {INSTALLERS.map(({ id, label, cmd, note }) => (
                  <div key={id} className="space-y-1.5">
                    <CodeBlock code={cmd} lang="sh" badge={label} copyable />
                    <p className="text-[9px] font-mono text-text-muted leading-snug">{note}</p>
                  </div>
                ))}
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
        title="Drop into"
        accent="The Console"
        description="Bare toha3ee opens a bettercap/metasploit-style REPL: grouped output with status glyphs."
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6">
          <div className="rounded-2xl border border-border/50 bg-bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-[9px] font-mono text-text-muted">toha3ee, zsh</span>
            </div>
            <div className="p-4 md:p-5 font-mono text-[11px] md:text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-primary">sudo ./toha3ee --iface eth0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-text-muted">[+] session ready. type 'help' for commands.</span>
              </div>
              <div className="pl-4 space-y-1.5 border-l border-accent/30">
                {CONSOLE_SESSION.map((line) => (
                  <div key={line.cmd} className="flex items-start gap-2 min-w-0">
                    <span className="text-accent shrink-0 pt-0.5">toha3ee&gt;</span>
                    <span className="text-text-primary min-w-0 break-words">{line.cmd}</span>
                    <span className="text-text-muted leading-relaxed break-words">, {line.note}</span>
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
                <p className="text-[9px] font-mono text-text-muted mt-0.5">One-shot and scripted runs</p>
              </div>
            </div>
            <CodeBlock
              code={QUICK_START.map((cmd) => `$ ${cmd}`).join('\n')}
              lang="sh"
              copyable
              className="mt-auto"
            />
            <p className="text-[9px] font-mono text-text-muted leading-relaxed">
              Most attack modules require root. Use only on networks you own.
            </p>
          </div>
        </div>
      </ToolDocSection>

      {/* ── Related ──────────────────────────────────────────────────────── */}
      <div className="py-16 md:py-24 border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6">
          <RelatedContentSection items={getRelatedTools(t, '/toha3ee')} />
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-bg-alt border-t border-border/10">
        <div className="px-3 md:px-4 lg:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-primary">
            Ready to <span className="text-accent">scan</span>?
          </h2>
          <p className="text-base text-text-secondary font-mono max-w-lg mx-auto">
            Install Toha3ee and start assessing networks from your terminal.
          </p>
          <button
            type="button"
            onClick={() => openToolInstall('toha3ee')}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3"
          >
            <Download className="w-4 h-4" /> Get Started <IconArrowRight size={14} />
          </button>
        </div>
      </section>
    </ToolDocPage>
  );
};

export default Toha3eePage;
