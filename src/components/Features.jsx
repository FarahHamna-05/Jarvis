import React from 'react';
import { Wand2, Cpu, Zap, Layers, Sliders, Users } from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <Wand2 size={24} />,
      color: '#ea580c',
      bg: '#fff7ed',
      border: 'rgba(255, 98, 0, 0.25)',
      title: '1. AI Stockout Prediction',
      desc: 'Predict precise stockout dates for every SKU using neural demand curves, seasonal trends, and historical purchase velocity.'
    },
    {
      icon: <Cpu size={24} />,
      color: '#ff5500',
      bg: '#ffedd5',
      border: 'rgba(255, 85, 0, 0.3)',
      title: '2. Early Warning System',
      desc: 'Get automated alerts days or weeks before inventory drops below critical thresholds — literally before you are out of stock.'
    },
    {
      icon: <Zap size={24} />,
      color: '#f97316',
      bg: '#fff7ed',
      border: 'rgba(249, 115, 22, 0.25)',
      title: '3. Instant Supplier Reorders',
      desc: 'Trigger purchase orders automatically to suppliers when safety stock levels are breached, minimizing lead-time delays.'
    },
    {
      icon: <Layers size={24} />,
      color: '#c2410c',
      bg: '#fed7aa',
      border: 'rgba(194, 65, 12, 0.25)',
      title: '4. Multi-Channel Integration',
      desc: 'Sync seamlessly across Shopify, Amazon, WooCommerce, ERPs, and custom warehouse management systems.'
    },
    {
      icon: <Sliders size={24} />,
      color: '#ea580c',
      bg: '#fff7ed',
      border: 'rgba(234, 88, 12, 0.25)',
      title: '5. Demand Spike Detection',
      desc: 'Detect viral marketing surges or sudden demand shifts in real-time, preventing unexpected inventory depletion.'
    },
    {
      icon: <Users size={24} />,
      color: '#ff5500',
      bg: '#ffedd5',
      border: 'rgba(255, 85, 0, 0.25)',
      title: '6. Built for High-Growth Merchants',
      desc: 'Designed for brand managers, inventory planners, and e-commerce leaders who cannot afford lost sales or stockouts.'
    }
  ];

  return (
    <section id="features" style={{ padding: '110px 0', background: '#ffffff' }}>
      <div className="content-container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
            <Zap size={14} color="#ea580c" />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Stockout Prevention Engine
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            color: '#09090b'
          }}>
            Engineered to <span className="glow-text">Prevent Out-of-Stock</span>
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Protect your revenue, optimize safety stock, and automate fulfillment with intelligent forecasting that stays steps ahead.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {featureList.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '36px 32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: f.bg,
                border: `1px solid ${f.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: f.color,
                boxShadow: '0 4px 14px rgba(255, 98, 0, 0.12)'
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '10px', color: '#09090b' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
