import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Button } from '@/shared/components/ui'
import { studentService } from '@/core/services'

export default function StudentPayments() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying payment...')
  const navigate = useNavigate()

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      setStatus('error')
      setMessage('Missing payment reference.')
      return
    }
    let active = true
    studentService.verifyBootcampPayment(reference)
      .then(() => {
        if (!active) return
        setStatus('success')
        setMessage('Payment verified. Access unlocked.')
        setTimeout(() => {
          navigate('/dashboard', { state: { paymentResult: { status: 'success' } } })
        }, 1200)
      })
      .catch((err) => {
        if (!active) return
        const apiMessage = err?.response?.data?.error
        setStatus('error')
        setMessage(apiMessage || 'Payment verification failed.')
      })
    return () => { active = false }
  }, [navigate, searchParams])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 space-y-3">
        <h1 className="font-display font-semibold text-2xl text-[var(--text-primary)]">Payment Status</h1>
        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        {status === 'error' && (
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        )}
      </Card>
    </div>
  )
}
