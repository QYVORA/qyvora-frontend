import { Terminal, ShieldCheck, ChevronRight } from 'lucide-react'
import { SectionHeader } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'

export function BootcampPreviewSection({ rewards }) {
  const { isDark } = useTheme()
  const earnedCp = rewards?.totals?.cp || 0
  const accentGlow = isDark ? 'bg-accent/12' : 'bg-accent/18'

  return (
    <section className="py-28 px-6 relative section-gradient">
      <div className={`absolute -top-20 right-6 sm:right-12 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] ${accentGlow} rounded-full blur-3xl opacity-70 pointer-events-none`} />
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-16">
          <SectionHeader
            kicker="// preview"
            title="Bootcamp Warm-Up Snapshot"
            subtitle="A fast look at the operator mindset and the reward economy."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="card p-8 border-accent/20 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <Terminal size={22} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Operator Brief</p>
                  <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">Choose the safe scan</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                You are about to probe a controlled test host. Your first move should gather service intel without noisy floods.
              </p>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 mb-6">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mb-2">Terminal</p>
                <div className="font-mono text-xs text-[var(--text-primary)] space-y-2">
                  <p>$ target: <span className="text-accent">127.0.0.1</span></p>
                  <p>$ intent: <span className="text-accent">safe service discovery</span></p>
                  <p className="text-[var(--text-muted)]">$ pick the right command</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Bonus Wallet</p>
                  <p className="text-2xl font-display font-bold text-[var(--text-primary)] mt-2">
                    {Number(earnedCp).toLocaleString()} <span className="text-sm text-[var(--text-muted)]">CP</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Live preview balance</p>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  'Short, tactical prompts from real engagements',
                  'Instant rewards for safe operator decisions',
                  'Preview the bootcamp scoring economy',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <span className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight size={11} className="text-accent" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-8 border border-[var(--border)] relative overflow-hidden">
            <div className="absolute -left-10 bottom-0 w-32 h-32 sm:w-44 sm:h-44 lg:w-56 lg:h-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Operator Mindset</p>
                  <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">Think before you touch</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-accent" />
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-5">
                Every module rewards careful reconnaissance, clean execution, and documented outcomes. Progress compounds quickly when you choose safe, precise moves.
              </p>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 font-mono text-xs text-[var(--text-primary)]">
                $ mindset: <span className="text-accent">validate first, act second</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
