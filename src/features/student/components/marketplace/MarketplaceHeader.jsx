import { Zap } from 'lucide-react'

export function MarketplaceHeader({ cp }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Marketplace</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Premium tools, exploits, and playbooks. Spend your CP.</p>
      </div>
      <div className="sm:ml-auto flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2">
        <Zap size={15} className="text-accent" />
        <span className="font-mono font-bold text-accent">{cp?.toLocaleString()} CP</span>
        <span className="text-xs text-[var(--text-muted)]">balance</span>
      </div>
    </div>
  )
}
