import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onOpenAuth, onGoToTeam, onGoToFront, onGoToFaq, onGoToPricing, onGoToDashboard }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
      {/* Top Center Black Navbar with NO GAP at the top (Flush to top, rounded bottom) */}
      <nav style={{
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '5px 12px 7px 12px',
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
          {/* Glossy Champagne, Fire Engine Red & Root Beer App Icon */}
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
            {/* Package / Inventory Graphic */}
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

        {/* Center Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }} className="desktop-nav-pills">
          {['Features'].map((item, idx) => (
            <span
              key={idx}
              onClick={() => {
                if (item === 'Features') {
                  if (onGoToFront) onGoToFront();
                }
              }}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.72)',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.72)';
              }}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right CTA Buttons */}
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

          {/* Login Button in Light White */}
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

        {/* Mobile Toggle */}
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
          top: '76px',
          left: '20px',
          right: '20px',
          background: 'rgba(10, 10, 12, 0.98)',
          backdropFilter: 'blur(24px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          pointerEvents: 'auto'
        }}>
          <span onClick={() => { setMobileOpen(false); if (onGoToFront) onGoToFront(); }} style={{ color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}>Features</span>
        </div>
      )}
    </header>
  );
}
