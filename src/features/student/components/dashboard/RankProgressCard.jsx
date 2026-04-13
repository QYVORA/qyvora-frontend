import { Star } from 'lucide-react'
import { Card } from '@/shared/components/ui'

export function RankProgressCard({ cp, rankLabel }) {
  const hasPoints = Number(cp || 0) > 0

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-accent" />
        <h3 className="font-semibold text-[var(--text-primary)]">Rank Progression</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-muted)]">Current Rank</span>
          <span className="text-xs font-mono text-accent">{rankLabel || 'Operator'}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: hasPoints ? '100%' : '0%', background: 'var(--accent)' }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--text-muted)]">{Number(cp || 0).toLocaleString()} CP</span>
          {hasPoints ? (
            <span className="text-xs text-[var(--text-muted)]">Live rank</span>
          ) : (
            <span className="text-xs text-[var(--text-muted)] italic">Start earning CP to rank up</span>
          )}
        </div>
      </div>
    </Card>
  )
}
