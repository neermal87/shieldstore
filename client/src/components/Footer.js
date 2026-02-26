import React from 'react';
import { Link } from 'react-router-dom';

const footerCols = [
  { title: 'Get to Know Us', links: [{ to: '/', label: 'About Shield' }, { to: '/products', label: 'Careers' }, { to: '/products', label: 'Press' }] },
  { title: 'Make Money with Us', links: [{ to: '/products', label: 'Sell on Shield' }, { to: '/products', label: 'Advertise' }] },
  { title: 'Let Us Help You', links: [{ to: '/orders', label: 'Returns & Orders' }, { to: '/', label: 'Shipping' }, { to: '/', label: 'Help' }] },
];

export default function Footer() {
  return (
    <footer className="mt-auto dark:bg-dark-900 border-t border-dark-700">
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full py-3 dark:bg-dark-800 dark:hover:bg-dark-700 text-neon-cyan font-medium text-sm transition-colors">
        Back to top
      </button>
      <div className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="font-display font-semibold text-neon-cyan mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(({ to, label }) => (
                  <li key={label}><Link to={to} className="text-sm dark:text-gray-400 hover:text-neon-cyan hover:underline">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-display font-semibold text-neon-cyan mb-3">Shield</h3>
            <p className="text-sm dark:text-gray-400">Gaming & electronics store. Dark theme, neon vibes.</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-dark-700 flex flex-wrap justify-center items-center gap-4 text-xs dark:text-gray-500">
          <Link to="/" className="hover:text-neon-cyan">Conditions of Use</Link>
          <Link to="/" className="hover:text-neon-cyan">Privacy Notice</Link>
          <Link to="/admin/login" className="hover:text-neon-cyan opacity-80">Admin</Link>
          <span>© {new Date().getFullYear()} Shield, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
