import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PortalFieldCollection } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <PortalFieldCollection
        variant="flow-field"
        speed={1.00}
        size={1.00}
        length={1.00}
        density={1.00}
        opacity={1.00}
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

export default function LoginPage({ onBackToHome, onSubmitSuccess, onLoginSuccess, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode);
  const [isFading, setIsFading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Store Admin',
    email: 'admin@beforestock.ai',
    password: '••••••••'
  });

  const handleModeSwitch = (newMode) => {
    if (newMode === mode || isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setMode(newMode);
      setIsFading(false);
    }, 220);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const user = {
      username: formData.email.split('@')[0] || 'admin',
      fullName: formData.fullName || (mode === 'signup' ? 'New Operator' : 'Store Admin'),
      email: formData.email || 'admin@beforestock.ai',
      role: 'ROLE_ADMIN',
      onboardingCompleted: true
    };
    if (onSubmitSuccess) {
      onSubmitSuccess(mode === 'signup' ? 'Account created! Welcome to BeforeStock.' : `Welcome back, ${user.fullName}!`);
    }
    if (onLoginSuccess) {
      onLoginSuccess(user);
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '80px 24px 24px 24px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      {/* Main Standalone Auth Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          minHeight: '580px',
          background: '#ffffff',
          borderRadius: '34px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: mode === 'login' ? 'row-reverse' : 'row',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 20px rgba(0, 0, 0, 0.05)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          margin: 'auto',
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'scale(0.97) translateY(4px)' : 'scale(1) translateY(0px)',
          filter: isFading ? 'blur(3px)' : 'blur(0px)',
          transition: 'opacity 0.22s ease-in-out, transform 0.22s ease-in-out, filter 0.22s ease-in-out'
        }}
      >
        {/* Form Panel */}
        <div
          style={{
            flex: '1.1',
            padding: '48px 52px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
            color: '#0f172a',
            zIndex: 10
          }}
        >
          <div>
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(180deg, #ff741e 0%, #F75C03 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(247, 92, 3, 0.4)'
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                </div>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.03em'
                }}>
                  BeforeStock
                </span>
              </div>
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
                >
                  ← Back to Dashboard
                </button>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              margin: '0 0 20px 0'
            }}>
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>

            {/* Social Logins */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '18px',
              padding: '7px 22px',
              borderRadius: '9999px',
              background: '#f1f5f9',
              marginBottom: '16px'
            }}>
              {/* Apple */}
              <button
                type="button"
                onClick={() => alert('Signing in with Apple...')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                title="Sign in with Apple"
              >
                <svg width="18" height="18" viewBox="0 0 170 170" fill="#0f172a">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.71-11.71-14.01-6.19-9.5-10.9-20.24-14.13-32.21-3.23-11.97-4.85-23.07-4.85-33.3 0-14.83 3.65-27.13 10.95-36.9 7.3-9.77 16.59-14.77 27.87-15 4.9.11 10.22 1.39 15.96 3.84 5.74 2.45 9.77 3.73 12.09 3.84 1.85-.22 5.66-1.52 11.44-3.9 5.78-2.38 11.04-3.46 15.79-3.24 10.23.44 18.73 4.13 25.5 11.08 6.77 6.95 11.22 15.54 13.35 25.77-9.58 5.77-14.28 13.93-14.1 24.47.19 8.27 3.34 15.25 9.45 20.93 6.11 5.68 13.37 9.17 21.78 10.47-2.61 7.84-5.83 15.34-9.66 22.52zM119.22 31.95c0-6.75 2.48-13.15 7.43-19.21 4.95-6.06 11.16-9.82 18.63-11.29.33 1.09.49 2.18.49 3.27 0 6.64-2.58 13.1-7.75 19.37-5.17 6.27-11.39 10.02-18.65 11.25-.11-1.19-.15-2.32-.15-3.39z" />
                </svg>
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={() => alert('Signing in with Google...')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                title="Sign in with Google"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => alert('Signing in with Facebook...')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                title="Sign in with Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0 16px 0' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>or enter credentials</span>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              )}

              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '13px 18px',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '13px 44px 13px 18px',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Action Button: Champagne -> Fire Engine Red -> Root Beer Gradient CTA */}
              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  width: '100%',
                  background: '#09090b',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)',
                  textShadow: 'none',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.background = '#18181b';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#09090b';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.3)';
                }}
              >
                <span>{mode === 'signup' ? 'Create Account' : 'Log In'}</span>
              </button>
            </form>
          </div>

          {/* Bottom Mode Switcher */}
          <div style={{
            marginTop: '20px',
            fontSize: '13.5px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => handleModeSwitch(mode === 'signup' ? 'login' : 'signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#F75C03',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                fontSize: '13.5px'
              }}
            >
              {mode === 'signup' ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>

        {/* Right Side: High-End Brand Panel with ThreeUI PortalFieldCollection */}
        <div
          style={{
            flex: '1.25',
            position: 'relative',
            background: '#0a0a0a',
            overflow: 'hidden',
            color: '#ffffff'
          }}
        >
          {/* Exact ThreeUI PortalFieldCollection Flow Field Shader */}
          <Scene />

          {/* Only text displayed in the left-hand side corner */}
          <div style={{
            position: 'absolute',
            bottom: '36px',
            left: '36px',
            zIndex: 2,
            maxWidth: '340px',
            pointerEvents: 'none'
          }}>
            <h3 style={{
              fontSize: '30px',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 8px 0',
              color: '#ffffff',
              letterSpacing: '-0.03em',
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.95)'
            }}>
              Never run out of inventory.
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.75)',
              lineHeight: 1.5,
              margin: 0,
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.95)'
            }}>
              Real-time stockout prediction & automated reordering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
