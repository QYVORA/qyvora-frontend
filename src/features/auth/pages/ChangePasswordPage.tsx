import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useToast } from '../../../core/contexts/ToastContext';
import SEO from '@/shared/components/SEO';
import { AuthFormLayout } from '@/shared/components/layout';
import api from '../../../core/services/api';
import ChangePasswordForm from '../components/ChangePasswordForm';

import ADMIN_PATH from '@/shared/utils/adminPath';

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
        navigate(`${ADMIN_PATH}/dashboard`);
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
    <AuthFormLayout>
      <SEO title="Change Password" description="Change your QYVORA account password." noindex />
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
        <ChangePasswordForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          token={urlToken}
        />
      </motion.div>
    </AuthFormLayout>
  );
};

export default ChangePasswordPage;
