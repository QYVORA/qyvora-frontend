import { Download, FileText, Zap } from 'lucide-react'
import { Badge, Button } from '@/shared/components/ui'

export function MarketplaceItemCard({ item, user, onBuy, onDownload, purchased = false }) {
  const canAfford = (user?.cpPoints ?? user?.cp ?? 0) >= Number(item.cpPrice || 0)

  return (
    <div className="card hover:border-accent/20 transition-all duration-200 group flex flex-col overflow-hidden">
      <div className="h-1" style={{ background: 'rgba(var(--accent-rgb), 0.2)' }} />
      <div className="relative h-36 overflow-hidden">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.8) saturate(1.1)' }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
              <FileText size={16} />
              PDF
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        <div className="absolute bottom-2 left-3 right-3 text-xs text-[var(--text-primary)] font-mono truncate">
          {item.title}
        </div>
      </div>

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
          {purchased ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDownload(item)}
            >
              <Download size={13} /> Download
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className={!canAfford ? 'opacity-50 cursor-not-allowed' : ''}
              onClick={() => onBuy(item)}
              disabled={!canAfford}
            >
              <Zap size={13} /> Buy
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
