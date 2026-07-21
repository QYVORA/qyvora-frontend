import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import api from '../../../core/services/api';
import VerifyEmailForm from '../components/VerifyEmailForm';

const VerifyEmailPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token') || '';
  const urlEmail = params.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(urlEmail);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const token = String(formData.get('token') || urlToken);
      await api.post('/auth/verify-email/confirm', { token });
      addToast('Email verified. You can now log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Verification failed.';
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
    <AuthFormLayout>
      <SEO title="Verify Email" description="Verify your QYVORA email address to activate your account." noindex />
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
        <VerifyEmailForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          email={verifyEmail}
          token={urlToken}
          onBackToLogin={() => navigate('/login')}
          onResendToken={handleResendVerification}
        />
      </motion.div>
    </AuthFormLayout>
  );
};

export default VerifyEmailPage;
