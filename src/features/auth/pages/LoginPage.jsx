import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { LoginSidePanel } from '@/features/auth/components/LoginSidePanel'
import { LoginTopBar } from '@/features/auth/components/LoginTopBar'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { TOKEN_STORAGE_KEY } from '@/features/auth/pages/ChangePasswordPage'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const result = await login(form.email, form.password)
      if (result.mustChangePassword) {
        toast({ type: 'warning', title: 'Password update required', message: 'Please update your password to continue.' })
        if (typeof window !== 'undefined' && result.passwordChangeToken) {
          sessionStorage.setItem(TOKEN_STORAGE_KEY, result.passwordChangeToken)
        }
        navigate(`/change-password${result.passwordChangeToken ? `?token=${encodeURIComponent(result.passwordChangeToken)}` : ''}`)
        return
      }
      const user = result.user
      if (!user) {
        toast({ type: 'error', title: 'Login failed', message: 'Unexpected response. Try again.' })
        return
      }
      toast({ type: 'success', title: 'Access granted.', message: `Welcome back, ${user.hackerHandle || user.name || user.email}.` })
      if (user.role === 'admin') {
        navigate('/admin')
        return
      }
      const params = new URLSearchParams(location.search)
      const intent = params.get('intent')
      const bootcampId = params.get('bootcampId')
      const next = params.get('next')
      const safeNext = next && next.startsWith('/') ? next : null
      if (safeNext) {
        navigate(safeNext)
        return
      }
      if (intent === 'rooms') {
        navigate('/learn/rooms')
        return
      }
      if (intent === 'marketplace') {
        navigate('/marketplace')
        return
      }
      if (intent === 'bootcamp') {
        const enrolled = (user.bootcampStatus || 'not_enrolled') !== 'not_enrolled'
        if (enrolled) {
          const enrolledBootcampId = String(user.bootcampId || '').trim()
          navigate(enrolledBootcampId ? `/bootcamp/${enrolledBootcampId}` : '/bootcamp')
        } else {
          const target = bootcampId ? `/bootcamp?bootcampId=${encodeURIComponent(bootcampId)}` : '/bootcamp'
          navigate(target)
        }
        return
      }
      navigate('/dashboard')
    } catch {
      toast({ type: 'error', title: 'Login failed', message: 'Invalid credentials. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      <LoginSidePanel />

      <div className="flex-1 flex flex-col">
        <LoginTopBar />
        <LoginForm
          form={form}
          errors={errors}
          loading={loading}
          showPass={showPass}
          onTogglePass={() => setShowPass(s => !s)}
          onChange={setForm}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
