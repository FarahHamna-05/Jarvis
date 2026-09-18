import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero({ onOpenAuth }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Progress from 0 to 1 over first 600px of scroll
      const progress = Math.min(Math.max(scrollY / 600, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Diagonal Transformation matching user's Image 1 & Image 2
  const rotateX = scrollProgress * 26; // Tilts backward
  const rotateY = -scrollProgress * 22; // Rotates horizontally (Image 2)
  const rotateZ = -scrollProgress * 12; // Subtle dynamic diagonal skew (Image 2)
  const scale = 1 - scrollProgress * 0.22; // Scales down
  const translateY = scrollProgress * 35; // Shifts gracefully
  const shadowOpacity = 0.35 + scrollProgress * 0.35;

  return (
    <section
      ref={heroRef}
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 20px 60px 20px',
        perspective: '1400px',
        perspectiveOrigin: 'center 45%',
        overflow: 'visible',
        zIndex: 2,
        background: 'transparent'
      }}
    >
      {/* 3D Transformable Hero Canvas Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          borderRadius: '34px',
          padding: '8px',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: `0 ${25 + scrollProgress * 50}px ${50 + scrollProgress * 60}px rgba(0, 0, 0, ${shadowOpacity}), 0 0 70px rgba(255, 98, 0, ${0.15 + scrollProgress * 0.2})`,
          transform: `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale}) translateY(${translateY}px)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.08s cubic-bezier(0.1, 0.2, 0.1, 1), box-shadow 0.2s ease',
          willChange: 'transform'
        }}
      >
        {/* Inner Canvas: Vibrant Luxury Orange & Sunset Amber Gradient */}
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ff4500 0%, #ff5500 28%, #ff6e00 65%, #ea580c 100%)',
            padding: 'clamp(36px, 5vw, 68px) clamp(24px, 5vw, 64px)',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}
        >
          {/* Ambient Warm Golden/Sunset Orbs inside Canvas */}
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '25%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255, 237, 213, 0.4) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            right: '15%',
            width: '550px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Main Hero Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Left Column: Heading, Subtitle, and Action CTAs */}
            <div style={{ maxWidth: '580px' }}>
              <h1
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.06,
                  letterSpacing: '-0.035em',
                  margin: '0 0 24px 0',
                  textShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                Prompts that<br />think ahead
              </h1>

              <p
                style={{
                  fontSize: 'clamp(15px, 1.6vw, 17.5px)',
                  color: 'rgba(255, 255, 255, 0.94)',
                  lineHeight: 1.65,
                  margin: '0 0 36px 0',
                  fontWeight: 400,
                  maxWidth: '480px'
                }}
              >
                Turn engagement into conversions, trends into traffic, and views into revenue. All with intelligent prompt blueprints that anticipate your next move.
              </p>

              {/* Action Buttons: See Pricing & Start Journey */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#pricing"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.18)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    color: '#ffffff',
                    fontSize: '14.5px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  See Pricing
                </a>

                <button
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px 28px',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    color: '#ff4500',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <span>Start Journey</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Right Column: Floating 3D Artwork Card (matching Images 1 & 2) */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Vertical Card Frame */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  height: '420px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'linear-gradient(180deg, #2b1104 0%, #150600 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.45), 0 0 40px rgba(255, 98, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '20px'
                }}
              >
                {/* 3D Ethereal Visual Canvas */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(circle at 50% 30%, rgba(255, 107, 0, 0.45) 0%, transparent 60%),
                    radial-gradient(circle at 50% 70%, rgba(254, 215, 170, 0.3) 0%, transparent 60%),
                    linear-gradient(180deg, #2b1104 0%, #0d0400 100%)
                  `,
                  zIndex: 0
                }} />

                {/* Generative Warm Ethereal 3D Sculptural Graphic */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}>
                  <svg width="240" height="300" viewBox="0 0 240 300" fill="none" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.7))' }}>
                    <defs>
                      <linearGradient id="sculptureGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="30%" stopColor="#fed7aa" />
                        <stop offset="70%" stopColor="#ff6200" />
                        <stop offset="100%" stopColor="#c2410c" />
                      </linearGradient>
                      <linearGradient id="sculptureGlowOrange" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#fdba74" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ff4500" stopOpacity="0" />
                      </linearGradient>
                      <radialGradient id="waterRipplesOrange" cx="50%" cy="85%" r="45%">
                        <stop offset="0%" stopColor="#fdba74" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="#ff6200" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Water ripples at bottom */}
                    <ellipse cx="120" cy="250" rx="90" ry="20" fill="url(#waterRipplesOrange)" />
                    <ellipse cx="120" cy="250" rx="60" ry="12" stroke="rgba(254, 215, 170, 0.5)" strokeWidth="1" fill="none" />
                    <ellipse cx="120" cy="250" rx="35" ry="7" stroke="rgba(255, 98, 0, 0.6)" strokeWidth="1" fill="none" />

                    {/* Ethereal Abstract 3D Figure */}
                    <path
                      d="M120 60 C145 75 160 110 150 145 C140 180 160 210 140 240 C130 255 110 255 100 240 C80 210 100 180 90 145 C80 110 95 75 120 60 Z"
                      fill="url(#sculptureGradOrange)"
                      opacity="0.95"
                    />

                    {/* Folded origami facet overlay */}
                    <path
                      d="M120 60 L140 115 L120 170 L100 115 Z"
                      fill="url(#sculptureGlowOrange)"
                    />
                    <path
                      d="M120 170 L150 200 L120 240 L90 200 Z"
                      fill="rgba(255, 255, 255, 0.25)"
                    />
                    <circle cx="120" cy="115" r="8" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />
                  </svg>
                </div>

                {/* Card Top Pill Badge */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#fed7aa',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}>
                    Neural Model 3.7
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e'
                  }} />
                </div>

                {/* Card Bottom Meta */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                    Synthesis Core
                  </div>
                  <div style={{ fontSize: '11px', color: '#fed7aa' }}>
                    Anticipates layout & UX physics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar inside Hero Canvas: Avatar Social Proof & Micro Text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            marginTop: '40px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Social Proof Avatars */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 16px 6px 8px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User avatar"
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: i > 0 ? '-8px' : 0,
                      border: '2px solid #ffffff'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Trusted by 4,000+ creatives
              </span>
            </div>

            {/* Micro Caption */}
            <p style={{
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.88)',
              margin: 0,
              maxWidth: '440px',
              lineHeight: 1.5,
              textAlign: 'right'
            }}>
              From creating scroll-stopping content to engineering algorithms, we help your brand break through the noise and go viral.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
