export function ProgressBar({ value, max = 100, color, label, showPercent, className }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-[var(--text-secondary)]">{label}</span>}
          {showPercent && <span className="text-xs font-mono text-accent">{pct}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color || undefined }} />
      </div>
    </div>
  )
}
