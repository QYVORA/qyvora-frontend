import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterPage now redirects to LoginPage with the registration form.
 * The unified auth experience is handled in LoginPage with a toggle.
 */
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
};

export default RegisterPage;
