import React, { useState, useEffect, useRef } from 'react';
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
  Menu
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
  onGoToHome,
  onGoToFront,
  onGoToTeam,
  onGoToFaq,
  onGoToPricing,
  onGoToDashboard
}) {
  // If user is authenticated, render the full operational SupplyGuard navbar
  if (currentUser) {
    return (
      <OperationalNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        criticalCount={criticalCount}
        onOpenOnboarding={onOpenOnboarding}
        onGoToHome={onGoToHome || onGoToFront}
      />
    );
  }

  // If not logged in, render the landing page "Our Team & FAQ" navbar
  return (
    <LandingNavbar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAuth={onOpenAuth}
      onGoToHome={onGoToHome || onGoToFront}
      onGoToFront={onGoToFront || onGoToHome}
      onGoToTeam={onGoToTeam}
      onGoToFaq={onGoToFaq}
      onGoToPricing={onGoToPricing}
      onGoToDashboard={onGoToDashboard}
    />
  );
}

/* ========================================================================== */
/* 1. OPERATIONAL NAVBAR (AFTER LOGIN - SupplyGuard Core Platform)            */
/* ========================================================================== */
function OperationalNavbar({
  activeTab = 'dashboard',
  setActiveTab,
  currentUser,
  _onOpenAuth,
  onLogout,
  onRefresh,
  isRefreshing = false,
  criticalCount = 0,
  onOpenOnboarding,
  onGoToHome
}) {
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const userMenuRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Boxes },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'simulator', label: 'Simulator', icon: Zap },
    { id: 'inbox', label: 'Inbox', icon: Mail },
    { id: 'graph', label: 'Graph', icon: Network },
    { id: 'audit', label: 'Audit', icon: History }
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
      {/* Top Center Flush-to-Top Black Glass Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
          pointerEvents: 'none'
        }}
      >
        <nav
          style={{
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
          }}
        >
          {/* Left Brand Badge: BeforeStock Icon + Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (onGoToHome) onGoToHome();
              else if (setActiveTab) setActiveTab('dashboard');
            }}
          >
            {/* Glossy Fire Engine Red & Root Beer App Icon */}
            <div
              style={{
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
              }}
            >
              {/* Gloss specular reflection */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255) 100%)',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }}
              />
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>

            <span
              style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
            >
              BeforeStock
            </span>
          </div>

          {/* Center Navigation Links (Matching Landing Page Styling) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            className="hidden lg:flex desktop-nav-pills"
          >
            {navItems.map((item) => {
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
            {onRefresh && (
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
            )}

            {/* Home Pill Button */}
            <button
              onClick={() => {
                if (onGoToHome) onGoToHome();
                else if (setActiveTab) setActiveTab('home');
              }}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '9999px',
                padding: '5px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
              }}
            >
              <span>Home</span>
            </button>

            {/* User Profile Dropdown Menu */}
            <div className="relative" ref={userMenuRef}>
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
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800
                  }}
                >
                  {(currentUser.username || 'U')[0].toUpperCase()}
                </div>
                <ChevronDown className="h-3 w-3 text-white/70" />
              </button>

              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '224px',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    padding: '8px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    zIndex: 100001
                  }}
                  className="animate-in fade-in zoom-in-95 text-slate-800"
                >
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
                    className="w-full mt-1.5 flex items-center space-x-2 px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 rounded-xl transition font-bold cursor-pointer text-left"
                  >
                    <Settings className="h-3.5 w-3.5 text-[#E51A24]" />
                    <span>My Profile & Settings</span>
                  </button>

                  {onOpenOnboarding && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs text-[#E51A24] hover:bg-red-50 rounded-xl transition font-bold cursor-pointer text-left"
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
                    className="w-full mt-1 flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer text-left"
                  >
                    <Users className="h-3.5 w-3.5 text-slate-500" />
                    <span>About System & Team</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsPricingOpen(true);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer text-left"
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
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition font-bold cursor-pointer text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out of Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle for Small Screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '4px',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer for Logged In User */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '58px',
              left: '16px',
              right: '16px',
              background: 'rgba(10, 10, 12, 0.98)',
              backdropFilter: 'blur(24px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75)',
              pointerEvents: 'auto',
              zIndex: 100002
            }}
          >
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (setActiveTab) setActiveTab(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: isActive ? 'rgba(229, 26, 36, 0.25)' : 'transparent',
                    border: isActive ? '1px solid #E51A24' : 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <ItemIcon size={16} className={isActive ? 'text-[#E51A24]' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '6px 0' }} />

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoToHome) onGoToHome();
                else if (setActiveTab) setActiveTab('home');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <span>3D Showcase Home</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLogout) onLogout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: 'rgba(229, 26, 36, 0.15)',
                border: '1px solid rgba(229, 26, 36, 0.3)',
                borderRadius: '10px',
                color: '#ff4d4f',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* OUR TEAM MODAL                                               */}
      {/* ============================================================ */}
      {isTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 pointer-events-auto">
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
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
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
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-xl w-full space-y-4 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#E51A24]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500">Everything you need to know about BeforeStock</p>
                </div>
              </div>
              <button
                onClick={() => setIsFaqOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
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
                      className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-100 transition cursor-pointer"
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
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-7 max-w-2xl w-full space-y-5 animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-50 text-[#E51A24]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">BeforeStock Enterprise Plans</h3>
                  <p className="text-xs text-slate-500">Deterministic inventory protection tiers</p>
                </div>
              </div>
              <button
                onClick={() => setIsPricingOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
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
                  className="w-full py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition cursor-pointer"
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
                  className="w-full py-2 rounded-full bg-[#E51A24] text-white font-bold text-xs hover:bg-[#C91822] transition shadow cursor-pointer"
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
                  className="w-full py-2 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsPricingOpen(false)}
                className="rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2 text-xs transition shadow-sm cursor-pointer"
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

/* ========================================================================== */
/* 2. LANDING NAVBAR (BEFORE LOGIN - "Our Team & FAQ Page" Navbar)             */
/* ========================================================================== */
function LandingNavbar({
  activeTab = 'home',
  setActiveTab,
  onOpenAuth,
  onGoToHome,
  onGoToFront,
  onGoToTeam,
  onGoToFaq,
  _onGoToPricing,
  onGoToDashboard
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleBrandClick = () => {
    if (onGoToFront) onGoToFront();
    else if (onGoToHome) onGoToHome();
    else if (setActiveTab) setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTeamClick = () => {
    setMobileOpen(false);
    if (onGoToTeam) onGoToTeam();
    else if (setActiveTab) setActiveTab('team');
  };

  const handleFaqClick = () => {
    setMobileOpen(false);
    if (onGoToFaq) onGoToFaq();
    else if (setActiveTab) setActiveTab('faq');
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    if (onOpenAuth) onOpenAuth('login');
    else if (setActiveTab) setActiveTab('login');
  };

  const handleDashboardClick = () => {
    setMobileOpen(false);
    if (onGoToDashboard) {
      onGoToDashboard();
    } else if (setActiveTab) {
      setActiveTab('dashboard');
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
          pointerEvents: 'none'
        }}
      >
        {/* Top Center Black Navbar: ONLY Our Team and FAQ Page */}
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            padding: '5px 14px 7px 14px',
            borderRadius: '0 0 18px 18px',
            background: 'rgba(0, 0, 0, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderTop: 'none',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 80, 255, 0.12)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Left Brand Badge: BeforeStock Icon + Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer'
            }}
            onClick={handleBrandClick}
          >
            {/* Glossy App Icon */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, #F9E7C9 0%, #C92924 50%, #280B0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(201, 41, 36, 0.45)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '45%',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255) 100%)',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }}
              />
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>

            <span
              style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
            >
              BeforeStock
            </span>
          </div>

          {/* Navigation Items: ONLY Our Team and FAQ Page */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            className="hidden sm:flex desktop-nav-pills"
          >
            {/* 1. Our Team */}
            <button
              onClick={handleTeamClick}
              style={{
                background: activeTab === 'team' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeTab === 'team' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
                border: activeTab === 'team' ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = activeTab === 'team' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.background = activeTab === 'team' ? 'rgba(255, 255, 255, 0.16)' : 'transparent';
              }}
            >
              <Users size={14} className="text-[#E51A24]" />
              <span>Our Team</span>
            </button>

            {/* 2. FAQ Page */}
            <button
              onClick={handleFaqClick}
              style={{
                background: activeTab === 'faq' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeTab === 'faq' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
                border: activeTab === 'faq' ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = activeTab === 'faq' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.background = activeTab === 'faq' ? 'rgba(255, 255, 255, 0.16)' : 'transparent';
              }}
            >
              <HelpCircle size={14} className="text-[#E51A24]" />
              <span>FAQ Page</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onGoToDashboard && (
              <button
                onClick={handleDashboardClick}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.24)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <span>Dashboard</span>
              </button>
            )}

            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              style={{
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '9999px',
                padding: '7px 20px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.background = '#f4f4f5';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.25)';
              }}
            >
              <span>Login</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '4px',
                cursor: 'pointer'
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              top: '64px',
              left: '20px',
              right: '20px',
              background: 'rgba(10, 10, 12, 0.98)',
              backdropFilter: 'blur(24px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              pointerEvents: 'auto',
              zIndex: 100002
            }}
          >
            <button
              onClick={handleTeamClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Users size={16} className="text-[#E51A24]" />
              <span>Our Team</span>
            </button>

            <button
              onClick={handleFaqClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '14px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <HelpCircle size={16} className="text-[#E51A24]" />
              <span>FAQ Page</span>
            </button>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

            {onGoToDashboard && (
              <button
                onClick={handleDashboardClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '9px 14px',
                  borderRadius: '9999px',
                  cursor: 'pointer'
                }}
              >
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={handleLoginClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#ffffff',
                border: 'none',
                color: '#000000',
                fontWeight: 700,
                fontSize: '14px',
                padding: '9px 14px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              <span>Login</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
