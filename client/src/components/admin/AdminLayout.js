import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Products', icon: '📦' },
  { to: '/admin/categories', label: 'Categories', icon: '📁' },
  { to: '/admin/orders', label: 'Orders', icon: '🛒' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar - distinct admin theme (no neon/gaming) */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-18'} bg-slate-800 text-white flex flex-col shrink-0 transition-all duration-200 shadow-xl`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <Link to="/admin" className="font-semibold text-slate-100 truncate">
            {sidebarOpen ? '🛡 Shield Admin' : '🛡'}
          </Link>
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-slate-700 text-slate-400" aria-label="Toggle sidebar">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="flex-1 py-4">
          {nav.map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ${sidebarOpen ? '' : 'justify-center'}`}>
              <span className="text-lg">{icon}</span>
              {sidebarOpen && <span>{label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-1">
          <Link to="/" className={`flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white text-sm ${sidebarOpen ? '' : 'justify-center'}`}>
            ← Store
          </Link>
          <button type="button" onClick={() => { logout(); navigate('/admin/login'); }} className={`w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white text-sm ${sidebarOpen ? '' : 'justify-center'}`}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-slate-800 font-semibold text-lg">Admin Panel</h1>
          <span className="text-sm text-slate-500">{user?.email}</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
