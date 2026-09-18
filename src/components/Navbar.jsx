import React, { useState, useEffect } from 'react';
import { Menu, X, Users, HelpCircle, ChevronDown } from 'lucide-react';

export default function Navbar({ onOpenAuth, onGoToTeam, onGoToFront, onGoToFaq, onGoToPricing, onGoToDashboard }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const getInitialModal = () => {
    try {
      const p = new URLSearchParams(window.location.search).get('page');
      if (p === 'team') return 'team';
      if (p === 'faq') return 'faq';
    } catch {}
    return null;
  };

  const [isFaqOpen, setIsFaqOpen] = useState(() => getInitialModal() === 'faq');
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search).get('page');
      setIsFaqOpen(p === 'faq');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openFaqModal = () => {
    try {
      window.history.pushState({}, '', '/?page=faq');
    } catch {}
    setIsFaqOpen(true);
    if (onGoToFaq) onGoToFaq();
  };

  const closeModal = () => {
    try {
      window.history.pushState({}, '', '/?page=home');
    } catch {}
    setIsFaqOpen(false);
  };

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
    },
    {
      q: "How does the Vapi AI Voice integration work with suppliers?",
      a: "When a critical stockout is detected, BeforeStock automatically dials primary or alternate suppliers via Vapi AI, conducting human-like negotiation calls to confirm stock availability, expedite delivery, and transcribe the agreement into the audit trail."
    }
  ];

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
              closeModal();
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
              onClick={openFaqModal}
              style={{
                background: isFaqOpen ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                color: isFaqOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
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
                e.currentTarget.style.color = isFaqOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.78)';
                e.currentTarget.style.background = isFaqOpen ? 'rgba(255, 255, 255, 0.16)' : 'transparent';
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
                openFaqModal();
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

      {/* ============================================================ */}
      {/* FAQ PAGE / MODAL VIEW                                         */}
      {/* ============================================================ */}
      {isFaqOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '16px'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              borderRadius: '24px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#0F172A',
              padding: '28px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(255, 255, 255, 0.1)',
              animation: 'fadeIn 0.2s ease-out',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', shrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '14px',
                  background: '#FEE2E2',
                  color: '#E51A24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    Frequently Asked Questions
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                    Everything you need to know about the BeforeStock platform
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{
                  color: '#94A3B8',
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.background = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = '#F1F5F9'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Accordion List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '16px',
              overflowY: 'auto',
              paddingRight: '4px',
              flex: 1
            }}>
              {faqItems.map((item, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: '14px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? -1 : idx)}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#0F172A',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        gap: '12px'
                      }}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          color: isOpen ? '#E51A24' : '#94A3B8',
                          shrink: 0
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 16px 14px 16px',
                        fontSize: '12px',
                        lineHeight: 1.6,
                        color: '#475569',
                        borderTop: '1px solid #F1F5F9',
                        paddingTop: '10px'
                      }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #E2E8F0', shrink: 0 }}>
              <button
                onClick={closeModal}
                style={{
                  borderRadius: '9999px',
                  background: '#E51A24',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  padding: '8px 24px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.18s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#C91822'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#E51A24'; }}
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
