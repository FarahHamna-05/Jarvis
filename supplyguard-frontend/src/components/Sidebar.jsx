import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Zap,
  Mail,
  Network,
  History,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingApprovals = 0,
  criticalCount = 0,
  onOpenAuth,
  onLogout,
  currentUser
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Bento Dashboard',
      shortLabel: 'Bento',
      icon: LayoutDashboard,
      badge: criticalCount > 0 ? `${criticalCount}` : null,
      badgeColor: 'bg-[#1E223D] text-[#F9E7C9]'
    },
    {
      id: 'products',
      label: 'Product Catalog',
      shortLabel: 'Catalog',
      icon: Boxes,
    },
    {
      id: 'suppliers',
      label: 'Supplier Hub',
      shortLabel: 'Suppliers',
      icon: Truck,
    },
    {
      id: 'simulator',
      label: 'Disruption Sandbox',
      shortLabel: 'Chaos Lab',
      icon: Zap,
      badge: 'Chaos',
      badgeColor: 'bg-[#1E223D] text-[#F9E7C9]'
    },
    {
      id: 'inbox',
      label: 'Supplier Mailbox',
      shortLabel: 'Chats',
      icon: Mail,
    },
    {
      id: 'graph',
      label: 'Supply Chain Graph',
      shortLabel: 'Network',
      icon: Network,
    },
    {
      id: 'audit',
      label: 'Audit Trail & Logs',
      shortLabel: 'Audit',
      icon: History,
      badge: pendingApprovals > 0 ? `${pendingApprovals}` : null,
      badgeColor: 'bg-[#1E223D] text-[#F9E7C9]'
    },
  ];

  return (
    <>
      {/* Mobile Navigation Strip */}
      <div className="md:hidden w-full overflow-x-auto border-b-2 border-black bg-[#F9E7C9] px-3 py-2 flex items-center space-x-1.5 scrollbar-none z-30 sticky top-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={`m-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-black whitespace-nowrap transition-all shrink-0 border border-black ${
                isActive
                  ? 'bg-[#1E223D] text-[#F9E7C9]'
                  : 'bg-[#F9E7C9] text-[#280B0B] hover:bg-[#1E223D]/10'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.shortLabel}</span>
              {item.badge && (
                <span className="rounded-full bg-black text-[#F9E7C9] px-1 py-0.2 text-[9px]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Solid Cream Sidebar */}
      <aside className="w-64 shrink-0 border-r-2 border-black bg-[#F9E7C9] text-[#280B0B] p-4 flex flex-col justify-between hidden md:flex min-h-screen">
        <div className="space-y-4">
          {/* Header Brand Link */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 w-full text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1E223D] text-[#F9E7C9] border border-black flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition">
              SG
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-[#280B0B] leading-none">
                SupplyGuard
              </div>
              <div className="text-[10px] font-bold text-[#280B0B]/70 uppercase tracking-widest mt-0.5">
                Autonomous AI
              </div>
            </div>
          </button>

          <div className="pt-2">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#280B0B]/60">
              Operations Navigation
            </div>
            <div className="space-y-1.5 mt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black transition-all border ${
                      isActive
                        ? 'bg-[#1E223D] text-[#F9E7C9] border-black shadow-md'
                        : 'bg-[#F9E7C9] text-[#280B0B] border-transparent hover:border-black hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#F9E7C9]' : 'text-[#280B0B]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isActive ? 'bg-[#F9E7C9] text-[#280B0B]' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom User & System Audit Status */}
        <div className="space-y-3">
          <div className="rounded-xl border border-black bg-white/40 p-3 text-xs space-y-1 text-[#280B0B]">
            <div className="flex items-center space-x-2 font-black">
              <ShieldCheck className="h-4 w-4 text-[#C92924]" />
              <span>Deterministic Core</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#280B0B]/80">
              Zero hallucination risk buffers & human authorization gate.
            </p>
          </div>

          {/* User Account Bar */}
          <div className="pt-2 border-t border-black/20 flex items-center justify-between">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#1E223D] text-[#F9E7C9] flex items-center justify-center text-xs font-black">
                    {currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : 'OP'}
                  </div>
                  <div className="text-xs font-black text-[#280B0B] truncate max-w-[100px]">
                    {currentUser.username}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-[10px] font-bold text-[#280B0B]/70 hover:text-[#280B0B] hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full py-2 bg-[#1E223D] text-[#F9E7C9] rounded-xl text-xs font-black border border-black hover:opacity-90 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
