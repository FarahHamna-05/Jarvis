import React, { useState } from 'react';
import { Laptop, Globe, Sparkles, ExternalLink } from 'lucide-react';

export default function Showcase({ onSelectPrompt }) {
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(0);

  const showcases = [
    {
      title: 'Artisan Gourmet Bakery & Cafe',
      category: 'Food & Beverage E-Commerce',
      url: 'https://artisan-bakes.preview.ai',
      description: 'French boulangerie aesthetic with warm amber lighting, crisp typography, and 1-tap bakery checkout.',
      metrics: { speed: '99/100', conversion: '+42%', stack: 'React 19 / Tailwind / Motion' },
      accent: '#ff5500'
    },
    {
      title: 'Quantum Fintech Asset Portal',
      category: 'Decentralized Finance',
      url: 'https://quantum-vault.preview.ai',
      description: 'High-frequency asset visualizer with glowing order-book telemetry and sub-second trading charts.',
      metrics: { speed: '100/100', conversion: '+68%', stack: 'Web3 / Next.js / Three.js' },
      accent: '#ea580c'
    },
    {
      title: 'NeuroLink Health Telemetry',
      category: 'Medical Technology',
      url: 'https://neurolink-health.preview.ai',
      description: 'Clean bio-medical interface with continuous biometric feeds, 3D anatomical charts, and patient portals.',
      metrics: { speed: '98/100', conversion: '+35%', stack: 'React / WebGL / Canvas' },
      accent: '#f97316'
    },
    {
      title: 'Nova Robotics Autonomous OS',
      category: 'Robotics & Hardware',
      url: 'https://nova-robotics.preview.ai',
      description: 'Sleek industrial control hub with LiDAR point-cloud renderer and distributed fleet management.',
      metrics: { speed: '99/100', conversion: '+51%', stack: 'Wasm / WebGPU / React' },
      accent: '#c2410c'
    }
  ];

  const current = showcases[activeShowcaseIndex];

  return (
    <section id="showcase" style={{ padding: '110px 0', background: '#ffffff' }}>
      <div className="content-container">
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: '#fff7ed',
            border: '1px solid rgba(255, 98, 0, 0.25)',
            marginBottom: '16px'
          }}>
            <Laptop size={14} color="#ea580c" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Production Gallery
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            color: '#09090b'
          }}>
            Crafted with <span className="glow-text">Prompt Ahead Architecture</span>
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Explore high-fidelity websites generated directly from our prompt system.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
          {showcases.map((s, idx) => (
            <button
              key={idx}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: activeShowcaseIndex === idx ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                background: activeShowcaseIndex === idx ? 'linear-gradient(135deg, #ff5500, #ea580c)' : '#f8fafc',
                color: activeShowcaseIndex === idx ? '#ffffff' : '#64748b',
                boxShadow: activeShowcaseIndex === idx ? '0 4px 14px rgba(255, 85, 0, 0.35)' : 'none'
              }}
              onClick={() => setActiveShowcaseIndex(idx)}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Browser Mockup */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08), 0 0 30px rgba(255, 98, 0, 0.08)'
        }}>
          {/* Browser Top Chrome */}
          <div style={{
            background: '#f8fafc',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <div style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              color: '#64748b',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Globe size={13} color="#ea580c" />
              <span>{current.url}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>
              SSL 256-bit Encrypted
            </div>
          </div>

          <div style={{ padding: '44px 36px', background: 'radial-gradient(circle at 50% 20%, rgba(255, 237, 213, 0.45) 0%, #ffffff 70%)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center' }} className="showcase-grid">
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: current.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {current.category}
                </span>
                <h3 style={{ fontSize: '30px', fontWeight: 800, color: '#09090b', marginTop: '8px', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                  {current.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                  {current.description}
                </p>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#09090b' }}>{current.metrics.speed}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lighthouse Score</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{current.metrics.conversion}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lift in Retention</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', paddingTop: '4px' }}>{current.metrics.stack}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Engineered Stack</div>
                  </div>
                </div>

                <a
                  href="#demo"
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <span>Inspect Live Sandbox</span>
                  <ExternalLink size={15} />
                </a>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(255, 98, 0, 0.25)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(255, 98, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#09090b' }}>Telemetry Stream</span>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>Active Node 01</span>
                </div>
                <div style={{ height: '140px', background: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 98, 0, 0.15)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Sparkles size={32} color={current.accent} />
                    <div style={{ fontSize: '12px', color: '#ea580c', fontWeight: 700, marginTop: '8px' }}>
                      WebGL Pipeline Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
