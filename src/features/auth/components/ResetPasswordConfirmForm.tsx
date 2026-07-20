import React from 'react';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { Mail, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import Input from '@/shared/components/ui/Input';

interface ResetPasswordConfirmFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  token: string;
  onBack: () => void;
}

const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  onSubmit,
  isLoading,
  email,
  onEmailChange,
  token,
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-accent mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('button.back')}
      </button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">{t('auth2.reset.title')}</h1>
        <p className="text-text-muted text-sm">{t('auth2.reset.description')}</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="reset-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
          <Input id="reset-email" type="email" name="email" required autoComplete="email" inputMode="email" defaultValue={email} placeholder={t('auth.emailPlaceholder')}
            onChange={(e) => onEmailChange(e.target.value)}
            icon={<Mail className="w-4 h-4" />} />
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-token" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('auth2.reset.tokenLabel')}</label>
          <Input id="reset-token" type="text" name="token" required defaultValue={token} placeholder={t('auth2.reset.tokenPlaceholder')}
            icon={<KeyRound className="w-4 h-4" />} />
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-new-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.newPassword')}</label>
          <PasswordInput id="reset-new-password" name="new_password" placeholder={t('auth2.reset.minLength')} autoComplete="new-password" />
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-confirm-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.confirmPassword')}</label>
          <PasswordInput id="reset-confirm-password" name="confirm_password" autoComplete="new-password" />
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? t('auth2.reset.resetting') : t('auth2.reset.resetPassword')}</span> <IconCheck size={20} />
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirmForm;
