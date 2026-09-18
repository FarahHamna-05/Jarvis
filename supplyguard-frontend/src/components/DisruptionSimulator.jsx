import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Flame,
  AlertTriangle,
  Ship,
  Play
} from 'lucide-react';

export default function DisruptionSimulator({
  suppliers = [],
  products = [],
  onSimulate,
  onReset,
  onContactSupplier
}) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [demandMultiplier, setDemandMultiplier] = useState(2.0);
  const [extraLeadTime, setExtraLeadTime] = useState(10);
  const [markDisrupted, setMarkDisrupted] = useState(true);
  const [simMessage, setSimMessage] = useState(null);
  const [demoRecipientEmail, setDemoRecipientEmail] = useState('');
  const [isDemoSending, setIsDemoSending] = useState(false);

  const triggerPreset = async (type) => {
    let payload = {};
    if (type === 'DEMAND_SURGE') {
      const topProduct = products[0]?.id || '';
      payload = { productId: topProduct, demandMultiplier: 2.5 };
      setSimMessage("Triggered 250% Black Friday Demand Surge on " + (products[0]?.name || 'Top SKU'));
    } else if (type === 'FACTORY_FREEZE') {
      const sup = suppliers.find((s) => s.status === 'ACTIVE') || suppliers[0];
      payload = { supplierId: sup?.id, markSupplierDisrupted: true };
      setSimMessage(`Triggered Emergency Factory Blackout on ${sup?.name}`);
    } else if (type === 'LOGISTICS_DELAY') {
      const sup = suppliers[0];
      payload = { supplierId: sup?.id, addedLeadTimeDays: 14 };
      setSimMessage(`Injected +14 Days Maritime Transit Congestion on ${sup?.name}`);
    }

    if (onSimulate) {
      await onSimulate(payload);
    }
  };

  const handleCustomSimulate = async () => {
    const payload = {
      supplierId: selectedSupplierId ? Number(selectedSupplierId) : null,
      productId: selectedProductId || null,
      markSupplierDisrupted: markDisrupted,
      demandMultiplier: Number(demandMultiplier),
      addedLeadTimeDays: Number(extraLeadTime)
    };

    if (onSimulate) {
      await onSimulate(payload);
      setSimMessage("Custom disruption injected successfully. Live risk engine recalculating...");
    }
  };

  const handleLiveOutreachDemo = async () => {
    const supId = selectedSupplierId ? Number(selectedSupplierId) : (suppliers[0]?.id || 1);
    const sup = suppliers.find((s) => s.id === supId) || suppliers[0];
    const targetEmail = demoRecipientEmail.trim() || sup?.contactEmail || 'supplier@example.com';

    setIsDemoSending(true);
    try {
      // 1. Mark supplier disrupted in the simulation engine
      if (onSimulate) {
        await onSimulate({ supplierId: supId, markSupplierDisrupted: true, addedLeadTimeDays: 10 });
      }

      // 2. Dispatch real email via SendGrid API
      if (onContactSupplier) {
        await onContactSupplier(supId, {
          toEmail: targetEmail,
          customSubject: `[CRITICAL ESCALATION] Autonomous Procurement Notice - Disruption Mitigation on ${sup?.name || 'Supplier'}`,
          productId: selectedProductId || products[0]?.id || 'SKU-01'
        });
      }
    } finally {
      setIsDemoSending(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2.5">
            <Zap className="h-5 w-5 text-[#E51A24]" />
            <span>Supply Chain Chaos Sandbox</span>
            <span className="rounded-full bg-red-50 text-[#E51A24] border border-red-200 px-3 py-0.5 text-xs font-bold">
              Chaos Engine
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Inject simulated supply shocks and watch the deterministic engine and Ollama AI adapt in real time.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {simMessage && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-[#E51A24] flex items-center space-x-3 shadow-sm animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#E51A24]" />
          <span>{simMessage}</span>
        </div>
      )}

      {/* Live Disruption + SendGrid Delivery Demo Card */}
      <div className="rounded-2xl border-2 border-[#E51A24]/30 bg-gradient-to-r from-red-50/80 via-white to-red-50/40 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#E51A24] text-white flex items-center justify-center font-bold shadow-xs">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Live SendGrid Delivery Demonstration Flow</span>
                <span className="text-[10px] uppercase font-bold bg-[#E51A24] text-white px-2 py-0.5 rounded-full">
                  Real API Call
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Simulate a sudden supplier disruption &rarr; AI reasoning synthesizes outreach &rarr; SendGrid delivers to real inbox &rarr; Mongo audit log records send status.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Target Supplier</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#E51A24] focus:outline-none"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.contactEmail})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span>Destination Supplier Gmail Address</span>
              <span className="text-[10px] text-emerald-600 font-semibold">From: freefiregodtamil@gmail.com</span>
            </label>
            <input
              type="email"
              value={demoRecipientEmail}
              onChange={(e) => setDemoRecipientEmail(e.target.value)}
              placeholder="e.g. supplier@gmail.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-[#E51A24] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleLiveOutreachDemo}
              disabled={isDemoSending}
              className="w-full rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold py-2 px-3 text-xs shadow-sm transition flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isDemoSending ? (
                <span>Dispatching via Gmail SMTP...</span>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  <span>Simulate & Dispatch Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Chaos Presets */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          1-Click Demonstration Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => triggerPreset('DEMAND_SURGE')}
            className="rounded-2xl border border-slate-200/80 bg-white hover:border-red-200 p-5 text-left space-y-2.5 group transition shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-red-50 text-[#E51A24] flex items-center justify-center transition-transform group-hover:scale-105">
                <Flame className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E51A24] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Demand Spike
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#E51A24] transition">
              Black Friday Surge (+250%)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multiplies daily consumption by 2.5x, causing runway to drop rapidly below the safety buffer.
            </p>
          </button>

          <button
            onClick={() => triggerPreset('FACTORY_FREEZE')}
            className="rounded-2xl border border-slate-200/80 bg-white hover:border-red-200 p-5 text-left space-y-2.5 group transition shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-105">
                <AlertTriangle className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Vendor Outage
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#E51A24] transition">
              Primary Supplier Blackout
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Marks primary vendor DISRUPTED. Evaluates secondary suppliers and drafts emergency POs automatically.
            </p>
          </button>

          <button
            onClick={() => triggerPreset('LOGISTICS_DELAY')}
            className="rounded-2xl border border-slate-200/80 bg-white hover:border-red-200 p-5 text-left space-y-2.5 group transition shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                <Ship className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Transport Choke
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#E51A24] transition">
              Maritime Congestion (+14d)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extends transit by 14 days, breaching safety buffers and triggering expediting workflows.
            </p>
          </button>
        </div>
      </div>

      {/* Custom Disruption Builder */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Play className="h-4 w-4 text-[#E51A24]" />
          <span>Custom Disruption Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Supplier */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Target Supplier</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">
                  {s.name} ({s.status} - {s.leadTimeDays}d lead time)
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="disruptToggle"
                checked={markDisrupted}
                onChange={(e) => setMarkDisrupted(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-[#E51A24] cursor-pointer"
              />
              <label htmlFor="disruptToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Mark supplier status as <strong className="text-[#E51A24]">DISRUPTED</strong>
              </label>
            </div>
          </div>

          {/* Target Product */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Target Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-900">
                  {p.name} (Stock: {p.currentStock})
                </option>
              ))}
            </select>

            {/* Demand Spike Slider */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Demand Surge Multiplier:</span>
                <span className="font-mono text-[#E51A24] bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">{demandMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.25"
                value={demandMultiplier}
                onChange={(e) => setDemandMultiplier(e.target.value)}
                className="w-full accent-[#E51A24] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCustomSimulate}
          className="w-full sm:w-auto rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-7 py-3 text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Flame className="h-4 w-4 stroke-[2.5]" />
          <span>Execute Disruption Shockwave</span>
        </button>
      </div>
    </div>
  );
}
