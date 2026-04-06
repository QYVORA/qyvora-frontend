import { Star } from 'lucide-react'
import { Card } from '@/shared/components/ui'

export function RankProgressCard({ xp, rankLabel }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-accent" />
        <h3 className="font-semibold text-[var(--text-primary)]">Rank Progression</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-muted)]">Current Rank</span>
          <span className="text-xs font-mono text-[var(--text-muted)]">{rankLabel || 'Operator'}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%', background: 'var(--accent)' }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--text-muted)]">{Number(xp || 0).toLocaleString()} XP</span>
          <span className="text-xs text-[var(--text-muted)]">Live rank</span>
        </div>
      </div>
    </Card>
  )
}
