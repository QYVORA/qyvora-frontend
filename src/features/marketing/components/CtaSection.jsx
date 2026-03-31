import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CTA_BG } from '@/features/marketing/data/landingData'
import { useTheme } from '@/core/contexts/ThemeContext'

export function CtaSection() {
  const { isDark } = useTheme()
  const backdropFilter = isDark ? 'brightness(0.15) saturate(1.2)' : 'brightness(0.45) saturate(0.9)'
  const lightTextVars = !isDark
    ? {
      '--text-primary': '#f8fafc',
      '--text-secondary': '#e2e8f0',
      '--text-muted': '#cbd5f5',
    }
    : undefined
  return (
    <section className="py-36 px-6 relative overflow-hidden" style={lightTextVars}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${CTA_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: backdropFilter,
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-phase-purple/8 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/12 border border-accent/25 text-accent text-xs font-mono mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Enrollment Open
        </div>
        <h2 className="font-display font-black text-5xl md:text-6xl text-[var(--text-primary)] mb-6 leading-tight">
          Ready to Operate?
        </h2>
        <p className="text-[var(--text-secondary)] mb-10 text-xl leading-relaxed max-w-xl mx-auto">
          Join 1,800+ operators training in offensive security. No experience required. Just commitment.
        </p>
        <Link to="/register" className="btn-primary text-lg px-12 py-5 rounded-xl inline-flex items-center gap-3 group">
          Begin Phase 01
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
