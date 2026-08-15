import { Terminal, Download, ChevronRight, GitBranch, ShieldAlert } from 'lucide-react';
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
import { MODULES, INSTALLERS, BUILD_FROM_SOURCE, QUICK_START, CONSOLE_SESSION, GITHUB_URL } from '@/features/marketing/data/toha3eeData';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';

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

const Toha3eePage = () => {
  const { user } = useAuth();
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Toha3ee - QYVORA" description="Toha3ee — network exploitation & MITM framework written in Go. ARP/DHCP/DNS/IPv6 poisoning, inline interception, wireless and switch-layer attacks from an interactive REPL." />
      <PublicSnapLayout>
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
            <a href="#install" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"><Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} /></a>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/30 bg-bg-card text-[9px] font-black uppercase tracking-widest text-text-muted"><span className="font-black text-[#00ADD8]">Go</span> 1.26+</span>
          </div>
        </StudentHeroSection>

        {/* ── Authorised-use warning ─────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
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

        {MODULES.map((category, index) => (
          <ToolDocumentationSection
            key={category.id}
            id={`modules-${category.id}`}
            index={String(index + 1).padStart(2, '0')}
            icon={category.icon}
            eyebrow={`${category.modules.length} registered modules`}
            title={category.name}
            accent="tooling"
            description={category.desc}
            why="Toha3ee organises related capabilities behind one module lifecycle so operators can preflight, run, verify, and clean up consistently."
            bullets={category.modules.slice(0, 3).map((module) => `${module} — available through the interactive console and scripting engine.`)}
            code={`toha3ee > modules ${category.id}\ntoha3ee > on ${category.modules[0]}`}
            codeLabel="Console workflow"
          />
        ))}

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

        <PublicSnapSection id="go-source" fitViewport>
          <div className="flex h-full min-h-0 flex-col justify-center gap-5">
            <SectionHeader kicker="Go source" title="One module" accent="contract" description="Every Toha3ee capability follows the same lifecycle contract, so the framework can enforce safety checks and cleanup consistently." />
            <GoCodeCarousel examples={[
              { 
                id: 'interface', 
                filename: 'internal/attacks/module.go', 
                label: 'Module interface', 
                description: 'Every attack module implements this contract so the framework can manage lifecycle consistently.', 
                code: 'type Module interface {\n    Meta() Metadata\n    Preflight(ctx context.Context) error\n    Run(ctx context.Context, opts Options) error\n    Verify(ctx context.Context) (bool, error)\n    Cleanup(ctx context.Context) error\n}' 
              },
              { 
                id: 'register', 
                filename: 'internal/attacks/arp/arp_spoof.go', 
                label: 'Self-registration', 
                description: 'Attack packages register during Go initialisation; duplicate IDs fail fast at startup.', 
                code: 'func init() {\n    attacks.Register(&ARPSpoofModule{\n        id: "arp.spoof",\n    })\n}' 
              },
              { 
                id: 'cleanup', 
                filename: 'internal/safety/tracker.go', 
                label: 'Cleanup tracking', 
                description: 'The safety layer registers cleanup handlers and runs them even after SIGINT or panic recovery.', 
                code: 'func (t *Tracker) RegisterCleanup(fn func()) {\n    t.mu.Lock()\n    defer t.mu.Unlock()\n    t.cleanups = append(t.cleanups, fn)\n}\n\nfunc (t *Tracker) RunCleanup() {\n    for i := len(t.cleanups) - 1; i >= 0; i-- {\n        t.cleanups[i]()\n    }\n}' 
              },
              { 
                id: 'heartbeat', 
                filename: 'internal/attacks/base.go', 
                label: 'Heartbeat requirement', 
                description: 'Running modules must heartbeat periodically; the framework stops unresponsive work.', 
                code: 'func (m *BaseModule) Run(ctx context.Context) error {\n    ticker := time.NewTicker(5 * time.Second)\n    defer ticker.Stop()\n    \n    for {\n        select {\n        case <-ctx.Done():\n            return ctx.Err()\n        case <-ticker.C:\n            m.Heartbeat()\n        }\n    }\n}' 
              },
            ]} />
          </div>
        </PublicSnapSection>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <PublicSnapSection id="install" className="scroll-mt-28">
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
              kicker="Install"
              title="Ready in"
              accent="One Line"
              description="One-liner installers fetch the prebuilt binary, verify its SHA-256 checksum and register the desktop icon."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
              {/* Option 1 — One-line installers */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">One-Line Installers</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">Prebuilt binary, checksum-verified.</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {INSTALLERS.map(({ id, label, icon: Icon, cmd }) => (
                    <div key={id} className="rounded-lg border border-border/20 bg-bg px-3 py-2">
                      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">
                        <Icon className="w-3 h-3 text-accent" /> {label}
                      </span>
                      <code className="block text-[10px] md:text-[11px] font-mono text-text-secondary break-all">{cmd}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 2 — Build from source */}
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4 text-accent" />
                  </div>
                  <div>
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
            </div>
          </div>
        </PublicSnapSection>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <PublicSnapSection>
          <div className="flex flex-col gap-6 lg:gap-8">
            <SectionHeader
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
              <div className="rounded-2xl border border-border/30 bg-accent/5 p-5 md:p-6 space-y-2 h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-primary leading-tight">Usage</h4>
                    <p className="text-[9px] font-mono text-text-muted mt-0.5">One-shot and scripted runs</p>
                  </div>
                </div>
                {QUICK_START.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 rounded-lg border border-border/20 bg-bg px-3 py-2">
                    <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" />
                    <code className="text-[10px] md:text-xs text-text-secondary break-all">{cmd}</code>
                  </div>
                ))}
                <p className="text-[9px] font-mono text-text-muted leading-relaxed pt-1">
                  Most attack modules require root. Use only on networks you own.
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

export default Toha3eePage;
