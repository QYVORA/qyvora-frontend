import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, LogIn, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import { IconShield, IconTerminal, IconTarget, IconArrowLeft } from '@/shared/components/icons';
import { Logo } from '@/shared/components/brand';
import PasswordInput from '../components/PasswordInput';
import HandleSuggestions from '../../../shared/components/HandleSuggestions';
import api from '../../../core/services/api';
import ADMIN_PATH from '@/shared/utils/adminPath';

type AuthMode = 'login' | 'register';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, user: sessionUser, loading: sessionLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoginRoute = location.pathname === ADMIN_PATH;
  
  const [mode, setMode] = useState<AuthMode>('login');
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

  const handleSuggestionSelect = (handle: string) => {
    setSelectedHandle(handle);
    if (handleRef.current) {
      handleRef.current.value = handle;
    }
  };

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
      
      const meRes = await api.get('/auth/me').catch(() => null);
      const isAdmin = String(meRes?.data?.role || '').toLowerCase() === 'admin';
      
      if (isAdmin) {
        addToast('Session established.', 'success');
        navigate(`${ADMIN_PATH}/dashboard`);
        return;
      }

      addToast('Session established. Welcome back, Operator.', 'success');
      setFormMessage('Login successful.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Authentication failed. Check credentials.';
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
      const msg = err?.response?.data?.error || 'Registration failed.';
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
                  {t('heading.workspaceAccess')}
                </h1>
                <p className="text-sm text-text-muted">{t('auth.enterCredentials')}</p>
              </div>

              <form className="space-y-5" onSubmit={handleLoginSubmit} noValidate>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
                  <div className="relative">
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder={t('auth.emailPlaceholder')}
                      className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
                  <PasswordInput
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    shake={shakePassword}
                    onAnimationEnd={() => setShakePassword(false)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-bg-card border border-border text-text-primary hover:border-accent/40 !rounded-xl !py-4 flex items-center justify-center gap-3 disabled:opacity-50 text-[10px] font-black uppercase tracking-widest transition-all"
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

  // Student auth - shared form component
  const AuthForm = () => (
    <div className="space-y-6">
      <p className="sr-only" aria-live="polite">{formMessage}</p>

      {/* Toggle between login and register */}
      <div className="flex bg-bg/90 border border-bg/50 p-1.5 rounded-xl backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
            mode === 'login'
              ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          {t('button.logIn')}
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={cn(
            'flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
            mode === 'register'
              ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
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
            className="rounded-2xl bg-bg/90 backdrop-blur-sm p-6 lg:p-8"
          >
            <form className="space-y-5" onSubmit={handleLoginSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.password')}</label>
                  <button 
                    type="button" 
                    onClick={() => navigate('/forgot-password')} 
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
                  onAnimationEnd={() => setShakePassword(false)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
            className="rounded-2xl bg-bg/90 backdrop-blur-sm p-6 lg:p-8"
          >
            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              <div className="space-y-2">
                <label htmlFor="register-handle" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.operatorHandle')}</label>
                <div className="relative">
                  <input 
                    ref={handleRef} 
                    id="register-handle" 
                    type="text" 
                    name="handle" 
                    required 
                    autoComplete="username"
                    pattern="^[a-zA-Z0-9][a-zA-Z0-9\-]{0,38}[a-zA-Z0-9]$"
                    title={t('validation.handleRules')}
                    placeholder={t('auth.handlePlaceholder')}
                    className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" 
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                </div>
                <HandleSuggestions
                  name={fullName}
                  onSelect={handleSuggestionSelect}
                  selectedHandle={selectedHandle}
                />
                <p className="text-[10px] text-text-muted/70 mt-1">{t('validation.handleRules')}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-full-name" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.fullName')}</label>
                <div className="relative">
                  <input 
                    id="register-full-name" 
                    type="text" 
                    name="full_name" 
                    required 
                    autoComplete="name" 
                    placeholder={t('auth.namePlaceholder')}
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setSelectedHandle(''); }}
                    className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" 
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-email" className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('form.email')}</label>
                <div className="relative">
                  <input 
                    id="register-email" 
                    type="email" 
                    name="email" 
                    required 
                    autoComplete="email" 
                    inputMode="email" 
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full bg-bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-all font-mono text-sm" 
                  />
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

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <span className="text-[10px]">{isLoading ? t('button.creatingAccount') : t('button.createAccount')}</span> <LogIn className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const bullets = [
    { icon: IconTerminal, text: 'Hands-on penetration testing labs' },
    { icon: IconShield, text: 'Real-world offensive security scenarios' },
    { icon: IconTarget, text: 'Capture the flag challenges & rankings' },
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
      
      {/* Mobile: Form with accent background */}
      <div className="lg:hidden relative w-full min-h-dvh overflow-hidden flex flex-col bg-accent">
        <GridBoxedBackground opacity={0.5} blur={0} mask="none" />
        
        {/* Back to Home button - Mobile */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 px-4 py-2 text-bg rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
          >
            <IconArrowLeft size={16} /> Back to Home
          </button>
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-dvh px-4 pt-24 pb-12 overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* Desktop: PublicHeroSection with left hero and right form */}
      <div className="hidden lg:block">
        <PublicHeroSection mask="right" showGlobe={false}>
          {/* Back to Home button - Desktop */}
          <div className="absolute top-6 left-6 z-20">
            <button 
              onClick={() => navigate('/')} 
              className="inline-flex items-center gap-2 px-4 py-2 text-bg rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95"
            >
              <IconArrowLeft size={16} /> Back to Home
            </button>
          </div>

          {/* Left column hero content */}
          <Logo size="md" variant="full" color="#000000" />

          <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
            Africa&apos;s offensive security platform built to sharpen your skills from the ground up.
          </p>

          <ul className="flex flex-col gap-4">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex-none w-9 h-9 rounded-xl bg-bg/10 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-bg" />
                </span>
                <span className="text-bg text-sm font-bold">{text}</span>
              </li>
            ))}
          </ul>

          {/* Right column form - positioned absolutely to overlay */}
          <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center px-16 xl:px-20 py-24 overflow-y-auto">
            <div className="w-full max-w-md my-auto">
              <AuthForm />
            </div>
          </div>
        </PublicHeroSection>
      </div>
    </>
  );
};

export default LoginPage;
