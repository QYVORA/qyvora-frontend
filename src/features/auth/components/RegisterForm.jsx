import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button, Input, ProgressBar } from '@/shared/components/ui'

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', 'var(--text-muted)', 'var(--accent)', 'var(--accent)', 'var(--accent)']

export function RegisterForm({
  form,
  errors,
  strength,
  loading,
  showPass,
  onTogglePass,
  onChange,
  onSubmit,
  onEmailBlur,
  emailChecking,
}) {
  return (
    <div className="card p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="ghost_zero"
          icon={User}
          value={form.username}
          onChange={e => onChange({ ...form, username: e.target.value })}
          error={errors.username}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={e => onChange({ ...form, email: e.target.value })}
          onBlur={onEmailBlur}
          error={errors.email}
        />
        {emailChecking && (
          <p className="text-xs text-[var(--text-muted)]">Checking email availability…</p>
        )}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              className={`input-field pl-10 pr-10 ${errors.password ? 'border-accent/60' : ''}`}
              value={form.password}
              onChange={e => onChange({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={onTogglePass}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-accent">{errors.password}</p>}
          {form.password && (
            <div className="mt-2">
              <ProgressBar value={strength} max={4} color={STRENGTH_COLORS[strength]} />
              <p className="text-xs mt-1 font-mono" style={{ color: STRENGTH_COLORS[strength] }}>
                {STRENGTH_LABELS[strength]}
              </p>
            </div>
          )}
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className={`input-field ${errors.confirm ? 'border-accent/60' : ''}`}
            value={form.confirm}
            onChange={e => onChange({ ...form, confirm: e.target.value })}
          />
          {errors.confirm && <p className="mt-1.5 text-xs text-accent">{errors.confirm}</p>}
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-3 mt-2">
          {!loading && <><ArrowRight size={16} /> Create Account</>}
        </Button>
      </form>

      <p className="text-center text-xs text-[var(--text-muted)] mt-6">
        By registering you agree to our{' '}
        <a href="/terms" className="text-accent hover:underline">Terms of Service</a> and{' '}
        <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
        For educational purposes only.
      </p>
    </div>
  )
}
