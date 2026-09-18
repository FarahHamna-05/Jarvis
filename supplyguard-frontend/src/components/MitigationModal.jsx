import React, { useState } from 'react';
import { Check, X, ShieldAlert, Sparkles, Truck, ShoppingCart, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MitigationModal({ event, suppliers = [], onClose, onApprove, onOpenVoiceSourcing }) {
  const [selectedAlternateId, setSelectedAlternateId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(
    Math.round(Math.max(250, (event?.averageDailyUsage || 20) * 30))
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const activeSuppliers = suppliers.filter((s) => s.id !== event.supplierId && s.status === 'ACTIVE');

  const handleConfirmApproval = async (approved) => {
    setIsSubmitting(true);
    if (approved) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    if (onApprove) {
      await onApprove({
        riskEventId: event.id,
        approved,
        notes: notes || (approved ? "Approved AI mitigation plan" : "Dismissed by operator"),
        switchSupplierId: selectedAlternateId ? Number(selectedAlternateId) : null,
        orderQuantity: Number(orderQuantity)
      });
    }
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 my-8 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-[#E51A24] border border-red-200/60">
              <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E51A24] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Human Governance Gate
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-tight mt-1">
                Authorize Mitigation for {event.productName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Recommendation Spotlight */}
        <div className="rounded-xl bg-red-50/40 border border-red-100 p-4 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#E51A24] uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-[#E51A24]" />
            <span>AI Reasoning Recommendation</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {event.aiRecommendation}
          </p>
        </div>

        {/* Telemetry Summary */}
        <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block font-sans font-semibold">Current Runway</span>
            <span className="font-bold text-[#E51A24] text-sm">{event.daysUntilStockout} days</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block font-sans font-semibold">Primary Vendor</span>
            <span className="font-bold text-slate-900 text-xs truncate block">{event.supplierName}</span>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <span className="text-[10px] text-slate-500 block font-sans font-semibold">Lead Time</span>
            <span className="font-bold text-slate-900 text-sm">{event.supplierLeadTimeDays} days</span>
          </div>
        </div>

        {/* Mitigation Controls */}
        <div className="space-y-4 pt-1">
          {/* Switch Supplier Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Truck className="h-3.5 w-3.5 text-slate-500" />
              <span>Divert to Alternate Vendor</span>
            </label>
            <select
              value={selectedAlternateId}
              onChange={(e) => setSelectedAlternateId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            >
              <option value="" className="bg-white text-slate-900">Keep current vendor allocation</option>
              {activeSuppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">
                  Switch to: {s.name} ({s.region} - {s.leadTimeDays}d lead time - {Math.round((s.reliabilityScore || 0.9)*100)}% reliability)
                </option>
              ))}
            </select>
          </div>

          {/* Expedite Purchase Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <ShoppingCart className="h-3.5 w-3.5 text-slate-500" />
              <span>Expedited Order Quantity (Units)</span>
            </label>
            <input
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>

          {/* Operator Audit Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Operator Sign-off Note (Recorded in Immutable Audit Log)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Authorized emergency air freight surcharge to avoid assembly halt."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 flex-wrap gap-y-2">
          <button
            type="button"
            onClick={() => {
              if (onOpenVoiceSourcing) {
                onOpenVoiceSourcing(event);
              }
              onClose();
            }}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2.5 text-xs shadow-xs transition mr-auto cursor-pointer active:scale-95"
            title="Compare & Call Alternate Suppliers via Voice Campaign"
          >
            <PhoneCall className="h-3.5 w-3.5 text-red-400 animate-pulse" />
            <span>Compare & Call Suppliers</span>
          </button>

          <button
            onClick={() => handleConfirmApproval(false)}
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <X className="h-4 w-4" />
            <span>Reject Mitigation</span>
          </button>

          <button
            onClick={() => handleConfirmApproval(true)}
            disabled={isSubmitting}
            className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2.5 text-xs shadow-sm transition"
          >
            <Check className="h-4 w-4 stroke-[3]" />
            <span>Authorize & Execute Mitigation</span>
          </button>
        </div>

      </div>
    </div>
  );
}

