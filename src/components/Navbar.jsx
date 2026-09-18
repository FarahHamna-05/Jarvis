import React, { useState } from 'react';
import { Menu, X, Users, HelpCircle } from 'lucide-react';

export default function Navbar({ onOpenAuth, onGoToTeam, onGoToFront, onGoToFaq, onGoToPricing, onGoToDashboard }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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
        {/* Top Center Black Navbar: ONLY Our Team and FAQ Page */}
        <nav style={{
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
              if (onGoToFront) onGoToFront();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Glossy App Icon */}
            <div style={{
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
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255) 100%)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }} />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>

            <span style={{
              fontSize: '14.5px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
            }}>
              BeforeStock
            </span>
          </div>

          {/* Navigation Items: ONLY Our Team and FAQ Page */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }} className="desktop-nav-pills">
            {/* 1. Our Team */}
            <button
              onClick={() => {
                if (onGoToTeam) onGoToTeam();
              }}
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.78)',
                border: 'none',
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
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Users size={14} className="text-[#E51A24]" />
              <span>Our Team</span>
            </button>

            {/* 2. FAQ Page */}
            <button
              onClick={() => {
                if (onGoToFaq) onGoToFaq();
              }}
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.78)',
                border: 'none',
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
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <HelpCircle size={14} className="text-[#E51A24]" />
              <span>FAQ Page</span>
            </button>
          </div>

          {/* Right CTA Buttons: Dashboard and Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onGoToDashboard && (
              <button
                onClick={onGoToDashboard}
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

            {/* Login Button in Crisp White */}
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
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
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-nav-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              padding: '4px',
              display: 'none',
              cursor: 'pointer'
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile Drawer Menu */}
        {mobileOpen && (
          <div style={{
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
            pointerEvents: 'auto'
          }}>
            <button
              onClick={() => {
                setMobileOpen(false);
                if (onGoToTeam) onGoToTeam();
              }}
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
              onClick={() => {
                setMobileOpen(false);
                if (onGoToFaq) onGoToFaq();
              }}
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
                onClick={() => {
                  setMobileOpen(false);
                  onGoToDashboard();
                }}
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
              onClick={() => {
                setMobileOpen(false);
                if (onOpenAuth) onOpenAuth('login');
              }}
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

