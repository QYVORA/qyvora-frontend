import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, LogIn, Terminal, Shield, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { IconArrowLeft } from '@/shared/components/icons';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import PasswordInput from '../components/PasswordInput';
import api from '../../../core/services/api';
import ADMIN_PATH from '@/shared/utils/adminPath';
import Input from '@/shared/components/ui/Input';
import AuthForm, { type AuthMode } from '../components/AuthForm';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, user: sessionUser, loading: sessionLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoginRoute = location.pathname === ADMIN_PATH;
  
  const [mode, setMode] = useState<AuthMode>(() =>
    (location.state as { authMode?: AuthMode } | null)?.authMode === 'register' ? 'register' : 'login'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [shakePassword, setShakePassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedHandle, setSelectedHandle] = useState('');
  const handleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionLoading || !isAdminLoginRoute) return;
    if (sessionUser?.isAdmin) {
      navigate(`${ADMIN_PATH}/dashboard`, { replace: true });
    }
  }, [sessionLoading, sessionUser, isAdminLoginRoute, navigate]);

  const handleSuggestionSelect = useCallback((handle: string) => {
    setSelectedHandle(handle);
    if (handleRef.current) {
      handleRef.current.value = handle;
    }
  }, []);

  const handleFullNameChange = useCallback((value: string) => {
    setFullName(value);
    setSelectedHandle('');
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);
    setFormMessage('');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');

      await login({ email, password, isAdminRoute: isAdminLoginRoute });
      
      // login() already calls /auth/me and sets user state internally.
      // Determine redirect based on isAdminRoute to avoid a redundant API call.
      if (isAdminLoginRoute) {
        addToast('Session established.', 'success');
        navigate(`${ADMIN_PATH}/dashboard`);
        return;
      }

      addToast('Session established. Welcome back, Operator.', 'success');
      setFormMessage('Login successful.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = sanitizeError(err, 'login');
      setFormMessage(msg);
      setShakePassword(true);
      addToast(msg, 'error');
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');
      const handle = String(formData.get('handle') || '').trim();
      const fullName = String(formData.get('full_name') || '').trim();
      const confirmPassword = String(formData.get('confirm_password') || '');

      if (password !== confirmPassword) {
        addToast('Passwords do not match.', 'error');
        return;
      }

      await api.post('/auth/register', {
        role: 'student',
        inviteCode: '',
        profile: { fullName, organization: '', handle },
        credentials: { email, password },
      });

      await login({ email, password });
      addToast('Session established. Welcome, Operator.', 'success');
      setFormMessage('Account created successfully.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = sanitizeError(err, 'register');
      setFormMessage(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login gets the old simplified layout
  if (isAdminLoginRoute) {
    return (
      <>
        <SEO title="Admin Login" description="Sign in to QYVORA admin workspace." noindex />
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-bg">
          <div className="w-full max-w-lg">
            <p className="sr-only" aria-live="polite">{formMessage}</p>
            <div className="rounded-2xl border border-border/30 bg-bg-card p-6 md:p-8">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-1 text-text-primary">
                  {t('heading.workspaceAccess1')} <span className="text-accent">{t('heading.workspaceAccess2')}</span>
                </h1>
                <p className="text-sm text-text-muted">{t('auth.enterCredentials')}</p>
              </div>

            <form className="space-y-6" onSubmit={handleLoginSubmit} noValidate>
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
                      className="lg:py-4"
                    />
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
                  <PasswordInput
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    shake={shakePassword}
                    onAnimationEnd={() => setShakePassword(false)}
                    className="lg:py-4"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-bg-card border border-border text-text-primary hover:border-accent/40 active:scale-[0.98] !rounded-xl !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <span className="text-[10px]">{isLoading ? t('button.signingIn') : t('button.signIn')}</span> <LogIn className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Student auth - shared form (AuthForm lives at module level so React
  // never remounts it on parent re-renders, which would wipe typed input).
  const authFormProps = {
    mode,
    onModeChange: setMode,
    isLoading,
    shakePassword,
    onShakeEnd: () => setShakePassword(false),
    formMessage,
    fullName,
    selectedHandle,
    onFullNameChange: handleFullNameChange,
    onSuggestionSelect: handleSuggestionSelect,
    handleRef,
    onLoginSubmit: handleLoginSubmit,
    onRegisterSubmit: handleRegisterSubmit,
    onForgotPassword: () => navigate('/forgot-password'),
  };

  const authBullets = [
    { icon: Terminal, text: t('auth.bullets.labs') },
    { icon: Shield, text: t('auth.bullets.scenarios') },
    { icon: Trophy, text: t('auth.bullets.ctf') },
  ];

  return (
    <>
      <SEO 
        title={mode === 'login' ? 'Login' : 'Register'} 
        description={mode === 'login' 
          ? 'Sign in to your QYVORA account to continue your offensive security training.' 
          : 'Create your QYVORA account to start your offensive security training journey.'
        } 
        noindex 
      />
      
      {/* Mobile: form only, centered */}
      <div className="md:hidden relative w-full min-h-dvh flex flex-col bg-bg" data-nav-invert>
        <GridBoxedBackground blur={0} mask="right" />
        
        {/* Back to Home button - Mobile */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
          >
            <IconArrowLeft size={16} /> Back to Home
          </button>
        </div>
        
        <div className="relative z-10 w-full flex-1 flex flex-col px-3 md:px-4 lg:px-6 pt-24 pb-10">
          <div className="my-auto w-full">
            <AuthForm {...authFormProps} />
          </div>
        </div>
      </div>

      {/* Desktop: PublicHeroSection with left hero and right form (page scrolls) */}
      <div className="hidden md:block">
        <PublicHeroSection
          mask="right"
          showGlobe
          scrollable
          splitAt="md"
          rightContent={
            <div className="flex items-center justify-center h-full w-full py-8">
              <div className="w-full max-w-md">
                <AuthForm {...authFormProps} />
              </div>
            </div>
          }
        >
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-border/30 bg-bg-elevated/50 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
              <span className="font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
                {t('hero.tagline')}
              </span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter leading-none">
                {mode === 'login' ? (
                  <>{t('hero.welcomeBack')} <span className="text-accent">{t('hero.operator')}</span></>
                ) : (
                  <>Join <span className="text-accent">QYVORA</span></>
                )}
              </h2>
              <p className="text-base text-text-muted mt-3 max-w-xl leading-relaxed">
                {mode === 'login' ? t('auth.signIntoContinue') : t('hero.authDescription')}
              </p>
            </div>
            <ul className="grid gap-2.5">
              {authBullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-text-muted font-mono leading-tight">
                  <Icon className="w-4 h-4 text-accent flex-none" /> {text}
                </li>
              ))}
            </ul>
          </div>
          {/* Back to Home button - Desktop */}
          <div className="absolute top-6 left-6 z-20">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
            >
              <IconArrowLeft size={16} /> Back to Home
            </button>
          </div>
        </PublicHeroSection>
      </div>
    </>
  );
};

export default LoginPage;
