import { Zap } from 'lucide-react'
import { Card, Button, Spinner } from '@/shared/components/ui'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { studentService } from '@/core/services'
import api, { API_ORIGIN } from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'
import { useAuth } from '@/core/contexts/AuthContext'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { PHASE_IMGS } from '@/features/marketing/data/landingData'

export default function BootcampPage() {
  const [overview, setOverview] = useState(null)
  const [bootcamps, setBootcamps] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState('')
  const [selectedBootcamp, setSelectedBootcamp] = useState(null)
  const [socialProgress, setSocialProgress] = useState({})
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

  const handleEnroll = async (bootcampId) => {
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
      toast({ type: 'success', message: 'Enrollment confirmed.' })
      const bootcamp = bootcamps.find((item) => item.id === bootcampId)
      if (bootcamp && isPaidBootcamp(bootcamp)) {
        setShowPayment(true)
      } else {
        navigate(`/bootcamp/${bootcampId}`)
      }
    } catch (err) {
      toast({ type: 'error', message: err?.response?.data?.error || 'Enrollment failed.' })
    } finally {
      setEnrollingId('')
    }
  }

  const handleStartEnroll = (item) => {
    setSelectedBootcamp(item)
    setShowPayment(false)
    setSocialProgress({})
    setApplication({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      experience: '',
      goals: '',
    })
  }

  useEffect(() => {
    const targetId = searchParams.get('bootcampId')
    if (!targetId || loading || bootcamps.length === 0) return
    if (bootcampStatus !== 'not_enrolled') {
      navigate(`/bootcamp/${targetId}`)
      return
    }
    const target = bootcamps.find((item) => String(item.id) === String(targetId))
    if (target && selectedBootcamp?.id !== target.id) {
      handleStartEnroll(target)
    }
  }, [bootcampStatus, bootcamps, loading, navigate, searchParams, selectedBootcamp?.id])

  const handlePayment = async (method) => {
    setPaymentLoading(method)
    try {
      const res = await studentService.initializeBootcampPayment({ method })
      const url = res.data?.authorizationUrl
      if (url) {
        window.location.href = url
      } else {
        toast({ type: 'error', message: 'Payment link unavailable.' })
      }
    } catch (err) {
      toast({ type: 'error', message: err?.response?.data?.error || 'Payment initialization failed.' })
    } finally {
      setPaymentLoading('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// training program</p>
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
            const isEnrolled = bootcampStatus !== 'not_enrolled'
            const isCurrent = isEnrolled && currentBootcampId === item.id
            const isOther = isEnrolled && currentBootcampId && currentBootcampId !== item.id
            const accent = ['#3A3F8F', '#0EA5E9', '#22C55E', '#B8860B', '#6D28D9'][i % 5]
            const cover = resolveImageUrl(item.image) || PHASE_IMGS[i % PHASE_IMGS.length]
            return (
              <div
                key={item.id}
                className="card overflow-hidden flex flex-col lg:flex-row group w-full max-w-5xl mx-auto"
                style={{ borderColor: `${accent}35`, borderRadius: '18px' }}
              >
                <div className="relative h-56 lg:h-auto lg:w-2/5 overflow-hidden shrink-0">
                  <img
                    src={cover}
                    alt={item.title || 'Bootcamp'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  {isCurrent ? (
                    <Button
                      variant="primary"
                      className="mt-5 inline-flex items-center justify-center"
                      onClick={() => navigate(`/bootcamp/${item.id}`)}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant={isOther ? 'outline' : 'primary'}
                      className="mt-5 inline-flex items-center justify-center"
                      disabled={isOther}
                      onClick={() => handleStartEnroll(item)}
                    >
                      {isOther ? 'Enrolled Elsewhere' : 'Enroll'}
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
              <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// enrollment</p>
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
              onChange={(e) => setApplication((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <input
              className="input-field"
              placeholder="Experience level (e.g. Beginner)"
              value={application.experience}
              onChange={(e) => setApplication((prev) => ({ ...prev, experience: e.target.value }))}
            />
            <textarea
              className="input-field md:col-span-2 min-h-[110px]"
              placeholder="Your goals / what you want to achieve"
              value={application.goals}
              onChange={(e) => setApplication((prev) => ({ ...prev, goals: e.target.value }))}
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Follow to unlock</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Visit all channels below before continuing your registration.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_MEDIA.map((platform) => {
                const Icon = platform.icon
                const visited = socialProgress[platform.key]
                return (
                  <Button
                    key={platform.key}
                    variant={visited ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      window.open(platform.url, '_blank', 'noopener,noreferrer')
                      setSocialProgress((prev) => ({ ...prev, [platform.key]: true }))
                    }}
                  >
                    <Icon size={14} />
                    {visited ? `${platform.label} visited` : `Visit ${platform.label}`}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              loading={enrollingId === selectedBootcamp.id}
              disabled={!SOCIAL_MEDIA.every((platform) => socialProgress[platform.key])}
              onClick={() => handleEnroll(selectedBootcamp.id)}
            >
              Continue
            </Button>
            <Button variant="ghost" onClick={() => setSelectedBootcamp(null)}>
              Cancel
            </Button>
          </div>

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
