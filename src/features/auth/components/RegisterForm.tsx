import React from 'react';
import { User, Mail, LogIn } from 'lucide-react';
import PasswordInput from './PasswordInput';

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, onLogin }) => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-1">Request Access</h1>
        <p className="text-text-muted text-base">Create your account to start learning.</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="register-handle" className="text-xs font-bold text-text-muted uppercase tracking-widest">Operator Handle</label>
          <div className="relative">
            <input id="register-handle" type="text" name="handle" required autoComplete="username" placeholder="kwame_operator"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
          <label htmlFor="register-full-name" className="text-xs font-bold text-text-muted uppercase tracking-widest">Full Name</label>
          <div className="relative">
            <input id="register-full-name" type="text" name="full_name" required autoComplete="name" placeholder="Kwame Mensah"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="text-xs font-bold text-text-muted uppercase tracking-widest">Email</label>
          <div className="relative">
            <input id="register-email" type="email" name="email" required autoComplete="email" inputMode="email" placeholder="operator@hsociety.africa"
              className="w-full bg-bg-card border border-border rounded-lg py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono text-base" />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">Password</label>
          <PasswordInput id="register-password" name="password" />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm-password" className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirm Password</label>
          <PasswordInput id="register-confirm-password" name="confirm_password" />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-base font-bold">
          {isLoading ? 'Creating account...' : 'Create Account'} <LogIn className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-8 text-center text-base text-text-muted">
        Already have access?{' '}
        <button onClick={onLogin} className="text-accent font-bold hover:underline">Log In</button>
      </p>
    </div>
  );
};

export default RegisterForm;
