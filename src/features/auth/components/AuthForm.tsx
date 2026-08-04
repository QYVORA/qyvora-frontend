import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, LogIn } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import AthenaBoxes from '@/shared/components/AthenaBoxes';
import PasswordInput from './PasswordInput';
import HandleSuggestions from '@/shared/components/HandleSuggestions';
import Input from '@/shared/components/ui/Input';

export type AuthMode = 'login' | 'register';

const AUTH_INPUT_SIZE = 'lg:py-4';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  isLoading: boolean;
  shakePassword: boolean;
  onShakeEnd: () => void;
  formMessage: string;
  fullName: string;
  selectedHandle: string;
  onFullNameChange: (value: string) => void;
  onSuggestionSelect: (handle: string) => void;
  handleRef: React.RefObject<HTMLInputElement | null>;
  onLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onModeChange,
  isLoading,
  shakePassword,
  onShakeEnd,
  formMessage,
  fullName,
  selectedHandle,
  onFullNameChange,
  onSuggestionSelect,
  handleRef,
  onLoginSubmit,
  onRegisterSubmit,
  onForgotPassword,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-5">
      <p className="sr-only" aria-live="polite">{formMessage}</p>

      {/* Toggle between login and register */}
      <div className="w-full flex bg-bg/80 border border-bg/50 p-1.5 rounded-xl backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onModeChange('login')}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
            mode === 'login'
              ? 'bg-accent text-on-accent shadow-[0_0_12px_var(--color-accent-glow)] font-black'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          {t('button.logIn')}
        </button>
        <button
          type="button"
          onClick={() => onModeChange('register')}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
            mode === 'register'
              ? 'bg-accent text-on-accent shadow-[0_0_12px_var(--color-accent-glow)] font-black'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          {t('button.createAccount')}
        </button>
      </div>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-2xl border border-border/30 bg-bg/70 backdrop-blur-md p-4 sm:p-6 lg:p-8"
          >
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">
                  {t('hero.welcomeBack')} <span className="text-accent">{t('hero.operator')}</span>
                </h1>
                <p className="text-text-muted text-sm">{t('auth.signIntoContinue')}</p>
              </div>

              <form className="space-y-4" onSubmit={onLoginSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
                <Input
                    id="login-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t('auth.emailPlaceholder')}
                    icon={<Mail className="w-4 h-4 lg:w-5 lg:h-5" />}
                    className={AUTH_INPUT_SIZE}
                  />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
                  <button 
                    type="button" 
                    onClick={onForgotPassword} 
                    className="text-accent hover:text-accent/70 hover:underline transition-colors text-xs font-bold"
                  >
                    {t('button.forgot')}
                  </button>
                </div>
                <PasswordInput
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  shake={shakePassword}
                  onAnimationEnd={onShakeEnd}
                  className={AUTH_INPUT_SIZE}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <AthenaBoxes />
                    <span className="text-[10px]">{t('button.signingIn')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px]">{t('button.signIn')}</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-2xl border border-border/30 bg-bg/70 backdrop-blur-md p-4 sm:p-6 lg:p-8"
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary uppercase tracking-tighter mb-1">
                {t('button.join')} <span className="text-accent">QYVORA</span>
              </h1>
              <p className="text-text-muted text-sm">{t('auth2.registerDescription')}</p>
            </div>

            <form className="space-y-4" onSubmit={onRegisterSubmit}>
              <div className="space-y-2">
                <label htmlFor="register-handle" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.operatorHandle')}</label>
                <Input 
                    ref={handleRef} 
                    id="register-handle" 
                    type="text" 
                    name="handle" 
                    required 
                    autoComplete="username"
                    pattern="^[a-zA-Z0-9][a-zA-Z0-9\-]{0,38}[a-zA-Z0-9]$"
                    title={t('validation.handleRules')}
                    placeholder={t('auth.handlePlaceholder')}
                    icon={<User className="w-4 h-4 lg:w-5 lg:h-5" />}
                    className={AUTH_INPUT_SIZE}
                  />
                <HandleSuggestions
                  name={fullName}
                  onSelect={onSuggestionSelect}
                  selectedHandle={selectedHandle}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="register-full-name" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.fullName')}</label>
                  <Input 
                      id="register-full-name" 
                      type="text" 
                      name="full_name" 
                      required 
                      autoComplete="name" 
                      placeholder={t('auth.namePlaceholder')}
                      value={fullName}
                      onChange={(e) => onFullNameChange(e.target.value)}
                      icon={<User className="w-4 h-4 lg:w-5 lg:h-5" />}
                      className={AUTH_INPUT_SIZE}
                    />
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
                  <Input 
                      id="register-email" 
                      type="email" 
                      name="email" 
                      required 
                      autoComplete="email" 
                      inputMode="email" 
                      placeholder={t('auth.emailPlaceholder')}
                      icon={<Mail className="w-4 h-4 lg:w-5 lg:h-5" />}
                      className={AUTH_INPUT_SIZE}
                    />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
                  <PasswordInput id="register-password" name="password" autoComplete="new-password" className={AUTH_INPUT_SIZE} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-confirm-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.confirmPassword')}</label>
                  <PasswordInput id="register-confirm-password" name="confirm_password" autoComplete="new-password" className={AUTH_INPUT_SIZE} />
                </div>
              </div>

              <p className="text-[10px] text-text-muted/70">{t('validation.handleRules')}</p>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <AthenaBoxes />
                    <span className="text-[10px]">{t('button.creatingAccount')}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px]">{t('button.createAccount')}</span> <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;
