import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'

export function LoginForm({ form, errors, loading, showPass, onTogglePass, onChange, onSubmit }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// authenticate</p>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Welcome back,<br />operator.</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@hsociety.io"
            icon={Mail}
            value={form.email}
            onChange={e => onChange({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/60' : ''}`}
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
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-3 mt-2">
            {!loading && <><ArrowRight size={16} /> Access Platform</>}
          </Button>
        </form>

        <div className="mt-3 text-right">
          <a href="/forgot-password" className="text-xs text-accent hover:opacity-80">
            Forgot password?
          </a>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] font-mono mb-2">// demo credentials</p>
          <div className="space-y-1 text-xs font-mono">
            <p><span className="text-[var(--text-muted)]">Student:</span> <span className="text-accent">student@hsociety.io</span></p>
            <p><span className="text-[var(--text-muted)]">Admin:</span> <span className="text-accent">admin@hsociety.io</span></p>
            <p><span className="text-[var(--text-muted)]">Password:</span> <span className="text-[var(--text-secondary)]">any value</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
