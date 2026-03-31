import { ShoppingBag } from 'lucide-react'
import { EmptyState, Card, Skeleton } from '@/shared/components/ui'
import { MarketplaceItemCard } from '@/features/student/components/marketplace/MarketplaceItemCard'

export function MarketplaceGrid({ items, user, onBuy, onDownload, purchasedIds, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-3">
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No items found"
        description="Try adjusting your search or filter."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(item => (
        <MarketplaceItemCard
          key={item._id || item.id}
          item={item}
          user={user}
          onBuy={onBuy}
          onDownload={onDownload}
          purchased={purchasedIds?.has(String(item._id || item.id))}
        />
      ))}
    </div>
  )
}
