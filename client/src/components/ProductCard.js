import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

// Mock rating from product id for consistency
function StarRating({ productId, rating = 4.5 }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('★');
  if (hasHalf) stars.push('½');
  while (stars.length < 5) stars.push('☆');
  return (
    <span className="text-amber-400 text-sm" title={`${rating} out of 5`}>
      {stars.slice(0, 5).join('')}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const rating = 3.5 + (product._id?.charCodeAt?.(0) % 15) / 10;
  const hasDiscount = product.discountPercent > 0 || (product.compareAtPrice != null && product.compareAtPrice > product.price);
  const discountLabel = product.discountPercent > 0 ? `${product.discountPercent}% OFF` : hasDiscount ? 'Sale' : null;

  return (
    <div className="group relative flex flex-col h-full dark:bg-dark-900 border border-dark-700 rounded-xl overflow-hidden hover:border-ff-orange hover:shadow-lg hover:shadow-ff-orange/20 transition-all duration-300">
      <Link to={`/products/${product._id}`} className="flex flex-col flex-1 min-h-0">
        <div className="relative aspect-square bg-dark-800 p-2">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-dark-600">🛡</div>
          )}
          {discountLabel && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ff-orange text-black text-xs font-bold shadow-lg">
              {discountLabel}
            </span>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-dark-900/90 flex items-center justify-center text-lg hover:bg-neon-pink/30 transition-colors z-10"
            aria-label="Wishlist"
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="p-3 flex flex-col flex-1 min-h-0">
          <p className="text-[10px] text-ff-gold uppercase tracking-wider mb-0.5">{product.category?.name}</p>
          <h3 className="font-medium dark:text-gray-200 line-clamp-2 text-sm group-hover:text-ff-orange transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1">
            <StarRating productId={product._id} rating={rating} />
            <span className="text-xs dark:text-gray-500">({(20 + (product._id?.length || 0))})</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <span className="text-ff-orange font-bold">{formatPrice(product.price, product.currency)}</span>
            {product.compareAtPrice != null && product.compareAtPrice > product.price && (
              <span className="text-xs dark:text-gray-500 line-through">{formatPrice(product.compareAtPrice, product.currency)}</span>
            )}
            {hasDiscount && product.discountPercent > 0 && (
              <span className="text-xs text-green-400 font-medium">Save {product.discountPercent}%</span>
            )}
          </div>
          <p className="text-xs dark:text-green-400 mt-0.5">FREE delivery</p>
        </div>
      </Link>
      <div className="p-3 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2 bg-ff-orange/90 hover:bg-ff-orange text-black font-bold rounded-lg text-sm transition-colors shadow-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
