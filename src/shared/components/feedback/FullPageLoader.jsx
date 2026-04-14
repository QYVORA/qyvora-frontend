export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-14 h-14 rounded-full border-4 border-[var(--border)] border-t-accent animate-spin"
          aria-label="Loading"
          role="status"
        />
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Loading...</p>
      </div>
    </div>
  )
}
