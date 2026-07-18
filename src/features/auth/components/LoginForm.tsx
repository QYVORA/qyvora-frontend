import React from 'react';
import { Mail, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-1 text-text-primary">
          {isAdminLoginRoute ? t('heading.workspaceAccess') : t('heading.operatorLogin')}
        </h1>
        <p className="text-sm text-text-muted">
          {isAdminLoginRoute ? t('auth.enterCredentials') : t('auth.signIntoContinue')}
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder={t('auth.emailPlaceholder')}
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
            {!isAdminLoginRoute && (
              <button type="button" onClick={onForgotPassword} className="text-accent hover:underline transition-colors">{t('button.forgot')}</button>
            )}
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            shake={shakePassword}
            onAnimationEnd={onAnimationEnd}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 ${
            isAdminLoginRoute
              ? 'bg-bg-card border border-border text-text-primary hover:border-accent/40'
              : ''
          }`}
        >
          <span className="text-[10px]">{isLoading ? t('button.signingIn') : t('button.signIn')}</span> <LogIn className="w-5 h-5" />
        </button>
      </form>

      {!isAdminLoginRoute && (
        <p className="mt-8 text-center text-sm text-text-muted">
          {t('auth.newHere')}{' '}
          <button onClick={onRegister} className="text-accent font-bold hover:underline">{t('button.createAccountLower')}</button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
