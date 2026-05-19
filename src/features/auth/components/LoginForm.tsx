import React from 'react';
import { Mail, LogIn } from 'lucide-react';
import PasswordInput from './PasswordInput';

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isAdminLoginRoute: boolean;
  shakePassword: boolean;
  onAnimationEnd: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  isAdminLoginRoute,
  shakePassword,
  onAnimationEnd,
  onForgotPassword,
  onRegister,
}) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-1 text-text-primary">
          {isAdminLoginRoute ? 'Workspace Access' : 'Operator Login'}
        </h1>
        <p className="text-base text-text-muted">
          {isAdminLoginRoute ? 'Enter your credentials to continue.' : 'Sign in to continue your training.'}
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-xs font-bold text-text-muted uppercase tracking-widest">Email</label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="operator@hsociety.africa"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">Password</label>
            {!isAdminLoginRoute && (
              <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-accent hover:underline">Forgot?</button>
            )}
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            shake={shakePassword}
            onAnimationEnd={onAnimationEnd}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full !py-4 flex items-center justify-center gap-3 disabled:opacity-50 rounded-lg text-base font-bold uppercase tracking-wider ${
            isAdminLoginRoute
              ? 'bg-bg-card border border-border text-text-primary hover:border-accent/40'
              : 'btn-primary'
          }`}
        >
          {isLoading ? 'Signing you in...' : 'Sign In'} <LogIn className="w-5 h-5" />
        </button>
      </form>

      {!isAdminLoginRoute && (
        <p className="mt-8 text-center text-base text-text-muted">
          New here?{' '}
          <button onClick={onRegister} className="text-accent font-bold hover:underline">Create account</button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
