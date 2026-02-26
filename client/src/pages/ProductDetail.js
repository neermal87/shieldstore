import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

function StarRating({ rating = 4.5 }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (hasHalf) stars.push('½');
  while (stars.length < 5) stars.push('☆');
  return <span className="text-amber-400 text-lg">{stars.slice(0, 5).join('')}</span>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    api.get('/products/' + id).then((r) => setProduct(r.data)).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product?.category?._id) return;
    api.get(`/products?category=${product.category._id}&limit=5`).then((r) => {
      const list = (r.data.products || []).filter((p) => p._id !== product._id).slice(0, 4);
      setRelated(list);
    }).catch(() => setRelated([]));
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, qty);
    window.location.href = '/checkout';
  };

  if (loading) return <div className="py-12 text-center dark:text-gray-400">Loading...</div>;
  if (!product) return <div className="py-12 text-center dark:text-gray-400">Product not found.</div>;

  const inWishlist = isInWishlist(product._id);
  const images = product.images?.length ? product.images : (product.image ? [product.image] : []);
  const mainImg = images[mainImage] || product.image;
  const rating = 3.5 + (product._id?.charCodeAt?.(0) % 15) / 10;
  const hasDiscount = product.discountPercent > 0 || (product.compareAtPrice != null && product.compareAtPrice > product.price);
  const discountLabel = product.discountPercent > 0 ? `${product.discountPercent}% OFF` : hasDiscount ? 'Sale' : null;

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        ...(product.category ? [{ to: `/products?category=${product.category.slug || product.category._id}`, label: product.category.name }] : []),
        { label: product.name },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="relative aspect-square bg-dark-800 rounded-xl overflow-hidden flex items-center justify-center ring-1 ring-dark-700">
            {mainImg ? (
              <img src={mainImg} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-6xl">🛡</span>
            )}
            {discountLabel && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-neon-orange text-black text-sm font-bold shadow-lg">
                {discountLabel}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button key={i} type="button" onClick={() => setMainImage(i)} className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${i === mainImage ? 'border-neon-cyan' : 'border-dark-700'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-neon-cyan text-sm uppercase tracking-wide">{product.category?.name}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold dark:text-gray-100 mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={rating} />
            <span className="text-sm dark:text-gray-500">({(20 + (product._id?.length || 0))} ratings)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="text-neon-orange font-bold text-2xl">{formatPrice(product.price, product.currency)}</span>
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-gray-500 line-through text-lg">{formatPrice(product.compareAtPrice, product.currency)}</span>
            )}
            {product.discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-medium">Save {product.discountPercent}%</span>
            )}
          </div>
          <p className="text-sm dark:text-green-400 mt-1">FREE delivery</p>
          <p className="dark:text-gray-400 mt-2">{product.description || 'No description.'}</p>

          <div className="mt-6 p-4 rounded-xl border border-dark-700 dark:bg-dark-800/50">
            <p className="text-sm dark:text-green-400 font-medium">In Stock</p>
            <label className="block mt-3 dark:text-gray-400 text-sm">Qty</label>
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 w-20 px-2 py-2 rounded border border-dark-700 dark:bg-dark-800 dark:text-gray-200">
              {Array.from({ length: Math.min(product.stock || 10, 10) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3 mt-4">
              <button type="button" onClick={handleAddToCart} className="px-6 py-3 bg-neon-orange text-black font-bold rounded-lg hover:shadow-neon-orange">
                Add to Cart
              </button>
              <button type="button" onClick={handleBuyNow} className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400">
                Buy Now
              </button>
              <button type="button" onClick={() => { toggleWishlist(product._id); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist'); }} className="px-6 py-3 border border-dark-700 rounded-lg dark:text-gray-200 hover:border-neon-pink">
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-neon-cyan mb-4">Customers also viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
