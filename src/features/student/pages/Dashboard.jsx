import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { profileService, studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { DashboardHeader } from '@/features/student/components/dashboard/DashboardHeader'
import { PhaseProgressCard } from '@/features/student/components/dashboard/PhaseProgressCard'
import { RankProgressCard } from '@/features/student/components/dashboard/RankProgressCard'
import { QuickLinks } from '@/features/student/components/dashboard/QuickLinks'
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
        const [profileRes, overviewRes, bootcampsRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          api.get('/public/bootcamps'),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setBootcamps(bootcampsRes.data?.items || [])
        if (profileRes.data) updateUser(profileRes.data)
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const displayName = profile?.hackerHandle || profile?.name || profile?.email || sessionUser?.hackerHandle || sessionUser?.name
  const totalCp = profile?.cpPoints ?? 0
  const rankLabel = profile?.xpSummary?.rank || 'Operator'
  const currentModule = useMemo(() => {
    return overview?.progressMeta?.currentPhase
      ? { title: overview.progressMeta.currentPhase.title, status: 'in-progress' }
      : null
  }, [overview?.progressMeta?.currentPhase])
  const hasActiveModule = Boolean(currentModule?.title)

  const currentBootcamp = useMemo(() => {
    const bootcampId = overview?.bootcampId
    if (!bootcampId) return null
    return bootcamps.find((item) => item.id === bootcampId) || null
  }, [overview?.bootcampId, bootcamps])

  const progressSnapshot = overview?.snapshot?.find((s) => s.id === 'progress')?.value || '0%'
  const progressPercent = Number(String(progressSnapshot).replace('%', '')) || 0

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Card className="space-y-4 p-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-10 w-40" />
        </Card>
        <Card className="p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-24" />
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const bootcampSection = (
    <div className="space-y-4 pb-24 sm:pb-4">
      <h3 className="font-semibold text-[var(--text-primary)] text-sm font-mono uppercase tracking-widest">Learning Hub</h3>

      {/* Mini cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Rooms card */}
        <Link to="/learn/rooms" className="card group p-4 flex flex-col gap-3 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-8 h-8 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <p className="font-mono font-bold text-xs text-[var(--text-primary)]">Rooms</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">Self-paced labs</p>
          </div>
        </Link>

        {/* Bootcamp card */}
        <Link to="/bootcamp" className="card group p-4 flex flex-col gap-3 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-8 h-8 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <p className="font-mono font-bold text-xs text-[var(--text-primary)]">Bootcamps</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">Structured tracks</p>
          </div>
        </Link>

        {/* Marketplace card */}
        <Link to="/marketplace" className="card group p-4 flex flex-col gap-3 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-8 h-8 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div>
            <p className="font-mono font-bold text-xs text-[var(--text-primary)]">Marketplace</p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">Spend your CP</p>
          </div>
        </Link>

        {/* Wallet card */}
        <Link to="/wallet" className="card group p-4 flex flex-col gap-3 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-8 h-8 border border-accent/30 bg-accent/8 flex items-center justify-center text-accent shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          </div>
          <div>
            <p className="font-mono font-bold text-xs text-[var(--text-primary)]">CP Wallet</p>
            <p className="font-mono text-[10px] text-accent mt-0.5">{Number(totalCp).toLocaleString()} CP</p>
          </div>
        </Link>
      </div>

      {/* Bootcamp list — compact */}
      {bootcamps.length > 0 && (
        <div className="space-y-3 mt-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// available bootcamps</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bootcamps.map((item, i) => {
              const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
              const isEnrolledHere =
                (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'
                && overview?.bootcampId
                && String(overview.bootcampId) === String(item.id)
              return (
                <div key={item.id} className="card group flex gap-0 overflow-hidden hover:border-accent/50 transition-all duration-200">
                  <div className="relative w-24 shrink-0 overflow-hidden">
                    <img src={cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                  </div>
                  <div className="flex flex-col gap-1.5 p-3 flex-1 min-w-0">
                    <p className="font-mono font-bold text-xs text-[var(--text-primary)] truncate">{item.title}</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] truncate">{item.level || 'Beginner'} {item.duration ? `· ${item.duration}` : ''}</p>
                    {isEnrolledHere ? (
                      <Link to={`/bootcamp/${item.id}`} className="btn-primary text-[10px] px-2 py-1 mt-auto w-fit">Continue</Link>
                    ) : (
                      <Link to={`/bootcamp?bootcampId=${encodeURIComponent(item.id)}`} className="btn-primary text-[10px] px-2 py-1 mt-auto w-fit">Enroll</Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-0">
      <DashboardHeader displayName={displayName} rankLabel={rankLabel} />
      {!hasActiveModule && bootcampSection}
      <PhaseProgressCard
        currentModule={currentModule}
        progressPercent={progressPercent}
        bootcampTitle={currentBootcamp?.title}
        bootcampImage={currentBootcamp?.image ? resolveImageUrl(currentBootcamp.image) : ''}
        isEnrolled={(overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'}
      />
      <RankProgressCard cp={totalCp} rankLabel={rankLabel} />
      <QuickLinks user={profile || sessionUser} />
      {hasActiveModule && bootcampSection}
      <div className="h-24 sm:h-0" />
    </div>
  )
}
