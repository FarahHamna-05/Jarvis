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
  onReset
}) {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [demandMultiplier, setDemandMultiplier] = useState(2.0);
  const [extraLeadTime, setExtraLeadTime] = useState(10);
  const [markDisrupted, setMarkDisrupted] = useState(true);
  const [simMessage, setSimMessage] = useState(null);

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

  return (
    <div className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5AC] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1E223D] flex items-center space-x-2.5">
            <Zap className="h-5 w-5 text-[#E51A24]" />
            <span>Supply Chain Chaos Sandbox</span>
            <span className="rounded-full bg-white/90 text-[#E51A24] border border-[#E2D5AC] px-3 py-0.5 text-xs font-bold">
              Chaos Engine
            </span>
          </h2>
          <p className="text-xs text-[#1E223D]/75 mt-1">
            Inject simulated supply shocks and watch the deterministic engine and Ollama AI adapt in real time.
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-2 rounded-full border border-[#E2D5AC] bg-white/90 hover:bg-white px-4 py-2 text-xs font-bold text-[#1E223D] shadow-2xs transition self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {simMessage && (
        <div className="rounded-xl bg-white/95 border border-[#E2D5AC] p-4 text-xs font-bold text-[#E51A24] flex items-center space-x-3 shadow-sm animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#E51A24]" />
          <span>{simMessage}</span>
        </div>
      )}

      {/* Quick Chaos Presets */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E223D]/70 mb-3">
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
          className="w-full sm:w-auto rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-7 py-3 text-xs shadow-md transition flex items-center justify-center space-x-2"
        >
          <Flame className="h-4 w-4 stroke-[2.5]" />
          <span>Execute Disruption Shockwave</span>
        </button>
      </div>
    </div>
  );
}
