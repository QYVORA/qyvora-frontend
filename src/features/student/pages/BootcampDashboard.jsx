import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ShieldCheck, Wallet, Zap } from 'lucide-react'
import { Card, Badge, ProgressBar, Button } from '@/shared/components/ui'
import { studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'

export default function BootcampDashboard() {
  const { bootcampId } = useParams()
  const [bootcamp, setBootcamp] = useState(null)
  const [overview, setOverview] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessError, setAccessError] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()

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
          setBootcamp(items.find((item) => item.id === bootcampId) || null)
        }

        if (overviewRes.status === 'fulfilled') {
          setOverview(overviewRes.value?.data || null)
        }

        if (progressRes.status === 'fulfilled') {
          setProgress(progressRes.value?.data || null)
        } else {
          const apiMessage = progressRes.reason?.response?.data?.error
          setAccessError(apiMessage || 'Bootcamp access is required to view modules.')
          setProgress(null)
        }
      } catch (err) {
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
    const status = overview?.bootcampPaymentStatus || 'unpaid'
    if (status === 'paid') return { label: 'Paid', variant: 'success' }
    if (status === 'pending') return { label: 'Pending', variant: 'warning' }
    return { label: 'Unpaid', variant: 'danger' }
  }, [overview?.bootcampPaymentStatus])

  const modules = progress?.modules || []
  const overallProgress = progress?.overall || '0%'

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 text-sm text-[var(--text-secondary)]">Loading bootcamp dashboard...</Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// bootcamp dashboard</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{bootcamp?.title || 'Bootcamp'}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{bootcamp?.description || 'Your bootcamp modules and rooms live here.'}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/bootcamp')}>Back to bootcamps</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Status</p>
            <div className="mt-1">
              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Payment</p>
            <div className="mt-1">
              <Badge variant={paymentBadge.variant}>{paymentBadge.label}</Badge>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Progress</p>
              <p className="font-display font-bold text-lg text-[var(--text-primary)]">{overallProgress}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={Number(String(overallProgress).replace('%', '')) || 0} max={100} color="#0EA5E9" showPercent />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Modules</h2>
        </div>

        {accessError ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">
            {accessError}
          </Card>
        ) : modules.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">No modules available yet.</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <Card key={module.id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-accent">Module {module.id}</p>
                    <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{module.title}</h3>
                  </div>
                  <Badge variant={module.progress >= 100 ? 'success' : 'accent'}>{module.progress}%</Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">Rooms completed: {module.roomsCompleted}/{module.roomsTotal}</p>
                <div className="mt-auto">
                  <Button
                    variant={module.locked ? 'outline' : 'primary'}
                    className="w-full justify-center"
                    disabled={module.locked}
                    onClick={() => !module.locked && navigate(`/bootcamp/${bootcampId}/modules/${module.id}`)}
                  >
                    {module.locked ? 'Locked' : 'Open Module'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
