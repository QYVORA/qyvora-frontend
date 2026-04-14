import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Terminal, Zap } from 'lucide-react'

const TERMINAL_LINES = [
  { prompt: '$', cmd: 'nmap -sV -p- target.hsociety.io', delay: 0 },
  { prompt: '>', out: 'Starting Nmap scan...', delay: 600, muted: true },
  { prompt: '>', out: '22/tcp  open  ssh     OpenSSH 8.9', delay: 900, accent: false },
  { prompt: '>', out: '80/tcp  open  http    nginx 1.24', delay: 1200, accent: false },
  { prompt: '>', out: '443/tcp open  https   nginx 1.24', delay: 1500, accent: false },
  { prompt: '$', cmd: 'exploit --target 443 --payload rev_shell', delay: 2200 },
  { prompt: '>', out: '[+] Shell obtained. Welcome, Operator.', delay: 3000, accent: true },
]

function TerminalCard() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* Glow behind terminal */}
      <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-2xl shadow-black/30">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-amber-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-xs font-mono text-[var(--text-muted)] tracking-widest">operator@hsociety ~ zsh</span>
        </div>

        {/* Terminal body */}
        <div className="p-5 font-mono text-xs leading-relaxed space-y-1.5 min-h-[220px]">
          {TERMINAL_LINES.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
              style={{ animationDelay: `${line.delay}ms` }}
            >
              <span className={`shrink-0 select-none ${line.prompt === '$' ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
                {line.prompt}
              </span>
              {line.cmd ? (
                <span className="text-[var(--text-primary)]">{line.cmd}</span>
              ) : (
                <span className={
                  line.accent
                    ? 'text-accent font-semibold'
                    : line.muted
                    ? 'text-[var(--text-muted)]'
                    : 'text-[var(--text-secondary)]'
                }>
                  {line.out}
                </span>
              )}
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="flex items-center gap-2">
            <span className="text-accent">$</span>
            <span className="w-2 h-4 bg-accent animate-pulse rounded-sm" />
          </div>
        </div>
      </div>

      {/* Floating stat badges */}
      <div className="absolute -top-4 -right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-accent/30 shadow-lg text-xs font-mono text-accent">
        <Zap size={11} /> Live Platform
      </div>
      <div className="absolute -bottom-4 -left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] shadow-lg text-xs font-mono text-[var(--text-secondary)]">
        <Shield size={11} className="text-accent" /> Ethical · Legal · Certified
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative isolate min-h-dvh flex items-center overflow-hidden bg-[var(--bg-primary)]">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial accent glow — top left */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      {/* Radial accent glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4" />

      <div className="cube-noise" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center min-h-dvh lg:min-h-0 lg:py-32">

          {/* ── LEFT — Copy ── */}
          <div className="flex flex-col items-start gap-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/8 text-accent text-xs font-mono tracking-widest backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              HSOCIETY OFFSEC — Africa
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] leading-[1.0] tracking-tight">
                Train like a
                <br />
                <span className="text-accent relative">
                  Hacker.
                  {/* Underline accent */}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent/40 rounded-full" />
                </span>
              </h1>
              <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] leading-[1.0] tracking-tight">
                Become a
                <br />
                <span className="text-[var(--text-muted)]">Hacker.</span>
              </h2>
            </div>

            {/* Sub */}
            <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-lg leading-relaxed">
              The offensive security training platform built for the next generation of African security talent.
              Train, validate, earn, and deploy.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {['Bootcamp Training', 'Live Labs', 'CP Economy', 'Zero-Day Market'].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)]"
                >
                  <Terminal size={10} className="text-accent" />
                  {f}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-accent/25"
              >
                Start Training
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="text-base px-8 py-4 rounded-xl flex items-center justify-center font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:border-accent/40 hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
              >
                Log In
              </Link>
            </div>

            {/* Social proof micro-stat */}
            <p className="text-xs font-mono text-[var(--text-muted)]">
              <span className="text-accent">↑</span> Operators training across Africa
            </p>
          </div>

          {/* ── RIGHT — Terminal ── */}
          <div className="flex items-center justify-center lg:justify-end">
            <TerminalCard />
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
    </section>
  )
}
