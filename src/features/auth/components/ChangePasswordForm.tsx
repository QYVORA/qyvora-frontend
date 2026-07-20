import React from 'react';
import { IconShield, IconCheck } from '@/shared/components/icons';
import { KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import Input from '@/shared/components/ui/Input';

interface ChangePasswordFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  token: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  isLoading,
  token,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <IconShield size={20} className="text-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter">{t('auth2.changePassword.title')}</h1>
        </div>
        <p className="text-text-muted text-sm">{t('auth2.changePassword.description')}</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        {!token && (
          <div className="space-y-2">
            <label htmlFor="change-token" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('auth2.changePassword.tokenLabel')}</label>
              <Input id="change-token" type="text" name="change_token" required placeholder={t('auth2.changePassword.tokenPlaceholder')}
                icon={<KeyRound className="w-4 h-4" />} />
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="change-new-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.newPassword')}</label>
          <PasswordInput id="change-new-password" name="new_password" placeholder={t('auth2.changePassword.minLength')} autoComplete="new-password" />
        </div>
        <div className="space-y-2">
          <label htmlFor="change-confirm-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.confirmPassword')}</label>
          <PasswordInput id="change-confirm-password" name="confirm_password" autoComplete="new-password" />
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? t('auth2.changePassword.updating') : t('auth2.changePassword.setNewPassword')}</span> <IconCheck size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
