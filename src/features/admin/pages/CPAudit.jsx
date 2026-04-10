import { useCallback, useEffect, useState } from 'react'
import { Coins, RefreshCcw } from 'lucide-react'
import { adminService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'
import { Button, Card, Badge, Skeleton } from '@/shared/components/ui'

const typeVariant = (type) => {
  if (type === 'credit') return 'success'
  if (type === 'debit') return 'danger'
  if (type === 'adjustment') return 'warning'
  if (type === 'purchase') return 'accent'
  return 'outline'
}

const formatPoints = (type, points) => {
  const value = Number(points || 0)
  if (type === 'debit') return `-${value}`
  return `+${value}`
}

export default function AdminCPAudit() {
  const { toast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.getCpTransactions({
        limit: 50,
        page,
        type: type || undefined,
        search: search || undefined,
      })
      setItems(res.data?.items || [])
      setPages(res.data?.pages || 1)
    } catch {
      toast({ type: 'error', title: 'Failed to load CP log', message: 'Please try again.' })
      setItems([])
      setPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, search, type, toast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [search, type])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// cp audit</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] flex items-center gap-2">
            <Coins size={20} className="text-accent" /> CP Audit Log
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">All CP point movements across the platform.</p>
        </div>
        <Button variant="outline" size="sm" icon={RefreshCcw} onClick={load} loading={loading}>
          Refresh
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-3">
          <input
            className="input-field py-2.5"
            placeholder="Search by name, email, or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field py-2.5"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="adjustment">Adjustment</option>
            <option value="purchase">Purchase</option>
          </select>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              Prev
            </Button>
            <span className="text-xs font-mono text-[var(--text-muted)]">Page {page} / {pages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <div className="text-sm text-[var(--text-secondary)]">No CP transactions found.</div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Points</th>
                  <th className="text-left p-3">Balance</th>
                  <th className="text-left p-3">Note</th>
                  <th className="text-left p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3">
                      <p className="text-sm text-[var(--text-primary)]">
                        {tx.user?.hackerHandle || tx.user?.name || tx.user?.email || 'Unknown user'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">{tx.user?.email || tx.userId}</p>
                    </td>
                    <td className="p-3">
                      <Badge variant={typeVariant(tx.type)}>{tx.type || 'unknown'}</Badge>
                    </td>
                    <td className="p-3 text-sm font-mono text-[var(--text-primary)]">
                      {formatPoints(tx.type, tx.points)} CP
                    </td>
                    <td className="p-3 text-sm font-mono text-[var(--text-primary)]">
                      {Number(tx.balanceAfter || 0).toLocaleString()} CP
                    </td>
                    <td className="p-3 text-xs text-[var(--text-muted)] max-w-[240px] truncate">
                      {tx.note || '—'}
                    </td>
                    <td className="p-3 text-xs text-[var(--text-muted)] font-mono">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
