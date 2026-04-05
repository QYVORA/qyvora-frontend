import { Shield } from 'lucide-react'
import { Card, ProgressBar } from '@/shared/components/ui'

export function PhaseProgress({ items = [] }) {
  return (
    <Card>
      <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <Shield size={16} className="text-accent" /> Phase Progress
      </h3>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">No progress data available.</div>
        ) : (
          items.map((item) => {
            const accent = '#1fbf8f'
            return (
              <div key={item.id} className={`${item.status === 'next' ? 'opacity-40' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs" style={{ color: accent }}>MODULE {String(item.id).padStart(2, '0')}</span>
                    <span className="text-sm text-[var(--text-primary)]">{item.title}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">{item.progress}%</span>
                </div>
                <ProgressBar value={item.progress} max={100} color={accent} />
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
