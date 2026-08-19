import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import api from '../../../core/services/api';
import VerifyEmailForm from '../components/VerifyEmailForm';

type VerifyState = 'idle' | 'verifying' | 'success' | 'error' | 'expired' | 'already_verified';

const PENDING_EMAIL_KEY = 'qyvora_pending_verification_email';
const REQUIRES_VERIFICATION_KEY = 'qyvora_auth_requires_verification';

const VerifyEmailPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialEmail = useCallback(() => {
    const stateEmail = (location.state as any)?.email;
    if (stateEmail) return stateEmail;
    try {
      const pendingEmail = localStorage.getItem(PENDING_EMAIL_KEY);
      if (pendingEmail) return pendingEmail;
    } catch { /* ignore */ }
    return '';
  }, [location.state]);

  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [verifyEmail, setVerifyEmail] = useState(getInitialEmail);
  const [resendCooldown, setResendCooldown] = useState(0);
  const autoSentRef = React.useRef(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (autoSentRef.current) return;
    if (!verifyEmail) return;
    autoSentRef.current = true;
    try {
      localStorage.removeItem(PENDING_EMAIL_KEY);
      localStorage.removeItem(REQUIRES_VERIFICATION_KEY);
    } catch { /* ignore */ }
    handleResendVerification(verifyEmail);
  }, [verifyEmail]);

  const handleVerifyOtp = async (otp: string) => {
    setVerifyState('verifying');
    try {
      const res = await api.post('/auth/verify-email/confirm', { otp });
      if (res.data?.success) {
        if (res.data?.message === 'Email is already verified') {
          setVerifyState('already_verified');
        } else {
          setVerifyState('success');
          addToast('Email verified successfully! You can now sign in.', 'success');
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

  const handleResendVerification = async (emailOverride?: string) => {
    const emailToUse = emailOverride || verifyEmail;
    if (!emailToUse) {
      addToast('Enter your email address to resend.', 'error');
      return;
    }
    try {
      await api.post('/auth/verify-email/request', { email: emailToUse });
      addToast('New verification code sent. Check your inbox.', 'success');
      setResendCooldown(60);
      setVerifyState('idle');
    } catch {
      addToast('Could not resend. Try again later.', 'error');
    }
  };

  const handleBackToLogin = () => {
    try {
      localStorage.removeItem(PENDING_EMAIL_KEY);
      localStorage.removeItem(REQUIRES_VERIFICATION_KEY);
    } catch { /* ignore */ }
    navigate('/login');
  };

  return (
    <AuthFormLayout>
      <SEO title="Verify Email" description="Verify your QYVORA email address to activate your account." noindex />
      <VerifyEmailForm
        state={verifyState}
        email={verifyEmail}
        onEmailChange={setVerifyEmail}
        onBackToLogin={handleBackToLogin}
        onResendCode={() => handleResendVerification()}
        onVerifyOtp={handleVerifyOtp}
        resendCooldown={resendCooldown}
        onResetState={() => setVerifyState('idle')}
      />
    </AuthFormLayout>
  );
};

export default VerifyEmailPage;
