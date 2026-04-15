import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/contexts/AuthContext'
import { useToast } from '@/core/contexts/ToastContext'
import { useModal } from '@/core/contexts/ModalContext'
import { authService, profileService } from '@/core/services'
import { LoginSidePanel } from '@/features/auth/components/LoginSidePanel'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { Logo } from '@/shared/components/brand/Logo'
import { copyText } from '@/shared/utils/clipboard'

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
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [emailChecking, setEmailChecking] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()
  const { openModal } = useModal()
  const navigate = useNavigate()
  const emailCheckTimeoutRef = useRef(null)

  useEffect(() => () => {
    if (emailCheckTimeoutRef.current) clearTimeout(emailCheckTimeoutRef.current)
  }, [])

  const strength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleEmailBlur = async () => {
    const email = form.email.trim()
    if (!email || !/\S+@\S+\.\S+/.test(email)) return
    if (emailCheckTimeoutRef.current) clearTimeout(emailCheckTimeoutRef.current)
    setEmailChecking(true)
    emailCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await authService.checkEmail(email)
        if (res.data?.exists) setErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }))
      } catch {
        // ignore
      } finally {
        setEmailChecking(false)
      }
    }, 500)
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

      const showRecoveryModal = (onDone) => {
        if (!recoveryToken) { if (onDone) onDone(); return }
        openModal({
          badge: 'Recovery Token',
          title: 'Save Your Recovery Token',
          description: 'This token can recover your account if you ever lose access. Copy it and store it somewhere safe.',
          confirmLabel: 'I saved it',
          requireConfirmCheck: true,
          confirmCheckLabel: 'I have copied this token',
          onConfirm: async () => {
            try { await profileService.acknowledgeRecoveryToken() } catch { /* ignore */ }
            if (onDone) onDone()
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
                  const ok = await copyText(recoveryToken)
                  toast(ok
                    ? { type: 'success', title: 'Copied', message: 'Recovery token copied.' }
                    : { type: 'error', title: 'Copy failed', message: 'Please copy the token manually.' })
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
        showRecoveryModal(() => navigate('/login'))
        return
      }
      if (result?.user) {
        toast({ type: 'success', title: 'Operator registered!', message: 'Welcome to HSOCIETY. Begin Phase 01.' })
        showRecoveryModal(() => navigate('/dashboard'))
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
        else if (lowered.includes('name') || lowered.includes('handle') || lowered.includes('username')) setErrors({ username: apiMessage })
        toast({ type: 'error', title: 'Registration failed', message: apiMessage })
        return
      }
      toast({ type: 'error', title: 'Registration failed', message: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left side panel — identical to login */}
      <LoginSidePanel />

      {/* Right — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link to="/" className="lg:hidden flex items-center">
            <Logo size="lg" />
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/login" className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors">
              Already registered? <span className="text-accent">Log in</span>
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div>
              <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// create account</p>
              <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Join the Platform</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Begin your offensive security journey.</p>
            </div>

            {/* Form card */}
            <RegisterForm
              form={form}
              errors={errors}
              strength={strength}
              loading={loading}
              showPass={showPass}
              onTogglePass={() => setShowPass((s) => !s)}
              showConfirmPass={showConfirmPass}
              onToggleConfirmPass={() => setShowConfirmPass((s) => !s)}
              onChange={setForm}
              onEmailBlur={handleEmailBlur}
              emailChecking={emailChecking}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
