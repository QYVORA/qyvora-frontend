import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, Lock, ShieldCheck, Wallet, Zap } from 'lucide-react'
import { Card, Badge, ProgressBar, Button, Skeleton } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'

export default function BootcampDashboard() {
  const { bootcampId } = useParams()
  const isSameId = (a, b) => String(a || '') === String(b || '')
  const [bootcamp, setBootcamp] = useState(null)
  const [overview, setOverview] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessError, setAccessError] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.enrolled) {
      toast({ type: 'success', message: 'Bootcamp registration successful.' })
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state, navigate, toast])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setAccessError('')
      try {
        const [bootcampsRes, overviewRes, progressRes] = await Promise.allSettled([
          api.get('/public/bootcamps'),
          studentService.getOverview(),
          studentService.getCourseProgress({ bootcampId }),
        ])
        if (!mounted) return
        if (bootcampsRes.status === 'fulfilled') {
          const items = bootcampsRes.value?.data?.items || []
          setBootcamp(items.find((item) => isSameId(item.id, bootcampId)) || null)
        }
        if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value?.data || null)
        if (progressRes.status === 'fulfilled') {
          setProgress(progressRes.value?.data || null)
        } else {
          setAccessError(progressRes.reason?.response?.data?.error || 'Bootcamp access required to view modules.')
          setProgress(null)
        }
      } catch {
        toast({ type: 'error', message: 'Failed to load bootcamp dashboard.' })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [bootcampId, toast])

  const statusBadge = useMemo(() => {
    const status = overview?.bootcampStatus || 'not_enrolled'
    if (status === 'completed') return { label: 'Completed', variant: 'success' }
    if (status === 'active' || status === 'enrolled') return { label: 'Enrolled', variant: 'accent' }
    return { label: 'Not Enrolled', variant: 'default' }
  }, [overview?.bootcampStatus])

  const paymentBadge = useMemo(() => {
    const label = String(bootcamp?.priceLabel || '').toLowerCase()
    if (label && label.includes('free')) return { label: 'Free', variant: 'success' }
    const status = overview?.bootcampPaymentStatus || 'unpaid'
    if (status === 'paid') return { label: 'Paid', variant: 'success' }
    if (status === 'pending') return { label: 'Pending', variant: 'warning' }
    return { label: 'Unpaid', variant: 'danger' }
  }, [bootcamp?.priceLabel, overview?.bootcampPaymentStatus])

  const isEnrolled = (overview?.bootcampStatus || 'not_enrolled') !== 'not_enrolled'
  const modules = progress?.modules || []
  const overallPercent = Number(String(progress?.overall || '0%').replace('%', '')) || 0

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{bootcamp?.title || 'Bootcamp'}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{bootcamp?.description || 'Your bootcamp modules and rooms.'}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {!isEnrolled && bootcampId && (
            <Button variant="primary" onClick={() => navigate(`/bootcamp?bootcampId=${encodeURIComponent(bootcampId)}`)}>
              Enroll
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate('/bootcamp')}>
            <ChevronLeft size={16} /> Bootcamps
          </Button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0"><ShieldCheck size={20} /></div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Status</p>
            <div className="mt-1"><Badge variant={statusBadge.variant}>{statusBadge.label}</Badge></div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0"><Wallet size={20} /></div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Payment</p>
            <div className="mt-1"><Badge variant={paymentBadge.variant}>{paymentBadge.label}</Badge></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0"><Zap size={20} /></div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Progress</p>
              <p className="font-display font-bold text-lg text-[var(--text-primary)]">{overallPercent}%</p>
            </div>
          </div>
          <ProgressBar value={overallPercent} max={100} color="var(--accent)" showPercent />
        </Card>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Modules</h2>
          {modules.length > 0 && (
            <span className="text-xs font-mono text-[var(--text-muted)]">· {modules.length}</span>
          )}
        </div>

        {!isEnrolled ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">
            Enroll in this bootcamp to unlock modules.
          </Card>
        ) : accessError ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">{accessError}</Card>
        ) : modules.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">No modules available yet.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => {
              const modulePercent = Number(module.progress || 0)
              const isLocked = module.locked
              return (
                <Card
                  key={module.id}
                  className={`p-5 flex flex-col gap-3 ${isLocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-mono uppercase tracking-widest text-accent">Module {module.id}</p>
                      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] leading-snug">{module.title}</h3>
                    </div>
                    {isLocked ? (
                      <Lock size={16} className="text-[var(--text-muted)] shrink-0 mt-1" />
                    ) : (
                      <Badge variant={modulePercent >= 100 ? 'success' : 'accent'}>{modulePercent}%</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <ProgressBar value={modulePercent} max={100} color="var(--accent)" />
                    <p className="text-xs text-[var(--text-muted)]">
                      {isLocked ? 'Locked — admin needs to unlock this module' : `${module.roomsCompleted || 0} / ${module.roomsTotal || 0} rooms completed`}
                    </p>
                  </div>
                  <Button
                    variant={isLocked ? 'outline' : 'primary'}
                    className="w-full justify-center mt-auto"
                    disabled={isLocked}
                    onClick={() => !isLocked && navigate(`/bootcamp/${bootcampId}/modules/${module.id}`)}
                  >
                    {isLocked ? <><Lock size={14} /> Locked</> : 'Open Module'}
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
