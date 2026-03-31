import { Clock } from 'lucide-react'

export function RecentActivity({ items = [] }) {
  return (
    <div className="lg:col-span-2">
      <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
        <Clock size={16} className="text-accent" />
        Recent Activity
      </h3>
      <div className="card divide-y divide-[var(--border)]">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-[var(--text-secondary)]">No recent activity yet.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.points > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{item.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.time}</p>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${item.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.points > 0 ? '+' : ''}{item.points} CP
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
