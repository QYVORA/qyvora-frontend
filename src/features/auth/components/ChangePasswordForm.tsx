import React from 'react';
import { KeyRound } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

interface ChangePasswordFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  token: string;
}

const labelClass = 'type-label mb-2 block uppercase tracking-[0.12em] text-text-tertiary';

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  isLoading,
  token,
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full rounded-xl border border-border-subtle bg-surface p-5 sm:p-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="type-h2 font-black uppercase tracking-tight text-text-primary">
            {t('auth2.changePassword.title1')} <span className="text-accent">{t('auth2.changePassword.title2')}</span>
          </h1>
        </div>
        <p className="type-body-sm">{t('auth2.changePassword.description')}</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        {!token && (
          <div className="space-y-2">
            <label htmlFor="change-token" className={labelClass}>{t('auth2.changePassword.tokenLabel')}</label>
              <Input id="change-token" type="text" name="change_token" required placeholder={t('auth2.changePassword.tokenPlaceholder')}
                icon={<KeyRound className="h-4 w-4" />} />
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="change-new-password" className={labelClass}>{t('form.newPassword')}</label>
          <PasswordInput id="change-new-password" name="new_password" placeholder={t('auth2.changePassword.minLength')} autoComplete="new-password" />
        </div>
        <div className="space-y-2">
          <label htmlFor="change-confirm-password" className={labelClass}>{t('form.confirmPassword')}</label>
          <PasswordInput id="change-confirm-password" name="confirm_password" autoComplete="new-password" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isLoading} loading={isLoading}>
          {t('auth2.changePassword.setNewPassword')}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;