export function Divider({ label }) {
  if (!label) return <div className="border-t border-[var(--border)] my-6" />
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 border-t border-[var(--border)]" />
      <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest">{label}</span>
      <div className="flex-1 border-t border-[var(--border)]" />
    </div>
  )
}
