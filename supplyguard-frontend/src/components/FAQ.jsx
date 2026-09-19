import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What makes "Prompts That Think Ahead" different from standard prompts?',
    a: 'Ordinary prompts give you bare minimum, shallow outputs that lack state management, responsive edge cases, error handling, and visual finesse. Our "Think Ahead" blueprints anticipate production constraints beforehand—specifying responsive layouts, contrast ratios, micro-animations, loading states, and full-stack structure before code is even written.'
  },
  {
    q: 'Which AI models and tools are compatible with these prompts?',
    a: 'Every prompt is engineered and tested across the top AI ecosystems: OpenAI (ChatGPT 4o / o1 / o3-mini), Anthropic (Claude 3.7 Sonnet / Opus), Cursor IDE, GitHub Copilot, v0 by Vercel, Bolt.new, Windsurf, and Lovable. You can copy-paste directly into any tool.'
  },
  {
    q: 'Can I use the generated code and websites for commercial client work?',
    a: 'Yes, 100%! All websites, apps, code snippets, and UI components generated using our prompt blueprints are completely royalty-free for commercial use, client deliverables, and personal SaaS products.'
  },
  {
    q: 'How does the Bakery Website Prompt work in the live demo?',
    a: 'The Bakery Website prompt contains specific domain-aware intelligence: it directs the AI to prioritize freshness cues ("Baked Today", shelf life), Indian dietary indicators (Veg/Egg/Non-veg badges), per-unit pricing clarity, clean sliding product showcases, and blur backdrop navigation without cluttered containers.'
  },
  {
    q: 'How often is the prompt library updated with new patterns?',
    a: 'Our team of design technologists and prompt architects adds new templates weekly. Pro and Team subscribers receive automatic access to all newly published categories, frameworks, and trending design styles.'
  },
  {
    q: 'Do you offer custom prompt development or enterprise team training?',
    a: 'Yes! Our Team / Agency tier includes private brand style guide injection and custom prompt engineering sessions with our core DeepMind & prompt architecture team.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" style={{ position: 'relative', padding: '120px 24px', zIndex: 1, background: '#ffffff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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
            <HelpCircle size={14} color="#ea580c" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Frequently Asked Questions
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#09090b'
          }}>
            Got Questions? <span className="glow-text">We Have Answers</span>
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#64748b',
            lineHeight: 1.6
          }}>
            Everything you need to know about our next-generation prompt engineering platform.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: isOpen
                    ? '1.5px solid rgba(255, 98, 0, 0.4)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  background: isOpen ? '#fffbf7' : '#ffffff',
                  boxShadow: isOpen ? '0 8px 24px rgba(255, 98, 0, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '16px'
                  }}
                >
                  <span style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: isOpen ? '#ea580c' : '#09090b',
                    transition: 'color 0.2s ease',
                    letterSpacing: '-0.01em'
                  }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isOpen ? '#ffedd5' : '#f8fafc',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    <ChevronDown size={18} color={isOpen ? '#ea580c' : '#64748b'} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 28px 26px 28px',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: '#475569',
                    borderTop: '1px solid rgba(255, 98, 0, 0.1)',
                    paddingTop: '18px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
