import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import api from '../../../core/services/api';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ResetPasswordConfirmForm from '../components/ResetPasswordConfirmForm';

const ForgotPasswordPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token') || '';
  const urlEmail = params.get('email') || '';

  const [mode, setMode] = useState<'forgot' | 'reset-confirm'>(urlToken ? 'reset-confirm' : 'forgot');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState(urlEmail);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const email = String(formData.get('email') || '');

      if (mode === 'forgot') {
        await api.post('/auth/password-reset/request', { email });
        setResetEmail(email);
        addToast('If that email exists, a reset token has been stored. Use it below.', 'success');
        setMode('reset-confirm');
      } else {
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
        navigate('/login');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Password reset request failed.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout>
      <SEO title="Reset Password" description="Reset your QYVORA account password." noindex />
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {mode === 'forgot' ? (
            <ForgotPasswordForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onBackToLogin={() => navigate('/login')}
              onEnterToken={() => setMode('reset-confirm')}
            />
          ) : (
            <ResetPasswordConfirmForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              email={resetEmail}
              onEmailChange={setResetEmail}
              token={urlToken}
              onBack={() => setMode('forgot')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </AuthFormLayout>
  );
};

export default ForgotPasswordPage;
