import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({ product: i.product._id, qty: i.qty }));
      const { data: order } = await api.post('/orders', { orderItems, shippingAddress: form });
      clearCart();
      navigate('/order-success?orderId=' + order._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
    setLoading(false);
  };

  if (items.length === 0 && !loading) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-2xl text-neon-cyan mb-2">Checkout</h1>
      <p className="text-sm dark:text-gray-500 mb-6">Step 1: Delivery address → Review & place order</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-dark-700 dark:bg-dark-800/50 p-4 space-y-4">
          <h2 className="font-display text-neon-cyan text-lg">Delivery address</h2>
          <div>
            <label htmlFor="checkout-fullName" className="block text-sm font-medium dark:text-gray-300 mb-1">Full name</label>
            <input id="checkout-fullName" type="text" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} required className="input-ring w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium dark:text-gray-300 mb-1">Email</label>
            <input id="checkout-email" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required className="input-ring w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div>
            <label htmlFor="checkout-address" className="block text-sm font-medium dark:text-gray-300 mb-1">Address</label>
            <input id="checkout-address" type="text" name="address" autoComplete="street-address" value={form.address} onChange={handleChange} required className="input-ring w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkout-city" className="block text-sm font-medium dark:text-gray-300 mb-1">City</label>
              <input id="checkout-city" type="text" name="city" autoComplete="address-level2" value={form.city} onChange={handleChange} required className="input-ring w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
            </div>
            <div>
              <label htmlFor="checkout-country" className="block text-sm font-medium dark:text-gray-300 mb-1">Country</label>
              <input id="checkout-country" type="text" name="country" autoComplete="country-name" value={form.country} onChange={handleChange} required className="input-ring w-full px-4 py-2 rounded-lg border border-dark-700 dark:bg-dark-800 dark:text-gray-200" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-dark-700 dark:bg-dark-800/50 p-4 flex justify-between items-center">
          <span className="dark:text-gray-400">Order total</span>
          <span className="text-neon-orange font-bold text-xl">{formatPrice(cartTotal, items[0]?.product?.currency)}</span>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3 bg-neon-orange text-black font-bold rounded-lg disabled:opacity-70">{loading ? 'Processing...' : 'Place Order'}</button>
      </form>
    </div>
  );
}
