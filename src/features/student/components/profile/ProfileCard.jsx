import { Calendar, Edit3, Shield, Star, X, Zap } from 'lucide-react'
import { Avatar, Badge, Button, Card, ProgressBar } from '@/shared/components/ui'

export function ProfileCard({ user, rankLabel, leaderboardPos, editing, onToggleEdit, totalXp }) {
  const displayName = user?.hackerHandle || user?.name || user?.email
  return (
    <Card className="relative overflow-hidden isolate">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
        <div className="relative">
          <Avatar username={displayName} size="xl" />
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[var(--bg-card)] flex items-center justify-center"
            style={{ background: 'var(--accent)' }}
          >
            <span className="text-[9px] font-bold text-[var(--text-primary)]">★</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">{displayName}</h2>
              <p className="text-[var(--text-secondary)] text-sm">{user?.email}</p>
            </div>
            <Badge variant="accent" className="text-sm px-3 py-1">{rankLabel || 'Operator'}</Badge>
            {leaderboardPos > 0 && leaderboardPos <= 10 && (
              <Badge variant="warning">Top {leaderboardPos}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { label: 'XP', value: Number(totalXp || 0).toLocaleString(), icon: Zap },
              { label: 'CP', value: Number(user?.cpPoints || 0).toLocaleString(), icon: Star },
              { label: 'Role', value: user?.role || 'student', icon: Shield },
              { label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '—', icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm">
                <Icon size={13} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">{label}:</span>
                <span className="font-medium text-[var(--text-primary)]">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 max-w-sm">
            <ProgressBar
              value={Number(totalXp || 0)}
              max={Number(totalXp || 1)}
              color="var(--accent)"
              label={`${Number(totalXp || 0).toLocaleString()} XP`}
              showPercent={false}
            />
          </div>
        </div>

        <Button variant="outline" size="sm" icon={editing ? X : Edit3} onClick={onToggleEdit}>
          {editing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
    </Card>
  )
}
