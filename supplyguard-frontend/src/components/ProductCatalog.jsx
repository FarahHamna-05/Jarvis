import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  TrendingDown,
  Truck,
  Edit2,
  Trash2
} from 'lucide-react';

export default function ProductCatalog({ products = [], onOpenAddProduct, onEditProduct, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 text-slate-900">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Boxes className="h-5 w-5 text-[#E51A24]" />
            <span>Product Inventory Catalog</span>
            <span className="text-xs font-semibold text-slate-500">({products.length} SKUs)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitored stock levels with rolling 7-day consumption and automated threshold triggers.
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="flex items-center space-x-1.5 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-sm transition self-start sm:self-auto"
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
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#E51A24] focus:ring-2 focus:ring-red-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition whitespace-nowrap ${
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
          const stockHealthPercent = Math.min(100, Math.round((product.currentStock / ((product.reorderThreshold || 50) * 2)) * 100));

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
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
                          <div className="absolute -top-6 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 font-mono">
                            {val}
                          </div>
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
    </div>
  );
}
