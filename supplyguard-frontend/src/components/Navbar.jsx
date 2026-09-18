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
  onOpenOnboarding
}) {
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

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
      {/* Top Vibrant Red Talentsy Banner */}
      <header className="w-full bg-[#E51A24] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          
          {/* Left Brand: White Square Badge + SupplyGuard */}
          <div
            onClick={() => {
              if (setActiveTab) setActiveTab('dashboard');
            }}
            className="flex items-center space-x-3 cursor-pointer group select-none pr-4 sm:pr-6 border-r border-white/20"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-[#E51A24] flex items-center justify-center font-black shadow-sm transform group-hover:scale-105 transition-transform">
              <svg
                className="w-4 h-4 text-[#E51A24]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              </svg>
            </div>
            <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
              SupplyGuard
            </span>
          </div>

          {/* Navigation Menu Links — Talentsy White Pill Active Tabs */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3">
            {featureItems.map((f) => {
              const isActive = activeTab === f.id;
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { if (setActiveTab) setActiveTab(f.id); }}
                  className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#E51A24] shadow-md scale-100'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#E51A24]' : 'text-white/80'}`} />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action: Critical Badge, Sync, User Profile Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {criticalCount > 0 && (
              <button
                onClick={onRefresh}
                className="hidden sm:flex items-center space-x-1.5 bg-white text-[#E51A24] font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm hover:bg-white/95 transition"
              >
                <span className="h-2 w-2 rounded-full bg-[#E51A24] animate-ping" />
                <span>{criticalCount} Critical</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1.5 rounded-full transition"
              title="Sync Telemetry"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync</span>
            </button>

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="hidden sm:flex items-center space-x-1.5 bg-white text-[#E51A24] hover:bg-white/90 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm transition border border-white/40 cursor-pointer"
                title="Launch 4-Step Sourcing Onboarding Flow"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#E51A24]" />
                <span>KYB Onboarding</span>
              </button>
            )}

            <button
              onClick={() => { if (setActiveTab) setActiveTab('settings'); }}
              className={`p-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-white text-[#E51A24] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/15'
              }`}
              title="Settings & Profile"
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsFaqOpen(true)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition cursor-pointer"
              title="FAQ & Guide"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm transition border border-white/25 cursor-pointer backdrop-blur-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-white text-[#E51A24] flex items-center justify-center text-[10px] font-black uppercase">
                    {(currentUser.username || 'O')[0]}
                  </div>
                  <span className="max-w-[85px] truncate">{currentUser.username || 'Operator'}</span>
                  <ChevronDown className="h-3 w-3 text-white/80" />
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

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsTeamOpen(true);
                      }}
                      className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer"
                    >
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>About System & Team</span>
                    </button>

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

        </div>

        {/* Mobile Horizontal Navigation Scroll */}
        <div className="lg:hidden flex items-center space-x-1.5 px-4 pb-2.5 overflow-x-auto border-t border-white/10 pt-2">
          {featureItems.map((f) => {
            const isActive = activeTab === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => { if (setActiveTab) setActiveTab(f.id); }}
                className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition ${
                  isActive ? 'bg-white text-[#E51A24] shadow' : 'text-white/85 hover:bg-white/15'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ============================================================ */}
      {/* OUR TEAM MODAL                                               */}
      {/* ============================================================ */}
      {isTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-lg w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#E51A24]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">BeforeStock Engineering Team</h3>
                  <p className="text-xs text-slate-500">Autonomous Supply Chain Intelligence Core</p>
                </div>
              </div>
              <button
                onClick={() => setIsTeamOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Dhanush</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200">
                    Lead System Architect
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Conceived and engineered BeforeStock's end-to-end architecture, deterministic telemetry calculus, human governance gates, and real-time WebSocket infrastructure.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">DeepMind Antigravity Agent</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200">
                    Autonomous AI Pair Programmer
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Collaborative agentic synthesis of Matter.js 2D zero-gravity physics, React Bits SwipeToast notification loops, Spring Boot REST controllers, and Talentsy-inspired design systems.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block font-sans">Core Engine</span>
                  <span className="font-bold text-slate-900">Spring Boot 3.2</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block font-sans">AI Reasoning</span>
                  <span className="font-bold text-slate-900">Ollama Llama-3</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                  <span className="text-slate-500 block font-sans">Database</span>
                  <span className="font-bold text-slate-900">MySQL 8.0</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsTeamOpen(false)}
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FAQ MODAL                                                    */}
      {/* ============================================================ */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-xl w-full space-y-4 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#E51A24]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500">Everything you need to know about SupplyGuard</p>
                </div>
              </div>
              <button
                onClick={() => setIsFaqOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {faqItems.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden transition">
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? -1 : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-100 transition"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#E51A24]' : 'text-slate-400'}`} />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-[11px] leading-relaxed text-slate-600 border-t border-slate-200/60">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsFaqOpen(false)}
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
