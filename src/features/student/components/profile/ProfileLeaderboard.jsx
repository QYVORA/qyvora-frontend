import { Star } from 'lucide-react'
import { Avatar, Card } from '@/shared/components/ui'

export function ProfileLeaderboard({ user, entries = [] }) {
  return (
    <Card>
      <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <Star size={16} className="text-accent" /> Platform Leaderboard
      </h3>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-sm text-[var(--text-secondary)]">Leaderboard unavailable.</div>
        ) : entries.map((entry, i) => {
          const handle = entry.handle || entry.name
          const isMe = handle === (user?.hackerHandle || user?.name)
          return (
            <div
              key={entry.id || entry.handle || i}
              className={`flex items-center gap-4 p-3 rounded-xl ${isMe ? 'bg-accent/5 border border-accent/20' : 'hover:bg-[var(--bg-secondary)]'} transition-colors`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono shrink-0 ${i === 0 ? 'bg-yellow-400/20 text-yellow-400' : i === 1 ? 'bg-slate-400/20 text-slate-400' : i === 2 ? 'bg-orange-400/20 text-orange-400' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                {entry.rank}
              </div>
              <Avatar username={handle} size="sm" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isMe ? 'text-accent' : 'text-[var(--text-primary)]'}`}>
                  {handle} {isMe && <span className="text-xs text-accent">(you)</span>}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{entry.rank}</p>
              </div>
              <span className="font-mono text-sm font-bold text-[var(--text-primary)]">{Number(entry.totalXp || 0).toLocaleString()} XP</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
