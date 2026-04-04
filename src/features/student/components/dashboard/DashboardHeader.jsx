import { Badge } from '@/shared/components/ui'

export function DashboardHeader({ displayName, rankLabel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0">
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// command center</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] min-h-[40px] sm:min-h-[48px] leading-tight">
          <span className="block truncate">
            Welcome back, <span className="text-accent">{displayName || 'Operator'}</span>
          </span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1 min-h-[20px]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <Badge variant="accent" className="text-sm px-3 py-1 self-start">{rankLabel || 'Operator'}</Badge>
    </div>
  )
}
