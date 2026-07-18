import React from 'react';
import { IconArrowLeft } from '@/shared/components/icons';
import { Mail, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onBackToLogin: () => void;
  onEnterToken: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading,
  onBackToLogin,
  onEnterToken,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('common2.backToLogin')}
      </button>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">{t('auth2.forgot.title')}</h1>
        <p className="text-text-muted text-sm">{t('auth2.forgot.description')}</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('auth2.forgot.emailLabel')}</label>
          <div className="relative">
            <input id="forgot-email" type="email" name="email" required autoComplete="email" inputMode="email" placeholder={t('auth.emailPlaceholder')}
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? t('auth2.forgot.submitting') : t('auth2.forgot.sendInstructions')}</span> <Send className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        {t('auth2.forgot.alreadyHaveToken')}{' '}
        <button onClick={onEnterToken} className="text-accent font-bold hover:underline">{t('auth2.forgot.enterToken')}</button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
