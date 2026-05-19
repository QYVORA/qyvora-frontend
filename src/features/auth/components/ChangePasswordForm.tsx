import React from 'react';
import { Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import PasswordInput from './PasswordInput';

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
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight">Password Change Required</h1>
        </div>
        <p className="text-text-muted text-base">Your account requires a password change before continuing.</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        {!token && (
          <div className="space-y-2">
            <label htmlFor="change-token" className="text-xs font-bold text-text-muted uppercase tracking-widest">Change Token</label>
            <div className="relative">
              <input id="change-token" type="text" name="change_token" required placeholder="Paste token from login response"
                className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="change-new-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">New Password</label>
          <PasswordInput id="change-new-password" name="new_password" placeholder="Min 8 characters" />
        </div>
        <div className="space-y-2">
          <label htmlFor="change-confirm-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
          <PasswordInput id="change-confirm-password" name="confirm_password" />
        </div>
        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-base font-bold">
          {isLoading ? 'Updating...' : 'Set New Password'} <CheckCircle2 className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
