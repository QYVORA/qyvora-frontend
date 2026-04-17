import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, KeyRound, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/core/contexts/ToastContext'
import { authService } from '@/core/services'
import { AuthTopActions } from '@/features/auth/components/AuthTopActions'
import { Button, Input } from '@/shared/components/ui'

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const queryToken = String(searchParams.get('token') || '').trim()
    if (queryToken) setToken(queryToken)
  }, [searchParams])

  const handleReset = async (e) => {
    e.preventDefault()
    if (!email || !token || !password) {
      toast({ type: 'error', message: 'Email, token, and new password are required.' })
      return
    }
    if (password.length < 8) {
      toast({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirm) {
      toast({ type: 'error', title: 'Password mismatch', message: 'The two passwords must match.' })
      return
    }
    setResetLoading(true)
    try {
      await authService.confirmPasswordReset(email.trim(), token.trim(), password)
      toast({ type: 'success', title: 'Password updated', message: 'You can now log in.' })
      navigate('/login')
    } catch (err) {
      const apiMessage = err?.response?.data?.error
      if (apiMessage && apiMessage.toLowerCase().includes('token')) {
        toast({ type: 'error', title: 'Invalid token', message: apiMessage })
      } else {
        toast({ type: 'error', message: apiMessage || 'Reset failed.' })
      }
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="px-6 py-5">
        <AuthTopActions
          linkTo="/login"
          linkLabel="Remembered your password?"
          linkText="Log in"
        />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// set new password</p>
            <h2 className="font-display font-bold text-3xl text-[var(--text-primary)]">Reset Password</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Enter your recovery token and email to reset your password.
            </p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl shadow-black/20 space-y-4">
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Reset Token"
                placeholder="Paste reset token"
                icon={KeyRound}
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="primary" loading={resetLoading} className="w-full justify-center py-3">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
