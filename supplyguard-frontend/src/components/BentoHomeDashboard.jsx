import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Boxes,
  Truck,
  Zap,
  Mail,
  Network,
  History,
  Send,
  Plus,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  CheckCheck,
  User,
  LogOut
} from 'lucide-react';
import FolderFloat from './FolderFloat';
import Folder from './Folder';
import { lazy, Suspense } from 'react';

const ShaderToggle = lazy(() =>
  import('../shaders/skeuomorphic-toggle/ShaderToggle').then((m) => ({ default: m.ShaderToggle }))
);

export default function BentoHomeDashboard({
  summary,
  risks = [],
  products = [],
  suppliers = [],
  conversations = [],
  onApproveAction,
  onOpenMitigationModal,
  onOpenDraftEmail,
  onNavigateTab,
  onPromptChat,
  onRefresh,
  isRefreshing,
  currentUser,
  activeTab = 'dashboard',
  onOpenAuth,
  onLogout
}) {
  const [activeRiskIndex, setActiveRiskIndex] = useState(0);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [activeCanvasView, setActiveCanvasView] = useState('FEATURED'); // 'FEATURED' or 'GRAPH'
  const [sliderVal, setSliderVal] = useState(38);
  const [threatViewMode, setThreatViewMode] = useState('folder');

  const defaultRisks = [
    {
      id: 1,
      productName: 'AI Neural Co-Processor X9',
      severity: 'CRITICAL',
      daysUntilStockout: 3.9,
      supplierName: 'Shenzhen Opto-Tech Logistics',
      supplierLeadTimeDays: 24,
      averageDailyUsage: 24.6,
      reason: 'PRIMARY SUPPLIER DISRUPTED: Factory stoppage triggers immediate stockout threat.',
      aiRecommendation: 'Divert replenishment orders to backup supplier Apex Microelectronics immediately.',
      actionRecommended: 'SWITCH_SUPPLIER_AND_EXPEDITE',
      tabColor: 'bg-[#EDEBDD]'
    },
    {
      id: 2,
      productName: 'Ultra-Capacitor Energy Module 48V',
      severity: 'HIGH',
      daysUntilStockout: 8.2,
      supplierName: 'Apex Microelectronics Ltd',
      supplierLeadTimeDays: 14,
      averageDailyUsage: 18.0,
      reason: 'TRANSIT BOTTLENECK: Port congestion adding 6 days to primary delivery schedule.',
      aiRecommendation: 'Authorize split-air freight shipment to bridge 500 unit supply deficit.',
      actionRecommended: 'EXPEDITE_AIR_FREIGHT',
      tabColor: 'bg-[#E5E3B8]'
    },
    {
      id: 3,
      productName: 'Precision Optical Sensor V2',
      severity: 'MEDIUM',
      daysUntilStockout: 14.5,
      supplierName: 'Global Micro Silicon',
      supplierLeadTimeDays: 10,
      averageDailyUsage: 12.4,
      reason: 'USAGE SURGE: Production ramp increased daily consumption by 35%.',
      aiRecommendation: 'Increase standing bi-weekly reorder quantity from 200 to 350 units.',
      actionRecommended: 'INCREASE_REORDER_QTY',
      tabColor: 'bg-[#FFFDD0]'
    }
  ];

  const sortedRisks = [...(risks.length > 0 ? risks : defaultRisks)].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (order[a.severity?.toUpperCase()] ?? 99) - (order[b.severity?.toUpperCase()] ?? 99);
  });

  const topRisks = sortedRisks;
  const currentRisk = topRisks[activeRiskIndex % topRisks.length] || topRisks[0];

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    if (!aiPromptInput.trim()) return;
    if (onPromptChat) {
      onPromptChat(aiPromptInput);
      setAiPromptInput('');
    }
  };

  // Center canvas wide SVG topology layout
  const supplierNodes = (suppliers.length > 0 ? suppliers : [
    { id: 1, name: 'Shenzhen Opto-Tech', status: 'DISRUPTED' },
    { id: 2, name: 'Apex Microelectronics', status: 'ACTIVE' },
    { id: 3, name: 'Global Micro Silicon', status: 'ACTIVE' },
    { id: 4, name: 'Kyoto Sensors Co', status: 'ACTIVE' }
  ]).slice(0, 4).map((s, idx) => ({
    ...s,
    type: 'SUPPLIER',
    x: 140,
    y: 65 + idx * 60
  }));

  const productNodes = (products.length > 0 ? products : [
    { id: 1, name: 'AI Neural Co-Processor', primarySupplierId: 1, severity: 'CRITICAL', daysUntilStockout: 3.9 },
    { id: 2, name: 'Ultra-Capacitor 48V', primarySupplierId: 2, severity: 'HIGH', daysUntilStockout: 8.2 },
    { id: 3, name: 'Optical Sensor V2', primarySupplierId: 3, severity: 'MEDIUM', daysUntilStockout: 14.5 },
    { id: 4, name: 'Power Inverter MCU', primarySupplierId: 4, severity: 'LOW', daysUntilStockout: 32.0 }
  ]).slice(0, 4).map((p, idx) => {
    const risk = risks.find((r) => r.productId === p.id);
    return {
      ...p,
      type: 'PRODUCT',
      x: 560,
      y: 65 + idx * 60,
      severity: risk?.severity || p.severity || 'LOW',
      daysUntilStockout: p.daysUntilStockout || risk?.daysUntilStockout || 30
    };
  });

  const getEdgeColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return '#F9E7C9';
      case 'HIGH': return '#FFA07A';
      case 'MEDIUM': return '#F5D77F';
      default: return '#F2D8B3';
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-300">
      
      {/* ============================================================ */}
      {/* 1. CENTER STAGE + PARAMETERS WIDGET                          */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        
        {/* Top Large Canvas Screen - Modern Clean White Card */}
        <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 flex flex-col justify-between h-[470px] shadow-sm overflow-hidden text-slate-900">
              
              {/* Header: Brand Name + Status & View Toggles */}
              <div className="flex items-center justify-between z-10 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold tracking-tight text-slate-900">SupplyGuard</span>
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-[#E51A24] border border-red-200">
                      AI 2.0
                    </span>
                  </div>

                  <span className="hidden md:flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-[#E51A24] animate-ping" />
                    <span>Live Threat Radar</span>
                  </span>

                  <div className="flex bg-slate-100 rounded-full p-1 text-xs font-semibold">
                    <button
                      onClick={() => setActiveCanvasView('FEATURED')}
                      className={`px-3 py-0.5 rounded-full transition ${activeCanvasView === 'FEATURED' ? 'bg-[#E51A24] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Spotlight
                    </button>
                    <button
                      onClick={() => setActiveCanvasView('GRAPH')}
                      className={`px-3 py-0.5 rounded-full transition ${activeCanvasView === 'GRAPH' ? 'bg-[#E51A24] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Topology
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-200">
                  <span>Buffer: <strong className="text-slate-900">1.20x</strong></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-900 font-bold">{currentUser?.username || 'Guest'}</span>
                  {currentUser && (
                    <button onClick={onLogout} title="Sign Out" className="text-[10px] text-slate-500 hover:underline ml-1">
                      (out)
                    </button>
                  )}
                </div>
              </div>

              {/* Exact Center Graphic Icon / Topology Canvas */}
              <div className="flex-1 flex items-center justify-center my-2 relative">
                {activeCanvasView === 'FEATURED' ? (
                  /* Center Graphic Matching Wireframe Silhouette */
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="relative group cursor-pointer" onClick={() => setActiveCanvasView('GRAPH')}>
                      {/* Center Image Icon Badge matching wireframe */}
                      <div className="relative h-20 w-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E51A24] shadow-sm group-hover:scale-105 transition-all">
                        <ImageIcon className="h-10 w-10 stroke-[1.5]" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#E51A24] text-xs font-bold shadow-sm">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Critical Threat Detected</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{currentRisk.productName}</h3>
                      <p className="text-sm text-slate-600 max-w-lg mx-auto">
                        Stockout runway: <span className="text-[#E51A24] font-mono font-bold text-base">{currentRisk.daysUntilStockout} days</span> &bull; {currentRisk.supplierName} &bull; Lead Time: {currentRisk.supplierLeadTimeDays || 14}d
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Interactive Topology Graph SVG */
                  <svg viewBox="0 0 720 280" className="w-full h-full max-h-[300px]">
                    {productNodes.map((p) => {
                      const primarySup = supplierNodes.find((s) => s.id === p.primarySupplierId) || supplierNodes[0];
                      const edgeColor = getEdgeColor(p.severity);
                      const isCrit = p.severity === 'CRITICAL';
                      return (
                        <g key={`edge-${p.id}`}>
                          {primarySup && (
                            <path
                              d={`M ${primarySup.x + 60} ${primarySup.y} C ${primarySup.x + 180} ${primarySup.y}, ${p.x - 180} ${p.y}, ${p.x - 60} ${p.y}`}
                              fill="none"
                              stroke={isCrit ? '#E51A24' : '#CBD5E1'}
                              strokeWidth={isCrit ? 3 : 1.5}
                              strokeDasharray={isCrit ? "6,4" : "none"}
                              className={isCrit ? "animate-pulse" : ""}
                              opacity={1}
                            />
                          )}
                        </g>
                      );
                    })}

                    {supplierNodes.map((s) => (
                      <g key={`sup-${s.id}`} transform={`translate(${s.x}, ${s.y})`} className="cursor-pointer">
                        <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#FFFFFF" stroke={s.status === 'DISRUPTED' ? '#E51A24' : '#E2E8F0'} strokeWidth="1.5" />
                        <circle cx="-42" cy="0" r="4.5" fill={s.status === 'DISRUPTED' ? '#E51A24' : '#10B981'} />
                        <text x="-30" y="4" fill="#1E293B" fontSize="10" fontWeight="bold">
                          {s.name.substring(0, 13)}..
                        </text>
                      </g>
                    ))}

                    {productNodes.map((p) => (
                      <g key={`prod-${p.id}`} transform={`translate(${p.x}, ${p.y})`} className="cursor-pointer">
                        <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#FFFFFF" stroke={p.severity === 'CRITICAL' ? '#E51A24' : '#E2E8F0'} strokeWidth="1.5" />
                        <circle cx="-42" cy="0" r="4.5" fill={p.severity === 'CRITICAL' ? '#E51A24' : '#64748B'} />
                        <text x="-30" y="4" fill="#1E293B" fontSize="10" fontWeight="bold">
                          {p.name.substring(0, 13)}..
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>

              {/* Bottom Floating Prompt Capsule */}
              <form onSubmit={handlePromptSubmit} className="z-10 mt-2">
                <div className="rounded-full bg-slate-50 border border-slate-200 p-1.5 pl-4 flex items-center space-x-3 shadow-sm focus-within:border-[#E51A24] focus-within:ring-2 focus-within:ring-red-100 transition">
                  <button
                    type="button"
                    onClick={() => setAiPromptInput("Why did Shenzhen Opto-Tech trigger a critical risk?")}
                    className="h-8 w-8 rounded-full bg-white text-slate-700 hover:text-[#E51A24] flex items-center justify-center transition shrink-0 shadow-sm border border-slate-200"
                    title="Quick Prompt"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="Ask SupplyGuard AI or prompt an autonomous procurement action..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    className="h-8 w-8 rounded-full bg-[#E51A24] text-white hover:bg-[#C91822] flex items-center justify-center transition shrink-0 font-bold shadow"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom-Center Bento Card: Parameters Widget - Clean White Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 space-y-4 shadow-sm text-slate-900">
              {/* Top Title Pill */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-800 flex items-center space-x-2">
                  <Info className="h-3.5 w-3.5 text-[#E51A24]" />
                  <span>Deterministic Engine Telemetry Matrix</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Formula: Stock / (DailyAvg &times; 1.20)
                </span>
              </div>

              {/* 8 Pill Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                {/* 1 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Runway</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{currentRisk.daysUntilStockout}d</span>
                </div>
                {/* 2 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Daily Use</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{currentRisk.averageDailyUsage || 24.6}/d</span>
                </div>
                {/* 3 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Lead Time</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{currentRisk.supplierLeadTimeDays || 24}d</span>
                </div>
                {/* 4 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Buffer</span>
                  <span className="font-mono font-bold text-slate-900 text-base">1.20x</span>
                </div>
                {/* 5 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Deficit</span>
                  <span className="font-mono font-bold text-[#E51A24] text-base">-14.2d</span>
                </div>
                {/* 6 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Severity</span>
                  <span className="font-bold text-[#E51A24] text-xs uppercase">{currentRisk.severity}</span>
                </div>
                {/* 7 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Action</span>
                  <span className="font-mono font-bold text-slate-900 text-xs truncate">Expedite PO</span>
                </div>
                {/* 8 */}
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">AI Gate</span>
                  <span className="font-mono font-bold text-emerald-600 text-xs">Verified</span>
                </div>
              </div>

              {/* Progress Slider Line with Scrubber Thumb */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-600">
                  <span>Safety Margin Ratio: <strong className="text-slate-900 text-sm">{sliderVal}%</strong></span>
                  <span className="text-[#E51A24] font-bold">Deficit Zone (&lt; 50%)</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E51A24]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* 3. RIGHT COLUMN: Cards in White with Red Accents            */}
          {/* ============================================================ */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-5 shrink-0">
            
            {/* Top Right Header Capsule Button */}
            <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E51A24] animate-pulse" />
                <span className="text-sm font-bold text-slate-900">
                  {summary?.criticalRisks || 2} Critical Threat{summary?.criticalRisks > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-1.5 rounded-full bg-slate-100 hover:bg-[#E51A24] hover:text-white px-4 py-1.5 text-xs text-slate-800 font-bold transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Middle Right: Interactive Threat Dossier — React Bits <Folder /> */}
            <div className="relative rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-5 flex flex-col justify-between min-h-[420px] shadow-sm overflow-visible">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Threat Stack ({activeRiskIndex + 1}/{topRisks.length})
                </span>
                <span className="text-[10px] font-bold text-[#E51A24] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full">
                  Threat Dossier
                </span>
              </div>

              {/* Folder view — React Bits <Folder /> */}
              <div className="relative flex-1 flex flex-col items-center justify-center gap-5 py-6">
                <Folder
                  color="#E51A24"
                  size="medium"
                  items={topRisks.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRiskIndex(i);
                        if (onOpenMitigationModal) onOpenMitigationModal(r);
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px 6px',
                        gap: 2,
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: 7.5, fontWeight: 900, color: '#E51A24', letterSpacing: 1, textTransform: 'uppercase' }}>
                        {r.severity}
                      </span>
                      <span style={{ fontSize: 8, fontWeight: 700, color: '#000000', textAlign: 'center', lineHeight: 1.2 }}>
                        {r.productName?.split(' ').slice(0, 3).join(' ')}
                      </span>
                      <span style={{ fontSize: 7, fontWeight: 900, color: '#E51A24', fontFamily: 'monospace' }}>
                        {r.daysUntilStockout}d runway
                      </span>
                    </div>
                  ))}
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Click to open &bull; {topRisks.length} active threats
                </p>
              </div>

              {/* Shader Live Sync Toggle + Authorize Mitigation Button */}
              <div className="space-y-2.5 z-20 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800 truncate max-w-[210px]">
                    Focus: {currentRisk.productName}
                  </span>
                  <span className="font-bold text-[#E51A24]">
                    {currentRisk.daysUntilStockout}d runway
                  </span>
                </div>

                {/* WebGL Shader Toggle — Live Sync */}
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 px-3 py-1.5">
                  <div style={{ width: 100, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    <Suspense fallback={
                      <div style={{ width: 100, height: 52, background: '#0C0C0E', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#E51A24', fontSize: 9, fontWeight: 900, letterSpacing: 2 }}>SYNC</span>
                      </div>
                    }>
                      <ShaderToggle
                        mode="dark"
                        defaultOn={true}
                        label="Live Sync"
                        speed={1.0}
                        size={0.68}
                        opacity={1.0}
                        hue={-10}
                        saturation={1.5}
                        brightness={1.1}
                      />
                    </Suspense>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Live Sync</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">Real-time telemetry active</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenMitigationModal && onOpenMitigationModal(currentRisk)}
                  className="w-full rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold py-3 text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 group hover:scale-[1.01]"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Authorize Mitigation Plan</span>
                </button>
              </div>

            </div>

            {/* Bottom Right: Fan-Out Cards Deck */}
            <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-5 space-y-3.5 shadow-sm">
              
              {/* Top Title Pill + Circular Indicator */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700">
                  Autonomous Actions Queue
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E51A24] animate-pulse" />
              </div>

              {/* Fan-deck cards preview */}
              <div
                onClick={() => onNavigateTab && onNavigateTab('inbox')}
                className="cursor-pointer group relative h-32 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition p-3.5 flex items-end overflow-hidden"
              >
                {/* 3 Fanned-Out Rotated Cards */}
                <div className="absolute top-3 left-4 w-32 h-24 rounded-xl bg-slate-300 -rotate-[16deg] shadow-sm pointer-events-none group-hover:-rotate-[20deg] transition-transform" />
                <div className="absolute top-2 left-12 w-32 h-24 rounded-xl bg-slate-700 -rotate-[8deg] shadow-sm pointer-events-none group-hover:-rotate-[10deg] transition-transform" />
                <div className="absolute top-1 left-20 w-36 h-26 rounded-xl bg-[#E51A24] p-3 shadow-md rotate-0 pointer-events-none group-hover:scale-105 transition-transform flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-bold text-white">
                    <span>Procurement PO Draft</span>
                    <CheckCheck className="h-3.5 w-3.5 text-white" />
                  </div>
                  <p className="text-[9px] text-white/90 line-clamp-2 font-medium">
                    Autonomous message to Shenzhen Opto-Tech ready for signature.
                  </p>
                </div>

                {/* Bottom interactive link */}
                <div className="w-full flex items-center justify-between text-xs font-bold text-slate-900 relative z-10 pt-2 group-hover:text-[#E51A24] transition-colors">
                  <span>Open Supplier Inbox</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-[#E51A24]" />
                </div>
              </div>

            </div>

          </div>

        </div>
  );
}
