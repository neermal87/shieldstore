import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data)).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12 text-center dark:text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="font-display text-2xl text-neon-cyan mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="dark:text-gray-500">No orders yet. <Link to="/products" className="text-neon-cyan hover:underline">Shop now</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 rounded-xl border border-dark-700 dark:bg-dark-900">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                <span className="font-mono text-sm dark:text-gray-400">{order._id.slice(-8)}</span>
                <span className="text-sm dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded text-sm bg-dark-700 dark:text-gray-300">{order.status}</span>
              </div>
              <p className="dark:text-gray-200">Total: {order.totalPrice?.toFixed(2)}</p>
              <p className="text-sm dark:text-gray-500">{order.orderItems?.length} items</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
