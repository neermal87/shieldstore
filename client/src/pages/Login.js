import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken, user } = useAuth();
  const from = location.state?.from?.pathname || '/';

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.token) await loginWithToken(data.token);
      toast.success('Logged in');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const apiBase = process.env.REACT_APP_API_URL || '';
  const googleUrl = (apiBase || '') + '/api/auth/google';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-dark-700 dark:bg-dark-900 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-neon-cyan mb-1">Sign in</h1>
        <p className="text-sm dark:text-gray-500 mb-6">Use your Shield account</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 bg-neon-orange text-black font-bold rounded-lg">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-sm dark:text-gray-500">
          <Link to="/register" className="text-neon-cyan hover:underline font-medium">Create account</Link>
          {' · '}
          <a href={googleUrl} className="text-neon-cyan hover:underline">Sign in with Google</a>
        </p>
      </div>
    </div>
  );
}
