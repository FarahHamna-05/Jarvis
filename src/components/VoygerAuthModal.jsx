import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

export default function VoygerAuthModal({ isOpen, onClose, defaultMode = 'signup', onSubmitSuccess }) {
  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitSuccess) {
      onSubmitSuccess(mode === 'signup' ? 'Ready for the raid! Profile prepared.' : 'Welcome back, explorer!');
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 14, 24, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          height: '570px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '34px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.5)',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 30,
            transition: 'transform 0.18s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Left Side: Form */}
        <div
          style={{
            flex: '1.05',
            padding: '38px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#ffffff',
            zIndex: 10,
            overflowY: 'auto'
          }}
        >
          <div>
            {/* voyger logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '21px',
                fontWeight: 800,
                color: '#264e3c',
                letterSpacing: '-0.03em'
              }}>
                voyger
              </span>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F54F1B' }} />
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.035em',
              margin: '16px 0 18px 0'
            }}>
              {mode === 'signup' ? 'Start your\nperfect trip' : 'Welcome back,\nexplorer'}
            </h2>

            {/* Social Logins */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '18px',
              padding: '6px 20px',
              borderRadius: '9999px',
              background: '#f1f4f6',
              marginBottom: '14px'
            }}>
              {/* Apple */}
              <button
                type="button"
                onClick={() => alert('Signing in with Apple...')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                title="Sign in with Apple"
              >
                <svg width="17" height="17" viewBox="0 0 170 170" fill="#0f172a">
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
                <svg width="17" height="17" viewBox="0 0 24 24">
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>

            {/* or */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '6px 0 14px 0',
              color: '#94a3b8',
              fontSize: '12.5px'
            }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>or</span>
            </div>

            {/* Inputs */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {mode === 'signup' && (
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f1f4f6',
                    border: '1px solid transparent',
                    borderRadius: '16px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              )}

              <input
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  background: '#f1f4f6',
                  border: '1px solid transparent',
                  borderRadius: '16px',
                  padding: '12px 18px',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#f1f4f6',
                    border: '1px solid transparent',
                    borderRadius: '16px',
                    padding: '12px 44px 12px 18px',
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
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Action Button: Start / Go for the raid */}
              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: '#2e5743',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '13px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(46, 87, 67, 0.35)',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#234635';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2e5743';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>{mode === 'signup' ? 'Start (Go for the raid)' : 'Log in & Explore'}</span>
              </button>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div style={{
            marginTop: '16px',
            fontSize: '13px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0f172a',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                fontSize: '13px'
              }}
            >
              {mode === 'signup' ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>

        {/* Right Side: Mountain Ridge Trail with Interactive Pins */}
        <div
          style={{
            flex: '1.25',
            position: 'relative',
            background: '#1b3327',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src="/trip-trail-clean.png"
            alt="Scenic Mountain Trail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      </div>
    </div>
  );
}
