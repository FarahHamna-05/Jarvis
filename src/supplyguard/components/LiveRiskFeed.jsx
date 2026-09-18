import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Mail,
  Check,
  X,
  TrendingDown,
  Info,
  CheckCheck
} from 'lucide-react';

export default function LiveRiskFeed({
  risks = [],
  onApproveAction,
  onOpenMitigationModal,
  onOpenDraftEmail,
  filter = 'ALL',
  setFilter
}) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL',
          badge: 'bg-red-50 text-[#E51A24] border border-red-200 font-extrabold',
          icon: ShieldAlert,
          border: 'border-red-200/80'
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          badge: 'bg-amber-50 text-amber-700 border border-amber-200 font-bold',
          icon: AlertTriangle,
          border: 'border-amber-200/80'
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM',
          badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold',
          icon: Clock,
          border: 'border-slate-200/80'
        };
      default:
        return {
          label: 'LOW / NOMINAL',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
          icon: CheckCircle,
          border: 'border-slate-200/80'
        };
    }
  };

  const filteredRisks = risks.filter((r) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return r.actionApproved === null && (r.severity === 'CRITICAL' || r.severity === 'HIGH');
    return r.severity === filter;
  });

  return (
    <div className="space-y-5 text-slate-900">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Deterministic Risk Ledger</span>
            <span className="text-xs font-semibold text-slate-500">
              ({filteredRisks.length} active updates)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic telemetry alerts calculated from rolling 7-day usage array and vendor lead times.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                filter === sev
                  ? 'bg-[#E51A24] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      {filteredRisks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-600 space-y-3 shadow-xs">
          <CheckCheck className="h-10 w-10 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-slate-900">All inventory channels nominal</p>
          <p className="text-xs text-slate-500">No SKU stockout projections breach safe lead time windows.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRisks.map((event) => {
            const config = getSeverityBadge(event.severity);
            const Icon = config.icon;
            const isExpanded = expandedId === event.id;

            return (
              <div
                key={event.id}
                className={`rounded-2xl bg-white transition-all border ${config.border} p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300`}
              >
                {/* Event Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div className={`mt-0.5 rounded-xl p-2.5 ${config.badge}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2.5 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900 tracking-tight">
                          {event.productName}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase ${config.badge}`}>
                          {config.label}
                        </span>
                        {event.actionApproved === true && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold flex items-center space-x-1">
                            <CheckCheck className="h-3 w-3 text-emerald-600" />
                            <span>APPROVED</span>
                          </span>
                        )}
                        {event.actionApproved === false && (
                          <span className="rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold">
                            DISMISSED
                          </span>
                        )}
                      </div>

                      {/* Key telemetry pills */}
                      <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500 flex-wrap gap-y-1">
                        <div>
                          Vendor: <span className="font-semibold text-slate-800">{event.supplierName || 'Unassigned'}</span>
                        </div>
                        <div>
                          Lead Time: <span className="font-mono font-semibold text-slate-800">{event.supplierLeadTimeDays || 14}d</span>
                        </div>
                        <div>
                          Daily Consumption: <span className="font-mono font-semibold text-slate-800">{event.averageDailyUsage || 0} units/d</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <TrendingDown className="h-3.5 w-3.5 text-[#E51A24]" />
                          <span>Runway until Stockout:</span>
                          <span className="font-mono font-bold text-[#E51A24] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            {event.daysUntilStockout || 0} days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    {event.actionApproved === null && (event.severity === 'CRITICAL' || event.severity === 'HIGH') && (
                      <button
                        onClick={() => onOpenMitigationModal && onOpenMitigationModal(event)}
                        className="flex items-center space-x-1.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-sm transition"
                      >
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Review & Approve</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenDraftEmail && onOpenDraftEmail(event)}
                      className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition"
                      title="Autonomous Supplier Outreach"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Message</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(event.id)}
                      className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-2 text-xs font-medium text-slate-600 transition"
                    >
                      <span>AI Reasoning</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Deterministic Reason Summary */}
                <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-200/70 text-xs text-slate-600 flex items-start space-x-2">
                  <Info className="h-4 w-4 text-[#E51A24] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">Diagnostic: </span>
                    <span>{event.reason}</span>
                  </div>
                </div>

                {/* Expandable AI Reasoning Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#E51A24] uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-[#E51A24]" />
                      <span>Ollama AI Recommendation & Reasoning Traceability</span>
                    </div>

                    <div className="rounded-xl bg-red-50/40 border border-red-100 p-4 space-y-1 text-xs">
                      <div className="font-bold text-slate-900">
                        Action Plan: <span className="font-mono text-[#E51A24] font-extrabold">{event.actionRecommended || 'EXPEDITE_PO'}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {event.aiRecommendation}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {event.aiReasoning}
                    </div>

                    {/* Quick Approve / Reject in Drawer */}
                    {event.actionApproved === null && (
                      <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                          onClick={() => onApproveAction && onApproveAction(event.id, false, "Dismissed by operator")}
                          className="flex items-center space-x-1 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 text-xs font-semibold transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Dismiss Alert</span>
                        </button>
                        <button
                          onClick={() => onOpenMitigationModal && onOpenMitigationModal(event)}
                          className="flex items-center space-x-1 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-3.5 py-1.5 text-xs shadow-sm transition"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>Authorize Mitigation</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

