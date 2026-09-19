import React, { useState } from 'react';
import {
  Menu,
  X,
  Users,
  HelpCircle,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  activeTab = 'home',
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onGoToHome,
  onGoToTeam,
  onGoToFaq
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavigate = (tabId) => {
    setMobileOpen(false);
    setUserDropdownOpen(false);

    if (tabId === 'home') {
      if (onGoToHome) onGoToHome();
      else if (setActiveTab) setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tabId === 'team') {
      if (onGoToTeam) onGoToTeam();
      else if (setActiveTab) setActiveTab('team');
      return;
    }

    if (tabId === 'faq') {
      if (onGoToFaq) onGoToFaq();
      else if (setActiveTab) setActiveTab('faq');
      return;
    }

    if (tabId === 'dashboard') {
      if (!currentUser && onOpenAuth) {
        onOpenAuth('login');
        return;
      }
      if (setActiveTab) setActiveTab('dashboard');
      return;
    }

    if (setActiveTab) setActiveTab(tabId);
  };

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
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45), 0 0 20px rgba(0, 80, 255, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Left Brand Badge: BeforeStock Icon + Text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => handleNavigate('home')}
          >
            {/* Glossy Fire Engine Red App Icon */}
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
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px'
                }}
              />
              <svg
                width="14"
                height="14"
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

          {/* Desktop Nav Items: ONLY Our Team and FAQ Page */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            className="hidden md:flex"
          >
            {/* 1. Our Team */}
            <button
              onClick={() => handleNavigate('team')}
              style={{
                background: activeTab === 'team' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeTab === 'team' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
                border: activeTab === 'team' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '5px 13px',
                fontSize: '13px',
                fontWeight: activeTab === 'team' ? 700 : 600,
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
              onClick={() => handleNavigate('faq')}
              style={{
                background: activeTab === 'faq' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: activeTab === 'faq' ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
                border: activeTab === 'faq' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid transparent',
                borderRadius: '9999px',
                padding: '5px 13px',
                fontSize: '13px',
                fontWeight: activeTab === 'faq' ? 700 : 600,
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

          {/* Right Action Buttons: KYC & Categories, Dashboard, Login / User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 3. KYC & Categories */}
            <button
              onClick={() => handleNavigate('kyc')}
              style={{
                background: activeTab === 'kyc' ? 'rgba(229, 26, 36, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: activeTab === 'kyc' ? '1px solid #E51A24' : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                padding: '5px 13px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = activeTab === 'kyc' ? 'rgba(229, 26, 36, 0.25)' : 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <ShieldCheck size={13} className="text-[#E51A24]" />
              <span>KYC & Categories</span>
            </button>

            {/* 4. Dashboard */}
            <button
              onClick={() => handleNavigate('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? '#E51A24' : 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: activeTab === 'dashboard' ? '1px solid #E51A24' : '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                padding: '5px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.18s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                boxShadow: activeTab === 'dashboard' ? '0 4px 14px rgba(229, 26, 36, 0.5)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'dashboard') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.24)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'dashboard') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                }
              }}
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </button>

            {/* 5. Login or User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#E51A24',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    {(currentUser.username || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{currentUser.username}</span>
                  <ChevronDown size={12} className="text-white/70" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '8px',
                      width: '210px',
                      borderRadius: '16px',
                      background: '#0d0d10',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '8px',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                      zIndex: 100001
                    }}
                  >
                    <div style={{ padding: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                        {currentUser.fullName || currentUser.username}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {currentUser.email || `@${currentUser.username}`}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavigate('dashboard');
                      }}
                      style={{
                        width: '100%',
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LayoutDashboard size={14} className="text-[#E51A24]" />
                      <span>Private Workspace</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{
                        width: '100%',
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f87171',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('login');
                  else if (setActiveTab) setActiveTab('login');
                }}
                style={{
                  background: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '6px 18px',
                  fontSize: '12.5px',
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
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              top: '56px',
              left: '16px',
              right: '16px',
              background: 'rgba(10, 10, 12, 0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              zIndex: 100002,
              pointerEvents: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.75)'
            }}
          >
            <button
              onClick={() => handleNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: activeTab === 'home' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <span>Home (3D Experience)</span>
            </button>

            <button
              onClick={() => handleNavigate('team')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: activeTab === 'team' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <Users size={16} className="text-[#E51A24]" />
              <span>Our Team</span>
            </button>

            <button
              onClick={() => handleNavigate('faq')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: activeTab === 'faq' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <HelpCircle size={16} className="text-[#E51A24]" />
              <span>FAQ Page</span>
            </button>

            <button
              onClick={() => handleNavigate('kyc')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: activeTab === 'kyc' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <ShieldCheck size={16} className="text-[#E51A24]" />
              <span>KYC & Categories</span>
            </button>

            <button
              onClick={() => handleNavigate('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: activeTab === 'dashboard' ? '#E51A24' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}
