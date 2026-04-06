import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/core/contexts/ToastContext'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useAuth } from '@/core/contexts/AuthContext'
import api from '@/core/services/api'
import { AuthTopActions } from '@/features/auth/components/AuthTopActions'
import { Button } from '@/shared/components/ui'

const TOKEN_STORAGE_KEY = 'hs_password_change_token'

export default function ChangePasswordPage() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()
  const { setSession } = useAuth()
  const navigate = useNavigate()

  const tokenFromQuery = String(searchParams.get('token') || '').trim()
  const tokenFromStorage = typeof window !== 'undefined'
    ? String(sessionStorage.getItem(TOKEN_STORAGE_KEY) || '').trim()
    : ''
  const token = tokenFromQuery || tokenFromStorage

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast({ type: 'error', message: 'Password change token is missing.' })
      return
    }
    if (!password || password.length < 8) {
      toast({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirm) {
      toast({ type: 'error', title: 'Password mismatch', message: 'The two passwords must match.' })
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/change-password', {
        passwordChangeToken: token,
        newPassword: password,
      })
      if (res.data?.user) {
        setSession(res.data.user)
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY)
      }
      toast({ type: 'success', title: 'Password updated', message: 'You can now continue.' })
      navigate('/dashboard')
    } catch (err) {
      const apiMessage = err?.response?.data?.error
      toast({ type: 'error', message: apiMessage || 'Password update failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <div className="px-6 py-5">
        <AuthTopActions
          isDark={isDark}
          onToggleTheme={toggleTheme}
          linkTo="/login"
          linkLabel="Back to login"
          linkText="Log in"
        />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// update password</p>
            <h2 className="font-display font-bold text-3xl text-[var(--text-primary)]">Change Password</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Set a stronger password to continue.
            </p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl shadow-black/20 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-3">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TOKEN_STORAGE_KEY }
