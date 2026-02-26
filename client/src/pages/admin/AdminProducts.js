import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', price: '', compareAtPrice: '', discountPercent: '', image: '', category: '', stock: '0', featured: false });

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data || [])).catch(() => setCategories([]));
  }, []);

  const loadProducts = () => {
    setLoading(true);
    api.get('/products?limit=100').then((r) => setProducts(r.data.products || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  };

  useEffect(() => loadProducts(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        discountPercent: form.discountPercent ? Math.min(100, Math.max(0, parseFloat(form.discountPercent))) : undefined,
        image: form.image || undefined,
        category: form.category,
        stock: parseInt(form.stock, 10) || 0,
        featured: !!form.featured,
      });
      toast.success('Product added');
      setForm({ name: '', description: '', price: '', compareAtPrice: '', discountPercent: '', image: '', category: '', stock: '0', featured: false });
      loadProducts();
    } catch (err) {
      toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete('/products/' + id);
      toast.success('Deleted');
      loadProducts();
    } catch (_) {
      toast.error('Failed');
    }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Products</h1>
      <p className="text-slate-600 mb-6">Add products with image URL and discount.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Name *</label><input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Category *</label><select value={form.category} onChange={(e) => update('category', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800"><option value="">Select</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.parent ? `  ${c.name}` : c.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Price *</label><input type="number" step="0.01" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Compare at price</label><input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => update('compareAtPrice', e.target.value)} placeholder="Optional" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label><input type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => update('discountPercent', e.target.value)} placeholder="e.g. 20" className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock</label><input type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label><input type="url" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800" />{form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 object-contain rounded border border-slate-200" onError={(e) => { e.target.style.display = 'none'; }} />}</div>
        <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-slate-300" /><label htmlFor="feat" className="text-sm text-slate-700">Featured</label></div>
        <div><button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Add Product</button></div>
      </form>
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="p-3 text-left text-sm font-semibold text-slate-700 w-16">Image</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Name</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Price</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Discount</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Category</th><th className="p-3 text-left text-sm font-semibold text-slate-700">Stock</th><th className="p-3 w-20"></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">{p.image ? <img src={p.image} alt="" className="w-12 h-12 object-cover rounded border border-slate-200" /> : <span className="text-slate-400 text-xs">—</span>}</td>
                    <td className="p-3 font-medium text-slate-800">{p.name}</td>
                    <td className="p-3 text-slate-700">${Number(p.price).toFixed(2)}</td>
                    <td className="p-3">{p.discountPercent != null ? `${p.discountPercent}%` : (p.compareAtPrice > p.price ? 'Sale' : '—')}</td>
                    <td className="p-3 text-slate-600 text-sm">{p.category?.name}</td>
                    <td className="p-3 text-slate-600">{p.stock}</td>
                    <td className="p-3"><button type="button" onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline text-sm">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
