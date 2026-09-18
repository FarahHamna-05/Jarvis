import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  ShieldCheck,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Edit3,
  Building2,
  Check,
  Sparkles
} from 'lucide-react';

export default function SupplierHub({
  suppliers = [],
  onToggleStatus,
  onOpenAddSupplier,
  onOpenDraftEmail,
  onContactSupplier,
  onUpdateSupplier
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactModalSupplier, setContactModalSupplier] = useState(null);
  const [testEmail, setTestEmail] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [updateContactEmailInDir, setUpdateContactEmailInDir] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Edit Supplier Modal State
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSavingSupplier, setIsSavingSupplier] = useState(false);

  const filteredSuppliers = suppliers.filter((s) => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (s.region && s.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (s.contactEmail && s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleOpenContactModal = (supplier) => {
    setContactModalSupplier(supplier);
    setTestEmail(supplier.contactEmail || '');
    setCustomSubject(`[URGENT] Supply Continuity & Lead Time Confirmation - ${supplier.name}`);
    setCustomNotes('');
    setUpdateContactEmailInDir(true);
  };

  const handleOpenEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setEditFormData({
      name: supplier.name || '',
      contactEmail: supplier.contactEmail || '',
      phone: supplier.phone || '',
      region: supplier.region || '',
      leadTimeDays: supplier.leadTimeDays || 14,
      reliabilityScore: supplier.reliabilityScore || 0.90,
      trustScore: supplier.trustScore || 85,
      status: supplier.status || 'ACTIVE'
    });
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    if (!editingSupplier || !onUpdateSupplier) return;
    setIsSavingSupplier(true);
    try {
      const success = await onUpdateSupplier(editingSupplier.id, {
        ...editingSupplier,
        ...editFormData,
        contactEmail: editFormData.contactEmail?.trim(),
        leadTimeDays: parseInt(editFormData.leadTimeDays, 10) || 14,
        reliabilityScore: parseFloat(editFormData.reliabilityScore) || 0.90,
        trustScore: parseFloat(editFormData.trustScore) || 85
      });
      if (success) {
        setEditingSupplier(null);
      }
    } finally {
      setIsSavingSupplier(false);
    }
  };

  const handleDispatchEmail = async (e) => {
    e.preventDefault();
    if (!contactModalSupplier || !onContactSupplier) return;

    setIsSending(true);
    try {
      await onContactSupplier(contactModalSupplier.id, {
        toEmail: testEmail.trim(),
        customSubject: customSubject.trim(),
        customNotes: customNotes.trim(),
        updateSupplierEmail: updateContactEmailInDir
      });
      setContactModalSupplier(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5AC] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1E223D] flex items-center space-x-2.5">
            <Truck className="h-5 w-5 text-[#E51A24]" />
            <span>Supplier Network Directory</span>
            <span className="text-xs font-semibold text-[#1E223D] bg-white/90 border border-[#E2D5AC] px-2.5 py-0.5 rounded-full">
              {suppliers.length} vendors
            </span>
          </h2>
          <p className="text-xs text-[#1E223D]/75 mt-1">
            Real-time supplier telemetry, lead times, dynamic reliability scores, and SendGrid live email dispatch.
          </p>
        </div>

        <button
          onClick={onOpenAddSupplier}
          className="flex items-center space-x-2 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search suppliers by name, region, or contact email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-[#E2D5AC] bg-white/95 pl-10 pr-4 py-2.5 text-xs font-medium text-[#1E223D] placeholder-slate-400 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((supplier) => {
          const isDisrupted = supplier.status === 'DISRUPTED';
          const trustScore = supplier.trustScore ? Math.round(supplier.trustScore) : 85;

          return (
            <div
              key={supplier.id}
              className={`rounded-2xl border bg-white/95 transition-all p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md ${
                isDisrupted ? 'border-red-300 bg-red-50/40' : 'border-[#E2D5AC] hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header & Status Toggle */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 tracking-tight">{supplier.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        isDisrupted
                          ? 'bg-red-50 text-[#E51A24] border-red-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {supplier.status}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center space-x-3 text-xs text-slate-500 flex-wrap gap-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{supplier.region || 'Global'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-slate-700">{supplier.contactEmail}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(supplier)}
                          className="p-1 rounded-md text-slate-400 hover:text-[#E51A24] hover:bg-red-50 transition cursor-pointer"
                          title="Edit supplier contact Gmail address"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Disruption Toggle Button */}
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(supplier.id, isDisrupted ? 'ACTIVE' : 'DISRUPTED')}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition flex items-center space-x-1.5 border shadow-sm cursor-pointer ${
                      isDisrupted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-red-50 text-[#E51A24] border-red-200 hover:bg-red-100'
                    }`}
                    title={isDisrupted ? 'Restore to Active status' : 'Simulate Disruption (Blackout, Strike, Delay)'}
                  >
                    {isDisrupted ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Restore Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-[#E51A24]" />
                        <span>Simulate Disruption</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Score Gauges */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Lead Time</span>
                    <span className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center space-x-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{supplier.leadTimeDays}d</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Reliability</span>
                    <span className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center space-x-1 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{Math.round((supplier.reliabilityScore || 0.85) * 100)}%</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Trust Score</span>
                    <span className="font-mono text-sm font-bold text-slate-900 flex items-center justify-center space-x-1 mt-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-[#E51A24]" />
                      <span>{trustScore}/100</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <span className="text-slate-500 text-[11px]">
                  Supplies <strong className="text-slate-800">{supplier.productsSuppliedCount || 1} SKU(s)</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenContactModal(supplier)}
                    className="flex items-center space-x-1.5 text-white bg-[#E51A24] hover:bg-[#C91822] px-3.5 py-1.5 rounded-full font-bold shadow-xs transition hover:scale-102 cursor-pointer text-xs"
                    title="Dispatch a real email from freefiregodtamil@gmail.com to this supplier"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Contact Supplier</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(supplier)}
                    className="flex items-center space-x-1 text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-semibold transition cursor-pointer text-xs"
                    title="Edit supplier contact details and Gmail address"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onOpenDraftEmail && onOpenDraftEmail({ supplierId: supplier.id, supplierName: supplier.name })}
                    className="flex items-center space-x-1 text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full font-semibold transition cursor-pointer text-xs"
                    title="Generate procurement draft in inbox"
                  >
                    <span>Draft PO</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authenticated Gmail Direct Outreach Modal */}
      {contactModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E51A24]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Contact {contactModalSupplier.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-mono flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Direct Gmail SMTP Outreach (freefiregodtamil@gmail.com)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setContactModalSupplier(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Explanatory Info Box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-2 text-slate-600">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700">Sender Account (Merchant / You):</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>freefiregodtamil@gmail.com</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                The email will be dispatched directly through your verified Gmail account via <code>smtp.gmail.com:587</code> to the supplier's real Gmail address.
              </p>
            </div>

            <form onSubmit={handleDispatchEmail} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Supplier Gmail Address <span className="text-[#E51A24]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="e.g. supplier@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
                <div className="mt-2">
                  <label className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateContactEmailInDir}
                      onChange={(e) => setUpdateContactEmailInDir(e.target.checked)}
                      className="rounded border-slate-300 text-[#E51A24] focus:ring-red-200"
                    />
                    <span>Save this Gmail address as {contactModalSupplier.name}'s permanent contact email</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Additional Notes / Directives for AI Writer (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Request immediate shipment of 500 units via expedited air freight. Mention critical inventory runway."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setContactModalSupplier(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white px-5 py-2 font-bold shadow-md transition hover:scale-102 disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <span>Sending via Gmail SMTP...</span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Dispatch from freefiregodtamil@gmail.com</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Supplier: {editingSupplier.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure contact Gmail, lead time, and operational parameters
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSupplier(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Supplier Company Name <span className="text-[#E51A24]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Supplier Contact Gmail Address <span className="text-[#E51A24]">*</span></span>
                  <span className="text-[10px] text-emerald-600 font-normal">Receives all automated emails</span>
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.contactEmail || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, contactEmail: e.target.value })}
                  placeholder="e.g. supplier@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  All automated purchase order drafts and risk notices will be sent from <code>freefiregodtamil@gmail.com</code> to this address.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Region / Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.region || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, region: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#E51A24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#E51A24] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lead Time (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.leadTimeDays || 14}
                    onChange={(e) => setEditFormData({ ...editFormData, leadTimeDays: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-[#E51A24] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editFormData.status || 'ACTIVE'}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-[#E51A24] focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISRUPTED">DISRUPTED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSupplier}
                  className="flex items-center space-x-1.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white px-5 py-2 font-bold shadow-md transition hover:scale-102 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingSupplier ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
