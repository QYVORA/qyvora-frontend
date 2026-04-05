import { Link } from 'react-router-dom'
import { HERO_BG } from '@/features/marketing/data/landingData'
import { useTheme } from '@/core/contexts/ThemeContext'
import { Logo } from '@/shared/components/brand/Logo'

const PHASE_LINES = [
  'Phase 01 — Reconnaissance',
  'Phase 02 — Exploitation',
  'Phase 03 — Post-Exploitation',
]

export function LoginSidePanel() {
  const { isDark } = useTheme()
  const patternOpacity = isDark ? 'opacity-40' : 'opacity-25'
  return (
    <div
      className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[var(--bg-secondary)] border-r border-[var(--border)] relative overflow-hidden isolate bg-cover bg-center"
      style={{ backgroundImage: `url(${HERO_BG})` }}
    >
      <div className={`absolute inset-0 bg-grid-pattern ${patternOpacity} pointer-events-none`} />
      <div className="relative z-10">
        <Link to="/" className="flex items-center">
          <Logo size="lg" />
        </Link>
      </div>
      <div className="relative z-10">
        <h2 className="font-display font-black text-4xl text-[var(--text-primary)] leading-tight mb-4">
          "The best defense<br />is a good offense."
        </h2>
        <p className="text-[var(--text-secondary)]">— Every operator who earned their rank.</p>
      </div>
      <div className="relative z-10 space-y-3">
        {PHASE_LINES.map((p, i) => (
          <div key={p} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <div className="w-2 h-2 rounded-full bg-accent opacity-50" style={{ opacity: 0.3 + i * 0.3 }} />
            <span className="font-mono">{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
