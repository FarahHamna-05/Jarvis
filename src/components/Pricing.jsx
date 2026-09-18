import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    tagline: 'Essential stockout prediction for emerging stores',
    priceMonthly: 0,
    priceAnnual: 0,
    featured: false,
    badge: 'FREE FOREVER',
    features: [
      'Up to 100 inventory SKUs',
      'Real-time stockout risk alerts',
      'Shopify & WooCommerce 1-click sync',
      '7-day predictive reorder forecasting',
      'Email notifications & daily health summary',
      'Standard CSV import & export'
    ],
    cta: 'Start Building Free',
    ctaStyle: 'secondary'
  },
  {
    name: 'Growth Pro',
    tagline: 'Autonomous inventory intelligence for scaling brands',
    priceMonthly: 29,
    priceAnnual: 24,
    featured: true,
    badge: 'MOST POPULAR',
    features: [
      'Up to 2,500 inventory SKUs',
      'Multi-channel inventory & warehouse sync',
      'AI Demand & Stockout Prediction Engine',
      'Automated Purchase Order drafts & alerts',
      'Lead-time buffer & dynamic safety stock AI',
      'Instant supplier delay risk detection',
      'Priority 24/7 dedicated support'
    ],
    cta: 'Start 14-Day Free Trial',
    ctaStyle: 'primary'
  },
  {
    name: 'Scale & Enterprise',
    tagline: 'High-volume logistics & omnichannel supply chain',
    priceMonthly: 99,
    priceAnnual: 79,
    featured: false,
    badge: 'ENTERPRISE READY',
    features: [
      'Unlimited SKUs & multi-warehouse routing',
      'Custom ERP, NetSuite & SAP direct connectors',
      'Dedicated inventory intelligence specialist',
      'Real-time supplier API webhooks',
      'Custom safety buffers & SLA guarantee',
      'Unlimited team member seats & role permissions',
      'Dedicated Slack channel & custom onboarding'
    ],
    cta: 'Contact Sales',
    ctaStyle: 'secondary'
  }
];

export default function Pricing({ onSelectPlan, onBackToHome }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" style={{ position: 'relative', padding: '40px 24px 100px 24px', zIndex: 1, background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back button */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              background: '#f4f4f5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: '#09090b',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              marginBottom: '28px',
              padding: '8px 16px',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.18s ease',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#09090b';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateX(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f4f4f5';
              e.currentTarget.style.color = '#09090b';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Experience</span>
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(201, 41, 36, 0.08)',
            border: '1px solid rgba(201, 41, 36, 0.25)',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} color="#C92924" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#C92924', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Transparent Pricing
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#09090b'
          }}>
            Predict <span style={{ color: '#C92924' }}>Before You're Out of Stock</span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#64748b',
            maxWidth: '640px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}>
            Transparent, predictable plans built for modern ecommerce brands, retailers, and logistics teams.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '9999px',
            padding: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: !isAnnual ? '#09090b' : 'transparent',
                color: !isAnnual ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                background: isAnnual ? '#09090b' : 'transparent',
                color: isAnnual ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Yearly</span>
              <span style={{
                background: isAnnual ? '#C92924' : 'rgba(201, 41, 36, 0.12)',
                color: isAnnual ? '#ffffff' : '#C92924',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {plans.map((plan, idx) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '40px 32px',
                  borderRadius: '28px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  background: plan.featured ? '#ffffff' : '#fbfbfd',
                  border: plan.featured
                    ? '2px solid #C92924'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: plan.featured
                    ? '0 20px 50px rgba(201, 41, 36, 0.18), 0 0 30px rgba(201, 41, 36, 0.1)'
                    : '0 8px 24px rgba(0, 0, 0, 0.04)',
                  transform: plan.featured ? 'scale(1.03)' : 'none',
                  zIndex: plan.featured ? 2 : 1
                }}
              >
                {/* Popular badge */}
                {plan.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #E63833, #C92924)',
                    padding: '6px 18px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(201, 41, 36, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Zap size={13} />
                    {plan.badge}
                  </div>
                )}

                {/* Plan Title & Tagline */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#09090b', marginBottom: '8px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0, minHeight: '40px', lineHeight: 1.5 }}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '46px', fontWeight: 900, color: '#09090b', letterSpacing: '-0.03em' }}>
                    ${price}
                  </span>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                    {price === 0 ? '/ forever' : isAnnual ? '/ month, billed yearly' : '/ month'}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onSelectPlan && onSelectPlan(plan.name)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '32px',
                    border: 'none',
                    background: plan.featured ? 'linear-gradient(135deg, #E63833, #C92924)' : '#09090b',
                    color: '#ffffff',
                    boxShadow: plan.featured ? '0 8px 24px rgba(201, 41, 36, 0.35)' : '0 4px 14px rgba(0, 0, 0, 0.25)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={16} />
                </button>

                {/* Features List */}
                <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '24px', flexGrow: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#C92924', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                    What's included:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {plan.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#334155', lineHeight: 1.5 }}>
                        <div style={{
                          minWidth: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: plan.featured ? 'rgba(201, 41, 36, 0.08)' : '#f8fafc',
                          border: plan.featured ? '1px solid #C92924' : '1px solid rgba(0, 0, 0, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '2px'
                        }}>
                          <Check size={11} color={plan.featured ? '#C92924' : '#64748b'} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
