import React from 'react';
import { Search, Sliders, Rocket, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Choose a Prompt',
    subtitle: 'Browse curated intelligence',
    description: 'Explore hundreds of high-precision prompts engineered specifically for full-stack websites, dynamic mobile apps, automated copy, and AI pipelines.',
    icon: Search,
    color: '#ff5500',
    tag: 'EXPLORE'
  },
  {
    num: '02',
    title: 'Customize It',
    subtitle: 'Tailor to your vision',
    description: 'Adjust branding guidelines, color palettes, tech stacks, tone of voice, or feature requirements in seconds with our dynamic parameter injection.',
    icon: Sliders,
    color: '#ea580c',
    tag: 'TWEAK'
  },
  {
    num: '03',
    title: 'Create Instantly',
    subtitle: 'Watch it come alive',
    description: 'Paste into ChatGPT, Claude, Cursor, v0, or use our direct AI synthesizer to deploy production-ready web designs, layouts, and apps in minutes.',
    icon: Rocket,
    color: '#f97316',
    tag: 'DEPLOY'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ position: 'relative', padding: '120px 24px', zIndex: 1, background: '#fbfbfd' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
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
            <Sparkles size={14} color="#ea580c" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple 3-Step Process
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#09090b'
          }}>
            How It <span className="glow-text">Works</span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#64748b',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Transform vague concepts into production-grade websites and applications in three effortless steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          position: 'relative'
        }}>
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '40px 32px',
                  borderRadius: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff'
                }}
              >
                {/* Background watermarked step number */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '24px',
                  fontSize: '72px',
                  fontWeight: 900,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'rgba(0, 0, 0, 0.04)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}>
                  {step.num}
                </div>

                {/* Top Badge & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: '#fff7ed',
                    border: '1px solid rgba(255, 98, 0, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(255, 98, 0, 0.12)'
                  }}>
                    <IconComponent size={26} color={step.color} />
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: '#f8fafc',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    color: '#64748b'
                  }}>
                    {step.tag}
                  </span>
                </div>

                {/* Step Subtitle & Title */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: step.color,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  Step {step.num}
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#09090b',
                  marginBottom: '14px',
                  letterSpacing: '-0.02em'
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '15px',
                  color: '#64748b',
                  lineHeight: 1.65,
                  margin: 0,
                  flexGrow: 1
                }}>
                  {step.description}
                </p>

                {/* Bottom line accent */}
                <div style={{
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: step.color,
                  fontSize: '13px',
                  fontWeight: 700
                }}>
                  <span>{step.subtitle}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
