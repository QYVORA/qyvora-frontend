import { Zap } from 'lucide-react'
import { Card, Button, Spinner } from '@/shared/components/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentService } from '@/core/services'
import api from '@/core/services/api'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { useToast } from '@/core/contexts/ToastContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'

const PENDING_ENROLLMENT_KEY = 'hs_pending_bootcamp_enrollment'
const isSameId = (a, b) => String(a || '') === String(b || '')

export default function BootcampPage() {
  const [overview, setOverview] = useState(null)
  const [bootcamps, setBootcamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState('')
  const [selectedBootcamp, setSelectedBootcamp] = useState(null)
  const [phoneError, setPhoneError] = useState('')
  const [enrollSuccess, setEnrollSuccess] = useState(false)
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    goals: '',
  })
  const [showPayment, setShowPayment] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState('')
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
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
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [updateUser])

  useEffect(() => {
    if (loading || bootcamps.length === 0) return
    const status = overview?.bootcampStatus || user?.bootcampStatus || 'not_enrolled'
    if (status === 'not_enrolled') return
    const raw = localStorage.getItem(PENDING_ENROLLMENT_KEY)
    if (!raw) return
    try {
      const pending = JSON.parse(raw)
      const pendingId = String(pending?.bootcampId || '')
      if (!pendingId) return
      const pendingBootcamp = bootcamps.find((item) => isSameId(item.id, pendingId))
      if (!pendingBootcamp) return
      setSelectedBootcamp(pendingBootcamp)
      setShowPayment(true)
      setEnrollSuccess(true)
      if (pending?.application && typeof pending.application === 'object') {
        setApplication((prev) => ({ ...prev, ...pending.application }))
      }
      toast({ type: 'info', title: 'Payment pending', message: 'Resume your payment to complete enrollment.' })
    } catch {
      localStorage.removeItem(PENDING_ENROLLMENT_KEY)
    }
  }, [bootcamps, loading, overview?.bootcampStatus, user?.bootcampStatus, toast])

  const bootcampStatus = overview?.bootcampStatus || user?.bootcampStatus || 'not_enrolled'
  const currentBootcampId = useMemo(() => {
    if (overview?.bootcampId) return overview.bootcampId
    if (user?.bootcampId) return user.bootcampId
    if (bootcampStatus !== 'not_enrolled' && bootcamps.length > 0) return bootcamps[0].id
    return ''
  }, [overview?.bootcampId, user?.bootcampId, bootcampStatus, bootcamps])

  const isPaidBootcamp = (item) => {
    const label = String(item?.priceLabel || '').toLowerCase()
    return Boolean(label) && !label.includes('free')
  }

  const normalizePhoneDigits = (value) => String(value || '').replace(/\D/g, '')

  const isValidPhone = (value) => {
    const digits = normalizePhoneDigits(value)
    return digits.length >= 7 && digits.length <= 15
  }

  const handleEnroll = async (bootcampId) => {
    const phoneValue = String(application.phone || '').trim()
    if (!isValidPhone(phoneValue)) {
      setPhoneError('Enter a valid phone number with at least 7 digits.')
      toast({ type: 'error', message: 'Please enter a valid phone number to continue.' })
      return
    }

    setEnrollingId(bootcampId)
    try {
      const res = await studentService.enrollBootcamp({
        bootcampId,
        application,
      })
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
      setEnrollSuccess(true)
      toast({ type: 'success', message: 'Bootcamp registration successful.' })
      const bootcamp = bootcamps.find((item) => item.id === bootcampId)
      if (bootcamp && isPaidBootcamp(bootcamp)) {
        localStorage.setItem(PENDING_ENROLLMENT_KEY, JSON.stringify({
          bootcampId,
          application,
          createdAt: Date.now(),
        }))
        setShowPayment(true)
      } else {
        localStorage.removeItem(PENDING_ENROLLMENT_KEY)
        navigate(`/bootcamp/${bootcampId}`, { state: { enrolled: true } })
      }
    } catch (err) {
      localStorage.removeItem(PENDING_ENROLLMENT_KEY)
      toast({ type: 'error', message: err?.response?.data?.error || 'Enrollment failed.' })
    } finally {
      setEnrollingId('')
    }
  }

  const handleStartEnroll = useCallback((item) => {
    setSelectedBootcamp(item)
    setShowPayment(false)
    setPhoneError('')
    setEnrollSuccess(false)
    setApplication({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      experience: '',
      goals: '',
    })
  }, [user?.email, user?.name])

  useEffect(() => {
    const targetId = searchParams.get('bootcampId')
    if (!targetId || loading || bootcamps.length === 0) return
    if (bootcampStatus !== 'not_enrolled') {
      navigate(currentBootcampId ? `/bootcamp/${currentBootcampId}` : '/bootcamp')
      return
    }
    const target = bootcamps.find((item) => isSameId(item.id, targetId))
    if (target && selectedBootcamp?.id !== target.id) {
      handleStartEnroll(target)
    }
  }, [bootcampStatus, bootcamps, currentBootcampId, handleStartEnroll, loading, navigate, searchParams, selectedBootcamp?.id])

  const handlePayment = async (method) => {
    setPaymentLoading(method)
    try {
      const res = await studentService.initializeBootcampPayment({ method })
      const url = res.data?.authorizationUrl
      if (url) {
        localStorage.removeItem(PENDING_ENROLLMENT_KEY)
        window.location.href = url
      } else {
        toast({ type: 'error', message: 'Payment link unavailable.' })
      }
    } catch (err) {
      toast({
        type: 'warning',
        title: 'Payment initialization failed',
        message: `${err?.response?.data?.error || 'Unable to start payment.'} Please retry; your enrollment is saved.`,
      })
    } finally {
      setPaymentLoading('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamp</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Choose a bootcamp and enroll to unlock modules.</p>
      </div>

      {/* Bootcamp Cards */}
      <div className="grid grid-cols-1 gap-8 justify-center">
        {loading ? (
          <Card className="p-6 text-center flex flex-col items-center gap-3">
            <Spinner size={28} />
            <p className="text-sm text-[var(--text-secondary)]">Loading bootcamps...</p>
          </Card>
        ) : bootcamps.length === 0 ? (
          <Card className="p-6 text-center">
            <Zap size={28} className="text-accent/50 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Bootcamps will appear here soon.</p>
          </Card>
        ) : (
          bootcamps.map((item, i) => {
            const isEnrolledHere = bootcampStatus !== 'not_enrolled' && isSameId(currentBootcampId, item.id)
            const accent = 'var(--accent)'
            const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
            return (
                <div
                  key={item.id}
                  className="card overflow-hidden flex flex-col lg:flex-row group cursor-default hover:shadow-2xl transition-all duration-400 w-full max-w-5xl mx-auto min-h-[280px]"
                  style={{ borderColor: `${accent}35`, borderRadius: '18px' }}
                >
                <div className="relative h-56 lg:h-full lg:w-2/5 overflow-hidden shrink-0 self-stretch">
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
                    <Button
                      variant="primary"
                      className="mt-5 inline-flex items-center justify-center"
                      onClick={() => navigate(`/bootcamp/${item.id}`)}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="mt-5 inline-flex items-center justify-center"
                      onClick={() => handleStartEnroll(item)}
                    >
                      Enroll
                    </Button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedBootcamp && (
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                Enroll in {selectedBootcamp.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">Complete your details to continue.</p>
            </div>
            <Button variant="ghost" onClick={() => setSelectedBootcamp(null)}>Close</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input-field"
              placeholder="Full name"
              value={application.name}
              onChange={(e) => setApplication((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Email"
              value={application.email}
              onChange={(e) => setApplication((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Phone"
              value={application.phone}
              onChange={(e) => {
                setPhoneError('')
                setApplication((prev) => ({ ...prev, phone: e.target.value }))
              }}
              onBlur={() => {
                const phoneValue = String(application.phone || '').trim()
                if (phoneValue && !isValidPhone(phoneValue)) {
                  setPhoneError('Enter a valid phone number with at least 7 digits.')
                }
              }}
            />
            <input
              className="input-field"
              placeholder="Experience level (e.g. Beginner)"
              value={application.experience}
              onChange={(e) => setApplication((prev) => ({ ...prev, experience: e.target.value }))}
            />
            {phoneError && (
              <div className="md:col-span-2 text-xs text-accent">{phoneError}</div>
            )}
            <textarea
              className="input-field md:col-span-2 min-h-[110px]"
              placeholder="Your goals / what you want to achieve"
              value={application.goals}
              onChange={(e) => setApplication((prev) => ({ ...prev, goals: e.target.value }))}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              loading={enrollingId === selectedBootcamp.id}
              onClick={() => handleEnroll(selectedBootcamp.id)}
            >
              Submit Enrollment
            </Button>
            <Button variant="ghost" onClick={() => setSelectedBootcamp(null)}>
              Cancel
            </Button>
          </div>

          {enrollSuccess && (
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
              Bootcamp registration successful. Proceed to payment or continue to the bootcamp.
            </div>
          )}

          {showPayment && isPaidBootcamp(selectedBootcamp) && (
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <p className="text-sm text-[var(--text-secondary)]">
                Payment required. Choose a payment method to unlock full access.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  loading={paymentLoading === 'momo'}
                  onClick={() => handlePayment('momo')}
                >
                  Pay with Mobile Money
                </Button>
                <Button
                  variant="secondary"
                  loading={paymentLoading === 'bank'}
                  onClick={() => handlePayment('bank')}
                >
                  Bank Transfer
                </Button>
                <Button
                  variant="outline"
                  loading={paymentLoading === 'card'}
                  onClick={() => handlePayment('card')}
                >
                  Card
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate(`/bootcamp/${selectedBootcamp.id}`)}
              >
                Continue to Bootcamp
              </Button>
            </div>
          )}
        </Card>
      )}

      {bootcamps.length > 1 && bootcampStatus !== 'not_enrolled' && currentBootcampId && (
        <Card className="p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Current bootcamp</p>
            <p className="font-display font-semibold text-lg text-[var(--text-primary)]">
              {bootcamps.find((item) => isSameId(item.id, currentBootcampId))?.title || 'Bootcamp'}
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
