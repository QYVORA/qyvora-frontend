import { memo, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTheme } from '@/core/contexts/ThemeContext'
import { CTA_BG } from '@/features/marketing/data/landingData'

const TypingHeadline = memo(function TypingHeadline() {
  const phrases = useMemo(
    () => [
      'Train like a hacker.',
      'Become a hacker.',
      'Hack the system.',
      'Own the network.',
      'Break things legally.',
    ],
    []
  )
  const [typedText, setTypedText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Longest phrase drives the reserved height so there's no layout shift
  const longestPhrase = useMemo(() => phrases.reduce((a, b) => (a.length > b.length ? a : b), ''), [phrases])

  useEffect(() => {
    const current = phrases[phraseIndex]
    const isComplete = typedText === current
    const isEmpty = typedText.length === 0
    const baseSpeed = isDeleting ? 35 : 70
    const pause = isComplete ? 1400 : isEmpty ? 400 : 0
    const timeout = setTimeout(() => {
      if (!isDeleting && isComplete) { setIsDeleting(true); return }
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
    if (idx === -1) return <span className="text-[var(--text-primary)]">{typedText}</span>
    return (
      <>
        <span className="text-[var(--text-primary)]">{typedText.slice(0, idx)}</span>
        <span className="text-accent">{typedText.slice(idx, idx + target.length)}</span>
        <span className="text-[var(--text-primary)]">{typedText.slice(idx + target.length)}</span>
      </>
    )
  }

  return (
    <span className="block text-center mx-auto w-full" aria-label={phrases[phraseIndex]}>
      {/* Invisible longest phrase reserves exact height — no layout shift */}
      <span className="invisible absolute pointer-events-none select-none" aria-hidden="true">
        {longestPhrase}
      </span>
      {renderTypedText()}
      <span className="inline-block w-[0.6ch] text-accent animate-pulse">|</span>
    </span>
  )
})

export function HeroSection({ stats, loading = false }) {
  const { isDark } = useTheme()
  const lightTextVars = !isDark
    ? {
        '--text-primary': 'var(--primary)',
        '--text-secondary': 'rgba(0, 0, 0, 0.72)',
        '--text-muted': 'rgba(0, 0, 0, 0.52)',
        '--border': 'rgba(0, 0, 0, 0.18)',
      }
    : undefined

  return (
    <section
      className="relative isolate min-h-dvh flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden bg-[var(--bg-primary)]"
      style={{
        ...lightTextVars,
        backgroundImage: `url(${CTA_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay — lighter in dark mode, even lighter in light mode so image shows */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[var(--bg-primary)]/55' : 'bg-white/40'}`} />
      <div className="cube-noise" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Platform badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/10 text-accent text-sm font-mono mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Offensive Security Training Platform
        </div>

        <h1 className="relative font-display font-black text-5xl md:text-7xl lg:text-8xl text-[var(--text-primary)] leading-[1.05] tracking-tight mb-8 text-center w-full">
          <TypingHeadline />
        </h1>

        <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-center">
          HSOCIETY OFFSEC is an offensive security company training the next generation of security talent across Africa.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            to="/register"
            className="btn-primary text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 group w-full sm:w-auto shadow-lg shadow-accent/30"
          >
            Start Training
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="text-base px-8 py-4 rounded-xl w-full sm:w-auto flex items-center justify-center font-semibold border border-[var(--text-primary)]/40 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/8 transition-all backdrop-blur-sm"
          >
            Log In
          </Link>
        </div>
      </div>
    </section>
  )
}
