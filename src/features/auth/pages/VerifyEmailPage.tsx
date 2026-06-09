import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../../core/contexts/ToastContext';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';
import api from '../../../core/services/api';
import AuthHero from '../components/AuthHero';
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
    <div className="min-h-screen relative lg:grid lg:grid-cols-2">
      <HeroBackground className="opacity-50" />
      <AuthHero />
      <div className="flex flex-col items-center justify-start px-4 py-8 md:p-12 relative lg:backdrop-blur-xl min-h-screen lg:h-screen lg:overflow-y-auto">
        {/* Back to Home button - Mobile only (desktop has it in AuthHero) */}
        <div className="absolute top-6 left-6 z-20 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        
        {/* Scrollable form container */}
        <div className="w-full max-w-lg relative z-10 my-auto py-12 lg:py-16">
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
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
