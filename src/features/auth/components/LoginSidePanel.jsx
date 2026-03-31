import { Link } from 'react-router-dom'
import { HERO_BG } from '@/features/marketing/data/landingData'
import { useTheme } from '@/core/contexts/ThemeContext'

const PHASE_LINES = [
  'Phase 01 — Reconnaissance',
  'Phase 02 — Exploitation',
  'Phase 03 — Post-Exploitation',
]

export function LoginSidePanel() {
  const { isDark } = useTheme()
  const backgroundFilter = isDark ? 'brightness(0.35) saturate(1.3)' : 'brightness(0.9) saturate(0.75)'
  const patternOpacity = isDark ? 'opacity-40' : 'opacity-25'
  const glowBlur = isDark ? 'blur-3xl' : 'blur-none'
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[var(--bg-secondary)] border-r border-[var(--border)] relative overflow-hidden isolate">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          filter: backgroundFilter,
        }}
      />
      <div className={`absolute inset-0 bg-grid-pattern ${patternOpacity} pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full ${glowBlur} pointer-events-none`} />
      <div className="relative z-10">
        <Link to="/" className="flex items-center">
          <span className="font-display font-bold text-xl">H<span className="text-accent">SOCIETY</span></span>
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
