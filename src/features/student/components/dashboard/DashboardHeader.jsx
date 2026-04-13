export function DashboardHeader({ displayName }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] leading-tight">
          <span className="block text-[var(--text-secondary)] text-xl font-medium">{greeting},</span>
          <span className="block text-accent break-words">{displayName || 'Operator'}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
