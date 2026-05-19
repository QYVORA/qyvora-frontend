import React from 'react';
import { KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

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
    <div>
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent text-sm font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-1">Verify Email</h1>
        <p className="text-text-muted text-base">
          {email ? `Enter the verification token sent to ${email}.` : 'Enter your email verification token.'}
        </p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="verify-token" className="text-xs font-bold text-text-muted uppercase tracking-widest">Verification Token</label>
          <div className="relative">
            <input id="verify-token" type="text" name="token" required defaultValue={token} placeholder="Paste verification token"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-base font-bold">
          {isLoading ? 'Verifying...' : 'Verify Email'} <CheckCircle2 className="w-5 h-5" />
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
