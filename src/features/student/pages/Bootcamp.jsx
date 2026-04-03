import { Zap } from 'lucide-react'
import { Card, Button } from '@/shared/components/ui'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentService } from '@/core/services'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { useAuth } from '@/core/contexts/AuthContext'

export default function BootcampPage() {
  const [overview, setOverview] = useState(null)
  const [bootcamps, setBootcamps] = useState([])
  const [enrollingId, setEnrollingId] = useState('')
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [res, bootcampsRes] = await Promise.all([
          studentService.getOverview(),
          api.get('/public/bootcamps'),
        ])
        if (!mounted) return
        const nextOverview = res.data || null
        setOverview(nextOverview)
        if (nextOverview) {
          updateUser({
            bootcampStatus: nextOverview.bootcampStatus,
            bootcampPaymentStatus: nextOverview.bootcampPaymentStatus,
            bootcampId: nextOverview.bootcampId,
          })
        }
        setBootcamps(bootcampsRes.data?.items || [])
      } catch {
        setOverview(null)
        setBootcamps([])
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  const bootcampStatus = overview?.bootcampStatus || user?.bootcampStatus || 'not_enrolled'
  const currentBootcampId = useMemo(() => {
    if (overview?.bootcampId) return overview.bootcampId
    if (user?.bootcampId) return user.bootcampId
    if (bootcampStatus !== 'not_enrolled' && bootcamps.length > 0) return bootcamps[0].id
    return ''
  }, [overview?.bootcampId, user?.bootcampId, bootcampStatus, bootcamps])

  const handleEnroll = async (bootcampId) => {
    setEnrollingId(bootcampId)
    try {
      const res = await studentService.enrollBootcamp({ bootcampId })
      const nextOverview = {
        ...(overview || {}),
        bootcampStatus: res.data?.bootcampStatus || 'enrolled',
        bootcampPaymentStatus: res.data?.bootcampPaymentStatus || 'unpaid',
        bootcampId: res.data?.bootcampId || bootcampId,
      }
      setOverview(nextOverview)
      updateUser({
        bootcampStatus: nextOverview.bootcampStatus,
        bootcampPaymentStatus: nextOverview.bootcampPaymentStatus,
        bootcampId: nextOverview.bootcampId,
      })
      toast({ type: 'success', message: 'Enrollment confirmed.' })
      navigate(`/bootcamp/${bootcampId}`)
    } catch (err) {
      toast({ type: 'error', message: err?.response?.data?.error || 'Enrollment failed.' })
    } finally {
      setEnrollingId('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// training program</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamp</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Choose a bootcamp and enroll to unlock modules.</p>
      </div>

      {/* Bootcamp Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bootcamps.length === 0 ? (
          <Card className="p-6 text-center md:col-span-2">
            <Zap size={28} className="text-accent/50 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Bootcamps will appear here soon.</p>
          </Card>
        ) : (
          bootcamps.map((item) => {
            const isEnrolled = bootcampStatus !== 'not_enrolled'
            const isCurrent = isEnrolled && currentBootcampId === item.id
            const isOther = isEnrolled && currentBootcampId && currentBootcampId !== item.id
            return (
              <Card key={item.id} className="p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description || 'Bootcamp track built for real-world mastery.'}</p>
                </div>
                {item.priceLabel && (
                  <span className="text-xs font-mono uppercase tracking-widest text-accent">{item.priceLabel}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
              </div>
              {isCurrent ? (
                <Button
                  variant="primary"
                  className="mt-auto justify-center"
                  onClick={() => navigate(`/bootcamp/${item.id}`)}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant={isOther ? 'outline' : 'primary'}
                  className="mt-auto justify-center"
                  disabled={isOther || enrollingId === item.id}
                  loading={enrollingId === item.id}
                  onClick={() => handleEnroll(item.id)}
                >
                  {isOther ? 'Enrolled Elsewhere' : 'I am enrolled'}
                </Button>
              )}
            </Card>
            )
          })
        )}
      </div>

      {bootcampStatus !== 'not_enrolled' && currentBootcampId && (
        <Card className="p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Current bootcamp</p>
            <p className="font-display font-semibold text-lg text-[var(--text-primary)]">
              {bootcamps.find((item) => item.id === currentBootcampId)?.title || 'Bootcamp'}
            </p>
          </div>
          <Button
            variant="primary"
            className="justify-center"
            onClick={() => navigate(`/bootcamp/${currentBootcampId}`)}
          >
            Continue
          </Button>
        </Card>
      )}
    </div>
  )
}
