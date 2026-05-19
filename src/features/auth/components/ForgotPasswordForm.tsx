import React from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

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
  return (
    <div>
      <button onClick={onBackToLogin} className="flex items-center gap-2 text-text-muted hover:text-accent text-sm font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-1">Reset Password</h1>
        <p className="text-text-muted text-base">Enter your email and we will help you reset your password.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-xs font-bold text-text-muted uppercase tracking-widest">Operator Email</label>
          <div className="relative">
            <input id="forgot-email" type="email" name="email" required autoComplete="email" inputMode="email" placeholder="operator@hsociety.africa"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-base font-bold">
          {isLoading ? 'Submitting...' : 'Send Reset Instructions'} <Send className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have a reset token?{' '}
        <button onClick={onEnterToken} className="text-accent font-bold hover:underline">Enter token</button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
