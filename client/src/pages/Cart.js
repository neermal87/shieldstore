import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const { items, cartCount, cartTotal, updateQty, removeItem } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center py-16">
        <p className="dark:text-gray-400 text-lg mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-neon-cyan font-semibold hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map(({ product, qty }) => (
          <div key={product._id} className="flex gap-4 p-4 rounded-xl border border-dark-700 dark:bg-dark-900">
            <div className="w-20 h-20 rounded-lg bg-dark-800 flex-shrink-0 overflow-hidden">
              {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">S</div>}
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product._id}`} className="font-semibold dark:text-gray-200 hover:text-neon-cyan">{product.name}</Link>
              <p className="text-neon-orange font-bold">{formatPrice(product.price, product.currency)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => updateQty(product._id, qty - 1)} className="w-8 h-8 rounded border border-dark-700 dark:bg-dark-800">-</button>
              <span className="w-8 text-center">{qty}</span>
              <button type="button" onClick={() => updateQty(product._id, qty + 1)} className="w-8 h-8 rounded border border-dark-700 dark:bg-dark-800">+</button>
            </div>
            <button type="button" onClick={() => removeItem(product._id)} className="text-red-500 hover:underline text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-24 p-6 rounded-xl border border-dark-700 dark:bg-dark-900">
          <h2 className="font-display text-neon-cyan mb-4">Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
          <p className="dark:text-gray-400 text-lg"><span className="font-bold dark:text-gray-200 text-xl">{formatPrice(cartTotal, items[0]?.product?.currency)}</span></p>
          <Link to="/checkout" className="mt-4 block w-full py-3 text-center bg-neon-orange text-black font-bold rounded-lg hover:shadow-neon-orange">Proceed to Checkout</Link>
          <Link to="/products" className="mt-3 block w-full py-2 text-center border border-dark-700 rounded-lg dark:text-gray-300 hover:border-neon-cyan text-sm">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
