import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, ShieldCheck, ChevronRight } from 'lucide-react'
import { Button, SectionHeader } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { studentService } from '@/core/services'

export function BootcampPreviewSection({ rewards }) {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const previewKey = 'hero-bootcamp-preview'
  const previewCompleted = rewards?.isCompleted?.(previewKey)
  const [previewChoice, setPreviewChoice] = useState('')
  const earnedXp = rewards?.totals?.xp || 0
  const earnedCp = rewards?.totals?.cp || 0
  const accentGlow = isDark ? 'bg-accent/12' : 'bg-accent/18'

  const options = [
    { label: 'nmap -sV 127.0.0.1', correct: true },
    { label: 'ping 127.0.0.1 -t', correct: false },
  ]

  return (
    <section className="py-28 px-6 relative">
      <div className={`absolute -top-20 right-12 w-[420px] h-[420px] ${accentGlow} rounded-full blur-3xl opacity-70 pointer-events-none`} />
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-16">
          <SectionHeader
            kicker="// preview"
            title="Bootcamp Warm-Up Challenge"
            subtitle="A fast preview of the operator mindset. Earn bonus XP + CP for the correct pick."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="card p-8 border-accent/20 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Bonus Wallet</p>
                  <p className="text-2xl font-display font-bold text-[var(--text-primary)] mt-2">
                    {Number(earnedCp).toLocaleString()} <span className="text-sm text-[var(--text-muted)]">CP</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Live preview balance</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">XP Earned</p>
                  <p className="text-2xl font-display font-bold text-accent mt-2">
                    {Number(earnedXp).toLocaleString()} <span className="text-sm text-[var(--text-muted)]">XP</span>
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Session tally</p>
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
            <div className="absolute -left-16 bottom-0 w-56 h-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Warm-Up Challenge</p>
                  <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">Pick the safest command</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-accent" />
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-5">
                Complete the command selection to unlock an instant reward. You can only claim once per account.
              </p>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 font-mono text-xs text-[var(--text-primary)] mb-6">
                $ ? <span className="text-accent">scan localhost safely</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {options.map((opt) => (
                  <Button
                    key={opt.label}
                    variant="outline"
                    size="sm"
                    disabled={previewCompleted}
                    onClick={async () => {
                      if (!user) {
                        navigate('/register')
                        return
                      }
                      setPreviewChoice(opt.label)
                      if (opt.correct && !previewCompleted) {
                        try {
                          const res = await studentService.claimLandingReward(previewKey)
                          const reward = res.data?.reward || { cp: 12, xp: 25 }
                          if (!res.data?.alreadyClaimed) {
                            rewards?.award?.({ key: previewKey, cp: reward.cp, xp: reward.xp })
                          } else {
                            rewards?.award?.({ key: previewKey, cp: 0, xp: 0 })
                          }
                        } catch {
                          // ignore claim failures
                        }
                      }
                    }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>

              {previewChoice && (
                <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
                  <p className={`text-xs font-mono ${previewCompleted ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
                    {previewCompleted ? 'Reward unlocked: +12 CP, +25 XP' : 'Try the safer scan command.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
