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
import { OnboardingWelcomeCard } from '@/features/student/components/onboarding/OnboardingWelcomeCard'
import { OnboardingTour } from '@/features/student/components/onboarding/OnboardingTour'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'
import { Card, Skeleton } from '@/shared/components/ui'

export default function StudentDashboard() {
  const { user: sessionUser, updateUser } = useAuth()
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [overview, setOverview] = useState(null)
  const [balance, setBalance] = useState(null)
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
        const [profileRes, overviewRes, balanceRes, bootcampsRes] = await Promise.all([
          profileService.getProfile(),
          studentService.getOverview(),
          cpService.getBalance(),
          api.get('/public/bootcamps'),
        ])
        if (!mounted) return
        setProfile(profileRes.data || null)
        setOverview(overviewRes.data || null)
        setBalance(balanceRes.data || null)
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-1 gap-10 justify-center">
          {bootcamps.map((item, i) => {
            const accent = 'var(--accent)'
            const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
            const isEnrolledHere =
              (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'
              && overview?.bootcampId
              && String(overview.bootcampId) === String(item.id)
            return (
              <div
                key={item.id}
                className="card overflow-hidden flex flex-col lg:flex-row group cursor-default hover:shadow-2xl transition-all duration-400 w-full max-w-5xl mx-auto"
                style={{ borderColor: `${accent}35`, borderRadius: '18px' }}
              >
                <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0">
                  <img
                    src={cover}
                    alt={item.title || 'Bootcamp'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-widest border"
                    style={{
                      color: accent,
                      borderColor: `${accent}50`,
                      background: `${accent}15`,
                    }}
                  >
                    BOOTCAMP
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-3">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                    {item.description || 'Curated offensive security track built for real-world mastery.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                    {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                    {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
                    {item.priceLabel && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.priceLabel}</span>}
                  </div>
                  {isEnrolledHere ? (
                    <a href={`/bootcamp/${item.id}`} className="btn-primary mt-5 inline-flex items-center justify-center">Continue</a>
                  ) : (
                    <a href={`/bootcamp?bootcampId=${encodeURIComponent(item.id)}`} className="btn-primary mt-5 inline-flex items-center justify-center">Enroll</a>
                  )}
                </div>
              </div>
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
      <RankProgressCard cp={totalCp} rankLabel={rankLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickLinks user={profile || sessionUser} />
      </div>

      {hasActiveModule && bootcampSection}
      <div className="h-24 sm:h-0" />
    </div>
  )
}
