import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Layers, ShoppingBag, Wallet, User, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { profileService, studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { DashboardHeader } from '@/features/student/components/dashboard/DashboardHeader'
import { RankProgressCard } from '@/features/student/components/dashboard/RankProgressCard'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'
import { Skeleton } from '@/shared/components/ui'

export default function StudentDashboard() {
  const { user: sessionUser, updateUser } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [bootcamps, setBootcamps] = useState([])
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const paymentResult = location.state?.paymentResult
    if (paymentResult?.status === 'success') {
      toast({ type: 'success', message: 'Payment verified. Bootcamp access unlocked.' })
      navigate('/dashboard', { replace: true, state: {} })
    }
    if (paymentResult?.status === 'error') {
      toast({ type: 'error', message: paymentResult.message || 'Payment verification failed.' })
      navigate('/dashboard', { replace: true, state: {} })
    }
  }, [location.state, navigate, toast])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [profileRes, overviewRes, bootcampsRes, roomsRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          api.get('/public/bootcamps'),
          studentService.getRooms(),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setBootcamps(Array.isArray(bootcampsRes.data?.items) ? bootcampsRes.data.items : [])
        setRooms(Array.isArray(roomsRes.data?.items) ? roomsRes.data.items : [])
        if (profileRes.data) updateUser(profileRes.data)
      } catch { /* ignore */ }
      finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const displayName = profile?.hackerHandle || profile?.name || profile?.email || sessionUser?.hackerHandle || sessionUser?.name
  const totalCp = profile?.cpPoints ?? 0
  const rankLabel = profile?.xpSummary?.rank || 'Operator'
  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'

  const quickLinks = useMemo(() => [
    { to: isEnrolled && overview?.bootcampId ? `/bootcamp/${overview.bootcampId}` : '/bootcamp', label: isEnrolled ? 'Continue' : 'Bootcamp', icon: BookOpen },
    { to: '/learn/rooms', label: 'Rooms', icon: Layers },
    { to: '/marketplace', label: 'Market', icon: ShoppingBag },
    { to: '/wallet', label: `${Number(totalCp).toLocaleString()} CP`, icon: Wallet },
    { to: '/profile', label: 'Profile', icon: User },
  ], [isEnrolled, overview?.bootcampId, totalCp])

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6 pb-24 sm:pb-8">
      <DashboardHeader displayName={displayName} />

      {/* Quick links — no borders, flat */}
      <div className="grid grid-cols-5 gap-2">
        {quickLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1.5 py-3 px-1 hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <div className="w-9 h-9 bg-accent/10 flex items-center justify-center text-accent">
              <Icon size={16} />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* Bootcamps + Rooms — single container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// training</p>
          <div className="flex items-center gap-4">
            <Link to="/bootcamp" className="text-[10px] font-mono text-accent hover:underline">Bootcamps</Link>
            <Link to="/learn/rooms" className="text-[10px] font-mono text-accent hover:underline">Rooms</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Bootcamp cards first */}
          {bootcamps.slice(0, 3).map((item, i) => {
            const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
            const enrolledHere = isEnrolled && overview?.bootcampId && String(overview.bootcampId) === String(item.id)
            return (
              <Link
                key={item.id}
                to={enrolledHere ? `/bootcamp/${item.id}` : `/bootcamp?bootcampId=${encodeURIComponent(item.id)}`}
                className="group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <div className="h-24 overflow-hidden">
                  <img src={cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" decoding="async" />
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center gap-1">
                    <BookOpen size={10} className="text-accent shrink-0" />
                    <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Bootcamp</span>
                  </div>
                  <p className="font-mono font-bold text-xs text-[var(--text-primary)] line-clamp-1">{item.title}</p>
                  <p className="font-mono text-[9px] text-accent uppercase">{enrolledHere ? 'Continue →' : 'Enroll →'}</p>
                </div>
              </Link>
            )
          })}

          {/* Room cards */}
          {rooms.slice(0, 5).map((room) => {
            const cover = resolveImageUrl(room.coverImage)
            return (
              <Link
                key={room.slug}
                to={`/learn/rooms/${room.slug}`}
                className="group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <div className="h-24 overflow-hidden bg-[var(--bg-secondary)]">
                  {cover
                    ? <img src={cover} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" loading="lazy" decoding="async" />
                    : <div className="w-full h-full flex items-center justify-center"><Layers size={20} className="text-[var(--text-muted)]" /></div>
                  }
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <Layers size={10} className="text-accent shrink-0" />
                      <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Room</span>
                    </div>
                    {room.completed && <CheckCircle2 size={11} className="text-accent shrink-0" />}
                  </div>
                  <p className="font-mono font-bold text-xs text-[var(--text-primary)] line-clamp-1">{room.title}</p>
                  {room.estimatedMinutes
                    ? <p className="font-mono text-[9px] text-[var(--text-muted)] flex items-center gap-1"><Clock size={9} />{room.estimatedMinutes} min</p>
                    : null}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <RankProgressCard cp={totalCp} rankLabel={rankLabel} />
    </div>
  )
}
