import React from 'react';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Input from '@/shared/components/ui/Input';

interface VerifyEmailFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  email: string;
  token: string;
  onBackToLogin: () => void;
  onResendToken: () => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  onSubmit,
  isLoading,
  email,
  token,
  onBackToLogin,
  onResendToken,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent active:opacity-70 mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('common2.backToLogin')}
      </button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">{t('auth2.verify.title')}</h1>
        <p className="text-text-muted text-sm">
          {email ? t('auth2.verify.description', { email }) : t('auth2.verify.descriptionFallback')}
        </p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="verify-token" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('auth2.verify.tokenLabel')}</label>
          <Input id="verify-token" type="text" name="token" required defaultValue={token} placeholder={t('auth2.verify.tokenPlaceholder')}
            icon={<KeyRound className="w-4 h-4" />} />
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? t('auth2.verify.verifying') : t('auth2.verify.verifyEmail')}</span> <IconCheck size={20} />
        </button>
      </form>
      {email && (
        <p className="mt-6 text-center text-sm text-text-muted">
          {t('auth2.verify.didNotGetToken')}{' '}
          <button
            onClick={onResendToken}
            className="text-accent font-bold hover:underline active:opacity-70"
          >
            {t('auth2.verify.resendToken')}
          </button>
        </p>
      )}
    </div>
  );
};

export default VerifyEmailForm;
