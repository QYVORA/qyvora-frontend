import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import PasswordInput from '../components/PasswordInput';
import api from '../../../core/services/api';
import ADMIN_PATH from '@/shared/utils/adminPath';
import Input from '@/shared/components/ui/Input';
import AthenaBoxes from '@/shared/components/AthenaBoxes';
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
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    try {
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
      if (err?.response?.data?.verificationRequired) {
        addToast('Please verify your email before signing in.', 'error');
        navigate('/verify-email', { state: { email } });
        return;
      }
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

      const res = await api.post('/auth/register', {
        role: 'student',
        inviteCode: '',
        profile: { fullName, organization: '', handle },
        credentials: { email, password },
      });

      if (res.data?.verificationRequired) {
        addToast('Account created. Please check your email to verify your account.', 'success');
        navigate('/verify-email', { state: { email } });
        return;
      }

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
                  {isLoading ? (
                    <>
                      <AthenaBoxes />
                      <span className="text-[10px]">{t('button.signingIn')}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px]">{t('button.signIn')}</span> <LogIn className="w-5 h-5" />
                    </>
                  )}
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

  return (
    <AuthFormLayout>
      <SEO 
        title={mode === 'login' ? 'Login' : 'Register'} 
        description={mode === 'login' 
          ? 'Sign in to your QYVORA account to continue your offensive security training.' 
          : 'Create your QYVORA account to start your offensive security training journey.'
        } 
        noindex 
      />
      <AuthForm {...authFormProps} />
    </AuthFormLayout>
  );
};

export default LoginPage;
