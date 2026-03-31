import { Search } from 'lucide-react'

export function MarketplaceFilters({ search, onSearchChange, category, onCategoryChange, categories = [] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          className="input-field pl-9 py-2.5"
          placeholder="Search tools, exploits, playbooks..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${cat === category ? 'bg-accent/10 text-accent border border-accent/30' : 'border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
