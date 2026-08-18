import React from 'react';
import { IconArrowLeft } from '@/shared/components/icons';
import { XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OtpInput from './OtpInput';

interface OtpInputFormProps {
  onSubmit: (otp: string) => void;
  onBack: () => void;
  onResendCode: () => void;
  isLoading: boolean;
  error: string | null;
  email: string;
  resendCooldown: number;
}

const OtpInputForm: React.FC<OtpInputFormProps> = ({
  onSubmit,
  onBack,
  onResendCode,
  isLoading,
  error,
  email,
  resendCooldown,
}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8">
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-accent active:opacity-70 mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('button.back')}
      </button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">
          Enter <span className="text-accent">Code</span>
        </h1>
        <p className="text-text-muted text-sm">
          {email
            ? `We sent a 6-digit code to ${email}`
            : 'Check your email for the verification code'}
        </p>
      </div>

      <OtpInput onComplete={onSubmit} disabled={isLoading} error={!!error} />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <p className="text-center text-sm text-text-muted">
        Didn't receive a code?{' '}
        <button
          onClick={onResendCode}
          disabled={resendCooldown > 0}
          className="text-accent font-bold hover:underline active:opacity-70 disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Wait ${resendCooldown}s` : 'Resend'}
        </button>
      </p>
    </div>
  );
};

export default OtpInputForm;
