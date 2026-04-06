import { Target } from 'lucide-react'
import { ProgressBar } from '@/shared/components/ui'

export function PhasesOverview({ items = [] }) {
  return (
    <div>
      <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
        <Target size={16} className="text-accent" />
        Learning Path
      </h3>
      {items.length === 0 ? (
        <div className="card p-6 text-sm text-[var(--text-secondary)]">No learning path available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((p) => {
            const isActive = p.status === 'in-progress'
            const isDone = p.status === 'done'
            const accent = 'var(--accent)'
            return (
              <div
                key={p.id}
                className={`card p-4 relative ${p.status === 'next' ? 'opacity-70' : 'card-hover'}`}
                style={{ borderColor: isActive ? `${accent}50` : undefined }}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
                )}
                <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>
                  MODULE {String(p.id).padStart(2, '0')}
                </div>
                <p className="font-semibold text-sm text-[var(--text-primary)] mb-2">{p.title}</p>
                <ProgressBar value={p.progress} max={100} color={accent} />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-[var(--text-muted)] font-mono">{p.progress}%</span>
                  {p.status === 'next' && <span className="text-[10px] text-[var(--text-muted)]">LOCKED</span>}
                  {isDone && <span className="text-[10px] text-accent">✓</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
