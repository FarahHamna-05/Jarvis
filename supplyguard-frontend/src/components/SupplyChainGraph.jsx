import React, { useState } from 'react';
import { Network, Info } from 'lucide-react';

export default function SupplyChainGraph({ products = [], suppliers = [], risks = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Group items with calculated positions
  const supplierNodes = suppliers.map((s, idx) => ({
    ...s,
    type: 'SUPPLIER',
    x: 180,
    y: 90 + idx * 105,
  }));

  const productNodes = products.map((p, idx) => {
    const risk = risks.find((r) => r.productId === p.id);
    return {
      ...p,
      type: 'PRODUCT',
      x: 620,
      y: 90 + idx * 105,
      severity: risk?.severity || 'LOW',
      daysUntilStockout: p.daysUntilStockout || risk?.daysUntilStockout || 30
    };
  });

  const getEdgeColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return '#E51A24'; // Red
      case 'HIGH':
        return '#F59E0B'; // Amber
      case 'MEDIUM':
        return '#EAB308'; // Yellow
      default:
        return '#CBD5E1'; // Soft slate
    }
  };

  return (
    <div className="space-y-5 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2D5AC] pb-5 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E223D] flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-red-50 text-[#E51A24] border border-red-200/60">
              <Network className="h-5 w-5" />
            </span>
            <span>Interactive Supply Chain Topology Graph</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Node-link relational topology mapping products to primary and backup suppliers with risk-reactive edges.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-semibold bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="flex items-center space-x-1.5 text-[#E51A24]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E51A24]"></span>
            <span>Critical</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-600">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span>High</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
            <span>Nominal</span>
          </span>
          <span className="flex items-center space-x-1.5 text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-slate-400"></span>
            <span>Backup</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SVG Canvas */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-4 overflow-x-auto min-h-[560px] flex items-center justify-center shadow-sm relative">
          <svg viewBox="0 0 800 600" className="w-full h-[540px]">
            {/* Connecting Edges */}
            {productNodes.map((p) => {
              const primarySup = supplierNodes.find((s) => s.id === p.primarySupplierId);
              const edgeColor = getEdgeColor(p.severity);
              const isCritical = p.severity === 'CRITICAL';

              return (
                <g key={`edges-${p.id}`}>
                  {/* Primary Supplier Edge */}
                  {primarySup && (
                    <g>
                      <path
                        d={`M ${primarySup.x + 80} ${primarySup.y} C ${primarySup.x + 200} ${primarySup.y}, ${p.x - 200} ${p.y}, ${p.x - 80} ${p.y}`}
                        fill="none"
                        stroke={edgeColor}
                        strokeWidth={isCritical ? 3.5 : 2}
                        strokeDasharray={isCritical ? "6,4" : "none"}
                        className={isCritical ? "animate-pulse" : ""}
                        opacity={0.9}
                      />
                    </g>
                  )}

                  {/* Alternate Backup Supplier Edges */}
                  {p.alternateSupplierIds?.map((altId) => {
                    const altSup = supplierNodes.find((s) => s.id === altId);
                    if (!altSup) return null;
                    return (
                      <path
                        key={`alt-${p.id}-${altId}`}
                        d={`M ${altSup.x + 80} ${altSup.y} C ${altSup.x + 220} ${altSup.y}, ${p.x - 220} ${p.y}, ${p.x - 80} ${p.y}`}
                        fill="none"
                        stroke="#94A3B8"
                        strokeWidth={1.5}
                        strokeDasharray="4,4"
                        opacity={0.6}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Supplier Nodes (Left Column) */}
            {supplierNodes.map((s) => {
              const isDisrupted = s.status === 'DISRUPTED';
              const isSelected = selectedNode?.id === s.id && selectedNode?.type === 'SUPPLIER';

              return (
                <g
                  key={`sup-${s.id}`}
                  transform={`translate(${s.x}, ${s.y})`}
                  onClick={() => setSelectedNode(s)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <rect
                    x="-75"
                    y="-28"
                    width="150"
                    height="56"
                    rx="14"
                    fill={isSelected ? '#FEF2F2' : '#FFFFFF'}
                    stroke={isSelected ? '#E51A24' : '#E2E8F0'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
                  />
                  <circle
                    cx="-55"
                    cy="0"
                    r="7"
                    fill={isDisrupted ? '#E51A24' : '#10B981'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x="-40"
                    y="-3"
                    fill={isSelected ? '#E51A24' : '#0F172A'}
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {s.name.length > 15 ? s.name.substring(0, 14) + '...' : s.name}
                  </text>
                  <text
                    x="-40"
                    y="14"
                    fill={isSelected ? '#991B1B' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {s.leadTimeDays}d lead | {s.region?.split(',')[0]}
                  </text>
                </g>
              );
            })}

            {/* Product Nodes (Right Column) */}
            {productNodes.map((p) => {
              const nodeColor = getEdgeColor(p.severity);
              const isSelected = selectedNode?.id === p.id && selectedNode?.type === 'PRODUCT';

              return (
                <g
                  key={`prod-${p.id}`}
                  transform={`translate(${p.x}, ${p.y})`}
                  onClick={() => setSelectedNode(p)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <rect
                    x="-75"
                    y="-28"
                    width="150"
                    height="56"
                    rx="14"
                    fill={isSelected ? '#FEF2F2' : '#FFFFFF'}
                    stroke={isSelected ? '#E51A24' : '#E2E8F0'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))"
                  />
                  <circle
                    cx="-55"
                    cy="0"
                    r="7"
                    fill={nodeColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x="-40"
                    y="-3"
                    fill={isSelected ? '#E51A24' : '#0F172A'}
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {p.name.length > 15 ? p.name.substring(0, 14) + '...' : p.name}
                  </text>
                  <text
                    x="-40"
                    y="14"
                    fill={isSelected ? '#991B1B' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    Runway: {p.daysUntilStockout}d
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Right Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-6 flex flex-col justify-between shadow-sm">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#E51A24] uppercase tracking-wider">
                <Info className="h-4 w-4" />
                <span>Node Telemetry Inspector</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200">
                  {selectedNode.type}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">{selectedNode.name}</h3>
                {selectedNode.type === 'PRODUCT' ? (
                  <p className="text-xs text-slate-500 mt-1">{selectedNode.description}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">{selectedNode.region} &bull; {selectedNode.contactEmail}</p>
                )}
              </div>

              {selectedNode.type === 'PRODUCT' ? (
                <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Current Stock:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedNode.currentStock} units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Stockout Runway:</span>
                    <span className="font-mono font-bold text-[#E51A24]">{selectedNode.daysUntilStockout} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Risk Severity:</span>
                    <span className="font-bold text-[#E51A24] uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px]">
                      {selectedNode.severity}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Status:</span>
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded border ${selectedNode.status === 'DISRUPTED' ? 'bg-red-50 text-[#E51A24] border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Lead Time:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedNode.leadTimeDays} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Reliability:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {Math.round((selectedNode.reliabilityScore || 0.9) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Trust Score:</span>
                    <span className="font-mono font-bold text-slate-900">{Math.round(selectedNode.trustScore || 85)}/100</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs space-y-3 font-semibold">
              <Network className="h-10 w-10 mx-auto text-slate-300" />
              <p>Click on any vendor or SKU node on the canvas to inspect real-time topology telemetry.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
            Edges update dynamically in real time based on active stock consumption and supplier lead times.
          </div>
        </div>
      </div>
    </div>
  );
}

