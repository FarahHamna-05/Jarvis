import React, { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';
import { showToast } from '../utils/toast';
import {
  Boxes,
  Plus,
  Search,
  TrendingDown,
  Truck,
  Edit2,
  Trash2,
  PhoneCall,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  X,
  ShieldAlert,
  FileText,
  Check
} from 'lucide-react';

export default function ProductCatalog({
  products = [],
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRefresh
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // AI Voice Sourcing State
  const [voiceModalProduct, setVoiceModalProduct] = useState(null);
  const [requiredQuantity, setRequiredQuantity] = useState(50);
  const [isCallingSuppliers, setIsCallingSuppliers] = useState(false);
  const [initiatedCalls, setInitiatedCalls] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [isPollingComparison, setIsPollingComparison] = useState(false);
  const [activeTranscriptModal, setActiveTranscriptModal] = useState(null);
  const [approvingSupplierId, setApprovingSupplierId] = useState(null);
  const [approvalSuccess, setApprovalSuccess] = useState(null);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const pollingRef = useRef(null);

  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch comparison data for a product
  const fetchComparison = useCallback(async (productId, silent = false) => {
    try {
      const res = await apiClient.get(`/products/${productId}/supplier-comparison`);
      if (res.data) {
        setComparisonData(res.data);
        if (res.data.allCompleted && res.data.responsesReceived > 0) {
          setIsPollingComparison(false);
        }
        return res.data;
      }
    } catch (err) {
      if (!silent) {
        console.warn('Could not fetch supplier comparison:', err);
      }
    }
    return null;
  }, []);

  // Open the AI Voice Sourcing Modal
  const handleOpenVoiceModal = (product) => {
    setVoiceModalProduct(product);
    const deficit = Math.max(10, (product.reorderThreshold || 50) - (product.currentStock || 0));
    setRequiredQuantity(deficit > 0 ? deficit : 50);
    setInitiatedCalls([]);
    setApprovalSuccess(null);
    setActiveTranscriptModal(null);
    setIsPollingComparison(false);

    // Initial check if comparison already exists
    fetchComparison(product.id, true);
  };

  // Close modal and stop polling
  const handleCloseVoiceModal = () => {
    setVoiceModalProduct(null);
    setIsPollingComparison(false);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Trigger Outbound AI Voice Calls via Vapi
  const handleTriggerVoiceCalls = async () => {
    if (!voiceModalProduct) return;
    setIsCallingSuppliers(true);
    setApprovalSuccess(null);

    try {
      const res = await apiClient.post(
        `/products/${voiceModalProduct.id}/check-suppliers?requiredQuantity=${requiredQuantity}`
      );
      setInitiatedCalls(res.data || []);

      showToast({
        title: 'AI Voice Sourcing Dispatched',
        description: `Triggered Vapi AI voice calls to ${res.data?.length || 0} alternate supplier(s).`,
        type: 'info'
      });

      // Start automatic polling every 3.5 seconds
      setIsPollingComparison(true);
      fetchComparison(voiceModalProduct.id, true);
    } catch (err) {
      console.error('Failed to trigger supplier calls:', err);
      showToast({
        title: 'Call Initiation Error',
        description: err.response?.data?.message || 'Unable to trigger voice calls to suppliers.',
        type: 'critical'
      });
    } finally {
      setIsCallingSuppliers(false);
    }
  };

  // Polling loop for active calls & comparison
  useEffect(() => {
    if (isPollingComparison && voiceModalProduct) {
      pollingRef.current = setInterval(async () => {
        const data = await fetchComparison(voiceModalProduct.id, true);
        if (data && data.allCompleted && data.responsesReceived > 0) {
          setIsPollingComparison(false);
          showToast({
            title: 'Sourcing Telemetry Complete',
            description: `All supplier voice calls completed and ranked via Ollama AI reasoning.`,
            type: 'success'
          });
        }
      }, 3500);

      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    }
  }, [isPollingComparison, voiceModalProduct, fetchComparison]);

  // Approve a supplier as the new primary
  const handleApproveSupplier = async (supplier) => {
    if (!voiceModalProduct || !supplier) return;
    setApprovingSupplierId(supplier.supplierId);

    try {
      const payload = {
        supplierId: supplier.supplierId,
        callId: supplier.callId || null,
        approvedQuantity: supplier.stockQuantity || requiredQuantity,
        agreedPrice: supplier.pricePerUnit || null,
        notes: `Approved via autonomous AI voice call comparison. Rank #${supplier.rank}.`
      };

      const res = await apiClient.post(`/products/${voiceModalProduct.id}/approve-supplier`, payload);
      setApprovalSuccess(res.data);

      showToast({
        title: 'Supplier Approved!',
        description: `${supplier.supplierName} is now the primary supplier for ${voiceModalProduct.name}.`,
        type: 'success'
      });

      // Refresh product list and telemetry
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to approve supplier:', err);
      showToast({
        title: 'Approval Error',
        description: err.response?.data?.message || 'Failed to update primary supplier.',
        type: 'critical'
      });
    } finally {
      setApprovingSupplierId(null);
    }
  };

  // Developer simulation helper to test the webhook and ranking loop end-to-end
  const handleSimulateWebhook = async (callId) => {
    setIsSimulatingWebhook(true);
    try {
      const mockPayload = {
        message: {
          type: 'end-of-call-report',
          call: {
            id: callId || (initiatedCalls[0] ? initiatedCalls[0].callId : 'sim-call-manual')
          },
          structuredData: {
            availability: true,
            stockQuantity: requiredQuantity + 50,
            deliveryDays: 3,
            pricePerUnit: 39.5,
            interested: true
          },
          transcript:
            'AI Assistant: Hello, I am calling from Procurement regarding component availability. Do you have stock available? ' +
            'Supplier: Yes, we currently have ready inventory of 150 units. We can dispatch within 3 business days at $39.50 per unit. ' +
            'AI Assistant: Thank you, I have logged these terms in our procurement system.'
        }
      };

      await apiClient.post('/calls/webhook', mockPayload);
      showToast({
        title: 'Webhook Sim Ingested',
        description: 'Mock Vapi end-of-call report ingested. Updating comparison...',
        type: 'info'
      });

      if (voiceModalProduct) {
        await fetchComparison(voiceModalProduct.id);
      }
    } catch (err) {
      console.error('Webhook sim failed:', err);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2D5AC] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#1E223D] flex items-center space-x-2">
            <Boxes className="h-5 w-5 text-[#E51A24]" />
            <span>Product Inventory Catalog</span>
            <span className="text-xs font-semibold text-[#1E223D]/70">({products.length} SKUs)</span>
          </h2>
          <p className="text-xs text-[#1E223D]/75 mt-0.5">
            Monitored stock levels with rolling 7-day consumption, automated threshold triggers, and Vapi AI voice sourcing.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="flex items-center space-x-1.5 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by SKU name or specification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E2D5AC] bg-white/95 pl-9 pr-4 py-2 text-xs text-[#1E223D] placeholder-slate-400 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto bg-white/80 p-1 rounded-xl border border-[#E2D5AC]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E51A24] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const isBelowThreshold = product.currentStock <= (product.reorderThreshold || 50);
          const stockHealthPercent = Math.min(
            100,
            Math.round((product.currentStock / ((product.reorderThreshold || 50) * 2)) * 100)
          );
          const isAtRisk = (product.daysUntilStockout || 0) <= (product.primarySupplierLeadTime || 14);

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-[#E2D5AC] bg-white/95 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition relative group"
            >
              <div>
                {/* Image and Header */}
                <div className="flex items-start space-x-3.5">
                  <div className="h-16 w-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-200 shrink-0">
                    {product.imageBase64 ? (
                      <img
                        src={product.imageBase64}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=60';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400">
                        <Boxes className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {product.category || 'General'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onEditProduct && onEditProduct(product)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">{product.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{product.description}</p>
                  </div>
                </div>

                {/* Stock Health Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-600">
                      On-Hand: <strong className="text-slate-900">{product.currentStock}</strong>
                    </span>
                    <span className="text-slate-500">Reorder Threshold: {product.reorderThreshold || 50}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isBelowThreshold ? 'bg-[#E51A24]' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${stockHealthPercent}%` }}
                    />
                  </div>
                </div>

                {/* 7-Day Usage Sparkline Bar Mini-Chart */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center space-x-1">
                      <TrendingDown className="h-3 w-3 text-[#E51A24]" />
                      <span>7-Day Consumption Array</span>
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      avg {product.averageDailyUsage || 15}/day
                    </span>
                  </div>
                  <div className="flex items-end justify-between h-8 pt-1 gap-1">
                    {(product.recentUsage && product.recentUsage.length > 0
                      ? product.recentUsage
                      : [10, 12, 11, 14, 13, 15, 12]
                    ).map((val, i) => {
                      const maxVal = Math.max(...(product.recentUsage || [20]), 25);
                      const heightPercent = Math.min(100, Math.max(15, (val / maxVal) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center group/bar relative">
                          <div
                            className="w-full bg-red-100 group-hover/bar:bg-[#E51A24] rounded-sm transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] text-slate-400 mt-0.5">D{i + 1}</span>
                          <div className="absolute -top-6 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none z-10 font-mono">
                            {val}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Vendors Info, Runway & AI Voice Action Button */}
              <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Truck className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate max-w-[140px] font-medium">{product.primarySupplierName || 'Unassigned'}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      product.primarySupplierStatus === 'DISRUPTED'
                        ? 'bg-red-50 text-[#E51A24] border border-red-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}
                  >
                    {product.primarySupplierStatus || 'ACTIVE'} ({product.primarySupplierLeadTime || 14}d)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Stockout Runway:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      isAtRisk
                        ? 'bg-red-50 text-[#E51A24] font-bold border border-red-200 animate-pulse'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {product.daysUntilStockout || 0} days
                  </span>
                </div>

                {/* AI Voice Call Action Button */}
                <button
                  onClick={() => handleOpenVoiceModal(product)}
                  className={`w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition group/btn ${
                    isAtRisk || product.primarySupplierStatus === 'DISRUPTED'
                      ? 'bg-gradient-to-r from-[#E51A24] via-rose-600 to-[#C91822] text-white hover:brightness-110 shadow-red-200 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                  }`}
                >
                  <PhoneCall className="h-3.5 w-3.5 text-red-300 group-hover/btn:scale-110 transition-transform" />
                  <span>
                    {product.primarySupplierStatus === 'DISRUPTED'
                      ? 'Disrupted • Autonomous AI Sourcing Active'
                      : 'Check Availability (AI Voice Call)'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Voice Call Sourcing Modal */}
      {voiceModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#E51A24] to-rose-600 flex items-center justify-center shadow-inner">
                  <PhoneCall className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">Autonomous AI Voice Sourcing</h3>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-semibold border border-red-500/30 flex items-center space-x-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>Vapi Integration</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Product: <strong className="text-white">{voiceModalProduct.name}</strong> • Current Stock:{' '}
                    <span className="font-mono text-white">{voiceModalProduct.currentStock}</span> • Threshold:{' '}
                    <span className="font-mono text-white">{voiceModalProduct.reorderThreshold || 50}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseVoiceModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {/* Approval Success Banner */}
              {approvalSuccess && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex items-start space-x-3 text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-emerald-800 text-sm">Primary Supplier Successfully Replaced!</p>
                    <p className="mt-1 text-emerald-700">{approvalSuccess.message}</p>
                    <div className="mt-2 flex items-center space-x-4 font-mono text-[11px] text-emerald-800">
                      <span>New Primary: <strong>{approvalSuccess.approvedSupplierName}</strong></span>
                      <span>Lead Time: <strong>{approvalSuccess.newLeadTimeDays} days</strong></span>
                      {approvalSuccess.newCostPerUnit && (
                        <span>Unit Cost: <strong>${approvalSuccess.newCostPerUnit}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sourcing Parameters Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Step 1: Configure Sourcing Target
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Vapi will autonomously dial alternate suppliers for {voiceModalProduct.name} to check live inventory, delivery schedules, and negotiate pricing.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Target Quantity:</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="1"
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:border-[#E51A24] focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">units</span>
                    </div>
                  </div>
                </div>

                {/* Quick preset buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <span className="text-[11px]">Presets:</span>
                    {[25, 50, 100, 200].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setRequiredQuantity(preset)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition ${
                          requiredQuantity === preset
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Trigger Outbound Calls Button */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleTriggerVoiceCalls}
                      disabled={isCallingSuppliers || isPollingComparison}
                      className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] disabled:opacity-60 text-white font-bold px-4 py-2 text-xs shadow-sm transition"
                    >
                      {isCallingSuppliers ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Dispatching Vapi Telephony...</span>
                        </>
                      ) : (
                        <>
                          <PhoneCall className="h-4 w-4" />
                          <span>Initiate AI Voice Calls ({requiredQuantity} units)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* In-Flight Calls Status Banner */}
              {(isPollingComparison || initiatedCalls.length > 0) && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                      </span>
                      <h4 className="text-xs font-bold text-blue-950">
                        {isPollingComparison ? 'Autonomous AI Voice Dispatch In Progress...' : 'Outbound Calls Dispatched'}
                      </h4>
                      {isPollingComparison && (
                        <span className="text-[10px] text-blue-600 font-mono flex items-center space-x-1">
                          <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                          <span>Polling comparison radar every 3.5s</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => fetchComparison(voiceModalProduct.id)}
                        className="p-1 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 text-[11px] font-bold px-2 py-0.5 flex items-center space-x-1"
                        title="Manual Refresh"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Refresh</span>
                      </button>

                      {/* Simulation helper button for testing/demos */}
                      <button
                        onClick={() => handleSimulateWebhook()}
                        disabled={isSimulatingWebhook}
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 flex items-center space-x-1 transition shadow-sm"
                        title="Inject mock Vapi end-of-call report for instant evaluation"
                      >
                        {isSimulatingWebhook ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3 text-amber-300" />
                        )}
                        <span>Simulate Call Response (Demo)</span>
                      </button>
                    </div>
                  </div>

                  {/* Initiated Calls Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {initiatedCalls.map((c, i) => (
                      <div
                        key={c.callId || i}
                        className="bg-white rounded-xl p-3 border border-blue-100 flex items-center justify-between text-xs shadow-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{c.supplierName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{c.phoneNumber || 'Vapi Outbound'}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            {c.status || 'CALLING'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Reasoning Spotlight Card */}
              {comparisonData && comparisonData.aiReasoning && (
                <div className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start space-x-3 relative z-10">
                    <div className="h-9 w-9 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center shrink-0 text-red-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                          AI Autonomous Sourcing Intelligence
                        </h4>
                        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                          Multi-Factor Ranking + Ollama RAG
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {comparisonData.aiReasoning || comparisonData.aiRecommendation}
                      </p>
                      {comparisonData.rankedSuppliers && comparisonData.rankedSuppliers.length > 0 && (
                        <div className="pt-2 flex items-center space-x-2 text-xs text-red-200">
                          <span className="font-bold">Top Choice:</span>
                          <span className="bg-red-500/30 px-2 py-0.5 rounded font-mono font-semibold text-white">
                            {comparisonData.rankedSuppliers[0].supplierName}
                          </span>
                          <span>• Lead Time: {comparisonData.rankedSuppliers[0].deliveryDays}d</span>
                          <span>• Cost: ${comparisonData.rankedSuppliers[0].pricePerUnit?.toFixed(2)}/unit</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Supplier Comparison Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Step 2: AI Voice Comparison & Procurement Review
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Structured findings parsed from Vapi call transcripts. Suppliers ranked by availability, lead time, and pricing.
                    </p>
                  </div>
                  {comparisonData && (
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {comparisonData.responsesReceived || 0} of {comparisonData.totalSuppliersContacted || initiatedCalls.length || 0} reported
                    </span>
                  )}
                </div>

                {comparisonData && comparisonData.rankedSuppliers && comparisonData.rankedSuppliers.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Rank & Supplier</th>
                          <th className="py-2.5 px-3">Availability</th>
                          <th className="py-2.5 px-3">Stock Offered</th>
                          <th className="py-2.5 px-3">Lead Time</th>
                          <th className="py-2.5 px-3">Price / Unit</th>
                          <th className="py-2.5 px-3">Total Cost</th>
                          <th className="py-2.5 px-3">Transcript</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {comparisonData.rankedSuppliers.map((s, idx) => {
                          const isTopRank = s.rank === 1;
                          const hasSufficientStock = s.stockQuantity >= (comparisonData.requiredQuantity || requiredQuantity);

                          return (
                            <tr
                              key={s.supplierId || idx}
                              className={`hover:bg-slate-50/80 transition ${
                                isTopRank ? 'bg-red-50/30' : ''
                              }`}
                            >
                              {/* Supplier & Rank */}
                              <td className="py-3 px-3">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      isTopRank
                                        ? 'bg-[#E51A24] text-white'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {s.rank}
                                  </span>
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center space-x-1">
                                      <span>{s.supplierName}</span>
                                      {isTopRank && (
                                        <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#E51A24] text-[9px] font-extrabold uppercase">
                                          AI Choice
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">{s.supplierPhone || s.phoneNumber || 'Outbound Direct'}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Availability */}
                              <td className="py-3 px-3">
                                {s.availability ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                    <span>Available</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                    <XCircle className="h-3 w-3 text-rose-600" />
                                    <span>Unavailable</span>
                                  </span>
                                )}
                              </td>

                              {/* Stock Offered */}
                              <td className="py-3 px-3">
                                <span
                                  className={`font-mono font-bold ${
                                    hasSufficientStock ? 'text-emerald-700' : 'text-amber-700'
                                  }`}
                                >
                                  {s.stockQuantity} units
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  req: {comparisonData.requiredQuantity || requiredQuantity}
                                </div>
                              </td>

                              {/* Delivery Lead Time */}
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-slate-800">
                                  {s.deliveryDays} days
                                </span>
                                {voiceModalProduct.primarySupplierLeadTime && (
                                  <div className="text-[10px] text-slate-400">
                                    vs primary: {voiceModalProduct.primarySupplierLeadTime}d
                                  </div>
                                )}
                              </td>

                              {/* Price per unit */}
                              <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                                ${s.pricePerUnit ? s.pricePerUnit.toFixed(2) : '0.00'}
                              </td>

                              {/* Total Cost */}
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">
                                ${s.totalCost ? s.totalCost.toFixed(2) : (s.pricePerUnit ? (s.pricePerUnit * (comparisonData.requiredQuantity || s.stockQuantity || 1)).toFixed(2) : '0.00')}
                              </td>

                              {/* Transcript button */}
                              <td className="py-3 px-3">
                                <button
                                  onClick={() =>
                                    setActiveTranscriptModal({
                                      supplierName: s.supplierName,
                                      transcript: s.transcript,
                                      notes: s.notes
                                    })
                                  }
                                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium flex items-center space-x-1 transition"
                                  title="View Call Transcript"
                                >
                                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                                  <span>Transcript</span>
                                </button>
                              </td>

                              {/* Action: Approve */}
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleApproveSupplier(s)}
                                  disabled={approvingSupplierId === s.supplierId}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1 ml-auto ${
                                    isTopRank
                                      ? 'bg-[#E51A24] hover:bg-[#C91822] text-white'
                                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                                  }`}
                                >
                                  {approvingSupplierId === s.supplierId ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                  <span>Approve Primary</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                    <PhoneCall className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">
                      {isPollingComparison
                        ? 'Autonomous calls are active. Awaiting structured reports from Vapi telephony...'
                        : 'No active voice comparison results yet. Click "Initiate AI Voice Calls" above to dial alternate suppliers.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                <span>Approving a supplier writes an immutable audit record and updates inventory lead time models.</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCloseVoiceModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Drawer Modal */}
      {activeTranscriptModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-red-400" />
                <h4 className="text-sm font-bold text-white">
                  Call Transcript: {activeTranscriptModal.supplierName}
                </h4>
              </div>
              <button
                onClick={() => setActiveTranscriptModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
              {activeTranscriptModal.notes && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <strong>Extracted Notes:</strong> {activeTranscriptModal.notes}
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed space-y-2">
                {activeTranscriptModal.transcript || 'No transcript text was recorded for this call.'}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-white text-right">
              <button
                onClick={() => setActiveTranscriptModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
