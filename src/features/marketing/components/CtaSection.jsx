import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CTA_BG } from '@/features/marketing/data/landingData'
import { useTheme } from '@/core/contexts/ThemeContext'

export function CtaSection() {
  const { isDark } = useTheme()
  const backdropFilter = isDark ? 'brightness(0.15) saturate(1.2)' : 'brightness(0.45) saturate(0.9)'
  const lightTextVars = !isDark
    ? {
      '--text-primary': '#ffffff',
      '--text-secondary': 'rgba(255, 255, 255, 0.8)',
      '--text-muted': 'rgba(255, 255, 255, 0.6)',
    }
    : undefined
  return (
    <section className="py-24 sm:py-36 px-6 relative overflow-hidden" style={lightTextVars}>
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
      <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative z-10 px-6 flex justify-center w-full">
        <div className="w-full max-w-3xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/12 border border-accent/25 text-accent text-xs font-mono mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Enrollment Open
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[var(--text-primary)] mb-6 leading-tight">
            Ready to Operate?
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 text-base sm:text-xl leading-relaxed max-w-xl mx-auto">
            Join 100+ Elite operators training in offensive security. No experience required. Just commitment.
          </p>
          <Link to="/register" className="btn-primary text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5 rounded-none inline-flex items-center gap-3 group">
            Begin Phase 01
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
