import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { useTheme } from '@/core/contexts/ThemeContext'
import { LoginSidePanel } from '@/features/auth/components/LoginSidePanel'
import { LoginTopBar } from '@/features/auth/components/LoginTopBar'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

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
        return
      }
      if (result.twoFactorRequired) {
        toast({ type: 'warning', title: 'Two-factor required', message: 'Complete 2FA to finish login.' })
        return
      }
      const user = result.user
      if (!user) {
        toast({ type: 'error', title: 'Login failed', message: 'Unexpected response. Try again.' })
        return
      }
      toast({ type: 'success', title: 'Access granted.', message: `Welcome back, ${user.hackerHandle || user.name || user.email}.` })
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
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
        <LoginTopBar isDark={isDark} onToggleTheme={toggleTheme} />
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
