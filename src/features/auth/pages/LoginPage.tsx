import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth, MustChangePasswordError } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import PasswordInput from '../components/PasswordInput';
import api from '../../../core/services/api';
import ADMIN_PATH from '@/shared/utils/adminPath';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import AuthForm, { type AuthMode } from '../components/AuthForm';

const LoginPage: React.FC = () => {
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
      if (err instanceof MustChangePasswordError) {
        setIsLoading(false);
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
        <div className="min-h-dvh flex items-center justify-center bg-canvas px-3 py-8 md:px-4 lg:px-6">
          <div className="w-full max-w-lg">
            <p className="sr-only" aria-live="polite">{formMessage}</p>
            <div className="rounded-xl border border-border-subtle bg-surface p-5 sm:p-8">
              <div className="mb-8">
                <h1 className="type-h2 mb-1 font-black uppercase tracking-tight text-text-primary">
                  {"Workspace"} <span className="text-accent">{"Access"}</span>
                </h1>
                <p className="type-body-sm">{"Enter your credentials to continue."}</p>
              </div>

            <form className="space-y-5" onSubmit={handleLoginSubmit} noValidate>
                <div className="space-y-2">
                  <label htmlFor="login-email" className="type-label mb-2 block uppercase tracking-[0.12em] text-text-tertiary">{"Email"}</label>
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
                  <label htmlFor="login-password" className="type-label mb-2 block uppercase tracking-[0.12em] text-text-tertiary">{"Password"}</label>
                  <PasswordInput
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    shake={shakePassword}
                    onAnimationEnd={() => setShakePassword(false)}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading} loading={isLoading}>
                  {"Sign In"}
                </Button>
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
