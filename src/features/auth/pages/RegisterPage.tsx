import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import HeroBackground from '../../marketing/components/HeroBackground';
import api from '../../../core/services/api';
import AuthHero from '../components/AuthHero';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed.';
      setFormMessage(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden relative grid grid-cols-1 lg:grid-cols-2">
      <HeroBackground className="opacity-50" />
      <AuthHero />
      <div className="flex flex-col items-center justify-center px-4 py-8 md:p-12 relative lg:backdrop-blur-xl lg:h-full lg:overflow-y-auto">
        <div className="absolute top-6 left-6 z-20 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-text-primary text-bg rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:brightness-110 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
        <div className="w-full max-w-lg relative z-10">
          <p className="sr-only" aria-live="polite">{formMessage}</p>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <RegisterForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onLogin={() => navigate('/login')}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
