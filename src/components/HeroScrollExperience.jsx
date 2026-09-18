import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const deckCards = [
  {
    id: 0,
    title: 'Browse our templates',
    tag: 'POPULAR COLLECTION',
    accent: '#f96015',
    textColor: '#1E223D',
    bg: 'linear-gradient(135deg, #ff741e 0%, #f96015 45%, #d64a00 100%)',
    buttonText: 'Explore the collection',
    category: 'Website'
  },
  {
    id: 1,
    title: 'Neural Blueprints',
    tag: 'AI ARCHITECTURE',
    accent: '#9abc05',
    textColor: '#ffffff',
    bg: 'linear-gradient(145deg, #2d6a4f 0%, #18542a 60%, #0d3319 100%)',
    buttonText: 'Inspect Neural Models',
    category: 'AI Models'
  },
  {
    id: 2,
    title: 'Visual UI Kits',
    tag: 'DESIGN SYSTEMS',
    accent: '#38bdf8',
    textColor: '#ffffff',
    bg: 'linear-gradient(145deg, #011463 0%, #021F94 50%, #0d38c7 100%)',
    buttonText: 'Inspect UI Components',
    category: 'UI/UX'
  },
  {
    id: 3,
    title: 'Next.js Apps',
    tag: 'FULL-STACK',
    accent: '#f96015',
    textColor: '#1E223D',
    bg: 'linear-gradient(145deg, #ffffff 0%, #f3e8cc 60%, #e6d7b8 100%)',
    buttonText: 'Launch Code Engine',
    category: 'Coding'
  }
];

