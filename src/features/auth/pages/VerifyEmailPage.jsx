import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/core/contexts/ToastContext'
import { authService } from '@/core/services'
import { AuthTopActions } from '@/features/auth/components/AuthTopActions'
import { Button } from '@/shared/components/ui'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('idle')
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const token = String(searchParams.get('token') || '').trim()
    if (!token) {
      setStatus('missing')
      return
    }
    let mounted = true
    setStatus('verifying')
    authService.confirmEmailVerification(token)
      .then(() => {
        if (!mounted) return
        setStatus('success')
        toast({ type: 'success', title: 'Email verified', message: 'You can now log in.' })
      })
      .catch((err) => {
        if (!mounted) return
        const apiMessage = err?.response?.data?.error
        setStatus('error')
        toast({ type: 'error', title: 'Verification failed', message: apiMessage || 'Invalid or expired token.' })
      })
    return () => { mounted = false }
  }, [searchParams, toast])

  return (
    <div className="relative isolate min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">

      <div className="relative z-10 w-full max-w-md space-y-6">
        <AuthTopActions
          linkTo="/login"
          linkLabel="Ready to sign in?"
          linkText="Log in"
        />

        <div className="card p-6 space-y-4 shadow-2xl shadow-black/20 border border-[var(--border)]">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// verify email</p>
            <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Email Verification</h1>
            {status === 'verifying' && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">Verifying your email...</p>
            )}
            {status === 'success' && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">Your email has been verified.</p>
            )}
            {status === 'missing' && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">Missing verification token.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-[var(--text-secondary)] mt-2">Verification failed. Request a new link.</p>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            className="w-full justify-center"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}
