import { Terminal, Download, ChevronRight, GitBranch, ShieldAlert } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import { useAuth } from '@/core/contexts/AuthContext';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
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
    <h4 className="text-2xl md:text-4xl lg:text-5xl font-black text-text-primary tracking-tighter leading-tight mt-3">
      {title} <span className="text-accent">{accent}</span>
    </h4>
    {description && (
      <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-4 font-mono">{description}</p>
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
          description="Network exploitation & MITM framework in Go — poisoning, interception, wireless and switch-layer attacks from an interactive REPL."
          stats={[
            { label: 'Categories', value: MODULES.length },
            { label: 'Platform', value: 'CLI' },
          ]}
          rightContent={
            <div className="relative md:hidden lg:flex items-center justify-center w-full h-full py-6 lg:py-0">
              <img
                src={toha3eeLogo}
                alt="Toha3ee"
                width={1024}
                height={1024}
                className="w-[72%] xl:w-[64%] 2xl:w-[56%] max-h-[68vh] object-contain drop-shadow-[0_0_50px_rgba(6,182,111,0.35)]"
              />
            </div>
          }
        >
          <a
            href="#install"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
          >
            <Download className="w-4 h-4" /> Install Now <IconArrowRight size={14} />
          </a>
        </StudentHeroSection>

        {/* ── Authorised-use warning ─────────────────────────────────────── */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Warning"
                title="Authorised"
                accent="Use Only"
                description="Toha3ee actively redirects, poisons, decrypts and intercepts network traffic. Use it only on networks you own or are explicitly authorised to test."
              />
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-primary leading-tight">Not for use against third parties</h4>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-2 font-mono max-w-2xl">
                    Running these modules against networks you do not own is illegal in most jurisdictions. Most attack modules require root — raw sockets, packet capture and IP forwarding. The tool re-executes itself under sudo by default; pass <code className="text-amber-400">--no-sudo</code> for unprivileged commands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Module catalogue ─────────────────────────────────────────── */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Module Catalogue"
                title="Seven"
                accent="Layers"
                description="Everything is a module. Each one self-registers, runs through a central safety lifecycle and tears down cleanly on panic or SIGINT."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {MODULES.map((cat) => (
                  <div key={cat.id} className="rounded-2xl border border-border/30 bg-bg-card p-5 md:p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                        <cat.icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-text-primary">{cat.name}</span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed font-mono mb-4">{cat.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {cat.modules.map((m) => (
                        <code key={m} className="px-2 py-0.5 rounded-lg bg-bg-elevated border border-border/20 text-[9px] font-mono text-text-secondary">
                          {m}
                        </code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Install ───────────────────────────────────────────────────── */}
        <div id="install" className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6 scroll-mt-28">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Install"
                title="Ready in"
                accent="One Line"
                description="One-liner installers fetch the prebuilt binary, verify its SHA-256 checksum and register the desktop icon."
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Option 1 — One-liner installer */}
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">Option 1 — One-Line Installer</h4>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">Prebuilt binary, checksum-verified.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {INSTALLERS.map(({ id, label, icon: Icon, cmd, note }) => (
                      <div key={id} className="rounded-xl border border-border/20 bg-bg p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-3.5 h-3.5 text-accent" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</span>
                        </div>
                        <code className="block text-[10px] md:text-[11px] font-mono text-text-secondary break-all">{cmd}</code>
                        <p className="text-[10px] font-mono text-text-muted mt-2 leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option 2 — Build from source */}
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-5 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <GitBranch className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">Option 2 — Build From Source</h4>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">{BUILD_FROM_SOURCE.requirements}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {BUILD_FROM_SOURCE.steps.map(({ cmd, note }) => (
                      <div key={cmd} className="rounded-xl border border-border/20 bg-bg p-4">
                        <code className="block text-[11px] md:text-xs font-mono text-text-secondary break-all">
                          {cmd}
                        </code>
                        {note && (
                          <p className="text-[10px] font-mono text-text-muted mt-2 leading-relaxed">{note}</p>
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
          </div>
        </div>

        {/* ── Quick Start ───────────────────────────────────────────────── */}
        <div className="min-h-dvh md:h-dvh md:overflow-y-auto px-3 md:px-4 lg:px-6">
          <div className="min-h-full flex flex-col justify-center py-16 md:py-20">
            <div className="space-y-6 md:space-y-8">
              <SectionHeader
                kicker="Quick Start"
                title="Drop into"
                accent="The Console"
                description="Bare toha3ee opens a bettercap/metasploit-style REPL — grouped, aligned output with status glyphs. Sessions keep captured data across module runs."
              />

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 md:gap-6 items-stretch">
                {/* Terminal mock */}
                <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden h-full">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-bg">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                    <span className="ml-2 text-[9px] font-mono text-text-muted">toha3ee — zsh</span>
                  </div>
                  <div className="p-4 md:p-6 font-mono text-xs md:text-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">$</span>
                      <span className="text-text-primary">sudo ./toha3ee --iface eth0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent">$</span>
                      <span className="text-text-muted">[+] session ready. type 'help' for commands.</span>
                    </div>
                    <div className="pl-4 space-y-2 border-l border-accent/30">
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
                <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8 space-y-3 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Terminal className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-text-primary leading-tight">Usage</h4>
                      <p className="text-[10px] font-mono text-text-muted mt-0.5">One-shot and scripted runs</p>
                    </div>
                  </div>
                  {QUICK_START.map((cmd) => (
                    <div key={cmd} className="flex items-center gap-2 rounded-xl border border-border/20 bg-bg px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-accent shrink-0" />
                      <code className="text-xs md:text-sm text-text-secondary break-all">{cmd}</code>
                    </div>
                  ))}
                  <p className="text-[10px] font-mono text-text-muted leading-relaxed pt-1">
                    Most attack modules require root. Use only on networks you own or have explicit written permission to test.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default Toha3eePage;
