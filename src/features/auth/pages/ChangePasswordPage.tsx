import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../../core/contexts/ToastContext';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';
import api from '../../../core/services/api';
import AuthHero from '../components/AuthHero';
import ChangePasswordForm from '../components/ChangePasswordForm';


const _0x5a2b = atob('L21yLXJvYm90');

const ChangePasswordPage: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
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
      
      const meRes = await api.get('/auth/me').catch(() => null);
      if (String(meRes?.data?.role || '').toLowerCase() === 'admin') {
        navigate(`${_0x5a2b}/dashboard`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Password change failed.';
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative md:grid md:grid-cols-2">
      <HeroBackground className="opacity-50" />
      <AuthHero />
      <div className="flex flex-col items-center justify-center px-4 py-8 md:p-12 relative md:backdrop-blur-xl min-h-screen md:h-screen md:overflow-y-auto">
        {/* Back to Home button - Mobile only (desktop has it in AuthHero) */}
        <div className="absolute top-6 left-6 z-20 md:hidden">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        
        {/* Scrollable form container */}
        <div className="w-full max-w-lg relative z-10 py-12 md:py-16">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <ChangePasswordForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              token={urlToken}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
