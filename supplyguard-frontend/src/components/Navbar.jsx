import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Zap,
  Mail,
  Network,
  History,
  X,
  Check,
  HelpCircle,
  Users,
  CreditCard,
  LogOut,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Settings,
  User
} from 'lucide-react';


export default function Navbar({
  activeTab = 'dashboard',
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onRefresh,
  isRefreshing = false,
  criticalCount = 0,
  onOpenOnboarding,
  onGoToHome
}) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const featureItems = [
    {
      id: 'dashboard',
      label: 'Bento Dashboard',
      description: 'Live Threat Radar, SKU spotlight & deterministic telemetry matrix',
      icon: LayoutDashboard,
      badge: criticalCount > 0 ? `${criticalCount} Critical` : 'Live'
    },
    {
      id: 'products',
      label: 'Product Catalog',
      description: 'Monitored SKUs, 7-day usage array & reorder threshold triggers',
      icon: Boxes,
      badge: 'SKUs'
    },
    {
      id: 'suppliers',
      label: 'Supplier Hub',
      description: 'Global vendor lead times, reliability scores & disruption toggles',
      icon: Truck,
      badge: 'Vendors'
    },
    {
      id: 'simulator',
      label: 'Chaos Sandbox',
      description: 'Inject simulated supply shocks and test autonomous recovery',
      icon: Zap,
      badge: 'Chaos Lab'
    },
    {
      id: 'inbox',
      label: 'Supplier Mailbox',
      description: 'Autonomous PO drafts, human sign-off & simulated supplier replies',
      icon: Mail,
      badge: 'Chats'
    },
    {
      id: 'graph',
      label: 'Supply Chain Graph',
      description: 'Interactive node-link relational topology & risk-reactive edges',
      icon: Network,
      badge: 'Topology'
    },
    {
      id: 'audit',
      label: 'Audit Trail & Logs',
      description: 'Immutable cryptographic logs and human mitigation approvals',
      icon: History,
      badge: 'Audit'
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      description: 'Operator identity, KYB profile, platform safety rules & API keys',
      icon: Settings,
      badge: 'Config'
    }
  ];

  const faqItems = [
    {
      q: "What is BeforeStock and how does it prevent supply chain stockouts?",
      a: "BeforeStock is an autonomous supply chain threat intelligence platform that continuously evaluates inventory consumption against vendor lead times using a 1.20x deterministic safety buffer, detecting stockout risks days before they occur."
    },
    {
      q: "How does the Deterministic Engine differ from probabilistic AI models?",
      a: "Unlike generative LLMs that can hallucinate numbers, our core runway formula is mathematically deterministic: Runway = Stock / (RollingDailyAvg × 1.20). Ollama AI is only used as a reasoning gate for strategic recommendations, never for the underlying arithmetic."
    },
    {
      q: "Can autonomous actions dispatch real purchase orders without human review?",
      a: "No. BeforeStock enforces a strict Human Governance Gate. While the AI drafts emergency POs and evaluates backup vendors, an authorized human operator must cryptographically sign off on the mitigation plan."
    },
    {
      q: "How does the zero-gravity Threat Dossier work?",
      a: "The Threat Dossier is powered by React Bits Matter.js 2D physics. It simulates floating threat pills in zero-gravity with subtle Brownian drift force, allowing operators to drag, fling, and click any threat pill to focus and mitigate."
    },
    {
      q: "How are supplier disruption shockwaves simulated in the Chaos Lab?",
      a: "The Chaos Sandbox lets operators inject Black Friday demand surges (+250%), primary vendor factory blackouts, or maritime port congestions (+14d) to test whether backup supplier allocations prevent factory downtime."
    }
  ];

  return (
    <>
      {/* Top Center Black Floating Glass Pill Navbar with NO GAP at the top (Flush to top, rounded bottom) */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        pointerEvents: 'none'
      }}>
        <nav style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '5px 14px 7px 14px',
          borderRadius: '0 0 18px 18px',
          background: 'rgba(0, 0, 0, 0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderTop: 'none',
          boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 80, 255, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Left Brand Badge: BeforeStock Icon + Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (setActiveTab) setActiveTab('home');
              if (onGoToHome) onGoToHome();
            }}
          >
            {/* Glossy Fire Engine Red & Root Beer App Icon */}
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(180deg, #E63833 0%, #C92924 50%, #280B0B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(201, 41, 36, 0.45)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gloss specular reflection */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }} />

              {/* Glowing core symbol */}
              <div style={{
                width: '12px',
                height: '12px',
                background: '#ffffff',
                borderRadius: '3px',
                transform: 'rotate(45deg)',
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.95)'
              }} />
            </div>

            {/* Brand Title: Bold White Pro Typography */}
            <span style={{
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            }}>
              BeforeStock
            </span>
          </div>

          {/* Center Navigation Links (Matching Landing Page Styling) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }} className="desktop-nav-pills">
            {[
              { id: 'home', label: 'Home' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'products', label: 'Products' },
              { id: 'suppliers', label: 'Suppliers' },
              { id: 'simulator', label: 'Simulator' },
              { id: 'inbox', label: 'Inbox' },
              { id: 'graph', label: 'Graph' },
              { id: 'audit', label: 'Audit' }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <span
                  key={item.id}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                  }}
                  style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(255, 255, 255, 0.14)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.72)';
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {criticalCount > 0 && (
              <span
                style={{
                  background: '#E51A24',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title={`${criticalCount} Critical Inventory Risks`}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                {criticalCount} Critical
              </span>
            )}

            {/* Sync Telemetry */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                padding: '4px 8px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Sync Telemetry"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Home Pill Button matching Landing Page style */}
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('home');
                if (onGoToHome) onGoToHome();
              }}
              style={{
                background: activeTab === 'home' ? '#E51A24' : '#ffffff',
                color: activeTab === 'home' ? '#ffffff' : '#000000',
                border: activeTab === 'home' ? '1px solid rgba(255, 255, 255, 0.4)' : 'none',
                borderRadius: '9999px',
                padding: '5px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: activeTab === 'home' ? '0 4px 16px rgba(229, 26, 36, 0.5)' : '0 4px 14px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                if (activeTab !== 'home') {
                  e.currentTarget.style.background = '#f4f4f5';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                if (activeTab !== 'home') {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
                }
              }}
            >
              <span>Home</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    padding: '3px 8px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                    {(currentUser.username || 'U')[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3 w-3 text-white/70" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 text-slate-800">
                    <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500">
                      <div className="text-slate-900 font-bold truncate text-sm">
                        {currentUser.fullName || currentUser.username}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {currentUser.email || `@${currentUser.username}`}
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200">
                        {currentUser.role || 'ROLE_USER'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (setActiveTab) setActiveTab('settings');
                      }}
                      className="w-full mt-1.5 flex items-center space-x-2 px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 rounded-xl transition font-bold cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-[#E51A24]" />
                      <span>My Profile & Settings</span>
                    </button>

                    {onOpenOnboarding && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenOnboarding();
                        }}
                        className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs text-[#E51A24] hover:bg-red-50 rounded-xl transition font-bold cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#E51A24]" />
                        <span>Replay Onboarding Flow</span>
                      </button>
                    )}

                    {onGoToHome && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onGoToHome();
                        }}
                        className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer"
                      >
                        <Users className="h-3.5 w-3.5 text-slate-500" />
                        <span>About System & Team</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsPricingOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                      <span>Enterprise Pricing</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-bold cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (setActiveTab) setActiveTab('login');
                    else if (onOpenAuth) onOpenAuth('login');
                  }}
                  className={`font-bold text-xs px-3 py-1.5 rounded-full transition cursor-pointer ${
                    activeTab === 'login' ? 'bg-white/25 text-white shadow-xs' : 'text-white hover:bg-white/15'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (setActiveTab) setActiveTab('signup');
                    else if (onOpenAuth) onOpenAuth('signup');
                  }}
                  className={`font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md transition cursor-pointer flex items-center space-x-1 ${
                    activeTab === 'signup'
                      ? 'bg-white text-[#E51A24] ring-2 ring-white/50'
                      : 'bg-white text-[#E51A24] hover:bg-white/95'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-[#E51A24]" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* PRICING MODAL                                                */}
      {/* ============================================================ */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-2xl w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#E51A24]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">SupplyGuard Enterprise Plans</h3>
                  <p className="text-xs text-slate-500">Deterministic inventory protection tiers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPricingOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Plan 1 */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Hackathon Pilot</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">$0 <span className="text-xs font-normal text-slate-500">/free</span></div>
                  <p className="text-[11px] text-slate-600 mt-2">Full live demonstration suite with local Ollama Llama-3 inference.</p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-slate-700">
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>5 Monitored SKUs</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>Matter.js Threat Dossier</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>Chaos Lab Simulator</span></li>
                </ul>
                <button
                  onClick={() => setIsPricingOpen(false)}
                  className="w-full py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
                >
                  Active Plan
                </button>
              </div>

              {/* Plan 2: Pro */}
              <div className="rounded-xl bg-white border-2 border-[#E51A24] p-4 flex flex-col justify-between space-y-3 shadow-lg relative">
                <span className="absolute -top-2.5 right-4 bg-[#E51A24] text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase shadow-sm">
                  Most Popular
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#E51A24]">Autonomous Pro</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">$499 <span className="text-xs font-normal text-slate-500">/month</span></div>
                  <p className="text-[11px] text-slate-600 mt-2">Automated PO drafting, multi-facility telemetry, and supplier webhooks.</p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-slate-700">
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-[#E51A24] shrink-0" /> <span>Unlimited SKUs & Vendors</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-[#E51A24] shrink-0" /> <span>Sub-second WebSockets</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-[#E51A24] shrink-0" /> <span>Autonomous Supplier Outreach</span></li>
                </ul>
                <button
                  onClick={() => setIsPricingOpen(false)}
                  className="w-full py-2 rounded-full bg-[#E51A24] text-white font-bold text-xs hover:bg-[#C91822] transition shadow"
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Sovereign Defense</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">$1,999 <span className="text-xs font-normal text-slate-500">/month</span></div>
                  <p className="text-[11px] text-slate-600 mt-2">Air-gapped private model deployment, custom SAP/Oracle ERP bridges.</p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-slate-700">
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>Custom ERP Sync</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>Dedicated AI Node</span></li>
                  <li className="flex items-center space-x-1.5"><Check className="h-3 w-3 text-emerald-500 shrink-0" /> <span>24/7 SLA Guarantee</span></li>
                </ul>
                <button
                  onClick={() => setIsPricingOpen(false)}
                  className="w-full py-2 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow"
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsPricingOpen(false)}
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
