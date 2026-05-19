import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, MustChangePasswordError } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import HeroBackground from '../../marketing/components/HeroBackground';
import api from '../../../core/services/api';

import AuthHero from '../components/AuthHero';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ResetPasswordConfirmForm from '../components/ResetPasswordConfirmForm';
import VerifyEmailForm from '../components/VerifyEmailForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

type Mode = 'login' | 'register' | 'forgot' | 'reset-confirm' | 'verify-email' | 'change-password';

const Login: React.FC = () => {
  const { login, logout, user: sessionUser, loading: sessionLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token') || '';
  const urlEmail = params.get('email') || '';
  const isAdminLoginRoute = location.pathname === '/mr-robot';

  const initialMode: Mode =
    isAdminLoginRoute ? 'login' :
    location.pathname === '/register' ? 'register' :
    location.pathname === '/forgot-password' ? 'forgot' :
    location.pathname === '/verify-email' ? 'verify-email' :
    location.pathname === '/reset-password' ? 'reset-confirm' :
    location.pathname === '/change-password' ? 'change-password' : 'login';

  const [mode, setMode] = useState<Mode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [shakePassword, setShakePassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(urlEmail);
  const [verifyEmail, setVerifyEmail] = useState(urlEmail);

  useEffect(() => {
    if (sessionLoading || !isAdminLoginRoute) return;
    if (sessionUser?.isAdmin) {
      navigate('/mr-robot/dashboard', { replace: true });
    }
  }, [sessionLoading, sessionUser, isAdminLoginRoute, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');
      const password = String(formData.get('password') || '');

      if (mode === 'forgot') {
        await api.post('/auth/password-reset/request', { email });
        setResetEmail(email);
        addToast('If that email exists, a reset token has been stored. Use it below.', 'success');
        setFormMessage('If the account exists, we sent reset instructions. Continue with the token form.');
        setMode('reset-confirm');

      } else if (mode === 'reset-confirm') {
        const token = String(formData.get('token') || urlToken);
        const newPassword = String(formData.get('new_password') || '');
        const confirmPassword = String(formData.get('confirm_password') || '');
        if (newPassword !== confirmPassword) {
          addToast('Passwords do not match.', 'error');
          return;
        }
        await api.post('/auth/password-reset/confirm', {
          token,
          email: resetEmail || email,
          password: newPassword,
        });
        addToast('Password reset successful. Log in with your new credentials.', 'success');
        setFormMessage('Password reset successful. You can now log in.');
        setMode('login');

      } else if (mode === 'verify-email') {
        const token = String(formData.get('token') || urlToken);
        await api.post('/auth/verify-email/confirm', { token });
        addToast('Email verified. You can now log in.', 'success');
        setFormMessage('Email verified successfully.');
        setMode('login');

      } else if (mode === 'change-password') {
        const passwordChangeToken = String(formData.get('change_token') || urlToken);
        const newPassword = String(formData.get('new_password') || '');
        const confirmPassword = String(formData.get('confirm_password') || '');
        if (newPassword !== confirmPassword) {
          addToast('Passwords do not match.', 'error');
          return;
        }
        const res = await api.post('/auth/change-password', { passwordChangeToken, newPassword });
        if (res.data?.token) {
          const { setAccessToken } = await import('../../../core/services/api');
          setAccessToken(res.data.token);
        }
        addToast('Password changed. Session established.', 'success');
        setFormMessage('Password changed successfully.');
        const meRes = await api.get('/auth/me').catch(() => null);
        if (String(meRes?.data?.role || '').toLowerCase() === 'admin') {
          navigate('/mr-robot/dashboard');
        } else {
          navigate('/dashboard');
        }

      } else if (mode === 'register') {
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

      } else {
        await login({ email, password });
        const meRes = await api.get('/auth/me').catch(() => null);
        const isAdmin = String(meRes?.data?.role || '').toLowerCase() === 'admin';
        if (isAdmin) {
          addToast('Session established.', 'success');
          navigate('/mr-robot/dashboard');
          return;
        }
        if (isAdminLoginRoute) {
          await logout();
          addToast('Credentials not valid for this workspace.', 'error');
          return;
        }
        addToast('Session established. Welcome back, Operator.', 'success');
        setFormMessage('Login successful.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      if (err instanceof MustChangePasswordError) {
        navigate(`/change-password?token=${encodeURIComponent(err.passwordChangeToken)}`, { replace: true });
        addToast('Your password needs to be updated before continuing.', 'error');
        return;
      }
      const msg = err?.response?.data?.error || 'Authentication failed. Check credentials.';
      setFormMessage(msg);
      if (err?.response?.data?.verificationRequired) {
        setVerifyEmail(String((e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('[name="email"]')?.value || ''));
        addToast('Email not verified. Enter your verification token below.', 'error');
        setMode('verify-email');
        return;
      }
      if (err?.response?.status === 401 || mode === 'login') {
        setShakePassword(true);
      }
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.post('/auth/verify-email/request', { email: verifyEmail });
      addToast('Verification token re-sent if account exists.', 'success');
    } catch {
      addToast('Could not resend. Try again later.', 'error');
    }
  };

  return (
    <div className={`min-h-screen relative grid grid-cols-1 ${isAdminLoginRoute ? '' : 'lg:grid-cols-2'}`}>
      <HeroBackground className="opacity-50" />

      {!isAdminLoginRoute && <AuthHero />}

      <div className="flex flex-col items-center justify-center px-4 py-8 md:p-12 relative">
        <div className="w-full max-w-lg relative z-10">
          <p className="sr-only" aria-live="polite">{formMessage}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'login' && (
                <LoginForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isAdminLoginRoute={isAdminLoginRoute}
                  shakePassword={shakePassword}
                  onAnimationEnd={() => setShakePassword(false)}
                  onForgotPassword={() => setMode('forgot')}
                  onRegister={() => setMode('register')}
                />
              )}

              {mode === 'register' && (
                <RegisterForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  onLogin={() => setMode('login')}
                />
              )}

              {mode === 'forgot' && (
                <ForgotPasswordForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  onBackToLogin={() => setMode('login')}
                  onEnterToken={() => setMode('reset-confirm')}
                />
              )}

              {mode === 'reset-confirm' && (
                <ResetPasswordConfirmForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  email={resetEmail}
                  onEmailChange={setResetEmail}
                  token={urlToken}
                  onBack={() => setMode('forgot')}
                />
              )}

              {mode === 'verify-email' && (
                <VerifyEmailForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  email={verifyEmail}
                  token={urlToken}
                  onBackToLogin={() => setMode('login')}
                  onResendToken={handleResendVerification}
                />
              )}

              {mode === 'change-password' && (
                <ChangePasswordForm
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  token={urlToken}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
