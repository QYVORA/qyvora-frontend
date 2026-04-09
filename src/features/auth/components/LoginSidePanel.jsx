import { Link } from 'react-router-dom'
import { Logo } from '@/shared/components/brand/Logo'

const PHASE_LINES = [
  'Phase 01 — Reconnaissance',
  'Phase 02 — Exploitation',
  'Phase 03 — Post-Exploitation',
]

export function LoginSidePanel() {
  return (
    <div
      className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[var(--bg-secondary)] border-r border-[var(--border)] relative overflow-hidden isolate"
    >
      <div className="relative z-10">
        <Link to="/" className="flex items-center">
          <Logo size="xl" className="h-[140px]" />
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
