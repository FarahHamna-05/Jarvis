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
  TrendingUp
} from 'lucide-react';

export default function SupplierHub({
  suppliers = [],
  onToggleStatus,
  onOpenAddSupplier,
  onOpenDraftEmail
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter((s) => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (s.region && s.region.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (s.contactEmail && s.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center space-x-2.5">
            <Truck className="h-5 w-5 text-[#E51A24]" />
            <span>Supplier Network Directory</span>
            <span className="text-xs font-semibold text-[#0F172A] bg-slate-50/90 border border-slate-200 px-2.5 py-0.5 rounded-full">
              {suppliers.length} vendors
            </span>
          </h2>
          <p className="text-xs text-[#1E223D]/75 mt-1">
            Real-time supplier telemetry, lead times, dynamic reliability scores, and autonomous email hooks.
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
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none transition shadow-sm"
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
              className={`rounded-2xl border bg-white transition-all p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md ${
                isDisrupted ? 'border-red-300 bg-red-50/20' : 'border-slate-200/80 hover:border-slate-300'
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
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-slate-700">{supplier.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Disruption Toggle Button */}
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(supplier.id, isDisrupted ? 'ACTIVE' : 'DISRUPTED')}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition flex items-center space-x-1.5 border shadow-sm ${
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

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Supplies <strong className="text-slate-800">{supplier.productsSuppliedCount || 1} SKU(s)</strong>
                </span>

                <button
                  onClick={() => onOpenDraftEmail && onOpenDraftEmail({ supplierId: supplier.id, supplierName: supplier.name })}
                  className="flex items-center space-x-1.5 text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-[#E51A24] hover:text-white font-bold transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Draft PO Email</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
