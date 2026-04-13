import { useCallback, useEffect, useState } from 'react'
import { Bell, CheckCircle2, MailOpen, RefreshCcw } from 'lucide-react'
import { notificationsService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'
import { Button, Card, Badge, Skeleton } from '@/shared/components/ui'

export function NotificationsList({ kicker, subtitle }) {
  const { toast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await notificationsService.list()
      setItems(res.data || [])
    } catch {
      toast({ type: 'error', title: 'Failed to load notifications', message: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  const handleMarkAll = async () => {
    try {
      await notificationsService.markAllRead()
      setItems((prev) => prev.map((item) => ({ ...item, read: true })))
      toast({ type: 'success', message: 'All notifications marked as read.' })
    } catch {
      toast({ type: 'error', message: 'Update failed. Please try again.' })
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await notificationsService.markRead(id)
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
    } catch {
      toast({ type: 'error', message: 'Update failed. Please try again.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          {kicker && <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">{kicker}</p>}
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] flex items-center gap-2">
            <Bell size={20} className="text-accent" /> Notifications
          </h1>
          {subtitle && <p className="text-[var(--text-secondary)] text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCcw} onClick={load} loading={loading}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" icon={CheckCircle2} onClick={handleMarkAll} disabled={items.length === 0 || items.every(i => i.read)}>
            Mark all read
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-5">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <MailOpen size={16} className="text-accent" />
            You are all caught up.
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--text-primary)]">{item.title || 'Notification'}</h3>
                    {!item.read && <Badge variant="accent">New</Badge>}
                  </div>
                  {item.message && (
                    <p className="text-sm text-[var(--text-secondary)]">{item.message}</p>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono whitespace-nowrap shrink-0">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                </span>
              </div>
              {!item.read && (
                <Button variant="outline" size="sm" onClick={() => handleMarkRead(item.id)}>
                  Mark as read
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
