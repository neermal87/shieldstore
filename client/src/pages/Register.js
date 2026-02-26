import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loginWithToken } = useAuth();

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.token) await loginWithToken(data.token);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-dark-700 dark:bg-dark-900 shadow-xl">
        <h1 className="font-display text-2xl font-bold text-neon-cyan mb-1">Create account</h1>
        <p className="text-sm dark:text-gray-500 mb-6">New to Shield? Register below.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Full name</label>
            <input id="reg-name" type="text" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Email</label>
            <input id="reg-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Password (min 6 characters)</label>
            <input id="reg-password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="reg-confirm" className="block text-sm font-medium dark:text-gray-300 mb-1.5">Confirm password</label>
            <input id="reg-confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="input-ring w-full px-4 py-2.5 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 bg-neon-orange text-black font-bold rounded-lg">{loading ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-sm dark:text-gray-500"><Link to="/login" className="text-neon-cyan hover:underline font-medium">Already have an account? Sign in</Link></p>
      </div>
    </div>
  );
}
