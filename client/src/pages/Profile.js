import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {},
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'street' || name === 'city' || name === 'state' || name === 'zip' || name === 'country') {
      setForm((f) => ({ ...f, address: { ...f.address, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-neon-cyan mb-6">Profile</h1>
      <p className="dark:text-gray-400 mb-4">{user?.email}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
        <input type="text" name="street" placeholder="Street" value={form.address?.street || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
        <input type="text" name="city" placeholder="City" value={form.address?.city || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
        <input type="text" name="country" placeholder="Country" value={form.address?.country || ''} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
        <button type="submit" disabled={loading} className="px-6 py-2 bg-neon-orange text-black font-bold rounded-lg disabled:opacity-70">Save</button>
      </form>
    </div>
  );
}
