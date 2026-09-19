import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Radio,
  FileCheck,
  Mail,
  ArrowRight,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export default function FAQPage({ onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'platform', label: 'Supply Chain & Telemetry' },
    { id: 'voice', label: 'Vapi Voice Telephony' },
    { id: 'kyc', label: 'KYC & Verification' },
    { id: 'prompts', label: 'Prompts & AI Architecture' }
  ];

  const faqItems = [
    {
      category: 'platform',
      q: 'What is BeforeStock and how does it prevent supply chain stockouts?',
      a: 'BeforeStock is an autonomous supply chain threat intelligence platform that continuously evaluates inventory consumption against vendor lead times using a 1.20x deterministic safety buffer, detecting stockout risks days before they occur.'
    },
    {
      category: 'platform',
      q: 'How does the Deterministic Engine differ from probabilistic AI models?',
      a: 'Unlike generative LLMs that can hallucinate numbers, our core runway formula is mathematically deterministic: Runway = Stock / (RollingDailyAvg × 1.20). Ollama AI is only used as a reasoning gate for strategic recommendations, never for the underlying arithmetic.'
    },
    {
      category: 'platform',
      q: 'Can autonomous actions dispatch real purchase orders without human review?',
      a: 'No. BeforeStock enforces a strict Human Governance Gate. While the AI drafts emergency POs and evaluates backup vendors, an authorized human operator must cryptographically sign off on the mitigation plan.'
    },
    {
      category: 'voice',
      q: 'How does the Vapi AI voice telephony negotiate with backup vendors?',
      a: 'When an inventory alert breaches threshold, BeforeStock can initiate an autonomous voice call via Vapi API directly to secondary vendor dispatchers. The voice agent inquires about stock on hand, unit pricing, and guaranteed delivery days, automatically injecting the verified lead time back into the system.'
    },
    {
      category: 'voice',
      q: 'Where do call recordings and transcripts appear in the system?',
      a: 'All completed phone conversations are ingested via our secure webhook endpoint (/api/calls/webhook) and logged in the Supplier Mailbox / Communications Inbox, complete with audio replay, confidence scores, and transcript logs.'
    },
    {
      category: 'kyc',
      q: 'What KYC and KYB documents are required for merchant onboarding?',
      a: 'To activate autonomous supplier ordering, merchants complete a 3-step verification: PAN Card (Company/Individual), Aadhaar verification, GSTIN Registration, Bank Account IFSC validation, and optional MSME / Udyam registration.'
    },
    {
      category: 'kyc',
      q: 'How is merchant data secured during the KYC verification process?',
      a: 'All credentials and identity tokens are transmitted over TLS 1.3 encryption, checked against real-time sandbox checksums, and stored with enterprise multi-tenant isolation, ensuring no cross-organization access.'
    },
    {
      category: 'prompts',
      q: 'What makes "Prompts That Think Ahead" different from standard prompts?',
      a: 'Ordinary prompts give you bare minimum, shallow outputs that lack state management, responsive edge cases, error handling, and visual finesse. Our "Think Ahead" blueprints anticipate production constraints beforehand—specifying responsive layouts, contrast ratios, micro-animations, loading states, and full-stack structure before code is even written.'
    },
    {
      category: 'prompts',
      q: 'Which AI models and tools are compatible with these prompt blueprints?',
      a: 'Every prompt is engineered and tested across top AI ecosystems: OpenAI (ChatGPT 4o / o1 / o3-mini), Anthropic (Claude 3.7 Sonnet / Opus), Cursor IDE, GitHub Copilot, v0 by Vercel, Bolt.new, Windsurf, and Lovable. You can copy-paste directly into any tool.'
    },
    {
      category: 'prompts',
      q: 'Can I use the generated code and websites for commercial client work?',
      a: 'Yes, 100%! All websites, apps, code snippets, and UI components generated using our prompt blueprints are completely royalty-free for commercial use, client deliverables, and personal SaaS products.'
    },
    {
      category: 'platform',
      q: 'How are supplier disruption shockwaves simulated in the Chaos Lab?',
      a: 'The Chaos Sandbox lets operators inject Black Friday demand surges (+250%), primary vendor factory blackouts, or maritime port congestions (+14d) to test whether backup supplier allocations prevent factory downtime.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[#E51A24] text-xs font-bold tracking-wide uppercase">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Got Questions? <span className="bg-gradient-to-r from-[#E51A24] via-red-400 to-[#F9E7C9] bg-clip-text text-transparent">We Have Answers</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Everything you need to know about BeforeStock&apos;s autonomous AI architecture, deterministic runway formula, Vapi voice telephony, and KYC onboarding.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions by keyword, topic, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#E51A24] transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                activeCategory === cat.id
                  ? 'bg-[#E51A24] text-white shadow-md shadow-red-900/30 border border-transparent'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. FAQ Accordion Cards */}
      <div className="max-w-4xl mx-auto space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 space-y-3">
            <p className="text-base font-bold text-slate-300">No matching questions found.</p>
            <p className="text-xs text-slate-400">Try searching for a different keyword or select &quot;All Questions&quot;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? 'rgba(28, 14, 14, 0.85)' : 'rgba(20, 20, 24, 0.7)',
                  border: isOpen ? '1.5px solid rgba(229, 26, 36, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isOpen ? '0 10px 30px rgba(229, 26, 36, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                className="rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className={`text-sm sm:text-base font-bold transition-colors ${isOpen ? 'text-[#E51A24]' : 'text-white group-hover:text-red-300'}`}>
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-red-500/20 text-[#E51A24]' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-red-500/10 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Support & Still Have Questions Card */}
      <div className="max-w-4xl mx-auto">
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(229, 26, 36, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%)',
            border: '1.5px solid rgba(229, 26, 36, 0.3)'
          }}
          className="rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
        >
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Need Direct Assistance?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Still have questions about BeforeStock?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Our engineering team and AI support desk are available 24/7 to help configure your enterprise supply telemetry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab && onNavigateTab('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#E51A24] hover:bg-[#c92924] text-white font-bold text-xs shadow-lg shadow-red-900/30 transition flex items-center justify-center space-x-1.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                window.location.href = 'mailto:support@beforestock.ai';
              }}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
