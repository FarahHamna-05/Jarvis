import React from 'react';
import { Star, Sparkles, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Lead Front-End Architect',
    company: 'Veloce Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    content: 'The "Think Ahead" bakery prompt generated a production-grade Flutter & React UI in one shot. It usually takes our team 3 weeks of wireframing and prototyping to get this level of polish.',
    rating: 5,
    highlight: 'Saved 3 weeks of wireframing'
  },
  {
    name: 'Marcus Vance',
    role: 'Founder & Full-Stack Solo Dev',
    company: 'HyperSaaS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'I plugged these prompts into Claude 3.7 & Cursor and built my entire SaaS landing page and dashboard overnight. The micro-interactions and orange highlights were spotless right out of the box.',
    rating: 5,
    highlight: 'Shipped entire SaaS overnight'
  },
  {
    name: 'Elena Rostova',
    role: 'Principal Product Designer',
    company: 'Studio Neura',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Most prompt libraries give you generic answers. These prompts anticipate state management, responsive breakpoints, edge cases, and accessibility that ordinary prompts completely miss.',
    rating: 5,
    highlight: 'Anticipates state & edge cases'
  },
  {
    name: 'David Chen',
    role: 'AI Engineering Lead',
    company: 'Synthetix AI',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'We integrated the prompt blueprints into our enterprise internal tooling. Developer velocity leaped by 340% within the first month. An absolute game-changer.',
    rating: 5,
    highlight: '340% increase in dev velocity'
  },
  {
    name: 'Sophia Lindqvist',
    role: 'Creative Technologist',
    company: 'Aetheria Interactive',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    content: 'The aesthetic precision is unbelievable. The warm orange glow, clean white backdrop, and typographic hierarchy match what top design agencies charge $20k for.',
    rating: 5,
    highlight: 'Agency-grade visual aesthetic'
  },
  {
    name: 'Kevin O’Connor',
    role: 'Growth Marketing Director',
    company: 'ApexScale',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    content: 'Our conversion rates doubled once we switched our landing page copy and structure to the high-converting SaaS prompt blueprint. Worth 100x the monthly price.',
    rating: 5,
    highlight: 'Doubled conversion rates'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ position: 'relative', padding: '120px 24px', zIndex: 1, background: '#fbfbfd' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
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
              Wall of Love
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#09090b'
          }}>
            Trusted by <span className="glow-text">50,000+ Creators</span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#64748b',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            See how founders, engineers, and designers use our intelligent prompt blueprints to build the future.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '32px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff'
              }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.12 }}>
                <Quote size={40} color="#ea580c" />
              </div>

              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />
                  ))}
                </div>

                {/* Highlight pill */}
                <div style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ea580c',
                  background: '#fff7ed',
                  border: '1px solid rgba(255, 98, 0, 0.25)',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  marginBottom: '16px'
                }}>
                  "{t.highlight}"
                </div>

                {/* Body Content */}
                <p style={{
                  fontSize: '15px',
                  color: '#334155',
                  lineHeight: 1.65,
                  margin: '0 0 24px 0',
                  fontStyle: 'normal'
                }}>
                  "{t.content}"
                </p>
              </div>

              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '18px' }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ffedd5'
                  }}
                />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#09090b' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {t.role} • <span style={{ color: '#ea580c', fontWeight: 600 }}>{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
