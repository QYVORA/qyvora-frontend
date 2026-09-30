import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { useToast } from '@/core/contexts/ToastContext';
import { BrandGithubIcon, BrandGoogleIcon } from '@/shared/components/icons';
import PasswordInput from './PasswordInput';
import HandleSuggestions from '@/shared/components/HandleSuggestions';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

export type AuthMode = 'login' | 'register';

/**
 * OAuthIcons — GitHub + Google sign-in, icon-only row rendered below the main
 * credentials form. Providers are not wired up yet, so clicking one surfaces a
 * "coming soon" toast instead of starting a flow.
 */
const OAuthIcons = ({ onOAuthClick }: { onOAuthClick: (provider: 'GitHub' | 'Google') => void }) => {
  const iconBtn =
    'flex h-12 w-12 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised ' +
    'text-text-secondary transition-[background-color,border-color,color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] ' +
    'hover:border-accent/40 hover:text-accent active:scale-95 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  return (
    <div className="flex items-center justify-center gap-3">
      <button type="button" onClick={() => onOAuthClick('GitHub')} className={iconBtn} aria-label={"Continue with GitHub"}>
        <BrandGithubIcon className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => onOAuthClick('Google')} className={iconBtn} aria-label={"Continue with Google"}>
        <BrandGoogleIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

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
}

const labels = {
  base: 'type-label mb-2 block uppercase tracking-[0.12em] text-text-tertiary',
};

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
}) => {
  const prefersReduced = useReducedMotion();
  const { addToast } = useToast();

  const handleOAuthClick = (provider: 'GitHub' | 'Google') => {
    addToast(`${provider} sign-in is coming soon.`, 'info');
  };

  const modes: AuthMode[] = ['login', 'register'];
  const modeLabels: Record<AuthMode, string> = {
    login: "Log In",
    register: "Create Account",
  };

  const panelMotion = prefersReduced
    ? { initial: false, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 8 }, exit: { opacity: 0, y: -8 } };

  return (
    <div className="w-full space-y-4 md:space-y-5">
      <p className="sr-only" aria-live="polite">{formMessage}</p>

      {/* Quiet mode toggle */}
      <div role="group" aria-label={"Choose sign in or register"} className="flex w-full rounded-lg bg-surface-raised p-1">
        {modes.map((m) => {
          const selected = mode === m;
          return (
            <button
              key={m}
              type="button"
              aria-pressed={selected}
              onClick={() => onModeChange(m)}
              className={cn(
                'min-h-[44px] flex-1 rounded-lg text-sm font-bold transition-[background-color,color] duration-[var(--dur-fast)] ease-[var(--ease-smooth)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                selected ? 'bg-accent text-on-accent' : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              {modeLabels[m]}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === 'login' ? (
          <motion.div
            key="login"
            {...panelMotion}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-xl border border-border-subtle bg-surface p-5 sm:p-8"
          >
            <div className="mb-5 md:mb-8">
              <h1 className="type-h2 mb-1 font-black uppercase tracking-tight text-text-primary">
                {"Welcome back,"} <span className="text-accent">{"Operator"}</span>
              </h1>
              <p className="type-body-sm">{"Sign in to continue your training."}</p>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={onLoginSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="login-email" className={labels.base}>{"Email"}</label>
                <Input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={"operator@qyvora.africa"}
                  icon={<Mail className="h-4 w-4 lg:h-5 lg:w-5" />}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className={labels.base}>{"Password"}</label>
                <PasswordInput
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  shake={shakePassword}
                  onAnimationEnd={onShakeEnd}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading} loading={isLoading}>
                {"Sign In"}
              </Button>

              <div className="border-t border-border-subtle pt-4 md:pt-5">
                <OAuthIcons onOAuthClick={handleOAuthClick} />
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            {...panelMotion}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-xl border border-border-subtle bg-surface p-5 sm:p-8"
          >
            <div className="mb-5 md:mb-8">
              <h1 className="type-h2 mb-1 font-black uppercase tracking-tight text-text-primary">
                {"Join"} <span className="text-accent">QYVORA</span>
              </h1>
              <p className="type-body-sm">{"Create your account to start learning."}</p>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={onRegisterSubmit}>
              <div className="space-y-2">
                <label htmlFor="register-handle" className={labels.base}>{"Operator Handle"}</label>
                <Input
                  ref={handleRef}
                  id="register-handle"
                  type="text"
                  name="handle"
                  required
                  autoComplete="username"
                  pattern="^[a-zA-Z0-9][a-zA-Z0-9\-]{0,38}[a-zA-Z0-9]$"
                  title={"Letters, numbers, and hyphens only. No spaces."}
                  placeholder={"Pick a handle or choose one below"}
                  icon={<User className="h-4 w-4 lg:h-5 lg:w-5" />}
                />
                <HandleSuggestions
                  name={fullName}
                  onSelect={onSuggestionSelect}
                  selectedHandle={selectedHandle}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
                <div className="space-y-2">
                  <label htmlFor="register-full-name" className={labels.base}>{"Full Name"}</label>
                  <Input
                    id="register-full-name"
                    type="text"
                    name="full_name"
                    required
                    autoComplete="name"
                    placeholder={"Kwame Mensah"}
                    value={fullName}
                    onChange={(e) => onFullNameChange(e.target.value)}
                    icon={<User className="h-4 w-4 lg:h-5 lg:w-5" />}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-email" className={labels.base}>{"Email"}</label>
                  <Input
                    id="register-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder={"operator@qyvora.africa"}
                    icon={<Mail className="h-4 w-4 lg:h-5 lg:w-5" />}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
                <div className="space-y-2">
                  <label htmlFor="register-password" className={labels.base}>{"Password"}</label>
                  <PasswordInput id="register-password" name="password" autoComplete="new-password" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="register-confirm-password" className={labels.base}>{"Confirm Password"}</label>
                  <PasswordInput id="register-confirm-password" name="confirm_password" autoComplete="new-password" />
                </div>
              </div>

              <p className="type-meta" role="note">{"Letters, numbers, and hyphens only. No spaces."}</p>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading} loading={isLoading}>
                {"Create Account"}
              </Button>

              <div className="border-t border-border-subtle pt-4 md:pt-5">
                <OAuthIcons onOAuthClick={handleOAuthClick} />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;