import { memo, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button, Spinner } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'
import { HeroStats } from '@/features/marketing/components/HeroStats'
const TypingHeadline = memo(function TypingHeadline() {
  const phrases = useMemo(
    () => [
      'Train like a hacker.',
      'Become a hacker.',
    ],
    []
  )
  const [typedText, setTypedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  useEffect(() => {
    const current = phrases[phraseIndex]
    const isComplete = typedText === current
    const isEmpty = typedText.length === 0
    const baseSpeed = isDeleting ? 35 : 70
    const pause = isComplete ? 1200 : isEmpty ? 400 : 0
    const timeout = setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true)
        return
      }
      if (isDeleting && isEmpty) {
        setIsDeleting(false)
        setPhraseIndex((idx) => (idx + 1) % phrases.length)
        return
      }
      const nextLength = isDeleting ? typedText.length - 1 : typedText.length + 1
      setTypedText(current.slice(0, Math.max(0, nextLength)))
    }, baseSpeed + pause)
    return () => clearTimeout(timeout)
  }, [isDeleting, phraseIndex, phrases, typedText])
  const renderTypedText = () => {
    const target = 'hacker'
    const lower = typedText.toLowerCase()
    const idx = lower.indexOf(target)
    if (idx === -1) {
      return <span className="text-[var(--text-primary)]">{typedText}</span>
    }
    const before = typedText.slice(0, idx)
    const word = typedText.slice(idx, idx + target.length)
    const after = typedText.slice(idx + target.length)
    return (
      <>
        <span className="text-[var(--text-primary)]">{before}</span>
        <span className="text-accent">{word}</span>
        <span className="text-[var(--text-primary)]">{after}</span>
      </>
    )
  }
  return (
    <span
      className="block text-center mx-auto w-full"
      aria-label={phrases[phraseIndex]}
    >
      {renderTypedText()}
      <span className="inline-block w-[0.6ch] text-accent animate-pulse">|</span>
    </span>
  )
})
export function HeroSection({
  stats,
  leaderboard = [],
  rewards,
  loading = false,
  loadingLeaderboard = false,
}) {
  const { isDark } = useTheme()
  const operatorAccent = isDark ? 'bg-accent/8' : 'bg-accent/12'
  const gridOpacity = isDark ? 'opacity-40' : 'opacity-20'
  const heroGlow = 'blur-none'
  const totalXp = leaderboard.reduce((acc, entry) => acc + Number(entry.totalXp || 0), 0)
  const totalCp = totalXp
  const earnedXp = rewards?.totals?.xp || 0
  const earnedCp = rewards?.totals?.cp || 0
  const previewKey = 'hero-bootcamp-preview'
  const previewCompleted = rewards?.isCompleted?.(previewKey)
  const [previewChoice, setPreviewChoice] = useState('')
  const lightTextVars = !isDark
    ? {
      '--text-primary': '#0f172a',
      '--text-secondary': '#1e293b',
      '--text-muted': '#475569',
      '--border': 'rgba(15, 23, 42, 0.18)',
    }
    : undefined
  return (
    <section
      className="relative isolate min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
      style={lightTextVars}
    >
      <div className={`absolute inset-0 bg-grid-pattern ${gridOpacity} pointer-events-none`} />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ${operatorAccent} rounded-full ${heroGlow} pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] bg-phase-purple/8 rounded-full ${heroGlow} pointer-events-none`} />
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/8 text-accent text-sm font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          Offensive Security Training Platform
        </div>
        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-[var(--text-primary)] leading-[0.95] tracking-tight mb-8 text-center w-full overflow-hidden min-h-[3.5rem] md:min-h-[5.5rem] lg:min-h-[7rem]">
          <TypingHeadline />
        </h1>
        <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed text-center">
          Structured offensive security bootcamps. Real techniques. Peer-validated skills. An economy built around zero-day knowledge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2 group">
            Start Training
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className={`btn-secondary text-base px-8 py-4 rounded-xl ${isDark ? '' : 'border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-black/5'}`}
          >
            Log In
          </Link>
        </div>
        <HeroStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="card p-6 text-left">
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Operator Economy</p>
            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-4">XP & CP Live Ticker</h3>
            {loadingLeaderboard ? (
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Spinner size={24} />
                <span className="text-sm font-mono">Loading stats...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Total XP Tracked</span>
                  <span className="font-mono text-lg text-accent">{Number(totalXp + earnedXp).toLocaleString()} XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">CP In Circulation</span>
                  <span className="font-mono text-lg text-[var(--text-primary)]">{Number(totalCp + earnedCp).toLocaleString()} CP</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Earn extra points below by completing the quick bootcamp preview.
                </p>
              </div>
            )}
          </div>

          <div className="card p-6 text-left">
            <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-2">Bootcamp Preview</p>
            <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">Warm-Up Challenge</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Pick the safest command to scan a test host. Earn instant CP for the correct pick.
            </p>
            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-primary)] mb-4">
              $ ? <span className="text-accent">scan localhost safely</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'nmap -sV 127.0.0.1', correct: true },
                { label: 'ping 127.0.0.1 -t', correct: false },
              ].map((opt) => (
                <Button
                  key={opt.label}
                  variant="outline"
                  size="sm"
                  disabled={previewCompleted}
                  onClick={() => {
                    setPreviewChoice(opt.label)
                    if (opt.correct && !previewCompleted) {
                      rewards?.award?.({ key: previewKey, cp: 12, xp: 25 })
                    }
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            {previewChoice && (
              <p className={`mt-3 text-xs font-mono ${previewCompleted ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
                {previewCompleted ? 'Reward unlocked: +12 CP, +25 XP' : 'Try the safer scan command.'}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] opacity-50">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
      </div>
    </section>
  )
}
