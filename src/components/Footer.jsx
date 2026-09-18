import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function Footer({ onOpenAuth, onShowToast }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    if (onShowToast) onShowToast('Subscribed! Welcome to the insider prompt newsletter.');
    setEmail('');
  };

  return (
    <footer style={{ position: 'relative', borderTop: '1px solid rgba(0, 0, 0, 0.08)', background: '#ffffff', zIndex: 1 }}>
      {/* Top CTA Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 60px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ff4500 0%, #ff5e00 45%, #ea580c 100%)',
          borderRadius: '32px',
          padding: '64px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(255, 85, 0, 0.35)'
        }}>
          {/* Ambient glow in banner */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(255, 237, 213, 0.45) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            position: 'relative'
          }}>
            Ready to Build <span style={{ textDecoration: 'underline', textDecorationColor: '#fed7aa' }}>Smarter & Faster?</span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '600px',
            margin: '0 auto 36px auto',
            lineHeight: 1.6,
            position: 'relative'
          }}>
            Join over 50,000 developers, designers, and founders who use our prompts that think ahead.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative' }}>
            <button
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              style={{
                padding: '16px 36px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                color: '#ea580c',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="#prompts"
              style={{
                padding: '16px 32px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
            >
              Browse Prompts
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginTop: '80px',
          marginBottom: '60px'
        }}>
          {/* Brand & Newsletter */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff5500, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(255, 98, 0, 0.4)'
              }}>
                <Sparkles size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#09090b' }}>
                Before<span style={{ color: '#ea580c' }}>Stock</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, maxWidth: '340px', margin: '0 0 24px 0' }}>
              Literally before you're out of stock. Intelligent inventory prediction, AI-driven demand forecasting, and automated supplier reordering.
            </p>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', maxWidth: '380px' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  flexGrow: 1,
                  background: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: '#09090b',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Join
              </button>
            </form>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Prompt Explorer', 'Interactive AI Demo', 'Website Showcase', 'Think Ahead Engine', 'Changelog', 'Pricing Plans'].map((item, idx) => (
                <li key={idx}>
                  <a href="#prompts" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Templates Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Templates
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Modern Bakery Store', 'SaaS Dark Mode UI', 'AI Agent Dashboard', 'Fintech Mobile App', 'Cyberpunk Portfolio', 'E-Commerce Marketplace'].map((item, idx) => (
                <li key={idx}>
                  <a href="#demo" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ea580c'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Socials */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#09090b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
              Community
            </h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ea580c';
                  e.currentTarget.style.background = '#fff7ed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ea580c';
                  e.currentTarget.style.background = '#fff7ed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ea580c';
                  e.currentTarget.style.background = '#fff7ed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#faq" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#faq" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>Terms of Service</a></li>
              <li><a href="#faq" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>Security & Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} BeforeStock AI Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ea580c" fill="#ea580c" />
            <span>for visionary creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
