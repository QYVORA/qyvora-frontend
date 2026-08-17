import { Download, GitBranch, ShieldAlert, Terminal } from 'lucide-react';
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
import { MODULES, INSTALLERS, BUILD_FROM_SOURCE, QUICK_START, CONSOLE_SESSION, GITHUB_URL, SOURCE_EXAMPLES } from '@/features/marketing/data/toha3eeData';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';

const Toha3eePage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Toha3ee - QYVORA" description="Toha3ee — network exploitation & MITM framework written in Go. ARP/DHCP/DNS/IPv6 poisoning, inline interception, wireless and switch-layer attacks from an interactive REPL." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg">
        <StudentHeroSection
          title="Toha3ee"
          accentWord="MITM"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Network exploitation & MITM framework in Go — 73 modules across ten categories, driven from an interactive REPL, a guided wizard, or one-shot scripts."
          stats={[
            { label: 'Categories', value: MODULES.length },
            { label: 'Modules', value: 73 },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={toha3eeLogo}
                alt="Toha3ee"
                width={1024}
                height={1024}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain"
              />
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openToolInstall('toha3ee')} className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></button>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.26+</span>
          </div>
        </StudentHeroSection>
        </section>

        {/* ── Authorised-use warning ─────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Warning"
              title="Authorised"
              accent="Use Only"
              description="Toha3ee actively redirects, poisons, decrypts and intercepts network traffic. Use it only on networks you own or are explicitly authorised to test."
            />
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 md:px-8 py-5 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-mono max-w-2xl">
                Running these modules against networks you do not own is illegal in most jurisdictions. Most attack
                modules require root — raw sockets, packet capture and IP forwarding. The tool re-executes itself under
                sudo by default; pass <code className="text-amber-400">--no-sudo</code> for unprivileged commands.
              </p>
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Categories Carousel ─────────────────────────────────────────── */}
        <section className="relative w-full min-h-dvh lg:h-dvh snap-section bg-bg-alt">
          <ToolsCarousel
            kicker="Framework"
            title="Attack"
            accent="Categories"
            label="Category"
            modules={MODULES.map((category, i) => ({
              id: category.id,
              index: String(i + 1).padStart(2, '0'),
              icon: category.icon,
              title: category.name,
              description: category.desc,
              meta: `${category.modules.length} modules`,
              code: `toha3ee > modules ${category.id}\ntoha3ee > on ${category.modules[0]}`,
            }))}
          />
        </section>

        <ToolDocumentationSection
          id="architecture"
          index="ARC"
          icon={GitBranch}
          eyebrow="How Toha3ee is built"
          title="Safe module"
          accent="lifecycle"
          description="Every module self-registers and implements metadata, preflight, run, verify, and cleanup. The safety layer tracks cleanup handlers and heartbeats so network changes are restored after stop signals or failures."
          why="Network testing can alter live traffic; a central lifecycle makes cleanup and risk gating part of the framework rather than a promise each module has to remember."
          bullets={['Preflight refuses execution while required checks are blocked.', 'Run loops receive cancellation and must heartbeat while active.', 'Cleanup handlers are run even after panic or SIGINT.']}
          tree={['cmd/toha3ee/       CLI, REPL, wizard, scripts', 'internal/attacks/    self-registering modules', 'internal/safety/     preflight, risk gates, cleanup', 'internal/netx/       protocol primitives', 'internal/store/      host, credential, event state', 'internal/script/     .toha3ee language', 'pkg/certutil/        CA and TLS certificates']}
        />

        {/* ── Go source ──────────────────────────────────────────────────── */}
        <ToolSourceSection
          id="go-source"
          kicker="Go source"
          title="Real module"
          accent="code"
          description="Every capability follows the same self-registering lifecycle contract, lifted from the repository."
          examples={SOURCE_EXAMPLES}
        />

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install">
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Install"
              title="Ready in"
              accent="One Line"
              description="One-liner installers fetch the prebuilt binary, verify its SHA-256 checksum and register the desktop icon."
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
                onClick={() => openToolInstall('toha3ee')}
                className="btn-primary inline-flex items-center gap-2 shrink-0 !px-6 !py-3"
              >
                <Download className="w-4 h-4" /> Auto-install
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
              {/* Option 1 — One-line installers */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
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

              {/* Option 2 — Build from source */}
              <div className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4 text-accent" />
                  </div>
                  <div>
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
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <ToolSectionHeader
              kicker="Quick Start"
              title="Drop into"
              accent="The Console"
              description="Bare toha3ee opens a bettercap/metasploit-style REPL — grouped output with status glyphs."
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
              {/* Terminal mock */}
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-bg">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                  <span className="ml-2 text-[9px] font-mono text-text-muted">toha3ee — zsh</span>
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
                      <div key={line.cmd} className="flex items-start gap-2">
                        <span className="text-accent shrink-0 pt-0.5">toha3ee&gt;</span>
                        <span className="text-text-primary shrink-0">{line.cmd}</span>
                        <span className="text-text-muted leading-relaxed break-words">— {line.note}</span>
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

export default Toha3eePage;
