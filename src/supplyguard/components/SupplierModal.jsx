import React, { useState } from 'react';
import { X, Truck } from 'lucide-react';

export default function SupplierModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [reliabilityScore, setReliabilityScore] = useState(0.92);
  const [leadTimeDays, setLeadTimeDays] = useState(14);
  const [status, setStatus] = useState('ACTIVE');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      contactEmail,
      phone,
      region,
      reliabilityScore: Number(reliabilityScore),
      leadTimeDays: Number(leadTimeDays),
      status,
      trustScore: Number(reliabilityScore) * 100
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-md w-full space-y-5 animate-in zoom-in-95 duration-150 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-[#E51A24] border border-red-200/60">
              <Truck className="h-4 w-4" />
            </span>
            <span>Onboard New Supplier</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1">Supplier / Vendor Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kyoto Precision Dynamics"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="procurement@vendor.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Region / Country</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Tokyo, Japan"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+81-3-555-0199"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Lead Time (Days)</label>
              <input
                type="number"
                required
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Reliability (0.50 - 1.00)</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                max="1.0"
                value={reliabilityScore}
                onChange={(e) => setReliabilityScore(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            >
              <option value="ACTIVE" className="bg-white text-slate-900">ACTIVE</option>
              <option value="DISRUPTED" className="bg-white text-slate-900">DISRUPTED</option>
            </select>
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
              Register Supplier
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

