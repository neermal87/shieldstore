import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';

function ProductRow({ title, to, products, loading }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl text-ff-gold">{title}</h2>
        {to && (
          <Link to={to} className="text-sm font-medium text-ff-gold hover:underline">
            View all
          </Link>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-72 bg-dark-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="dark:text-gray-500 py-6">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then((r) => setFeatured(r.data.products || [])).catch(() => setFeatured([])).finally(() => setLoadingFeatured(false));
  }, []);

  const allowedCategorySlugs = ['free-fire-diamonds', 'free-fire-subscriptions', 'fashion'];
  const mainCategories = categories
    .filter((c) => allowedCategorySlugs.includes(c.slug))
    .sort((a, b) => allowedCategorySlugs.indexOf(a.slug) - allowedCategorySlugs.indexOf(b.slug));

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || [])).catch(() => setCategories([])).finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    const allowed = ['free-fire-diamonds', 'free-fire-subscriptions', 'fashion'];
    const main = categories.filter((c) => allowed.includes(c.slug)).sort((a, b) => allowed.indexOf(a.slug) - allowed.indexOf(b.slug));
    if (main.length === 0) return;
    const slugs = main.slice(0, 3).map((c) => c.slug).filter(Boolean);
    slugs.forEach((slug) => {
      api.get(`/products?category=${slug}&limit=6`).then((r) => {
        setCategoryProducts((prev) => ({ ...prev, [slug]: r.data.products || [] }));
      }).catch(() => setCategoryProducts((prev) => ({ ...prev, [slug]: [] })));
    });
  }, [categories]);

  return (
    <div className="space-y-10">
      <HeroCarousel />

      <section className="rounded-xl border border-ff-orange/30 dark:bg-dark-800/50 p-4 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-ff-dark/50 to-dark-800/50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💎</span>
          <div>
            <h2 className="font-display text-lg text-ff-gold">Free Fire Rate List</h2>
            <p className="text-sm dark:text-gray-400">Diamonds & subscriptions – best rates in RS.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/products?category=free-fire-diamonds" className="px-4 py-2.5 bg-ff-orange text-black font-bold rounded-lg hover:bg-ff-gold text-sm">Diamonds</Link>
          <Link to="/products?category=free-fire-subscriptions" className="px-4 py-2.5 border border-ff-gold text-ff-gold rounded-lg hover:bg-ff-gold/20 text-sm font-medium">Subscriptions</Link>
        </div>
      </section>

      {loadingCategories ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-dark-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : mainCategories.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-ff-gold mb-4">Shop by category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mainCategories.map((c) => (
              <Link key={c._id} to={`/products?category=${c.slug || c._id}`} className="rounded-xl border border-dark-700 dark:bg-dark-800 p-4 text-center hover:border-ff-orange hover:shadow-lg transition-all">
                <span className="text-3xl">{c.slug === 'free-fire-diamonds' ? '💎' : c.slug === 'free-fire-subscriptions' ? '🎫' : '👕'}</span>
                <p className="font-medium dark:text-gray-200 mt-2">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductRow title="Featured products" to="/products?featured=true" products={featured} loading={loadingFeatured} />

      {mainCategories.slice(0, 2).map((c) => (
        <ProductRow
          key={c._id}
          title={c.name}
          to={`/products?category=${c.slug || c._id}`}
          products={categoryProducts[c.slug] || []}
          loading={categoryProducts[c.slug] === undefined && mainCategories.length > 0}
        />
      ))}

      <div className="flex justify-center">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm dark:text-gray-400 hover:text-ff-gold">
          Back to top
        </button>
      </div>
    </div>
  );
}
