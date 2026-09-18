import React, { useState } from 'react';
import { Sparkles, Search, X, Heart, Check, Copy, Play } from 'lucide-react';

export default function PromptExplorer({ onSelectPrompt, onShowToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const promptLibrary = [
    {
      id: 'p1',
      category: 'Website',
      title: 'Artisan Bakery & Cafe Storefront',
      model: 'Claude 3.7',
      likes: 1240,
      content: 'Create a high-contrast luxury bakery web storefront for "{bakery_name}" specializing in {signature_items}. Use warm terracotta and dark charcoal accents, a full-bleed hero carousel with French croissants, interactive dietary filters (Veg/Eggless), and instant order drawer.'
    },
    {
      id: 'p2',
      category: 'UI/UX',
      title: 'Glassmorphic Crypto Trading Terminal',
      model: 'GPT-4.5',
      likes: 890,
      content: 'Design a dark-mode real-time crypto telemetry dashboard with live candlestick charts, glowing order-book depth meters, multi-wallet selector modal, and sub-second trade execution buttons.'
    },
    {
      id: 'p3',
      category: 'App',
      title: 'Mindful Meditation & Audio Sanctuary',
      model: 'Gemini 2.5',
      likes: 640,
      content: 'Build a mobile-first mindfulness meditation app with animated breathing ring timers, soundscape mixer (Rain, Forest, Binaural), daily streak trackers, and gentle haptic feedback triggers.'
    },
    {
      id: 'p4',
      category: 'Coding',
      title: 'Full-Stack Next.js 15 Auth & Stripe SaaS',
      model: 'Claude 3.7',
      likes: 1580,
      content: 'Generate a production-ready Next.js 15 App Router architecture with Supabase Auth, Prisma ORM, Stripe webhook subscriptions, rate-limiting middleware, and responsive Tailwind UI.'
    },
    {
      id: 'p5',
      category: 'Marketing',
      title: 'Viral Product Launch Video Script',
      model: 'GPT-4.5',
      likes: 910,
      content: 'Write a 60-second high-energy product launch video script with a disruptive 3-second hook for {product_name}, addressing {core_pain_point}, followed by 3 cinematic visual cuts and high-urgency CTA.'
    },
    {
      id: 'p6',
      category: 'Business',
      title: 'YC Seed Pitch Deck Narrative',
      model: 'Claude 3.7',
      likes: 1120,
      content: 'Structure an 11-slide seed pitch deck outline for an AI-native startup. Focus on Problem, Secret Insight, Why Now, Unfair Advantage, Bottom-Up Moat, and 18-month financial milestones.'
    },
    {
      id: 'p7',
      category: 'Content',
      title: 'Deep Research Newsletter Essay',
      model: 'GPT-4.5',
      likes: 780,
      content: 'Synthesize a 1,500-word authoritative deep-dive newsletter on {topic}. Use crisp journalistic prose, data citations, 3 mental models, and actionable takeaways for operators.'
    },
    {
      id: 'p8',
      category: 'AI',
      title: 'Autonomous Multi-Agent Orchestrator',
      model: 'Claude 3.7',
      likes: 1940,
      content: 'Design an autonomous multi-agent task execution graph with planner, tool executor, critic reflection cycle, memory persistence, and dynamic rollback safeguards.'
    }
  ];

  const filteredPrompts = promptLibrary.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt.content);
    setCopiedId(prompt.id);
    if (onShowToast) onShowToast(`Copied "${prompt.title}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (onShowToast) onShowToast(favorites[id] ? 'Removed from saved prompts' : 'Saved to your prompt vault!');
  };

  return (
    <section id="prompts" style={{ padding: '110px 0', background: '#fbfbfd' }}>
      <div className="content-container">
        
        {/* Section Header */}
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
            <Sparkles size={14} color="#ea580c" />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Prompt Vault
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            color: '#09090b'
          }}>
            Explore <span className="glow-text">High-Performance Prompts</span>
          </h2>
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: '#64748b',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Browse, test, copy, and favorite battle-tested AI prompts engineered for world-class digital execution.
          </p>
        </div>

        {/* Search & Filters */}
        <div style={{ maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid rgba(255, 98, 0, 0.25)',
            borderRadius: '16px',
            padding: '12px 20px',
            gap: '12px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04), 0 0 20px rgba(255, 98, 0, 0.08)',
            marginBottom: '20px'
          }}>
            <Search size={19} color="#ea580c" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword (e.g. bakery, crypto, saas, next.js, pitch deck)..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#09090b',
                fontSize: '15px',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {['All', 'Website', 'App', 'UI/UX', 'Marketing', 'Business', 'Coding', 'Content', 'AI'].map(category => (
              <button
                key={category}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedCategory === category ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                  background: selectedCategory === category ? 'linear-gradient(135deg, #ff5500, #ea580c)' : '#ffffff',
                  color: selectedCategory === category ? '#ffffff' : '#64748b',
                  boxShadow: selectedCategory === category ? '0 4px 14px rgba(255, 85, 0, 0.35)' : '0 2px 6px rgba(0,0,0,0.02)'
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Prompt Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredPrompts.map(prompt => {
            const isFav = favorites[prompt.id];
            const isCopied = copiedId === prompt.id;

            return (
              <div
                key={prompt.id}
                className="glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: '#fff7ed',
                        color: '#ea580c',
                        border: '1px solid rgba(255, 98, 0, 0.25)'
                      }}>
                        {prompt.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        {prompt.model}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(prompt.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isFav ? '#ea580c' : '#94a3b8',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                      title={isFav ? 'Remove favorite' : 'Save prompt'}
                    >
                      <Heart size={16} fill={isFav ? '#ea580c' : 'none'} />
                      <span>{prompt.likes + (isFav ? 1 : 0)}</span>
                    </button>
                  </div>

                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#09090b', marginBottom: '12px', lineHeight: 1.3 }}>
                    {prompt.title}
                  </h4>

                  <div style={{
                    background: '#fff7ed',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '13px',
                    color: '#334155',
                    lineHeight: 1.5,
                    border: '1px solid rgba(255, 98, 0, 0.15)',
                    marginBottom: '20px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    "{prompt.content}"
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleCopyPrompt(prompt)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: isCopied ? 'rgba(22, 163, 74, 0.15)' : '#f8fafc',
                      border: isCopied ? '1px solid #16a34a' : '1px solid rgba(0, 0, 0, 0.1)',
                      color: isCopied ? '#16a34a' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      padding: '7px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>

                  <button
                    onClick={() => onSelectPrompt && onSelectPrompt(prompt.content)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, #ff5500 0%, #ea580c 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      padding: '7px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(255, 85, 0, 0.3)'
                    }}
                  >
                    <Play size={12} fill="#ffffff" />
                    <span>Try Prompt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
