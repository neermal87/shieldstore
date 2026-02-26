import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loginWithToken(token).then(() => navigate('/', { replace: true })).catch(() => navigate('/login', { replace: true }));
    } else {
      navigate('/login', { replace: true });
    }
  }, [token, loginWithToken, navigate]);

  return <div className="min-h-[50vh] flex items-center justify-center dark:text-gray-400">Signing you in...</div>;
}
