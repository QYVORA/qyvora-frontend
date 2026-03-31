export function FullPageLoader({ label = 'Loading' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono">{label}...</span>
      </div>
    </div>
  )
}
