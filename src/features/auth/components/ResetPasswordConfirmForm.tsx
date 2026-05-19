import React from 'react';
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import PasswordInput from './PasswordInput';

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
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-accent text-sm font-bold uppercase tracking-widest mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-1">Set New Password</h1>
        <p className="text-text-muted text-base">Enter your reset token and choose a new password.</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="reset-email" className="text-xs font-bold text-text-muted uppercase tracking-widest">Email</label>
          <div className="relative">
            <input id="reset-email" type="email" name="email" required autoComplete="email" inputMode="email" defaultValue={email} placeholder="operator@hsociety.africa"
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-token" className="text-xs font-bold text-text-muted uppercase tracking-widest">Reset Token</label>
          <div className="relative">
            <input id="reset-token" type="text" name="token" required defaultValue={token} placeholder="Paste reset token here"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-new-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">New Password</label>
          <PasswordInput id="reset-new-password" name="new_password" placeholder="Min 8 characters" />
        </div>
        <div className="space-y-2">
          <label htmlFor="reset-confirm-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
          <PasswordInput id="reset-confirm-password" name="confirm_password" />
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-base font-bold">
          {isLoading ? 'Resetting...' : 'Reset Password'} <CheckCircle2 className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirmForm;
