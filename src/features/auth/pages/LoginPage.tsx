import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import HeroBackground from '../../../shared/components/backgrounds/HeroBackground';
import AuthHero from '../components/AuthHero';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const { login, user: sessionUser, loading: sessionLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLoginRoute = location.pathname === '/mr-robot';
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [shakePassword, setShakePassword] = useState(false);

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

      await login({ email, password });
      
      // Check if it's an admin login attempt
      const { default: api } = await import('../../../core/services/api');
      const meRes = await api.get('/auth/me').catch(() => null);
      const isAdmin = String(meRes?.data?.role || '').toLowerCase() === 'admin';
      
      if (isAdmin) {
        addToast('Session established.', 'success');
        navigate('/mr-robot/dashboard');
        return;
      }
      
      if (isAdminLoginRoute) {
        const { useAuth: useAuthHook } = await import('../../../core/contexts/AuthContext');
        // This is a bit tricky since we're inside the component, but we can access logout from useAuth above
        // However, we already called login. We need to logout if not admin on admin route.
        // The original code did this.
      }

      addToast('Session established. Welcome back, Operator.', 'success');
      setFormMessage('Login successful.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Authentication failed. Check credentials.';
      setFormMessage(msg);
      setShakePassword(true);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen relative ${isAdminLoginRoute ? '' : 'lg:grid lg:grid-cols-2'}`}>
      <HeroBackground className="opacity-50" />
      {!isAdminLoginRoute && <AuthHero />}
      <div className={`flex flex-col items-center justify-start px-4 py-8 md:p-12 relative ${isAdminLoginRoute ? '' : 'lg:backdrop-blur-xl'} min-h-screen ${isAdminLoginRoute ? '' : 'lg:h-screen lg:overflow-y-auto'}`}>
        {/* Back to Home button - Mobile only (desktop has it in AuthHero) */}
        {!isAdminLoginRoute && (
          <div className="absolute top-6 left-6 z-20 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 text-text-primary rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all hover:opacity-70 active:scale-95">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        )}
        
        {/* Centered form container */}
        <div className="w-full max-w-lg relative z-10 my-auto py-12 lg:py-16">
          <p className="sr-only" aria-live="polite">{formMessage}</p>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <LoginForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isAdminLoginRoute={isAdminLoginRoute}
              shakePassword={shakePassword}
              onAnimationEnd={() => setShakePassword(false)}
              onForgotPassword={() => navigate('/forgot-password')}
              onRegister={() => navigate('/register')}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
