import React, { useState, useRef, useCallback } from 'react';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { Mail, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Input from '@/shared/components/ui/Input';
import AthenaBoxes from '@/shared/components/AthenaBoxes';

type VerifyState = 'idle' | 'verifying' | 'success' | 'error' | 'expired' | 'already_verified';

interface VerifyEmailFormProps {
  state: VerifyState;
  email: string;
  onEmailChange: (email: string) => void;
  onBackToLogin: () => void;
  onResendCode: () => void;
  onVerifyOtp: (otp: string) => void;
  resendCooldown: number;
  onResetState: () => void;
}

const OTP_LENGTH = 6;

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  state,
  email,
  onEmailChange,
  onBackToLogin,
  onResendCode,
  onVerifyOtp,
  resendCooldown,
  onResetState,
}) => {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === OTP_LENGTH - 1) {
      const otp = newDigits.join('');
      if (otp.length === OTP_LENGTH) {
        onVerifyOtp(otp);
      }
    }
  }, [digits, onVerifyOtp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newDigits = new Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      onVerifyOtp(pasted);
    }
  }, [onVerifyOtp]);

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter mb-3">
          Email <span className="text-accent">Verified</span>
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Your email has been verified. You can now sign in to your QYVORA account.
        </p>
        <button
          onClick={onBackToLogin}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3"
        >
          <span className="text-[10px]">{t('common2.backToLogin')}</span>
          <IconArrowLeft size={20} />
        </button>
      </div>
    );
  }

  if (state === 'already_verified') {
    return (
      <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter mb-3">
          Email <span className="text-accent">Already Verified</span>
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Your email address has already been verified. You can sign in to your account.
        </p>
        <button
          onClick={onBackToLogin}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3"
        >
          <span className="text-[10px]">{t('common2.backToLogin')}</span>
          <IconArrowLeft size={20} />
        </button>
      </div>
    );
  }

  if (state === 'expired') {
    return (
      <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8">
        <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent active:opacity-70 mb-8 transition-colors">
          <IconArrowLeft size={16} /> {t('common2.backToLogin')}
        </button>
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter mb-3">
            Code <span className="text-amber-500">Expired</span>
          </h1>
          <p className="text-text-muted text-sm">
            This verification code has expired. Enter your email to receive a new one.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="resend-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email Address</label>
            <Input
              id="resend-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="operator@qyvora.africa"
              icon={<Mail className="w-4 h-4" />}
              className="lg:py-4"
            />
          </div>
          <button
            onClick={onResendCode}
            disabled={resendCooldown > 0 || !email}
            className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-[10px]">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Code'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8">
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent active:opacity-70 mb-8 transition-colors">
        <IconArrowLeft size={16} /> {t('common2.backToLogin')}
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

      {/* OTP Input */}
      <form
        className="mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          const otp = digits.join('');
          if (otp.length === OTP_LENGTH) onVerifyOtp(otp);
        }}
      >
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={state === 'verifying'}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-black font-mono
                bg-bg-elevated border border-border/40 rounded-xl
                text-text-primary outline-none
                focus:border-accent focus:ring-1 focus:ring-accent/30
                disabled:opacity-50 transition-colors"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={state === 'verifying' || digits.join('').length !== OTP_LENGTH}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {state === 'verifying' ? (
            <>
              <AthenaBoxes />
              <span className="text-[10px]">Verifying...</span>
            </>
          ) : (
            <>
              <span className="text-[10px]">Verify Code</span>
              <IconCheck size={20} />
            </>
          )}
        </button>
      </form>

      {state === 'error' && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">Invalid or expired code. Check and try again.</p>
        </div>
      )}

      <div className="space-y-4">
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
        {!email && (
          <div className="space-y-2">
            <label htmlFor="resend-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email Address</label>
            <Input
              id="resend-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="operator@qyvora.africa"
              icon={<Mail className="w-4 h-4" />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailForm;
