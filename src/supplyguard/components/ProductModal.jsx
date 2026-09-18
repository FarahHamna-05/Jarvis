import React, { useState, useEffect } from 'react';
import { X, Boxes, Upload } from 'lucide-react';

export default function ProductModal({ product, suppliers = [], onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Semiconductors');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [currentStock, setCurrentStock] = useState(250);
  const [reorderThreshold, setReorderThreshold] = useState(100);
  const [primarySupplierId, setPrimarySupplierId] = useState('');
  const [alternateSupplierIds, setAlternateSupplierIds] = useState([]);
  const [recentUsageStr, setRecentUsageStr] = useState('15, 18, 16, 20, 19, 17, 18');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Semiconductors');
      setDescription(product.description || '');
      setImageBase64(product.imageBase64 || '');
      setCurrentStock(product.currentStock || 100);
      setReorderThreshold(product.reorderThreshold || 50);
      setPrimarySupplierId(product.primarySupplierId ? String(product.primarySupplierId) : '');
      setAlternateSupplierIds(product.alternateSupplierIds ? product.alternateSupplierIds.map(String) : []);
      setRecentUsageStr(product.recentUsage ? product.recentUsage.join(', ') : '15, 18, 16, 20, 19, 17, 18');
    } else if (suppliers.length > 0) {
      setPrimarySupplierId(String(suppliers[0].id));
    }
  }, [product, suppliers]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recentUsage = recentUsageStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const payload = {
      name,
      category,
      description,
      imageBase64,
      launchDate: product?.launchDate || new Date().toISOString().split('T')[0],
      currentStock: Number(currentStock),
      recentUsage: recentUsage.length === 7 ? recentUsage : [15, 18, 16, 20, 19, 17, 18],
      reorderThreshold: Number(reorderThreshold),
      primarySupplierId: primarySupplierId ? Number(primarySupplierId) : null,
      alternateSupplierIds: alternateSupplierIds.map(Number)
    };

    if (onSave) {
      onSave(payload);
    }
    onClose();
  };

  const toggleAlternate = (idStr) => {
    setAlternateSupplierIds((prev) =>
      prev.includes(idStr) ? prev.filter((x) => x !== idStr) : [...prev, idStr]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150 my-8 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-[#E51A24] border border-red-200/60">
              <Boxes className="h-4 w-4" />
            </span>
            <span>{product ? 'Edit SKU Configuration' : 'Onboard New Product SKU'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1">Product Name / Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Neural Co-Processor X9"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Semiconductors, Medical, etc."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Current On-Hand Stock</label>
              <input
                type="number"
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Reorder Threshold</label>
              <input
                type="number"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Last 7 Days Usage (CSV)</label>
              <input
                type="text"
                value={recentUsageStr}
                onChange={(e) => setRecentUsageStr(e.target.value)}
                placeholder="15, 18, 16, 20, 19, 17, 18"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-density specification and usage profile..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>

          {/* Image URL or File Upload */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">Image (URL or File Upload)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageBase64}
                onChange={(e) => setImageBase64(e.target.value)}
                placeholder="https://... or upload below"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
              <label className="cursor-pointer rounded-xl bg-red-50 hover:bg-red-100 text-[#E51A24] border border-red-200 font-bold px-3 py-2 flex items-center space-x-1.5 transition">
                <Upload className="h-3.5 w-3.5 stroke-[2.5]" />
                <span className="text-[11px]">Upload</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Primary Supplier */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">Primary Supplier</label>
            <select
              value={primarySupplierId}
              onChange={(e) => setPrimarySupplierId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            >
              <option value="" className="bg-white text-slate-900">Select Primary Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">
                  {s.name} ({s.region} - {s.leadTimeDays}d lead time - {s.status})
                </option>
              ))}
            </select>
          </div>

          {/* Alternate Suppliers */}
          <div>
            <label className="text-slate-700 font-bold block mb-1">Alternate Backup Suppliers</label>
            <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              {suppliers.filter((s) => String(s.id) !== primarySupplierId).map((s) => (
                <label key={s.id} className="flex items-center space-x-2 text-[11px] text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alternateSupplierIds.includes(String(s.id))}
                    onChange={() => toggleAlternate(String(s.id))}
                    className="rounded border border-slate-300 accent-[#E51A24] cursor-pointer"
                  />
                  <span className="truncate">{s.name} ({s.leadTimeDays}d)</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold transition shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs shadow-sm transition"
            >
              Save & Recalculate Risk
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

