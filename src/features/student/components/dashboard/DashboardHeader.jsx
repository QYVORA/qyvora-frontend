export function DashboardHeader({ displayName }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4" data-tour="dashboard-header">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] min-h-[40px] sm:min-h-[48px] leading-tight">
          <span className="block">Welcome back,</span>
          <span className="block text-accent break-words">{displayName || 'Operator'}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1 min-h-[20px]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
