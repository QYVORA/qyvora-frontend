import { LogOut, Bell, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Avatar } from '@/shared/components/ui'
import { Logo } from '@/shared/components/brand/Logo'
import { notificationsService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'

export function StudentTopbar({ user, onLogout, solid }) {
  const { toast } = useToast()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!notifOpen) return
    let mounted = true
    const load = async () => {
      setNotifLoading(true)
      try {
        const res = await notificationsService.list()
        if (mounted) setNotifications((res.data || []).slice(0, 5))
      } catch {
        toast({ type: 'error', title: 'Notifications unavailable', message: 'Please try again later.' })
      } finally {
        if (mounted) setNotifLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [notifOpen, toast])

  useEffect(() => {
    if (!notifOpen) return
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen])

  return (
    <header
      className={clsx(
        'h-20 flex items-center justify-between px-6 sticky top-0 z-30',
        solid ? 'bg-[color:var(--bg-primary)]' : 'bg-[color:var(--bg-primary)]/80 backdrop-blur-sm'
      )}
    >
      <Link to="/" className="flex items-center gap-2 lg:hidden">
        <Logo size="md" scale={1.7} offsetY={-2} className="h-[40px]" />
      </Link>
      <div className="hidden lg:flex items-center gap-2 text-[var(--text-muted)] text-sm">
        <Star size={14} className="text-accent" />
        <span className="font-mono">Rank {user?.xpSummary?.rank || 'Operator'} — {Number(user?.cpPoints || 0).toLocaleString()} CP</span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative group">
          <button onClick={onLogout} className="lg:hidden btn-ghost p-2 rounded-lg text-accent" aria-label="Logout">
            <LogOut size={18} />
          </button>
          <span className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg-card)]/95 px-2 py-1 text-[10px] font-mono text-[var(--text-secondary)] shadow-lg opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
            Logout
          </span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <div className="relative group">
            <button
              type="button"
              onClick={() => setNotifOpen((open) => !open)}
              className="btn-ghost p-2 rounded-lg relative"
              data-tour="topbar-notifications"
              aria-label="Notifications"
              aria-expanded={notifOpen}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <span className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg-card)]/95 px-2 py-1 text-[10px] font-mono text-[var(--text-secondary)] shadow-lg opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
              Notifications
            </span>
          </div>
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Notifications</span>
                <Link to="/notifications" className="text-xs text-accent hover:opacity-80" onClick={() => setNotifOpen(false)}>
                  View all
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifLoading ? (
                  <div className="px-4 py-4 text-sm text-[var(--text-secondary)]">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-[var(--text-secondary)]">No new notifications.</div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="px-4 py-3 border-b border-[var(--border)] last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {item.title || 'Notification'}
                          </p>
                          {item.message && (
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{item.message}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono whitespace-nowrap">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="h-6 w-px bg-[var(--border)] mx-1" />
        <div className="relative group">
          <Link
            to="/profile"
            className="btn-ghost px-3 py-1.5 rounded-lg flex items-center gap-2.5 max-w-[220px]"
            data-tour="topbar-profile"
          >
            <Avatar username={user?.hackerHandle || user?.name || user?.email} size="sm" />
            <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block truncate">
              {user?.hackerHandle || user?.name || user?.email}
            </span>
          </Link>
          <span className="pointer-events-none absolute top-11 right-0 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg-card)]/95 px-2 py-1 text-[10px] font-mono text-[var(--text-secondary)] shadow-lg opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0">
            Profile
          </span>
        </div>
      </div>
    </header>
  )
}
