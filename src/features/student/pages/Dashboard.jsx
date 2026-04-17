import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layers, ShoppingBag, Wallet, User, Clock, CheckCircle2 } from 'lucide-react'
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

  // Progress data for header
  const progressPercent = useMemo(() => {
    const raw = overview?.snapshot?.find(s => s.id === 'progress')?.value || '0%'
    return Number(String(raw).replace('%', '')) || 0
  }, [overview])

  const currentModuleTitle = overview?.progressMeta?.currentPhase?.title || null
  const enrolledBootcamp = useMemo(() => {
    if (!overview?.bootcampId) return null
    return bootcamps.find(b => String(b.id) === String(overview.bootcampId)) || null
  }, [overview?.bootcampId, bootcamps])

  // Momentum signals — derived from available data
  const streak = profile?.streak ?? 0
  const aheadPercent = progressPercent > 30 ? Math.min(Math.round(progressPercent * 0.8), 85) : 0

  // Secondary quick links (bootcamp is now in header as primary CTA)
  const secondaryLinks = useMemo(() => [
    { to: '/learn/rooms', label: 'Rooms', icon: Layers },
    { to: '/marketplace', label: 'Market', icon: ShoppingBag },
    { to: '/wallet', label: `${Number(totalCp).toLocaleString()} CP`, icon: Wallet },
    { to: '/profile', label: 'Profile', icon: User },
  ], [totalCp])

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6 pb-24 sm:pb-8">

      {/* 1. Progress Hero Header — primary CTA embedded */}
      <DashboardHeader
        displayName={displayName}
        isEnrolled={isEnrolled}
        bootcampId={overview?.bootcampId}
        bootcampTitle={enrolledBootcamp?.title}
        progressPercent={progressPercent}
        currentModuleTitle={currentModuleTitle}
        streak={streak}
        aheadPercent={aheadPercent}
      />

      {/* 2. Secondary quick links — de-emphasised */}
      <div className="grid grid-cols-4 gap-2">
        {secondaryLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1.5 py-3 px-1 hover:bg-[var(--bg-secondary)] active:bg-accent/10 transition-colors"
          >
            <div className="w-8 h-8 bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-accent transition-colors">
              <Icon size={15} />
            </div>
            <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wide text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* 3. Training grid — bootcamps and rooms with subtle grouping */}
      <div className="space-y-5">

        {/* Bootcamps group */}
        {bootcamps.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Bootcamps</span>
              <Link to="/bootcamp" className="font-mono text-[10px] text-accent hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {bootcamps.slice(0, 4).map((item, i) => {
                const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
                const enrolledHere = isEnrolled && overview?.bootcampId && String(overview.bootcampId) === String(item.id)
                return (
                  <Link
                    key={item.id}
                    to={enrolledHere ? `/bootcamp/${item.id}` : `/bootcamp?bootcampId=${encodeURIComponent(item.id)}`}
                    className="group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
                  >
                    <div className="h-24 overflow-hidden">
                      <img src={cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="font-mono font-bold text-xs text-[var(--text-primary)] line-clamp-1">{item.title}</p>
                      <p className="font-mono text-[9px] text-accent uppercase tracking-wide">
                        {enrolledHere ? 'Continue →' : 'Enroll →'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Rooms group */}
        {rooms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Rooms</span>
              <Link to="/learn/rooms" className="font-mono text-[10px] text-accent hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {rooms.slice(0, 4).map((room) => {
                const cover = resolveImageUrl(room.coverImage)
                return (
                  <Link
                    key={room.slug}
                    to={`/learn/rooms/${room.slug}`}
                    className="group overflow-hidden bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
                  >
                    <div className="h-24 overflow-hidden bg-[var(--bg-secondary)]">
                      {cover
                        ? <img src={cover} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                        : <div className="w-full h-full flex items-center justify-center"><Layers size={20} className="text-[var(--text-muted)]" /></div>
                      }
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-mono font-bold text-xs text-[var(--text-primary)] line-clamp-1 flex-1">{room.title}</p>
                        {room.completed && <CheckCircle2 size={11} className="text-accent shrink-0" />}
                      </div>
                      {room.estimatedMinutes
                        ? <p className="font-mono text-[9px] text-[var(--text-muted)] flex items-center gap-1"><Clock size={9} />{room.estimatedMinutes} min</p>
                        : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Rank progress */}
      <RankProgressCard cp={totalCp} rankLabel={rankLabel} />
    </div>
  )
}
