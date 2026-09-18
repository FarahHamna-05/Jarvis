import React, { useState, useEffect } from 'react';
import { X, Boxes, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export default function ProductModal({ product, suppliers = [], onClose, onSave }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Semiconductors');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
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

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
          {/* 1. Dedicated Direct Product Image File Upload (First) */}
          <div>
            <label className="text-slate-700 font-bold block mb-1.5">Product Image</label>
            {imageBase64 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
                <div className="h-14 w-14 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 flex items-center justify-center">
                  <img src={imageBase64} alt="Product Preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Image uploaded</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">Product SKU thumbnail ready</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="cursor-pointer text-[11px] font-bold text-[#E51A24] hover:text-[#C91822] flex items-center space-x-1 transition">
                      <Upload className="h-3 w-3 stroke-[2.5]" />
                      <span>Change</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setImageBase64('')}
                      className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer flex flex-col items-center justify-center py-4 px-3 rounded-xl border-2 border-dashed transition-all ${
                  isDraggingFile
                    ? 'border-[#E51A24] bg-red-50/60 scale-[1.01]'
                    : 'border-slate-200 hover:border-[#E51A24]/60 bg-slate-50/70 hover:bg-slate-50'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-red-50 text-[#E51A24] flex items-center justify-center mb-1.5 border border-red-100">
                  <Upload className="h-4 w-4 stroke-[2.5]" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Click to upload product image <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, or SVG file</p>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            )}
          </div>

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

