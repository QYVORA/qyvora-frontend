import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen, Layers, ShoppingBag, Wallet, ArrowRight,
  Clock, CheckCircle2, Zap, Target, TrendingUp, Flame,
} from 'lucide-react'
import { useAuth } from '@/core/contexts/AuthContext'
import { profileService, studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'
import { Skeleton } from '@/shared/components/ui'

/* ── Stat pill ── */
function StatPill({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[var(--surface-1)] border border-[var(--border)]">
      <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ background: accent ? 'rgba(136,173,124,0.12)' : 'rgba(238,244,236,0.06)' }}>
        <Icon size={13} className={accent ? 'text-accent' : 'text-[var(--text-muted)]'} />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-none">{label}</p>
        <p className="font-mono font-bold text-sm text-[var(--text-primary)] mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}

/* ── Content card ── */
function ContentCard({ item, type, enrolledHere }) {
  const cover = type === 'bootcamp'
    ? (resolveImageUrl(item.image) || PHASE_IMGS[0])
    : resolveImageUrl(item.coverImage)

  const to = type === 'bootcamp'
    ? (enrolledHere ? `/bootcamp/${item.id}` : `/bootcamp?bootcampId=${encodeURIComponent(item.id)}`)
    : `/learn/rooms/${item.slug}`

  return (
    <Link
      to={to}
      className="group flex gap-3 items-start p-3 hover:bg-[var(--bg-secondary)] transition-colors duration-150"
    >
      {/* Thumbnail */}
      <div className="w-16 h-12 shrink-0 overflow-hidden bg-[var(--surface-2)]">
        {cover
          ? <img src={cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
          : <div className="w-full h-full flex items-center justify-center"><Layers size={16} className="text-[var(--text-muted)]" /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-mono font-bold text-xs text-[var(--text-primary)] line-clamp-1 leading-snug">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          {type === 'room' && item.estimatedMinutes && (
            <span className="font-mono text-[9px] text-[var(--text-muted)] flex items-center gap-0.5">
              <Clock size={8} />{item.estimatedMinutes}m
            </span>
          )}
          {type === 'room' && item.completed && <CheckCircle2 size={10} className="text-accent" />}
          {type === 'bootcamp' && (
            <span className="font-mono text-[9px] text-accent uppercase tracking-wide">
              {enrolledHere ? 'Active' : item.level || 'Beginner'}
            </span>
          )}
        </div>
      </div>

      <ArrowRight size={12} className="text-[var(--text-muted)] group-hover:text-accent shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

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
  const streak = profile?.streak ?? 0

  const progressPercent = useMemo(() => {
    const raw = overview?.snapshot?.find(s => s.id === 'progress')?.value || '0%'
    return Number(String(raw).replace('%', '')) || 0
  }, [overview])

  const currentModuleTitle = overview?.progressMeta?.currentPhase?.title || null
  const enrolledBootcamp = useMemo(() => {
    if (!overview?.bootcampId) return null
    return bootcamps.find(b => String(b.id) === String(overview.bootcampId)) || null
  }, [overview?.bootcampId, bootcamps])

  const primaryTo = isEnrolled && overview?.bootcampId ? `/bootcamp/${overview.bootcampId}` : '/bootcamp'

  if (loading) {
    return (
      <div className="py-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 pb-24 sm:pb-8 space-y-5">

      {/* ── Mission header ── */}
      <div className="relative overflow-hidden bg-[var(--surface-1)] border border-[var(--border)]">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Accent glow */}
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(136,173,124,0.08) 0%, transparent 70%)' }} />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <h1 className="font-mono font-black text-xl sm:text-2xl text-[var(--text-primary)] leading-tight">
                {displayName || 'Operator'}
                <span className="text-[var(--text-muted)] font-normal text-base ml-2">/ {rankLabel}</span>
              </h1>
              {isEnrolled && (currentModuleTitle || enrolledBootcamp?.title) && (
                <p className="font-mono text-xs text-[var(--text-secondary)] mt-1.5">
                  {currentModuleTitle ? `↳ ${currentModuleTitle}` : `↳ ${enrolledBootcamp?.title}`}
                  {progressPercent > 0 && <span className="text-accent ml-2">{progressPercent}% complete</span>}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/10 border border-orange-500/20">
                  <Flame size={11} className="text-orange-400" />
                  <span className="font-mono text-[10px] text-orange-400 uppercase tracking-wide">{streak}d streak</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/10 border border-accent/20">
                <Zap size={11} className="text-accent" />
                <span className="font-mono text-[10px] text-accent uppercase tracking-wide">{Number(totalCp).toLocaleString()} CP</span>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <Link
            to={primaryTo}
            className="group mt-4 flex items-center justify-between gap-3 px-4 py-3 bg-accent text-black hover:bg-[#9ec492] transition-colors duration-150"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen size={15} />
              <span className="font-mono font-bold text-sm uppercase tracking-wide">
                {isEnrolled ? 'Continue Learning' : 'Start a Bootcamp'}
              </span>
            </div>
            {isEnrolled && progressPercent > 0 && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-20 h-1 bg-black/20 overflow-hidden">
                  <div className="h-full bg-black/50" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="font-mono text-xs font-bold">{progressPercent}%</span>
              </div>
            )}
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatPill icon={Target} label="Rank" value={rankLabel} accent />
        <StatPill icon={Zap} label="CP Balance" value={`${Number(totalCp).toLocaleString()} CP`} accent />
        <StatPill icon={TrendingUp} label="Progress" value={progressPercent > 0 ? `${progressPercent}%` : 'Not started'} />
        <StatPill icon={BookOpen} label="Status" value={isEnrolled ? 'Enrolled' : 'Not enrolled'} />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — bootcamps + rooms (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">

          {/* Bootcamps */}
          <div className="bg-[var(--surface-1)] border border-[var(--border)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <BookOpen size={13} className="text-accent" />
                <span className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-widest">Bootcamps</span>
              </div>
              <Link to="/bootcamp" className="font-mono text-[10px] text-[var(--text-muted)] hover:text-accent transition-colors uppercase tracking-widest">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {bootcamps.length === 0
                ? <p className="font-mono text-xs text-[var(--text-muted)] p-4">No bootcamps available yet.</p>
                : bootcamps.slice(0, 4).map((item, i) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    type="bootcamp"
                    enrolledHere={isEnrolled && overview?.bootcampId && String(overview.bootcampId) === String(item.id)}
                  />
                ))
              }
            </div>
          </div>

          {/* Rooms */}
          <div className="bg-[var(--surface-1)] border border-[var(--border)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Layers size={13} className="text-accent" />
                <span className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-widest">Rooms</span>
              </div>
              <Link to="/learn/rooms" className="font-mono text-[10px] text-[var(--text-muted)] hover:text-accent transition-colors uppercase tracking-widest">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {rooms.length === 0
                ? <p className="font-mono text-xs text-[var(--text-muted)] p-4">No rooms available yet.</p>
                : rooms.slice(0, 5).map((room) => (
                  <ContentCard key={room.slug} item={room} type="room" />
                ))
              }
            </div>
          </div>
        </div>

        {/* Right — quick actions (1/3 width) */}
        <div className="space-y-4">

          {/* Quick actions */}
          <div className="bg-[var(--surface-1)] border border-[var(--border)]">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <span className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-widest">Quick Access</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {[
                { to: '/wallet', icon: Wallet, label: 'CP Wallet', sub: `${Number(totalCp).toLocaleString()} CP` },
                { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace', sub: 'Spend your CP' },
                { to: '/learn', icon: Layers, label: 'Learn', sub: 'Rooms & content' },
              ].map(({ to, icon: Icon, label, sub }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="w-7 h-7 bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-[var(--text-primary)]">{label}</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)]">{sub}</p>
                  </div>
                  <ArrowRight size={11} className="text-[var(--text-muted)] group-hover:text-accent transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Rank card */}
          <div className="bg-[var(--surface-1)] border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--text-primary)] uppercase tracking-widest">Rank</span>
              <span className="font-mono text-xs text-accent">{rankLabel}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: totalCp > 0 ? `${Math.min((totalCp / 1000) * 100, 100)}%` : '0%' }} />
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{Number(totalCp).toLocaleString()} CP</span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">1,000 CP next</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
