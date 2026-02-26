import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { productIds } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const idsKey = productIds.join(',');

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    api.get('/products?ids=' + idsKey).then((r) => setProducts(r.data.products || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, [idsKey, productIds.length]);

  if (loading) return <div className="py-12 text-center dark:text-gray-400">Loading...</div>;
  if (products.length === 0) return <div className="py-12 text-center dark:text-gray-400">Your wishlist is empty.</div>;

  return (
    <div>
      <h1 className="font-display text-2xl text-neon-cyan mb-6">Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
