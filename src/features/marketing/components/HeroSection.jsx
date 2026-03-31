import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HERO_BG } from '@/features/marketing/data/landingData'
import { Skeleton } from '@/shared/components/ui'
import { useTheme } from '@/core/contexts/ThemeContext'

export function HeroSection({ stats, loading = false }) {
  const { isDark } = useTheme()
  const learners = stats?.stats?.learnersTrained ?? 0
  const phases = stats?.stats?.engagementsCompleted ?? 0
  const marketItems = stats?.stats?.vulnerabilitiesIdentified ?? 0
  const heroFilter = isDark ? 'brightness(0.18) saturate(1.4)' : 'brightness(0.55) saturate(0.9)'
  const operatorAccent = isDark ? 'bg-accent/8' : 'bg-accent/12'
  const gridOpacity = isDark ? 'opacity-40' : 'opacity-20'
  const heroGlow = isDark ? 'blur-3xl' : 'blur-none'
  const lightTextVars = !isDark
    ? {
      '--text-primary': '#f8fafc',
      '--text-secondary': '#e2e8f0',
      '--text-muted': '#cbd5f5',
      '--border': 'rgba(248, 250, 252, 0.25)',
    }
    : undefined
  return (
    <section
      className="relative isolate min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
      style={lightTextVars}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: heroFilter,
        }}
      />
      <div className={`absolute inset-0 bg-grid-pattern ${gridOpacity} pointer-events-none`} />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ${operatorAccent} rounded-full ${heroGlow} pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] bg-phase-purple/8 rounded-full ${heroGlow} pointer-events-none`} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/40 bg-accent/8 text-accent text-sm font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          Offensive Security Training Platform
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-[var(--text-primary)] leading-[0.95] tracking-tight mb-8">
          Train Like a
          <br />
          <span className="text-accent glow-text"> Hacker.</span>
          <br />
          <span className="text-[var(--text-secondary)]">Become a </span>
          <span className="text-accent glow-text">Hacker</span>
        </h1>

        <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Structured offensive security curriculum. Real techniques. Peer-validated skills. An economy built around zero-day knowledge.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2 group">
            Start Training
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className={`btn-secondary text-base px-8 py-4 rounded-xl ${isDark ? '' : 'border-white/70 text-white hover:bg-white/10'}`}
          >
            Log In
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mt-16 pt-10 border-t border-[var(--border)] pb-20">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))
          ) : (
            [
              [Number(learners || 0).toLocaleString(), 'Operators'],
              [Number(phases || 0).toLocaleString(), 'Engagements'],
              [Number(marketItems || 0).toLocaleString(), 'Findings'],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="font-display font-black text-3xl md:text-4xl text-accent glow-text leading-none mb-2">{val}</span>
                <span className="text-[10px] md:text-xs text-[var(--text-muted)] font-mono uppercase tracking-[0.2em]">{label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] opacity-50">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
      </div>
    </section>
  )
}
