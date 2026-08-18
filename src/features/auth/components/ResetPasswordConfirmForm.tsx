import React from 'react';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import Input from '@/shared/components/ui/Input';
import AthenaBoxes from '@/shared/components/AthenaBoxes';

interface ResetPasswordConfirmFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onBack: () => void;
}

const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  onSubmit,
  isLoading,
  onBack,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-accent active:opacity-70 mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('button.back')}
      </button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">{t('auth2.reset.title1')} <span className="text-accent">{t('auth2.reset.title2')}</span></h1>
        <p className="text-text-muted text-sm">Create a new password for your account.</p>
      </div>
      <form className="space-y-6" onSubmit={onSubmit}>
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
          {isLoading ? (
            <>
              <AthenaBoxes />
              <span className="text-[10px]">{t('auth2.reset.resetting')}</span>
            </>
          ) : (
            <>
              <span className="text-[10px]">{t('auth2.reset.resetPassword')}</span> <IconCheck size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirmForm;
