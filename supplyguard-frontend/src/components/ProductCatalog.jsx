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
  Layers,
  LayoutGrid,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  RefreshCw,
  X,
  ShieldAlert,
  FileText,
  Check,
  Volume2,
  Play,
  Radio,
  PhoneCall,
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
  ArrowRight,
  MapPin,
  Clock,
  Flame
} from 'lucide-react';
import { motion, useMotionValue } from 'motion/react';
import { cn } from '../lib/utils';

const MAX_DRAG = 120;

function Card({ children, updatePosition }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > MAX_DRAG ||
      Math.abs(info.offset.y) > MAX_DRAG
    ) {
      updatePosition();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      style={{ x, y }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.65}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 cursor-grab select-none touch-none"
    >
      {children}
    </motion.div>
  );
}

function DeptTab({
  label,
  value,
  isActive,
  count,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium',
        'transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer',
        isActive
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900',
      )}
    >
      {label}
      <span
        className={cn(
          'inline-flex size-4 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums',
          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600',
        )}
      >
        {count}
      </span>
    </button>
  );
}

export default function ProductCatalog({ products = [], onOpenAddProduct, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'stack', or 'grid'

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

  // Live Demo Call Option States
  const [sourcingMode, setSourcingMode] = useState('suppliers'); // 'suppliers' | 'demo'
  const [demoPhoneNumber, setDemoPhoneNumber] = useState('+91');
  const [demoSupplierName, setDemoSupplierName] = useState('Apex Microelectronics India');
  const [isCallingDemo, setIsCallingDemo] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  const pollingRef = useRef(null);

  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.primarySupplierName && p.primarySupplierName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [stackCards, setStackCards] = useState(filteredProducts);

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
  // Open the AI Voice Sourcing Modal (supports setting initial mode to 'demo' or 'suppliers')
  const handleOpenVoiceModal = (product, defaultMode = 'suppliers') => {
    setVoiceModalProduct(product);
    setSourcingMode(defaultMode);
    const deficit = Math.max(10, (product.reorderThreshold || 50) - (product.currentStock || 0));
    setRequiredQuantity(deficit > 0 ? deficit : 50);
    setInitiatedCalls([]);
    setApprovalSuccess(null);
    setActiveTranscriptModal(null);
    setIsPollingComparison(false);

    // Initial check if comparison already exists
    fetchComparison(product.id, true);
  };

  // Close modal and stop polling / speech
  const handleCloseVoiceModal = () => {
    setVoiceModalProduct(null);
    setIsPollingComparison(false);
    setIsSpeakingAudio(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Trigger Custom Live Demo Call to user's phone
  const handleTriggerDemoCall = async () => {
    if (!voiceModalProduct || !demoPhoneNumber || demoPhoneNumber.trim().length < 6) {
      showToast({
        title: 'Valid Phone Required',
        description: 'Please enter a valid phone number (e.g. +91 98765 43210 or 9876543210).',
        type: 'warning'
      });
      return;
    }

    setIsCallingDemo(true);
    setApprovalSuccess(null);

    try {
      const res = await apiClient.post(`/products/${voiceModalProduct.id}/demo-call`, {
        phoneNumber: demoPhoneNumber.trim(),
        supplierName: demoSupplierName.trim(),
        requiredQuantity: requiredQuantity
      });

      const call = res.data;
      setInitiatedCalls((prev) => [
        {
          callId: call.vapiCallId || call.id,
          supplierName: demoSupplierName || 'Demo Indian Supplier',
          phoneNumber: call.supplierPhone || demoPhoneNumber,
          status: call.status || 'CALLING'
        },
        ...prev
      ]);

      showToast({
        title: 'Demo Call Dispatched!',
        description: `Vapi AI is dialing ${demoPhoneNumber}. Please pick up your phone!`,
        type: 'success'
      });

      setIsPollingComparison(true);
      fetchComparison(voiceModalProduct.id, true);
    } catch (err) {
      console.error('Failed to trigger demo call:', err);
      showToast({
        title: 'Demo Call Error',
        description: err.response?.data?.message || 'Unable to place live demo call.',
        type: 'critical'
      });
    } finally {
      setIsCallingDemo(false);
    }
  };

  // Play Spoken AI Voice Dialogue Simulation using Browser SpeechSynthesis
  const handlePlayAudioSimulation = async () => {
    if (typeof window === 'undefined') return;
    setIsSpeakingAudio(true);

    const prodName = voiceModalProduct ? voiceModalProduct.name : 'Components';
    const script = [
      {
        speaker: 'AI Assistant',
        text: `Hello! I am calling from SupplyGuard Autonomous Procurement. We are verifying stock availability for ${prodName}. Do you currently have ${requiredQuantity} units ready for immediate dispatch?`
      },
      {
        speaker: 'Supplier',
        text: `Yes, we have verified inventory of ${requiredQuantity + 50} units ready at our Bangalore facility. We can deliver within 3 business days at 39 dollars and 50 cents per unit.`
      },
      {
        speaker: 'AI Assistant',
        text: `Confirmed. I have logged 3-day lead time at 39 dollars and 50 cents per unit in SupplyGuard procurement radar. Thank you!`
      }
    ];

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let index = 0;
      const speakNext = () => {
        if (index < script.length) {
          const item = script[index];
          const utter = new SpeechSynthesisUtterance(item.text);
          utter.rate = 1.0;
          utter.pitch = item.speaker === 'AI Assistant' ? 1.05 : 0.95;
          utter.onend = () => {
            index++;
            speakNext();
          };
          window.speechSynthesis.speak(utter);
        } else {
          setIsSpeakingAudio(false);
          handleSimulateWebhook();
        }
      };
      speakNext();
    } else {
      setTimeout(() => {
        setIsSpeakingAudio(false);
        handleSimulateWebhook();
      }, 1200);
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
            title: 'Sourcing Evaluation Complete',
            description: 'All supplier responses received and ranked by SupplyGuard AI.',
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

  // Trigger simulated webhook for rapid testing/demos
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
        description: 'Simulated Vapi end-of-call report ingested successfully.',
        type: 'info'
      });

      if (voiceModalProduct) {
        await fetchComparison(voiceModalProduct.id);
      }
    } catch (err) {
      console.error('Webhook sim failed:', err);
      showToast({
        title: 'Simulation Error',
        description: 'Failed to ingest simulated webhook.',
        type: 'warning'
      });
    } finally {
      setIsSimulatingWebhook(false);
    }
  };
  useEffect(() => {
    setStackCards(filteredProducts);
  }, [filteredProducts]);

  const updatePosition = (id) => {
    setStackCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      if (index === -1) return prev;
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  const handleCyclePrev = () => {
    setStackCards((prev) => {
      if (prev.length <= 1) return prev;
      const newCards = [...prev];
      const [card] = newCards.splice(0, 1);
      newCards.push(card);
      return newCards;
    });
  };

  const handleCycleNext = () => {
    if (stackCards.length > 0) {
      updatePosition(stackCards[stackCards.length - 1].id);
    }
  };

  const countByCategory = (cat) => {
    if (cat === 'ALL') return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* 1. Header Banner matching Modern UI specification */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-1 text-xs font-semibold text-[#0F172A]">
              <Sparkles className="size-3.5 text-[#E51A24]" />
              <span>Continuous Inventory Telemetry</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1E223D]">
              Product Inventory{' '}
              <span className="relative inline-block text-[#E51A24]">
                Catalog
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#1E223D]/80 leading-relaxed font-medium">
              Monitored SKU stock levels with rolling 7-day consumption, primary supplier lead times, and automated inventory threshold triggers across all facilities.
            </p>
          </div>

          {/* Action Header Controls */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white/70 p-1 rounded-xl border border-slate-300/80 shadow-2xs backdrop-blur-xs">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
                title="Modern Directory List View"
              >
                <ListFilter className="h-3.5 w-3.5 text-[#E51A24]" />
                <span>Directory List</span>
              </button>

              <button
                onClick={() => setViewMode('stack')}
                className={cn(
                  'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  viewMode === 'stack'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
                title="Interactive Swipeable Stack Deck"
              >
                <Layers className="h-3.5 w-3.5 text-[#E51A24]" />
                <span>Stack Deck</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
                title="Standard Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                <span>Grid View</span>
              </button>
            </div>

            {/* Reset Filters Quick Button (when filters are active) */}
            {(selectedCategory !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchTerm('');
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white/80 hover:bg-white border border-slate-300/80 shadow-xs transition cursor-pointer active:scale-95"
                title="Reset active category and search filters"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>Reset Filters</span>
              </button>
            )}

            {/* AI Draft SKU Button */}
            <button
              onClick={() => {
                onOpenAddProduct && onOpenAddProduct({
                  name: 'High-Bandwidth Memory (HBM3e)',
                  category: 'Semiconductors',
                  currentStock: 450,
                  reorderThreshold: 300,
                  averageDailyUsage: 35,
                  description: '12-layer stacked DRAM high-bandwidth memory for enterprise GPU clusters.',
                  primarySupplierName: 'SK Hynix (Korea)',
                  primarySupplierLeadTime: 21,
                  primarySupplierStatus: 'ACTIVE'
                });
              }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white/90 hover:bg-white border border-slate-300/80 shadow-xs hover:shadow transition cursor-pointer active:scale-95"
              title="Auto-fill AI recommended SKU specification"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
              <span>AI Draft SKU</span>
            </button>

            {/* Live Demo Call Button */}
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => handleOpenVoiceModal(products[0], 'demo')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition cursor-pointer active:scale-95 whitespace-nowrap"
                title="Dial your phone or simulate AI voice supplier call"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Launch Demo Call</span>
              </button>
            )}

            {/* Primary Add SKU Button */}
            <button
              onClick={() => onOpenAddProduct && onOpenAddProduct()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#E51A24] hover:bg-[#C91822] shadow-sm hover:shadow transition cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add Product SKU</span>
            </button>
          </div>
        </div>

        {/* 2. Department / Category Tabs with Live SKU Counts */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <DeptTab
              key={cat}
              label={cat === 'ALL' ? 'All Categories' : cat}
              value={cat}
              isActive={selectedCategory === cat}
              count={countByCategory(cat)}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search inventory by SKU name, technical specification, or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-4 py-3 text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 shadow-2xs focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none transition"
        />
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-12 text-center text-slate-500 shadow-2xs">
          <Boxes className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700">No SKU items found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or selecting a different category filter.</p>
        </div>
      )}

      {/* MODE 1: MODERN DIRECTORY LIST VIEW (Integrated Component UI) */}
      {viewMode === 'list' && filteredProducts.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 sm:px-6 shadow-2xs">
          <ul role="list" className="divide-y divide-slate-100 p-0 m-0">
            {filteredProducts.map((product) => {
              const isBelowThreshold = product.currentStock <= (product.reorderThreshold || 50);
              const runwayDays = product.daysUntilStockout || 0;
              const isHot = runwayDays <= (product.primarySupplierLeadTime || 14) || isBelowThreshold;

              return (
                <li
                  key={product.id}
                  className="group relative flex flex-col gap-3.5 py-5 sm:flex-row sm:items-center sm:gap-5 transition-colors duration-150 hover:bg-slate-50/70 -mx-4 sm:-mx-6 px-4 sm:px-6"
                >
                  {/* SKU Image Thumbnail */}
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                    {product.imageBase64 ? (
                      <img
                        src={product.imageBase64}
                        alt={product.name}
                        className="h-full w-full object-cover pointer-events-none"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=60';
                        }}
                      />
                    ) : (
                      <Boxes className="h-6 w-6 text-slate-400" />
                    )}
                  </div>

                  {/* Title, Hot Pill, Category & Description */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onEditProduct && onEditProduct(product)}
                        className="text-sm font-bold text-slate-900 group-hover:text-[#E51A24] transition-colors sm:text-base cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {isHot && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-200">
                          <Flame className="size-2.5" />
                          Critical Stockout
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {product.category || 'General SKU'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {product.description || 'Monitored supply chain component telemetry record.'}
                    </p>
                  </div>

                  {/* Metadata Pills & Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:shrink-0">
                    {/* Supplier Pill with MapMarker */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-1 text-xs font-medium text-blue-700">
                      <MapPin className="size-2.5 shrink-0" />
                      <span className="truncate max-w-[130px]">
                        {product.primarySupplierName || 'Unassigned'}
                      </span>
                    </span>

                    {/* Stock Pill with Clock */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <Clock className="size-2.5 shrink-0" />
                      <span>{product.currentStock} units on-hand</span>
                    </span>

                    {/* Runway Pill */}
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold',
                        isHot
                          ? 'border-red-200 bg-red-50 text-[#E51A24]'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {runwayDays}d runway
                    </span>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 sm:ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct && onEditProduct(product);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct && onDeleteProduct(product.id);
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Circular Arrow Button */}
                    <button
                      onClick={() => onEditProduct && onEditProduct(product)}
                      className="ml-auto flex size-7 sm:size-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white cursor-pointer"
                      title="Inspect SKU Specifications"
                    >
                      <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* MODE 2: INTERACTIVE SWIPEABLE STACK CARDS */}
      {viewMode === 'stack' && filteredProducts.length > 0 && (
        <div className="flex flex-col items-center justify-center py-6 min-h-[590px]">
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between w-full max-w-[440px] mb-5 px-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#E51A24]" />
              <span>Swipe card in any direction to cycle</span>
            </span>
            <span className="font-mono font-bold text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200/90 shadow-xs">
              SKU {stackCards.length > 0 ? filteredProducts.findIndex(p => p.id === stackCards[stackCards.length - 1]?.id) + 1 : 1} of {filteredProducts.length}
            </span>
          </div>

          {/* Swipeable Stage */}
          <div className="relative h-[510px] w-full max-w-[440px]">
            {stackCards.map((product, index) => {
              const isBelowThreshold = product.currentStock <= (product.reorderThreshold || 50);
              const stockHealthPercent = Math.min(
                100,
                Math.round((product.currentStock / ((product.reorderThreshold || 50) * 2)) * 100)
              );

              return (
                <Card key={product.id} updatePosition={() => updatePosition(product.id)}>
                  <motion.div
                    style={{
                      borderRadius: '32px',
                      transformOrigin: '0% 100%'
                    }}
                    animate={{
                      rotateZ: -(stackCards.length - index - 1) * 4,
                      scale: 1 + index * 0.035 - stackCards.length * 0.035
                    }}
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.45 }}
                    className="size-full overflow-hidden bg-white rounded-[32px] border border-slate-200/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between p-6 select-none"
                  >
                    {/* Top Row: Image, Category & Action Buttons */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-14 w-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 shrink-0">
                            {product.imageBase64 ? (
                              <img
                                src={product.imageBase64}
                                alt={product.name}
                                className="h-full w-full object-cover pointer-events-none"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=60';
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-400">
                                <Boxes className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                              {product.category || 'General'}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate max-w-[200px]">
                              {product.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onEditProduct && onEditProduct(product)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                        {product.description || 'Monitored SKU telemetry unit.'}
                      </p>

                      {/* Stock Health Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-600">
                            On-Hand: <strong className="text-slate-900">{product.currentStock}</strong>
                          </span>
                          <span className="text-slate-500">
                            Reorder: {product.reorderThreshold || 50}
                          </span>
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
                      <div className="mt-4 rounded-2xl bg-slate-50/80 p-3 border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 flex items-center space-x-1">
                            <TrendingDown className="h-3 w-3 text-[#E51A24]" />
                            <span className="font-semibold">7-Day Consumption Array</span>
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            avg {product.averageDailyUsage || 15}/day
                          </span>
                        </div>
                        <div className="flex items-end justify-between h-9 pt-1 gap-1.5">
                          {(product.recentUsage && product.recentUsage.length > 0
                            ? product.recentUsage
                            : [10, 12, 11, 14, 13, 15, 12]
                          ).map((val, i) => {
                            const maxVal = Math.max(...(product.recentUsage || [20]), 25);
                            const heightPercent = Math.min(100, Math.max(15, (val / maxVal) * 100));
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center group relative">
                                <div
                                  className="w-full bg-red-200 group-hover:bg-[#E51A24] rounded-sm transition-all"
                                  style={{ height: `${heightPercent}%` }}
                                />
                                <span className="text-[9px] text-slate-400 mt-0.5">D{i + 1}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer & Action CTA */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <Truck className="h-3.5 w-3.5 text-slate-500" />
                          <span className="truncate max-w-[150px] font-semibold">
                            {product.primarySupplierName || 'Unassigned'}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          product.primarySupplierStatus === 'DISRUPTED'
                            ? 'bg-red-50 text-[#E51A24] border border-red-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {product.primarySupplierStatus || 'ACTIVE'} ({product.primarySupplierLeadTime || 14}d)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Stockout Runway:</span>
                        <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          (product.daysUntilStockout || 0) <= (product.primarySupplierLeadTime || 14)
                            ? 'bg-red-50 text-[#E51A24] border border-red-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {product.daysUntilStockout || 0} days
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePosition(product.id);
                        }}
                        className="w-full cursor-pointer rounded-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] py-3 text-xs font-bold text-white shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        <span>Swipe to Next SKU</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </motion.div>
                </Card>
              );
            })}
          </div>

          {/* Cycle Navigation Buttons below deck */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleCyclePrev}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-xs hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setStackCards(filteredProducts)}
              className="p-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-xs hover:scale-105 transition cursor-pointer"
              title="Reset Deck Order"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCycleNext}
              className="px-4 py-2 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-xs font-bold text-white shadow-md hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next SKU</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: STANDARD GRID VIEW */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isBelowThreshold = product.currentStock <= (product.reorderThreshold || 50);
            const stockHealthPercent = Math.min(
              100,
              Math.round((product.currentStock / ((product.reorderThreshold || 50) * 2)) * 100)
            );

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-slate-200 bg-white/95 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition"
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
                            e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=60';
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
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                          {product.category || 'General'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onEditProduct && onEditProduct(product)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                            className="p-1 text-rose-400 hover:text-rose-600 rounded hover:bg-rose-50 transition cursor-pointer"
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
                      <span className="text-slate-600">On-Hand: <strong className="text-slate-900">{product.currentStock}</strong></span>
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
                          <div key={i} className="flex-1 flex flex-col items-center group relative">
                            <div
                              className="w-full bg-red-100 group-hover:bg-[#E51A24] rounded-sm transition-all"
                              style={{ height: `${heightPercent}%` }}
                            />
                            <span className="text-[9px] text-slate-400 mt-0.5">D{i + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Vendors Info & Runway Footer */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-slate-700">
                      <Truck className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate max-w-[140px] font-medium">{product.primarySupplierName || 'Unassigned'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      product.primarySupplierStatus === 'DISRUPTED'
                        ? 'bg-red-50 text-[#E51A24] border border-red-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {product.primarySupplierStatus || 'ACTIVE'} ({product.primarySupplierLeadTime || 14}d)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Stockout Runway:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      (product.daysUntilStockout || 0) <= (product.primarySupplierLeadTime || 14)
                        ? 'bg-red-50 text-[#E51A24] font-bold border border-red-200'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {product.daysUntilStockout || 0} days
                    </span>
                  </div>
                </div>
                {/* AI Voice Call Action Button & Demo Shortcut */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenVoiceModal(product, 'suppliers')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition group/btn ${
                      isAtRisk || product.primarySupplierStatus === 'DISRUPTED'
                        ? 'bg-gradient-to-r from-[#E51A24] via-rose-600 to-[#C91822] text-white hover:brightness-110 shadow-red-200 animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                    }`}
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-red-300 group-hover/btn:scale-110 transition-transform" />
                    <span>
                      {product.primarySupplierStatus === 'DISRUPTED'
                        ? 'Disrupted • AI Sourcing'
                        : 'AI Voice Sourcing'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleOpenVoiceModal(product, 'demo')}
                    title="Interactive Demo Call (Direct Phone / Browser Audio)"
                    className="flex items-center space-x-1 py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shrink-0 cursor-pointer"
                  >
                    <Radio className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Demo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Bottom CTA Banner matching Modern UI specification */}
      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
            <Briefcase className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Need to monitor a new raw material SKU or component specification?
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly register supplier lead times, reorder thresholds, and consumption telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E51A24] hover:text-[#C91822] hover:underline underline-offset-4 transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Onboard New Product SKU</span>
          <ArrowRight className="size-3" />
        </button>
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
                {/* Mode Selector Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setSourcingMode('suppliers')}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        sourcingMode === 'suppliers'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>All Alternate Suppliers Fleet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSourcingMode('demo')}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        sourcingMode === 'demo'
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <Radio className="h-3.5 w-3.5" />
                      <span>Interactive Demo Call</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-700 text-white rounded-full font-mono">
                        Live / Audio
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Target Quantity:</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="1"
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono font-bold text-slate-900 focus:border-[#E51A24] focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">units</span>
                    </div>
                  </div>
                </div>

                {sourcingMode === 'suppliers' ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Step 1: Configure Sourcing Target
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Vapi will autonomously dial registered alternate suppliers for {voiceModalProduct.name} to check live inventory, delivery schedules, and negotiate pricing.
                        </p>
                      </div>
                    </div>

                    {/* Quick preset buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <span className="text-[11px]">Presets:</span>
                        {[25, 50, 100, 200].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setRequiredQuantity(preset)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition cursor-pointer ${
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
                          type="button"
                          onClick={handleTriggerVoiceCalls}
                          disabled={isCallingSuppliers || isPollingComparison}
                          className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] disabled:opacity-60 text-white font-bold px-4 py-2 text-xs shadow-sm transition cursor-pointer"
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
                  </>
                ) : (
                  /* Demo Call Panel */
                  <div className="space-y-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-950">
                      <div className="flex items-center space-x-2 font-bold text-emerald-900 mb-1">
                        <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
                        <span>Interactive Demo Call Mode</span>
                      </div>
                      <p className="text-emerald-800">
                        Experience Vapi AI voice calls live! Receive a real call on your phone (supporting Indian <code className="font-mono bg-emerald-100 px-1 rounded">+91XXXXXXXXXX</code> numbers), or listen to the AI voice dialogue aloud directly in your browser.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone Number (to receive call):
                        </label>
                        <div className="space-y-1.5">
                          <input
                            type="tel"
                            value={demoPhoneNumber}
                            onChange={(e) => setDemoPhoneNumber(e.target.value)}
                            placeholder="+91 98765 43210 or 9876543210"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                          />
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400">Quick prefix:</span>
                            <button
                              type="button"
                              onClick={() => setDemoPhoneNumber('+91')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-semibold text-slate-700 cursor-pointer"
                            >
                              +91 (India)
                            </button>
                            <button
                              type="button"
                              onClick={() => setDemoPhoneNumber('+1')}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-semibold text-slate-700 cursor-pointer"
                            >
                              +1 (US)
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Supplier Persona Name:
                        </label>
                        <input
                          type="text"
                          value={demoSupplierName}
                          onChange={(e) => setDemoSupplierName(e.target.value)}
                          placeholder="e.g. Apex Microelectronics India"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          The simulated supplier entity that will appear in your ranking comparison.
                        </p>
                      </div>
                    </div>

                    {/* Audio Speaking Animation if speech synthesis is running */}
                    {isSpeakingAudio && (
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="h-4 w-4 text-indigo-600 animate-bounce" />
                          <span className="text-xs font-bold text-indigo-900">
                            AI Voice Dialogue Speaking Aloud in Browser...
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSpeakingAudio(false);
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                            }
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 px-2 py-0.5 rounded bg-white border border-red-200 cursor-pointer"
                        >
                          Stop Audio
                        </button>
                      </div>
                    )}

                    {/* Demo Action Buttons */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handlePlayAudioSimulation}
                        disabled={isSpeakingAudio}
                        className="flex items-center space-x-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-3.5 py-2 text-xs transition cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-indigo-600 text-indigo-600" />
                        <span>In-Browser Voice Simulation (Aloud)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerDemoCall}
                        disabled={isCallingDemo || isPollingComparison}
                        className="flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-4 py-2 text-xs shadow-sm transition cursor-pointer"
                      >
                        {isCallingDemo ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Dialing Phone via Vapi...</span>
                          </>
                        ) : (
                          <>
                            <PhoneCall className="h-4 w-4" />
                            <span>Dial My Phone ({demoPhoneNumber})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
