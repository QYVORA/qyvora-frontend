import React from 'react';
import { IconArrowLeft, IconCheck } from '@/shared/components/icons';
import { KeyRound } from 'lucide-react';

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
  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent mb-8 transition-colors">
        <IconArrowLeft size={16} /> Back to Login
      </button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">Verify Email</h1>
        <p className="text-text-muted text-sm">
          {email ? `Enter the verification token sent to ${email}.` : 'Enter your email verification token.'}
        </p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="verify-token" className="text-[10px] font-black text-text-muted uppercase tracking-widest">Verification Token</label>
          <div className="relative">
            <input id="verify-token" type="text" name="token" required defaultValue={token} placeholder="Paste verification token"
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? 'Verifying...' : 'Verify Email'}</span> <IconCheck size={20} />
        </button>
      </form>
      {email && (
        <p className="mt-6 text-center text-sm text-text-muted">
          Didn't get a token?{' '}
          <button
            onClick={onResendToken}
            className="text-accent font-bold hover:underline"
          >
            Resend token
          </button>
        </p>
      )}
    </div>
  );
};

export default VerifyEmailForm;
