import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data || [])).catch(() => setCategories([])); }, []);
  const allowedSlugs = ['free-fire-diamonds', 'free-fire-subscriptions', 'fashion'];
  const parentCats = categories.filter((c) => allowedSlugs.includes(c.slug)).sort((a, b) => allowedSlugs.indexOf(a.slug) - allowedSlugs.indexOf(b.slug));
  const subCats = categories.filter((c) => c.parent && parentCats.some((p) => (c.parent?._id || c.parent) === p._id));

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 dark:bg-dark-900 border-b border-dark-700 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-4 flex-wrap">
        <Link to="/" className="flex items-center shrink-0 py-1" title="The Shield Store">
          <img
            src={`${process.env.PUBLIC_URL || ''}/logo.png`}
            alt="The Shield Store"
            width={120}
            height={44}
            className="h-9 w-auto max-h-11 sm:h-10 sm:max-h-12 max-w-[120px] object-contain object-left"
            loading="eager"
            decoding="async"
            onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL || ''}/logo.svg`; }}
          />
        </Link>

        <div className="hidden md:flex flex-col items-start text-left px-2 py-1 text-xs dark:text-gray-400">
          <span className="text-[10px] uppercase">Deliver to</span>
          <span className="font-semibold dark:text-gray-200">Your location</span>
        </div>

        <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-2xl flex">
          <div className="flex w-full rounded-lg overflow-hidden border border-dark-700 dark:bg-dark-800 focus-within:ring-2 focus-within:ring-neon-cyan">
            <input
              type="search"
              placeholder="Search Shield"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 dark:bg-dark-800 dark:text-gray-200 text-sm outline-none placeholder:text-gray-500"
              aria-label="Search"
            />
            <button type="submit" className="px-4 py-2 bg-neon-orange text-black font-bold hover:bg-amber-500 transition-colors">
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={toggleTheme} className="p-2 rounded dark:bg-dark-800 dark:hover:bg-dark-700 transition-colors" aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>

          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
              className="flex flex-col items-start text-left px-2 py-1 text-xs dark:text-gray-400 hover:text-neon-cyan border border-transparent hover:border-neon-cyan/50 rounded"
            >
              <span className="text-[10px]">Hello, {user ? user.name?.split(' ')[0] || 'User' : 'Sign in'}</span>
              <span className="font-semibold dark:text-gray-200">{user ? 'Account & Lists' : 'Account'}</span>
            </button>
            {accountOpen && (
              <div className="absolute top-full right-0 mt-0 w-56 py-2 dark:bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="font-semibold dark:text-gray-200 truncate">{user.name}</p>
                      <p className="text-xs dark:text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/orders" className="block px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700 hover:text-neon-cyan">Orders</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700 hover:text-neon-cyan">Profile</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700 hover:text-neon-cyan">Wishlist</Link>
                    {isAdmin && <Link to="/admin" className="block px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700 hover:text-neon-cyan">Admin</Link>}
                    <button type="button" onClick={() => { setAccountOpen(false); logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700 text-neon-orange">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3 text-center bg-neon-orange text-black font-bold rounded mx-2 mb-2">Sign in</Link>
                    <Link to="/register" className="block px-4 py-2 text-sm dark:text-gray-300 hover:bg-dark-700">New customer? Start here</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/orders" className="hidden sm:flex flex-col items-start text-left px-2 py-1 text-xs dark:text-gray-400 hover:text-neon-cyan rounded">
            <span className="text-[10px]">Returns</span>
            <span className="font-semibold dark:text-gray-200">& Orders</span>
          </Link>

          <Link to="/cart" className="flex items-end gap-0.5 px-2 py-1 text-neon-cyan hover:text-neon-orange transition-colors" title="Cart">
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-sm">{cartCount > 0 ? cartCount : '0'}</span>
            <span className="hidden sm:inline font-semibold text-sm dark:text-gray-200 ml-0.5">Cart</span>
          </Link>
        </div>
      </div>

      <nav className="dark:bg-dark-800 border-t border-dark-700">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-1.5 flex flex-wrap items-center gap-2 sm:gap-6">
          <Link to="/" className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium dark:text-gray-300 hover:text-neon-cyan hover:bg-dark-700 rounded"><span className="text-lg">☰</span> All</Link>
          <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
            <span className="cursor-pointer px-2 py-1.5 text-sm font-medium dark:text-gray-300 hover:text-neon-cyan hover:bg-dark-700 rounded">Categories ▾</span>
            {categoriesOpen && categories.length > 0 && (
              <div className="absolute top-full left-0 mt-0 w-52 py-2 dark:bg-dark-900 border border-dark-700 rounded-lg shadow-xl z-50">
                {parentCats.map((p) => (
                  <div key={p._id}>
                    <Link to={`/products?category=${p.slug}`} className="block px-4 py-2 text-sm font-medium dark:text-gray-200 hover:bg-dark-700 hover:text-neon-cyan">{p.name}</Link>
                    {subCats.filter((s) => (s.parent?._id || s.parent) === p._id).map((s) => (
                      <Link key={s._id} to={`/products?category=${s.slug}`} className="block px-4 py-1.5 pl-6 text-sm dark:text-gray-400 hover:bg-dark-700 hover:text-neon-cyan">{s.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to="/products?featured=true" className="text-sm dark:text-gray-300 hover:text-neon-cyan">Today&apos;s Deals</Link>
          <Link to="/products" className="text-sm dark:text-gray-300 hover:text-neon-cyan">All Products</Link>
          <Link to="/wishlist" className="text-sm dark:text-gray-300 hover:text-neon-cyan">Wishlist</Link>
        </div>
      </nav>
    </header>
  );
}
