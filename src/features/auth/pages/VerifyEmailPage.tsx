import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import api from '../../../core/services/api';
import VerifyEmailForm from '../components/VerifyEmailForm';

type VerifyState = 'idle' | 'verifying' | 'success' | 'error' | 'expired' | 'already_verified';

const VerifyEmailPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const stateEmail = (location.state as any)?.email || '';

  const [verifyState, setVerifyState] = useState<VerifyState>(stateEmail ? 'idle' : 'idle');
  const [verifyEmail, setVerifyEmail] = useState(stateEmail);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerifyOtp = async (otp: string) => {
    setVerifyState('verifying');
    try {
      const res = await api.post('/auth/verify-email/confirm', { otp });
      if (res.data?.success) {
        if (res.data?.message === 'Email is already verified') {
          setVerifyState('already_verified');
        } else {
          setVerifyState('success');
          addToast('Email verified successfully!', 'success');
        }
      }
    } catch (err: any) {
      const msg = sanitizeError(err, 'verify');
      const status = err?.response?.status;
      if (status === 400 && msg.includes('expired')) {
        setVerifyState('expired');
      } else {
        setVerifyState('error');
      }
      addToast(msg, 'error');
    }
  };

  const handleResendVerification = async () => {
    if (!verifyEmail) {
      addToast('Enter your email address to resend.', 'error');
      return;
    }
    try {
      await api.post('/auth/verify-email/request', { email: verifyEmail });
      addToast('New verification code sent. Check your inbox.', 'success');
      setResendCooldown(60);
      setVerifyState('idle');
    } catch {
      addToast('Could not resend. Try again later.', 'error');
    }
  };

  return (
    <AuthFormLayout>
      <SEO title="Verify Email" description="Verify your QYVORA email address to activate your account." noindex />
      <VerifyEmailForm
        state={verifyState}
        email={verifyEmail}
        onEmailChange={setVerifyEmail}
        onBackToLogin={() => navigate('/login')}
        onResendCode={handleResendVerification}
        onVerifyOtp={handleVerifyOtp}
        resendCooldown={resendCooldown}
        onResetState={() => setVerifyState('idle')}
      />
    </AuthFormLayout>
  );
};

export default VerifyEmailPage;
