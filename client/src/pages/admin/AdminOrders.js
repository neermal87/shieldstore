import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data || [])).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put('/orders/' + id + '/status', { status });
      toast.success('Updated');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (_) {
      toast.error('Failed');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Orders</h1>
      <p className="text-slate-600 mb-6">Update order status.</p>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="p-3 text-left text-sm font-semibold text-slate-700">ID</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Date</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Total</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Status</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Change</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-mono text-sm text-slate-600">{o._id ? o._id.slice(-8) : ''}</td>
                  <td className="p-3 text-slate-700">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</td>
                  <td className="p-3 font-medium text-slate-800">${o.totalPrice != null ? Number(o.totalPrice).toFixed(2) : ''}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">{o.status}</span></td>
                  <td className="p-3">
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-sm">
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
