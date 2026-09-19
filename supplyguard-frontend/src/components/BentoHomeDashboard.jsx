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
  ChevronsRight,
  Image as ImageIcon,
  CheckCheck,
  User,
  LogOut,
  PhoneCall
} from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import FolderFloat from './FolderFloat';
import Folder from './Folder';
import { lazy, Suspense } from 'react';

function SwipeToAuthorizeButton({ onAuthorize, label = "Swipe to Authorize Plan" }) {
  const trackRef = React.useRef(null);
  const [maxDrag, setMaxDrag] = React.useState(0);
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const x = useMotionValue(0);

  React.useEffect(() => {
    const updateBounds = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.clientWidth;
        setMaxDrag(Math.max(0, trackWidth - 48));
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const textOpacity = useTransform(x, [0, (maxDrag || 1) * 0.45], [1, 0.05]);
  const bgWidth = useTransform(x, (val) => `${val + 44}px`);

  const triggerAuth = () => {
    if (isAuthorized) return;
    setIsAuthorized(true);
    animate(x, maxDrag, { type: 'spring', stiffness: 350, damping: 26 });
    if (onAuthorize) {
      onAuthorize();
    }
    setTimeout(() => {
      setIsAuthorized(false);
      animate(x, 0, { type: 'spring', stiffness: 320, damping: 28 });
    }, 2500);
  };

  const handleDragEnd = () => {
    if (isAuthorized) return;
    if (x.get() >= maxDrag * 0.55) {
      triggerAuth();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 26 });
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative w-full h-12 bg-slate-900 rounded-full p-1 select-none overflow-hidden border border-slate-800 shadow-inner flex items-center group cursor-pointer"
      onClick={() => {
        if (!isAuthorized && x.get() < 15) {
          triggerAuth();
        }
      }}
    >
      {/* Background slide fill tracking knob */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#C91822] via-[#E51A24] to-[#FF4D58] rounded-full shadow-[0_0_15px_rgba(229,26,36,0.6)]"
        style={{ width: bgWidth }}
      />

      {/* Shimmer / Animated Label */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-6 pr-2"
        style={{ opacity: textOpacity }}
      >
        <span className="text-xs font-bold tracking-wide text-white/95 drop-shadow-sm flex items-center gap-1.5">
          {isAuthorized ? '✓ Plan Authorized' : label}
        </span>
        {!isAuthorized && (
          <span className="flex items-center text-white/60 ml-1">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.span>
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] -ml-2" />
            </motion.span>
          </span>
        )}
      </motion.div>

      {/* Draggable Knob */}
      <motion.div
        drag={isAuthorized ? false : "x"}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 w-10 h-10 rounded-full bg-white text-[#E51A24] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-grab active:cursor-grabbing hover:scale-[1.04] active:scale-[0.98] transition-transform"
      >
        {isAuthorized ? (
          <Check className="w-5 h-5 stroke-[3] text-emerald-600" />
        ) : (
          <ChevronsRight className="w-5 h-5 stroke-[2.5] text-[#E51A24]" />
        )}
      </motion.div>
    </div>
  );
}

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
  onLogout,
  onOpenVoiceSourcing
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
      tabColor: 'bg-white'
    }
  ];

  const sortedRisks = [...(risks.length > 0 ? risks : defaultRisks)].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (order[a.severity?.toUpperCase()] ?? 99) - (order[b.severity?.toUpperCase()] ?? 99);
  });

  const topRisks = sortedRisks;
  const currentRisk = topRisks[activeRiskIndex % topRisks.length] || topRisks[0];
  const matchedProduct = products.find(
    (p) => p.name === currentRisk.productName || p.id === currentRisk.productId
  ) || products[0];

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
        
        {/* Top Large Canvas Screen - Full White Luxury Container */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 1)',
            color: '#0F172A'
          }}
          className="relative rounded-2xl p-6 lg:p-7 flex flex-col justify-between min-h-[490px] overflow-hidden"
        >
              
              {/* Header: Brand Name + Status & View Toggles */}
              <div className="flex items-center justify-between z-10 flex-wrap gap-2 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold tracking-tight text-[#0F172A]">SupplyGuard</span>
                    <span className="rounded-full bg-[#0F172A] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      AI 2.0
                    </span>
                  </div>

                  <span className="hidden md:flex rounded-full bg-[#0F172A] px-3 py-1 text-xs font-semibold text-white items-center space-x-2 shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-[#E51A24] animate-ping" />
                    <span>Live Threat Radar</span>
                  </span>

                  <div className="flex bg-[#0F172A]/10 rounded-full p-1 text-xs font-semibold">
                    <button
                      onClick={() => setActiveCanvasView('FEATURED')}
                      className={`px-3 py-0.5 rounded-full transition cursor-pointer ${activeCanvasView === 'FEATURED' ? 'bg-[#E51A24] text-white shadow-sm font-bold' : 'text-[#0F172A]/75 hover:text-[#0F172A]'}`}
                    >
                      Spotlight
                    </button>
                    <button
                      onClick={() => setActiveCanvasView('GRAPH')}
                      className={`px-3 py-0.5 rounded-full transition cursor-pointer ${activeCanvasView === 'GRAPH' ? 'bg-[#E51A24] text-white shadow-sm font-bold' : 'text-[#0F172A]/75 hover:text-[#0F172A]'}`}
                    >
                      Topology
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: '#0F172A',
                    borderColor: '#0F172A',
                    color: '#FFFFFF'
                  }}
                  className="flex items-center space-x-2 text-xs font-mono px-3.5 py-1 rounded-full border shadow-xs"
                >
                  <span>Buffer: <strong className="text-white">1.20x</strong></span>
                  <span className="text-white/30">|</span>
                  <span className="text-white font-bold" title={currentUser?.email || currentUser?.companyName}>
                    {currentUser?.fullName || currentUser?.username || 'Operator'}
                  </span>
                  {currentUser?.companyName && (
                    <span className="hidden sm:inline-block text-[10px] text-amber-200/90 font-sans font-semibold px-2 py-0.5 rounded-full bg-white/10">
                      {currentUser.companyName}
                    </span>
                  )}
                  {currentUser && (
                    <button onClick={onLogout} title="Sign Out of Dashboard" className="text-[10px] text-rose-300 hover:text-rose-100 hover:underline ml-1 cursor-pointer font-sans font-bold">
                      Sign Out
                    </button>
                  )}
                </div>
              </div>

              {/* Exact Center Graphic Icon / Topology Canvas */}
              <div className="flex-1 flex items-center justify-center my-2 relative">
                {activeCanvasView === 'FEATURED' ? (
                  /* High-Impact Production SKU Threat Spotlight */
                  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-2">
                    
                    {/* Left Column: Product Imagery + Runway Dial (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-3">
                      {/* Product Image Card with Severity Glow */}
                      <div className="relative group w-full h-[180px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-black/10">
                        <img
                          src={matchedProduct?.imageBase64 || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60'}
                          alt={currentRisk.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        {/* Category Chip */}
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                          {matchedProduct?.category || 'Semiconductors'}
                        </span>

                        {/* Critical Risk Floating Badge */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#E51A24] text-white text-[11px] font-bold shadow-md animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          <span>CRITICAL RISK</span>
                        </div>

                        {/* Runway Badge */}
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/20">
                          {currentRisk.daysUntilStockout}d runway
                        </span>
                      </div>

                      {/* Stock Level vs Threshold Gauge */}
                      <div className="w-full bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 shadow-2xs space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold text-[#0F172A]">
                          <span>Current Stock: <strong className="font-mono text-[#0F172A]">{matchedProduct?.currentStock ?? 115} units</strong></span>
                          <span className="text-[#E51A24] font-mono">Min Threshold: {matchedProduct?.reorderThreshold ?? 200}</span>
                        </div>
                        <div className="w-full h-2 bg-[#0F172A]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E51A24] to-[#ff4d4d] rounded-full"
                            style={{ width: `${Math.min(100, ((matchedProduct?.currentStock ?? 115) / (matchedProduct?.reorderThreshold ?? 200)) * 100)}%` }}
                          />
                        </div>
                        {(matchedProduct?.currentStock ?? 115) <= (matchedProduct?.reorderThreshold ?? 200) && (
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-xs font-bold text-[#E51A24] flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3 text-[#E51A24]" />
                              <span>Low Stock Alert</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const target = matchedProduct || currentRisk;
                                if (onOpenVoiceSourcing) onOpenVoiceSourcing(target);
                              }}
                              className="text-[11px] font-bold text-slate-900 hover:text-[#E51A24] underline flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Campaign & Call &raquo;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Threat Intel, Deficit Breakdown & AI Plan (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
                      {/* Title & SKU Specs */}
                      <div>
                        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#E51A24] mb-1">
                          <ShieldAlert className="h-4 w-4 text-[#E51A24]" />
                          <span className="tracking-wide uppercase">Critical Disruption Detected</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                          {currentRisk.productName}
                        </h3>
                        <p className="text-xs text-[#0F172A]/80 mt-1 leading-relaxed font-medium">
                          {matchedProduct?.description || 'High-density 4nm tensor chip for edge robotics and autonomous systems.'}
                        </p>
                      </div>

                      {/* 3 Metrics Cards Grid */}
                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-[#0F172A]/65 block">Primary Vendor</span>
                          <span className="font-bold text-[#0F172A] truncate block text-[11px]" title={currentRisk.supplierName}>
                            {currentRisk.supplierName}
                          </span>
                          <span className="text-[10px] text-[#E51A24] font-bold">DISRUPTED</span>
                        </div>

                        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-[#0F172A]/65 block">Lead Time</span>
                          <span className="font-mono font-bold text-[#0F172A] text-sm block">
                            {currentRisk.supplierLeadTimeDays || 24}d
                          </span>
                          <span className="text-[10px] text-[#0F172A]/70 font-semibold">vs {currentRisk.daysUntilStockout}d stock</span>
                        </div>

                        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-[#0F172A]/65 block">Deficit Gap</span>
                          <span className="font-mono font-extrabold text-[#E51A24] text-sm block">
                            -{( (currentRisk.supplierLeadTimeDays || 24) - currentRisk.daysUntilStockout ).toFixed(1)}d
                          </span>
                          <span className="text-[10px] text-[#E51A24] font-bold">Uncovered Gap</span>
                        </div>
                      </div>

                      {/* AI Strategic Recommendation Box */}
                      <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3 shadow-2xs flex items-start space-x-3">
                        <div className="h-7 w-7 rounded-lg bg-[#E51A24]/10 border border-[#E51A24]/20 flex items-center justify-center text-[#E51A24] shrink-0 mt-0.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#E51A24]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#E51A24]">
                              AI Strategic Directive
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#0F172A]/60">
                              Action: {currentRisk.actionRecommended || 'EXPEDITE'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#0F172A] mt-0.5 leading-snug">
                            {currentRisk.aiRecommendation || 'Divert replenishment orders to backup supplier Apex Microelectronics immediately.'}
                          </p>
                        </div>
                      </div>

                      {/* Action CTA Bar */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                        <button
                          onClick={() => onOpenMitigationModal && onOpenMitigationModal(currentRisk)}
                          className="px-5 py-2.5 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 cursor-pointer"
                        >
                          <Zap className="h-3.5 w-3.5 fill-white" />
                          <span>Execute Mitigation Plan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const target = matchedProduct || currentRisk;
                            if (onOpenVoiceSourcing) onOpenVoiceSourcing(target);
                          }}
                          className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer border border-slate-700 active:scale-95"
                          title="Open Sourcing Campaign & Connect Call to Alternate Suppliers"
                        >
                          <PhoneCall className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                          <span>Compare & Call Suppliers</span>
                        </button>
                        <button
                          onClick={() => setActiveCanvasView('GRAPH')}
                          className="px-4 py-2.5 rounded-full bg-[#1E223D] hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Network className="h-3.5 w-3.5 text-white" />
                          <span>View Topology</span>
                        </button>
                      </div>

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
                        <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#FAF6EF" stroke={s.status === 'DISRUPTED' ? '#E51A24' : '#D4BF9B'} strokeWidth="1.5" />
                        <circle cx="-42" cy="0" r="4.5" fill={s.status === 'DISRUPTED' ? '#E51A24' : '#10B981'} />
                        <text x="-30" y="4" fill="#1E223D" fontSize="10" fontWeight="bold">
                          {s.name.substring(0, 13)}..
                        </text>
                      </g>
                    ))}

                    {productNodes.map((p) => (
                      <g key={`prod-${p.id}`} transform={`translate(${p.x}, ${p.y})`} className="cursor-pointer">
                        <rect x="-60" y="-18" width="120" height="36" rx="10" fill="#FAF6EF" stroke={p.severity === 'CRITICAL' ? '#E51A24' : '#D4BF9B'} strokeWidth="1.5" />
                        <circle cx="-42" cy="0" r="4.5" fill={p.severity === 'CRITICAL' ? '#E51A24' : '#64748B'} />
                        <text x="-30" y="4" fill="#1E223D" fontSize="10" fontWeight="bold">
                          {p.name.substring(0, 13)}..
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {/* Bottom-Center Bento Card: Parameters Widget - Full White Container */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 1)',
                color: '#0F172A'
              }}
              className="rounded-2xl p-6 lg:p-7 space-y-4 shadow-sm"
            >
              {/* Top Title Pill */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#0F172A] px-3.5 py-1 text-xs font-bold text-white flex items-center space-x-2 shadow-xs">
                  <Info className="h-3.5 w-3.5 text-white" />
                  <span>Deterministic Engine Telemetry Matrix</span>
                </span>
                <span className="text-xs text-[#0F172A]/75 font-mono font-bold">
                  Formula: Stock / (DailyAvg &times; 1.20)
                </span>
              </div>

              {/* 8 Pill Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                {/* 1 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Runway</span>
                  <span className="font-mono font-extrabold text-[#0F172A] text-base">{currentRisk.daysUntilStockout}d</span>
                </div>
                {/* 2 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Daily Use</span>
                  <span className="font-mono font-extrabold text-[#0F172A] text-base">{currentRisk.averageDailyUsage || 24.6}/d</span>
                </div>
                {/* 3 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Lead Time</span>
                  <span className="font-mono font-extrabold text-[#0F172A] text-base">{currentRisk.supplierLeadTimeDays || 24}d</span>
                </div>
                {/* 4 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Buffer</span>
                  <span className="font-mono font-extrabold text-[#0F172A] text-base">1.20x</span>
                </div>
                {/* 5 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Deficit</span>
                  <span className="font-mono font-extrabold text-[#E51A24] text-base">-14.2d</span>
                </div>
                {/* 6 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Severity</span>
                  <span className="font-extrabold text-[#E51A24] text-xs uppercase">{currentRisk.severity}</span>
                </div>
                {/* 7 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">Action</span>
                  <span className="font-mono font-extrabold text-[#0F172A] text-xs truncate">Expedite PO</span>
                </div>
                {/* 8 */}
                <div className="rounded-xl bg-slate-50/90 p-3 border border-slate-200/90 flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[10px] uppercase font-bold text-[#0F172A]/70">AI Gate</span>
                  <span className="font-mono font-extrabold text-emerald-700 text-xs">Verified</span>
                </div>
              </div>

              {/* Progress Slider Line with Scrubber Thumb */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono text-[#0F172A]">
                  <span>Safety Margin Ratio: <strong className="text-[#0F172A] text-sm font-bold">{sliderVal}%</strong></span>
                  <span className="text-[#E51A24] font-extrabold">Deficit Zone (&lt; 50%)</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={sliderVal}
                    onChange={(e) => setSliderVal(Number(e.target.value))}
                    className="w-full h-2 bg-[#0F172A]/15 rounded-lg appearance-none cursor-pointer accent-[#E51A24]"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* 3. RIGHT COLUMN: Bento Cards in Pure White #FFFFFF Modern Style  */}
          {/* ============================================================ */}
          <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-5 shrink-0">
            
            {/* Top Right Header Capsule Button - Full White Container */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 1)',
                color: '#0F172A'
              }}
              className="rounded-2xl p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E51A24] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E51A24]" />
                </span>
                <span className="text-sm font-extrabold text-[#0F172A]">
                  {summary?.criticalRisks || 2} Critical Threat{summary?.criticalRisks > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-1.5 rounded-full bg-[#0F172A] hover:bg-black text-white px-4 py-1.5 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Middle Right: Interactive Threat Dossier — Full White Container */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 1)',
                color: '#0F172A'
              }}
              className="relative rounded-2xl p-5 flex flex-col justify-between min-h-[420px] shadow-sm overflow-visible"
            >

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  Threat Stack ({activeRiskIndex + 1}/{topRisks.length})
                </span>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#0F172A] px-2.5 py-0.5 rounded-full shadow-xs">
                  Threat Dossier
                </span>
              </div>

              {/* Folder view — React Bits <Folder /> */}
              <div className="relative flex-1 flex flex-col items-center justify-center gap-5 py-6">
                <Folder
                  color="#0F172A"
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
                <p className="text-[10px] font-bold text-[#0F172A]/70 uppercase tracking-widest">
                  Click to open &bull; {topRisks.length} active threats
                </p>
              </div>

              {/* Shader Live Sync Toggle + Authorize Mitigation Button */}
              <div className="space-y-2.5 z-20 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#0F172A] truncate max-w-[210px]">
                    Focus: {currentRisk.productName}
                  </span>
                  <span className="font-bold text-[#E51A24]">
                    {currentRisk.daysUntilStockout}d runway
                  </span>
                </div>

                <SwipeToAuthorizeButton
                  onAuthorize={() => onOpenMitigationModal && onOpenMitigationModal(currentRisk)}
                />

                <button
                  type="button"
                  onClick={() => {
                    const target = matchedProduct || currentRisk;
                    if (onOpenVoiceSourcing) onOpenVoiceSourcing(target);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer border border-slate-700 active:scale-95"
                  title="Launch Sourcing Campaign & Connect Voice Call"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                  <span>Compare & Call Suppliers</span>
                </button>
              </div>

            </div>

            {/* Bottom Right: Fan-Out Cards Deck - Full White Container */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 1)',
                color: '#0F172A'
              }}
              className="rounded-2xl p-5 space-y-3.5 shadow-sm"
            >
              
              {/* Top Title Pill + Circular Indicator */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#0F172A] text-white px-3.5 py-1 text-xs font-bold shadow-xs">
                  Autonomous Actions Queue
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#E51A24] animate-pulse" />
              </div>

              {/* Fan-deck cards preview */}
              <div
                onClick={() => onNavigateTab && onNavigateTab('inbox')}
                className="cursor-pointer group relative h-40 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-[#0F172A]/30 transition p-3.5 flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                {/* 3 Fanned-Out Rotated Cards */}
                <div className="relative w-full h-24 flex items-center justify-center">
                  <div className="absolute top-1 left-6 w-28 h-20 rounded-xl bg-slate-200 -rotate-[16deg] shadow-sm pointer-events-none group-hover:-rotate-[20deg] transition-transform" />
                  <div className="absolute top-0.5 left-14 w-30 h-20 rounded-xl bg-[#0F172A] -rotate-[8deg] shadow-sm pointer-events-none group-hover:-rotate-[10deg] transition-transform" />
                  <div className="absolute top-0 left-22 w-36 h-22 rounded-xl bg-[#E51A24] p-2.5 shadow-md rotate-0 pointer-events-none group-hover:scale-105 transition-transform flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white">
                      <span>Procurement PO Draft</span>
                      <CheckCheck className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[9px] text-white/90 line-clamp-2 font-medium leading-tight">
                      Autonomous message to Shenzhen Opto-Tech ready for signature.
                    </p>
                  </div>
                </div>

                {/* Bottom interactive link */}
                <div className="w-full flex items-center justify-between text-xs font-bold text-[#0F172A] relative z-10 pt-1.5 border-t border-slate-200 group-hover:text-[#E51A24] transition-colors">
                  <span>Open Supplier Inbox</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-[#E51A24]" />
                </div>
              </div>

            </div>

          </div>

        </div>
  );
}
