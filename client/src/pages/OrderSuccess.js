import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center p-8 rounded-2xl border border-dark-700 dark:bg-dark-900 max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-3xl mx-auto mb-4">OK</div>
        <h1 className="font-display text-xl text-neon-cyan mb-2">Order Placed</h1>
        {orderId && <p className="dark:text-gray-400 text-sm mb-4">Order ID: {orderId}</p>}
        <Link to="/orders" className="inline-block mt-4 px-6 py-2 bg-neon-orange text-black font-bold rounded-lg">View Orders</Link>
        <Link to="/" className="block mt-2 text-neon-cyan hover:underline">Continue shopping</Link>
      </div>
    </div>
  );
}
