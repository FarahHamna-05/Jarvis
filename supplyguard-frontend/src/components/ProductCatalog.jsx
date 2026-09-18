import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { FiBriefcase } from 'react-icons/fi';
import { FaArrowRight, FaMapMarkerAlt, FaClock, FaFire } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { motion, useMotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

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

  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.primarySupplierName && p.primarySupplierName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [stackCards, setStackCards] = useState(filteredProducts);

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
              <HiSparkles className="size-3.5 text-[#E51A24]" />
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
                          <FaFire className="size-2.5" />
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
                      <FaMapMarkerAlt className="size-2.5 shrink-0" />
                      <span className="truncate max-w-[130px]">
                        {product.primarySupplierName || 'Unassigned'}
                      </span>
                    </span>

                    {/* Stock Pill with Clock */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <FaClock className="size-2.5 shrink-0" />
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
                      <FaArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
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
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Bottom CTA Banner matching Modern UI specification */}
      <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/90 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-700 shadow-xs">
            <FiBriefcase className="size-4" />
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
          <FaArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
