import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { adminService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'
import { Button, Card, Badge, Skeleton } from '@/shared/components/ui'

const severityFromStatus = (statusCode) => {
  const code = Number(statusCode || 0)
  if (code >= 500) return { label: 'error', variant: 'danger' }
  if (code >= 400) return { label: 'warn', variant: 'warning' }
  return { label: 'info', variant: 'accent' }
}

export default function AdminSecurityEvents() {
  const { toast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCount, setNewCount] = useState(0)

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    try {
      const res = await adminService.getSecurityEvents({ limit: 50 })
      const nextItems = res.data?.items || []
      if (silent) {
        setItems((prev) => {
          const existing = new Set(prev.map((item) => String(item.id || item._id)))
          const fresh = nextItems.filter((item) => !existing.has(String(item.id || item._id)))
          if (fresh.length) setNewCount((count) => count + fresh.length)
          return fresh.length ? [...fresh, ...prev].slice(0, 50) : prev
        })
      } else {
        setItems(nextItems)
      }
    } catch {
      if (!silent) {
        toast({ type: 'error', title: 'Failed to load events', message: 'Please try again.' })
        setItems([])
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const timer = setInterval(() => {
      load({ silent: true })
    }, 30000)
    return () => clearInterval(timer)
  }, [load])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// security feed</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] flex items-center gap-2">
            <AlertTriangle size={20} className="text-accent" /> Security Events
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Latest system and authentication events.</p>
        </div>
        <Button variant="outline" size="sm" icon={RefreshCcw} onClick={load} loading={loading}>
          Refresh
        </Button>
      </div>

      {newCount > 0 && (
        <div className="inline-flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          <span>{newCount} new events</span>
          <button type="button" className="text-xs underline" onClick={() => setNewCount(0)}>
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <Card className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
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
        <Card className="p-5">
          <p className="text-sm text-[var(--text-secondary)]">No recent events.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="text-left p-3">Event / Path</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((ev) => {
                  const sev = severityFromStatus(ev.statusCode)
                  return (
                    <tr key={ev.id || ev._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="p-3">
                        <p className="text-sm text-[var(--text-primary)]">{ev.eventType || 'event'}</p>
                        {ev.path && <p className="text-xs text-[var(--text-muted)] font-mono">{ev.path}</p>}
                      </td>
                      <td className="p-3 text-sm text-[var(--text-secondary)]">{ev.action || '—'}</td>
                      <td className="p-3">
                        <Badge variant={sev.variant}>
                          {ev.statusCode ? `${ev.statusCode} ${sev.label}` : sev.label}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-[var(--text-muted)] font-mono">
                        {ev.user?.email || ev.user?.name || (ev.userId ? String(ev.userId).slice(-8) : '—')}
                      </td>
                      <td className="p-3 text-xs text-[var(--text-muted)] font-mono">
                        {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
