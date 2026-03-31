import { Zap } from 'lucide-react'
import { Badge, Button } from '@/shared/components/ui'

export function MarketplaceItemCard({ item, user, onBuy }) {
  const canAfford = (user?.cpPoints ?? user?.cp ?? 0) >= Number(item.cpPrice || 0)

  return (
    <div className="card hover:border-accent/20 transition-all duration-200 group flex flex-col">
      <div className="h-1 rounded-t-xl" style={{ background: '#1fbf8f33' }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="default" className="text-[10px]">{item.type || 'General'}</Badge>
          </div>
        </div>

        <h3 className="font-semibold text-[var(--text-primary)] mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 flex-1">{item.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div>
            <p className="font-display font-bold text-lg text-accent">{Number(item.cpPrice || 0).toLocaleString()} <span className="text-sm text-[var(--text-muted)]">CP</span></p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className={!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
            onClick={() => onBuy(item)}
            disabled={!canAfford}
          >
            <Zap size={13} /> Buy
          </Button>
        </div>
      </div>
    </div>
  )
}
