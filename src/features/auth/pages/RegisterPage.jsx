import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { useTheme } from '@/core/contexts/ThemeContext'
import { useModal } from '@/core/contexts/ModalContext'
import { profileService } from '@/core/services'
import { AuthTopActions } from '@/features/auth/components/AuthTopActions'
import { RegisterHeader } from '@/features/auth/components/RegisterHeader'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

function getPasswordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const { toast } = useToast()
  const { isDark, toggleTheme } = useTheme()
  const { openModal } = useModal()
  const navigate = useNavigate()

  const strength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const payload = {
        role: 'student',
        profile: { fullName: form.username, handle: form.username },
        credentials: { email: form.email, password: form.password },
      }
      const result = await register(payload)
      const recoveryToken = result?.recoveryToken
      const showRecoveryModal = () => {
        if (!recoveryToken) return
        openModal({
          badge: 'Recovery Token',
          title: 'Save Your Recovery Token',
          description: 'This token can recover your account if you ever lose access. Copy it and store it somewhere safe.',
          confirmLabel: 'I saved it',
          onConfirm: async () => {
            try {
              await profileService.acknowledgeRecoveryToken()
            } catch {
              // ignore acknowledgement failures
            }
          },
          content: (
            <div className="space-y-4">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 font-mono text-sm break-all">
                {recoveryToken}
              </div>
              <button
                type="button"
                className="btn-primary w-full justify-center py-2.5"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(recoveryToken)
                    toast({ type: 'success', title: 'Copied', message: 'Recovery token copied to clipboard.' })
                  } catch {
                    toast({ type: 'error', title: 'Copy failed', message: 'Please copy the token manually.' })
                  }
                }}
              >
                Copy Token
              </button>
            </div>
          ),
        })
      }

      if (result?.verificationRequired) {
        toast({ type: 'success', title: 'Verify your email', message: 'Check your inbox to complete registration.' })
        showRecoveryModal()
        navigate('/login')
        return
      }
      if (result?.user) {
        toast({ type: 'success', title: 'Operator registered!', message: 'Welcome to HSOCIETY. Begin Phase 01.' })
        showRecoveryModal()
        navigate('/dashboard')
        return
      }
      toast({ type: 'error', title: 'Registration failed', message: 'Please try again.' })
    } catch (err) {
      const status = err?.response?.status
      const apiMessage = err?.response?.data?.error

      if (status === 409) {
        setErrors({ email: 'An account with this email already exists' })
        toast({ type: 'error', title: 'Email already registered', message: 'Try logging in instead.' })
        return
      }

      if (status === 400 && apiMessage) {
        const lowered = apiMessage.toLowerCase()
        if (lowered.includes('password')) setErrors({ password: apiMessage })
        else if (lowered.includes('email')) setErrors({ email: apiMessage })
        else if (lowered.includes('name') || lowered.includes('handle') || lowered.includes('username')) {
          setErrors({ username: apiMessage })
        } else {
          setErrors({})
        }
        toast({ type: 'error', title: 'Registration failed', message: apiMessage })
        return
      }

      toast({ type: 'error', title: 'Registration failed', message: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <AuthTopActions
          isDark={isDark}
          onToggleTheme={toggleTheme}
          linkTo="/login"
          linkLabel="Already registered?"
          linkText="Log in"
        />

        <RegisterHeader />

        <RegisterForm
          form={form}
          errors={errors}
          strength={strength}
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
