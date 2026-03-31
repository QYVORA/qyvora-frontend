import { useEffect, useState } from 'react'
import { Users, ShoppingBag, FileText, Activity, AlertCircle } from 'lucide-react'
import { StatCard, Card, Badge, Skeleton } from '@/shared/components/ui'
import { Link } from 'react-router-dom'
import { adminService } from '@/core/services'
import api from '@/core/services/api'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [contentCount, setContentCount] = useState(0)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [overviewRes, usersRes, productsRes, contentRes] = await Promise.all([
          adminService.getOverview(),
          adminService.getUsers(),
          adminService.getCPProducts(),
          adminService.getContent(),
        ])
        if (!mounted) return
        setOverview(overviewRes.data || null)
        setUsers(usersRes.data || [])
        setProducts(productsRes.data?.items || [])
        const freeResources = contentRes.data?.learn?.freeResources || []
        setContentCount(freeResources.length)
      } catch {
        // ignore
      }

      try {
        const eventsRes = await api.get('/admin/security/events', { params: { limit: 5 } })
        if (!mounted) return
        setEvents(eventsRes.data?.items || [])
      } catch {
        setEvents([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const totalUsers = overview?.users?.total || 0
  const activeUsers = overview?.users?.active24h || 0
  const marketplaceItems = products.length
  const contentPieces = contentCount

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-red-400 text-xs uppercase tracking-widest mb-1">// root session</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Admin Overview</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Platform health and management console.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </Card>
          ))
        ) : (
          <>
            <StatCard label="Total Users" value={Number(totalUsers).toLocaleString()} sub="All time" icon={Users} color="#1fbf8f" />
            <StatCard label="Active Users" value={Number(activeUsers).toLocaleString()} sub="Last 24h" icon={Activity} color="#0EA5E9" />
            <StatCard label="Market Items" value={Number(marketplaceItems).toLocaleString()} sub="Live listings" icon={ShoppingBag} color="#B8860B" />
            <StatCard label="Content Pieces" value={Number(contentPieces).toLocaleString()} sub="Free resources" icon={FileText} color="#6D28D9" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Users size={16} className="text-accent" /> Recent Users
            </h3>
            <Link to="/admin/users" className="text-xs text-accent hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : users.slice(0, 4).map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center text-sm font-mono font-bold text-accent shrink-0">
                  {(u.hackerHandle || u.name || u.email || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{u.hackerHandle || u.name || u.email}</p>
                  <p className="text-xs text-[var(--text-muted)]">Role {u.role} · {Number(u.cpPoints || 0).toLocaleString()} CP</p>
                </div>
                <Badge variant={u.bootcampAccessRevoked ? 'danger' : 'success'} className="shrink-0">
                  {u.bootcampAccessRevoked ? 'revoked' : 'active'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Event log */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <AlertCircle size={16} className="text-accent" /> System Events
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-mono">Live</span>
          </div>
          <div className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl">
                  <Skeleton className="w-2 h-2 rounded-full mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="text-sm text-[var(--text-secondary)]">No recent events.</div>
            ) : events.map((ev, i) => (
              <div key={ev.id || i} className="flex items-start gap-3 p-2.5 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  ev.severity === 'high' ? 'bg-red-400' : ev.severity === 'medium' ? 'bg-yellow-400' : 'bg-accent'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{ev.title || ev.action || 'Security event'}</p>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" className="btn-secondary text-sm flex items-center gap-2">
            <Users size={15} /> Manage Users
          </Link>
          <Link to="/admin/content" className="btn-secondary text-sm flex items-center gap-2">
            <FileText size={15} /> Upload Content
          </Link>
          <Link to="/admin/marketplace" className="btn-secondary text-sm flex items-center gap-2">
            <ShoppingBag size={15} /> Marketplace Control
          </Link>
        </div>
      </Card>
    </div>
  )
}
