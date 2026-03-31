import { useEffect, useState } from 'react'
import { ShoppingBag, X, Eye, Star } from 'lucide-react'
import { Badge, Button, Card, Skeleton } from '@/shared/components/ui'
import { useToast } from '@/core/contexts/ToastContext'
import { adminService } from '@/core/services'

export default function AdminMarketplace() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getCPProducts()
        if (!mounted) return
        setAllItems(res.data?.items || [])
      } catch {
        setAllItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const reject = (id, name) => {
    adminService.deleteCPProduct(id)
      .then(() => {
        setAllItems(prev => prev.filter(i => i._id !== id))
        toast({ type: 'warning', message: `"${name}" has been removed.` })
      })
      .catch(() => toast({ type: 'error', message: 'Failed to remove item.' }))
  }

  const approvedItems = allItems

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-red-400 text-xs uppercase tracking-widest mb-1">// marketplace control</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Marketplace</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Review, approve, and remove marketplace listings.</p>
      </div>

      {/* Active listings */}
      <Card>
        <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <ShoppingBag size={16} className="text-accent" /> Active Listings ({approvedItems.length})
        </h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 border-b border-[var(--border)] last:border-0">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="text-left p-3">Item</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Downloads</th>
                  <th className="text-left p-3">Seller</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {approvedItems.map(item => (
                  <tr key={item._id || item.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--text-primary)] max-w-[180px] truncate">{item.title}</p>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="default">{item.type || 'General'}</Badge></td>
                    <td className="p-3 font-mono text-sm text-accent">{item.cpPrice} CP</td>
                    <td className="p-3 text-sm text-[var(--text-secondary)] flex items-center gap-1">
                      <Star size={12} className="text-yellow-400" />—
                    </td>
                    <td className="p-3 text-sm text-[var(--text-secondary)] font-mono">—</td>
                    <td className="p-3 text-sm text-[var(--text-muted)] font-mono">{item.createdBy || '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                        <Button variant="danger" size="sm" icon={X} onClick={() => reject(item._id || item.id, item.title)}>Remove</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
