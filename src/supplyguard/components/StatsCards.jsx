import React from 'react';
import { ShieldAlert, AlertTriangle, Boxes, Truck, CheckCircle2, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function StatsCards({ summary, onFilterSeverity }) {
  const cards = [
    {
      title: 'CRITICAL THREATS',
      value: summary?.criticalRisks || 0,
      subtext: 'Runway < Lead Time',
      icon: ShieldAlert,
      tag: 'Urgent',
      tagColor: 'bg-red-50 text-[#E51A24] border-red-200',
      iconBg: 'bg-red-50 text-[#E51A24]',
      filter: 'CRITICAL',
    },
    {
      title: 'HIGH RISK SKUS',
      value: summary?.highRisks || 0,
      subtext: 'Runway < 1.5x Lead Time',
      icon: AlertTriangle,
      tag: 'Warning',
      tagColor: 'bg-amber-50 text-amber-600 border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600',
      filter: 'HIGH',
    },
    {
      title: 'DISRUPTED VENDORS',
      value: summary?.disruptedSuppliers || 0,
      subtext: `Out of ${summary?.totalSuppliers || 0} Registered`,
      icon: Truck,
      tag: 'Disrupted',
      tagColor: 'bg-red-50 text-[#E51A24] border-red-200',
      iconBg: 'bg-red-50 text-[#E51A24]',
      filter: 'DISRUPTED',
    },
    {
      title: 'MONITORED SKUS',
      value: summary?.totalProducts || 0,
      subtext: '1.20x Safety Buffer',
      icon: Boxes,
      tag: 'Active',
      tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      iconBg: 'bg-slate-100 text-slate-700',
      filter: 'ALL',
    },
    {
      title: 'PENDING APPROVALS',
      value: summary?.pendingApprovals || 0,
      subtext: 'Human Sign-off Queue',
      icon: CheckCircle2,
      tag: 'Action',
      tagColor: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600',
      filter: 'PENDING',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onFilterSeverity && onFilterSeverity(card.filter)}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 cursor-pointer transition-all shadow-sm hover:shadow-md hover:border-[#E51A24]/40 group relative flex flex-col justify-between"
          >
            {/* Top Row: Circular Icon Badge + Tag */}
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-full ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.tagColor}`}>
                {card.tag}
              </span>
            </div>

            {/* Metric Value */}
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono-num">
                {card.value}
              </span>
            </div>

            {/* Metric Title & Subtext */}
            <div className="mt-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#E51A24]">
                {card.title}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
