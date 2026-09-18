import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const cards = [
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

export default function TemplatesDeck({ onSelectPrompt }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <section
      id="templates-deck"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '120px 24px 100px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 2,
        background: '#ffffff'
      }}
    >
      {/* Massive Editorial Background Heading (matching Image 2 & 3) */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1300px',
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6.5vw, 6.5rem)',
          fontWeight: 800,
          color: '#09090b',
          letterSpacing: '-0.035em',
          lineHeight: 1.05,
          margin: 0,
          whiteSpace: 'nowrap',
          opacity: 0.9
        }}>
          Design that stands out without compromise
        </h2>
      </div>

      {/* 3D Interactive Card Deck / Carousel Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          height: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          marginTop: '60px',
          zIndex: 1
        }}
      >
        {cards.map((card, index) => {
          let offset = (index - activeIndex + cards.length) % cards.length;
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
              onClick={() => setActiveIndex(index)}
              style={{
                position: 'absolute',
                width: '320px',
                height: '430px',
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
                  ? '0 30px 60px rgba(0, 0, 0, 0.18), 0 0 50px rgba(255, 85, 0, 0.25)'
                  : '0 20px 40px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCenter ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 98, 0, 0.2)',
                userSelect: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Silhouette abstract glow */}
              <div style={{
                position: 'absolute',
                right: '-20px',
                bottom: '-20px',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: isCenter ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 98, 0, 0.15)',
                filter: 'blur(36px)',
                pointerEvents: 'none',
                zIndex: 0
              }} />

              {/* Card Top Pill Badge */}
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

              {/* Card Title */}
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

              {/* Card Bottom: Micro indicator */}
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

      {/* Button below Center Card: "Explore the collection" */}
      <div style={{ marginTop: '40px', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handlePrev}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'background 0.2s ease, transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff7ed';
            e.currentTarget.style.color = '#ea580c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#09090b';
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
            padding: '14px 34px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(255, 85, 0, 0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 85, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 85, 0, 0.35)';
          }}
        >
          <span>Explore the collection</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>

        <button
          onClick={handleNext}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            color: '#09090b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'background 0.2s ease, transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff7ed';
            e.currentTarget.style.color = '#ea580c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#09090b';
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
