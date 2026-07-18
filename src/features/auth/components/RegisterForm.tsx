import React, { useState, useRef } from 'react';
import { User, Mail, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PasswordInput from './PasswordInput';
import HandleSuggestions from '../../../shared/components/HandleSuggestions';

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, onLogin }) => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [selectedHandle, setSelectedHandle] = useState('');
  const handleRef = useRef<HTMLInputElement>(null);

  const handleSuggestionSelect = (handle: string) => {
    setSelectedHandle(handle);
    if (handleRef.current) {
      handleRef.current.value = handle;
    }
  };

  return (
    <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">{t('heading.requestAccess')}</h1>
        <p className="text-text-muted text-sm">{t('auth2.registerDescription')}</p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="register-handle" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.operatorHandle')}</label>
          <div className="relative">
            <input ref={handleRef} id="register-handle" type="text" name="handle" required autoComplete="username"
              pattern="^[a-zA-Z0-9][a-zA-Z0-9\-]{0,38}[a-zA-Z0-9]$"
              title={t('validation.handleRules')}
              placeholder={t('auth.handlePlaceholder')}
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
          <HandleSuggestions
            name={fullName}
            onSelect={handleSuggestionSelect}
            selectedHandle={selectedHandle}
          />
          <p className="text-[10px] text-text-muted/60 mt-1">{t('validation.handleRules')}</p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
          <label htmlFor="register-full-name" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.fullName')}</label>
          <div className="relative">
            <input id="register-full-name" type="text" name="full_name" required autoComplete="name" placeholder={t('auth.namePlaceholder')}
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setSelectedHandle(''); }}
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
          <div className="relative">
            <input id="register-email" type="email" name="email" required autoComplete="email" inputMode="email" placeholder={t('auth.emailPlaceholder')}
              className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
          <PasswordInput id="register-password" name="password" autoComplete="new-password" />
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.confirmPassword')}</label>
          <PasswordInput id="register-confirm-password" name="confirm_password" autoComplete="new-password" />
        </div>

        <button type="submit" disabled={isLoading}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50">
          <span className="text-[10px]">{isLoading ? t('button.creatingAccount') : t('button.createAccount')}</span> <LogIn className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-text-muted">
        {t('auth.alreadyHaveAccess')}{' '}
        <button onClick={onLogin} className="text-accent font-bold hover:underline">{t('button.logIn')}</button>
      </p>
    </div>
  );
};

export default RegisterForm;
