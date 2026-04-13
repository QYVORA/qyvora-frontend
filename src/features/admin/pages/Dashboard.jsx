import { useEffect, useState } from 'react'
import { Users, ShoppingBag, FileText, Activity, AlertCircle, Layers, ArrowRight } from 'lucide-react'
import { StatCard, Card, Badge, Skeleton } from '@/shared/components/ui'
import { Link } from 'react-router-dom'
import { adminService } from '@/core/services'
import api from '@/core/services/api'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [contentCount, setContentCount] = useState(0)
  const [events, setEvents] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [overviewRes, usersRes, productsRes, contentRes, roomsRes] = await Promise.all([
          adminService.getOverview(),
          adminService.getUsers(),
          adminService.getCPProducts(),
          adminService.getContent(),
          adminService.getRooms(),
        ])
        if (!mounted) return
        setOverview(overviewRes.data || null)
        setUsers(usersRes.data || [])
        setProducts(productsRes.data?.items || [])
        setRooms((roomsRes.data?.items || []).slice(0, 3))
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// root session</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Admin Overview</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Platform health and management console.</p>
      </div>

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
            <StatCard label="Total Users" value={Number(totalUsers).toLocaleString()} sub="All time" icon={Users} color="var(--accent)" />
            <StatCard label="Active Users" value={Number(activeUsers).toLocaleString()} sub="Last 24h" icon={Activity} color="var(--accent)" />
            <StatCard label="Market Items" value={Number(products.length).toLocaleString()} sub="Live listings" icon={ShoppingBag} color="var(--accent)" />
            <StatCard label="Free Resources" value={Number(contentCount).toLocaleString()} sub="Uploaded PDFs" icon={FileText} color="var(--accent)" />
          </>
        )}
      </div>

      {/* Rooms preview */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Layers size={16} className="text-accent" /> Learn Rooms
          </h3>
          <Link to="/admin/rooms" className="text-xs text-accent hover:underline flex items-center gap-1">
            Manage rooms <ArrowRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-[var(--border)]">
                <Skeleton className="h-28 w-full rounded-none" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <Layers size={28} className="text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">No rooms created yet.</p>
            <Link to="/admin/rooms" className="btn-secondary text-xs">Create your first room</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rooms.map((room) => (
              <Link
                key={room._id}
                to="/admin/rooms"
                className="group rounded-xl overflow-hidden border border-[var(--border)] hover:border-accent/40 transition-all duration-200 hover:shadow-md"
              >
                {room.coverImage ? (
                  <div className="h-28 overflow-hidden bg-[var(--bg-secondary)]">
                    <img
                      src={resolveImageUrl(room.coverImage)}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-28 bg-accent/8 flex items-center justify-center">
                    <Layers size={28} className="text-accent/40" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{room.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{room.level || 'Beginner'}</span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">·</span>
                    <span className={`text-[10px] font-mono ${room.isActive ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
                      {room.isActive ? '● Active' : '○ Hidden'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

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
                  <p className="text-xs text-[var(--text-muted)]">{u.role} · {Number(u.cpPoints || 0).toLocaleString()} CP</p>
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
            <Link to="/admin/security-events" className="text-xs text-accent hover:underline">View all →</Link>
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
              <p className="text-sm text-[var(--text-secondary)]">No recent events.</p>
            ) : events.map((ev, i) => (
              <div key={ev.id || i} className="flex items-start gap-3 p-2.5 rounded-xl">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${Number(ev.statusCode || 0) >= 400 ? 'bg-red-500' : 'bg-[var(--primary-60)]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">
                    {ev.action || 'event'}{ev.path ? <span className="text-[var(--text-muted)]"> {ev.path}</span> : null}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                    {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
