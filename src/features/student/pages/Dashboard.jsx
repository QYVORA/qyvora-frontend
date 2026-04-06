import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { cpService, profileService, studentService } from '@/core/services'
import api, { API_ORIGIN } from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { DashboardHeader } from '@/features/student/components/dashboard/DashboardHeader'
import { PhaseProgressCard } from '@/features/student/components/dashboard/PhaseProgressCard'
import { RankProgressCard } from '@/features/student/components/dashboard/RankProgressCard'
import { QuickLinks } from '@/features/student/components/dashboard/QuickLinks'
import { RecentActivity } from '@/features/student/components/dashboard/RecentActivity'
import { OnboardingWelcomeCard } from '@/features/student/components/onboarding/OnboardingWelcomeCard'
import { OnboardingTour } from '@/features/student/components/onboarding/OnboardingTour'
import { Card, Skeleton } from '@/shared/components/ui'

export default function StudentDashboard() {
  const { user: sessionUser, updateUser } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [xpSummary, setXpSummary] = useState(null)
  const [balance, setBalance] = useState(null)
  const [activity, setActivity] = useState([])
  const [bootcamps, setBootcamps] = useState([])
  const [tourActive, setTourActive] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(false)

  const resolveImageUrl = (value) => {
    const src = String(value || '').trim()
    if (!src) return ''
    if (src.startsWith('data:')) return src
    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('//')) return `${window.location.protocol}${src}`
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src.replace(/^\/+/, '')}`
  }

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
        const [profileRes, overviewRes, xpRes, balanceRes, txRes, bootcampsRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          studentService.getXpSummary(),
          cpService.getBalance(),
          cpService.getTransactions(6),
          api.get('/public/bootcamps'),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setXpSummary(xpRes.data || null)
        setBalance(balanceRes.data || null)
        const items = txRes.data?.items || []
        setActivity(items.map((tx) => ({
          id: tx._id || tx.id,
          label: tx.note || tx.type || 'CP activity',
          time: new Date(tx.createdAt || Date.now()).toLocaleString(),
          points: Number(tx.points || 0),
        })))
        setBootcamps(bootcampsRes.data?.items || [])
        if (profileRes.data) updateUser(profileRes.data)
      } catch {
        // ignore errors for now
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const displayName = profile?.hackerHandle || profile?.name || profile?.email || sessionUser?.hackerHandle || sessionUser?.name
  const totalXp = xpSummary?.totalXp ?? profile?.xpSummary?.totalXp ?? 0
  const rankLabel = xpSummary?.rank || profile?.xpSummary?.rank || 'Operator'
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
  const cpBalance = balance?.balance ?? profile?.cpPoints ?? 0
  const onboardingComplete = onboardingDone || Boolean(overview?.onboarding?.completed || sessionUser?.onboardingCompletedAt)

  useEffect(() => {
    if (!loading && !onboardingComplete) {
      setTourActive(true)
    }
  }, [loading, onboardingComplete])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-10 w-40" />
        </Card>

        <Card className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-4 w-32 mb-3" />
            <Card className="divide-y divide-[var(--border)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const bootcampSection = (
    <div className="space-y-4 pb-24 sm:pb-4" data-tour="bootcamp-cards">
      <h3 className="font-semibold text-[var(--text-primary)]">Available Bootcamps</h3>
      {bootcamps.length === 0 ? (
        <Card className="p-6 text-sm text-[var(--text-secondary)]">No bootcamps available yet.</Card>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 justify-center">
          {bootcamps.map((item) => {
            const isEnrolledHere =
              (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'
              && overview?.bootcampId
              && String(overview.bootcampId) === String(item.id)
            return (
            <Card key={item.id} className="p-0 overflow-hidden flex flex-col md:flex-row w-full max-w-none mx-0">
              {item.image ? (
                <div className="h-32 md:h-auto md:w-48 lg:w-56 w-full overflow-hidden shrink-0">
                  <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : null}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h4 className="font-display font-semibold text-lg text-[var(--text-primary)]">{item.title}</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description || 'Bootcamp track ready for you.'}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                  {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                  {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
                  {item.priceLabel && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.priceLabel}</span>}
                </div>
                <div className="mt-auto">
                  {isEnrolledHere ? (
                    <a href={`/bootcamp/${item.id}`} className="btn-primary w-full justify-center flex">Continue</a>
                  ) : (
                    <a href={`/bootcamp?bootcampId=${encodeURIComponent(item.id)}`} className="btn-primary w-full justify-center flex">Enroll</a>
                  )}
                </div>
              </div>
            </Card>
          )})}
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-0">
      {!loading && !onboardingComplete && (
        <OnboardingWelcomeCard
          onStart={() => setTourActive(true)}
          onSocialClick={(key) => {
            window.dispatchEvent(new CustomEvent('hsociety:onboarding-social', { detail: { key } }))
          }}
        />
      )}
      <OnboardingTour
        active={tourActive && !onboardingComplete}
        onComplete={() => {
          setTourActive(false)
          setOnboardingDone(true)
        }}
      />
      <DashboardHeader displayName={displayName} rankLabel={rankLabel} />
      {!hasActiveModule && bootcampSection}
      <PhaseProgressCard
        currentModule={currentModule}
        progressPercent={progressPercent}
        bootcampTitle={currentBootcamp?.title}
        bootcampImage={currentBootcamp?.image ? resolveImageUrl(currentBootcamp.image) : ''}
        isEnrolled={(overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'}
      />
      <RankProgressCard xp={totalXp} rankLabel={rankLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickLinks user={profile || sessionUser} />
        <RecentActivity items={activity} />
      </div>

      {hasActiveModule && bootcampSection}
      <div className="h-24 sm:h-0" />
    </div>
  )
}
