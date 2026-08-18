import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import { sanitizeError } from '../../../shared/utils/sanitizeError';
import api from '../../../core/services/api';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import OtpInputForm from '../components/OtpInputForm';
import ResetPasswordConfirmForm from '../components/ResetPasswordConfirmForm';

type Step = 'email' | 'otp' | 'reset' | 'success';

const ForgotPasswordPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const emailValue = String(formData.get('email') || '').trim().toLowerCase();
      setEmail(emailValue);
      await api.post('/auth/forgot-password', { email: emailValue });
      addToast('If that email exists, a verification code has been sent.', 'success');
      setStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      const msg = sanitizeError(err, 'reset');
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async (otp: string) => {
    setOtpError(null);
    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-password-reset-otp', { email, otp });
      if (res.data?.resetToken) {
        setResetToken(res.data.resetToken);
        addToast('Code verified. Create your new password.', 'success');
        setStep('reset');
      }
    } catch (err: any) {
      const msg = sanitizeError(err, 'verify');
      setOtpError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [email, addToast]);

  const handleResendOtp = async () => {
    try {
      await api.post('/auth/forgot-password', { email });
      addToast('New verification code sent. Check your inbox.', 'success');
      setResendCooldown(60);
      setOtpError(null);
    } catch {
      addToast('Could not resend. Try again later.', 'error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const newPassword = String(formData.get('new_password') || '');
      const confirmPassword = String(formData.get('confirm_password') || '');
      if (newPassword !== confirmPassword) {
        addToast('Passwords do not match.', 'error');
        return;
      }
      await api.post('/auth/reset-password', {
        resetToken,
        newPassword,
        confirmPassword,
      });
      addToast('Password reset successful. Log in with your new credentials.', 'success');
      setStep('success');
    } catch (err: any) {
      const msg = sanitizeError(err, 'reset');
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout>
      <SEO title="Reset Password" description="Reset your QYVORA account password." noindex />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 'email' && (
            <ForgotPasswordForm
              onSubmit={handleRequestReset}
              isLoading={isLoading}
              onBackToLogin={() => navigate('/login')}
            />
          )}

          {step === 'otp' && (
            <OtpInputForm
              onSubmit={handleVerifyOtp}
              onBack={() => setStep('email')}
              onResendCode={handleResendOtp}
              isLoading={isLoading}
              error={otpError}
              email={email}
              resendCooldown={resendCooldown}
            />
          )}

          {step === 'reset' && (
            <ResetPasswordConfirmForm
              onSubmit={handleResetPassword}
              isLoading={isLoading}
              onBack={() => setStep('otp')}
            />
          )}

          {step === 'success' && (
            <div className="rounded-2xl border border-border/30 bg-bg/40 backdrop-blur-md p-4 sm:p-6 lg:p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-text-primary uppercase tracking-tighter mb-3">
                Password <span className="text-accent">Reset</span>
              </h1>
              <p className="text-text-muted text-sm mb-8">
                Your password has been reset. You can now sign in with your new credentials.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3"
              >
                <span className="text-[10px]">Sign In</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthFormLayout>
  );
};

export default ForgotPasswordPage;
