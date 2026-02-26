import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    const run = async () => {
      try {
        const u = await api.get('/users');
        const p = await api.get('/products?limit=1');
        const o = await api.get('/orders');
        setStats({
          users: (u.data && u.data.length) || 0,
          products: (p.data && p.data.total) || 0,
          orders: (o.data && o.data.length) || 0,
        });
      } catch (_) {}
    };
    run();
  }, []);

  const cards = [
    { label: 'Users', value: stats.users, to: '/admin/users', icon: '👥', color: 'bg-indigo-500' },
    { label: 'Products', value: stats.products, to: '/admin/products', icon: '📦', color: 'bg-emerald-500' },
    { label: 'Orders', value: stats.orders, to: '/admin/orders', icon: '🛒', color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Overview of your store.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ label, value, to, icon, color }) => (
          <Link key={to} to={to} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-2xl mb-4`}>{icon}</div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            <p className="text-sm text-indigo-600 font-medium mt-2">Manage →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