export default function HeroScrollExperience({ onOpenAuth, onSelectPrompt }) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Distance scrolled through the container
      const totalScrollableDistance = containerHeight - windowHeight;
      const currentScroll = -rect.top;

      const progress = Math.min(Math.max(currentScroll / totalScrollableDistance, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transformation Calculations matching user's exact 4 reference images:
  // Phase 1 (0 to 0.35): Tilts backward (Image 3)
  // Phase 2 (0.35 to 0.65): Rotates diagonally into 3D floating tile (Image 4)
  // Phase 3 (0.65 to 1.0): Fades into 3D card deck (Image 5)

  // Card rotation parameters
  const heroRotateX = scrollProgress < 0.35
    ? scrollProgress * (22 / 0.35)
    : 22 + (scrollProgress - 0.35) * (14 / 0.3); // up to 36deg

  const heroRotateY = scrollProgress < 0.35
    ? -scrollProgress * (8 / 0.35)
    : -8 - (scrollProgress - 0.35) * (18 / 0.3); // up to -26deg

  const heroRotateZ = scrollProgress < 0.35
    ? 0
    : -(scrollProgress - 0.35) * (42 / 0.3); // diagonal tilt up to -42deg (Image 4!)

  const heroScale = scrollProgress < 0.35
    ? 1 - scrollProgress * (0.15 / 0.35)
    : 0.85 - (scrollProgress - 0.35) * (0.33 / 0.3); // scales down to 0.52 (Image 4!)

  // Opacity transitions
  const heroOpacity = scrollProgress > 0.68
    ? Math.max(0, 1 - (scrollProgress - 0.68) / 0.12)
    : 1;

  const bgTextOpacity = scrollProgress < 0.28
    ? 0
    : Math.min(1, (scrollProgress - 0.28) / 0.25);

  const deckOpacity = scrollProgress < 0.62
    ? 0
    : Math.min(1, (scrollProgress - 0.62) / 0.2);

  const deckScale = scrollProgress < 0.62
    ? 0.75
    : 0.75 + Math.min(1, (scrollProgress - 0.62) / 0.25) * 0.25;

  return (
    <div
      ref={containerRef}
      id="home"
      style={{
        position: 'relative',
        height: '280vh', // Pinned scroll track
        background: '#ffffff'
      }}
    >
      {/* Sticky Viewport Window */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          perspective: '1400px',
          perspectiveOrigin: 'center center'
        }}
      >
        {/* Massive Editorial Background Heading (Images 4 & 5) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '1350px',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: bgTextOpacity,
            transition: 'opacity 0.2s ease',
            padding: '0 20px'
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 6.8rem)',
              fontWeight: 800,
              color: '#09090b',
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              margin: 0,
              opacity: 0.95
            }}
          >
            Design that stands out without compromise
          </h2>
        </div>

        {/* 1. The Transforming Hero Card (Images 2, 3, 4) */}
        {heroOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              width: '92%',
              maxWidth: '1240px',
              borderRadius: '34px',
              padding: '8px',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: `
                0 ${25 + scrollProgress * 50}px ${60 + scrollProgress * 50}px rgba(0, 0, 0, ${0.2 + scrollProgress * 0.25}),
                0 0 70px rgba(255, 98, 0, ${0.15 + scrollProgress * 0.15})
              `,
              transform: `
                rotateX(${heroRotateX}deg)
                rotateY(${heroRotateY}deg)
                rotateZ(${heroRotateZ}deg)
                scale(${heroScale})
              `,
              transformStyle: 'preserve-3d',
              opacity: heroOpacity,
              zIndex: scrollProgress > 0.65 ? 2 : 5,
              pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
              transition: 'box-shadow 0.2s ease',
              willChange: 'transform, opacity'
            }}
          >
            {/* Inner Canvas: Vibrant Luxury Orange & Sunset Amber Gradient */}
            <div
              style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ff4500 0%, #ff5500 28%, #ff6e00 65%, #ea580c 100%)',
                padding: 'clamp(32px, 4.5vw, 64px) clamp(24px, 4.5vw, 60px)',
                minHeight: '580px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.4)'
              }}
            >
              {/* Ambient Glowing Orbs */}
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

              {/* Main Grid Content */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '36px',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Left Column */}
                <div style={{ maxWidth: '540px' }}>
                  <h1
                    style={{
                      fontSize: 'clamp(2.6rem, 5vw, 4.5rem)',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.06,
                      letterSpacing: '-0.035em',
                      margin: '0 0 20px 0',
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Prompts that<br />think ahead
                  </h1>

                  <p
                    style={{
                      fontSize: 'clamp(14.5px, 1.5vw, 17px)',
                      color: 'rgba(255, 255, 255, 0.94)',
                      lineHeight: 1.6,
                      margin: '0 0 32px 0',
                      fontWeight: 400,
                      maxWidth: '460px'
                    }}
                  >
                    Turn engagement into conversions, trends into traffic, and views into revenue. All with intelligent prompt blueprints that anticipate your next move.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <a
                      href="#pricing"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 24px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.18)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 700,
                        textDecoration: 'none'
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
                        padding: '12px 26px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        color: '#ff4500',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <span>Start Journey</span>
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Right Column: 3D Artwork Card */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      height: '380px',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: 'linear-gradient(180deg, #2b1104 0%, #150600 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '18px'
                    }}
                  >
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

                    {/* Generative Warm Ethereal 3D Graphic */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      <svg width="220" height="280" viewBox="0 0 240 300" fill="none">
                        <defs>
                          <linearGradient id="scrollSculptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="30%" stopColor="#fed7aa" />
                            <stop offset="70%" stopColor="#ff6200" />
                            <stop offset="100%" stopColor="#c2410c" />
                          </linearGradient>
                        </defs>
                        <ellipse cx="120" cy="250" rx="80" ry="18" fill="rgba(253, 186, 116, 0.4)" />
                        <path
                          d="M120 60 C145 75 160 110 150 145 C140 180 160 210 140 240 C130 255 110 255 100 240 C80 210 100 180 90 145 C80 110 95 75 120 60 Z"
                          fill="url(#scrollSculptGrad)"
                        />
                        <circle cx="120" cy="115" r="8" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />
                      </svg>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#fed7aa', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: '9999px' }}>
                        Neural Model 3.7
                      </span>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                    </div>

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>Synthesis Core</div>
                      <div style={{ fontSize: '11px', color: '#fed7aa' }}>Anticipates layout & UX physics</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.35)'
                }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff' }}>
                    ✦ Trusted by 4,000+ creatives
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.88)', margin: 0 }}>
                  From creating scroll-stopping content to engineering algorithms, we help your brand break through the noise and go viral.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. The 3D Templates Deck (Image 5) */}
        {deckOpacity > 0 && (
          <div
            id="templates-deck"
            style={{
              position: 'absolute',
              width: '100%',
              maxWidth: '960px',
              height: '460px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              opacity: deckOpacity,
              transform: `scale(${deckScale})`,
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              pointerEvents: scrollProgress > 0.65 ? 'auto' : 'none'
            }}
          >
            {/* 3D Cards Deck */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                perspective: '1200px'
              }}
            >
              {deckCards.map((card, index) => {
                let offset = (index - activeDeckIndex + deckCards.length) % deckCards.length;
                if (offset === 2) offset = -1;

                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;

                let transform = '';
                let zIndex = 1;
                let opacity = 0.5;

                if (isCenter) {
                  transform = 'translateX(0px) scale(1) rotateY(0deg)';
                  zIndex = 10;
                  opacity = 1;
                } else if (isLeft) {
                  transform = 'translateX(-220px) scale(0.86) rotateY(24deg) translateZ(-60px)';
                  zIndex = 5;
                  opacity = 0.8;
                } else if (isRight) {
                  transform = 'translateX(220px) scale(0.86) rotateY(-24deg) translateZ(-60px)';
                  zIndex = 5;
                  opacity = 0.8;
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveDeckIndex(index)}
                    style={{
                      position: 'absolute',
                      width: '320px',
                      height: '410px',
                      borderRadius: '28px',
                      padding: '36px 30px',
                      background: card.bg,
                      color: card.textColor,
                      transform,
                      opacity,
                      zIndex,
                      cursor: isCenter ? 'default' : 'pointer',
                      transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      boxShadow: isCenter
                        ? '0 30px 60px rgba(0, 0, 0, 0.22), 0 0 50px rgba(255, 85, 0, 0.3)'
                        : '0 20px 40px rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isCenter ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 98, 0, 0.2)',
                      userSelect: 'none',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        background: isCenter ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 98, 0, 0.1)',
                        color: isCenter ? '#ffffff' : '#ea580c'
                      }}>
                        {card.tag}
                      </span>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{
                        fontSize: '32px',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        margin: '0 0 8px 0',
                        color: card.textColor
                      }}>
                        {card.title}
                      </h3>
                    </div>

                    <div style={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.85 }}>
                        150+ Verified Blueprints
                      </span>
                      <Sparkles size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Button "Explore the collection" (Image 5) */}
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setActiveDeckIndex((prev) => (prev - 1 + deckCards.length) % deckCards.length)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <a
                href="#prompts"
                style={{
                  background: 'linear-gradient(135deg, #ff5500 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '13px 32px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(255, 85, 0, 0.35)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <span>Explore the collection</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>

              <button
                onClick={() => setActiveDeckIndex((prev) => (prev + 1) % deckCards.length)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  color: '#09090b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
