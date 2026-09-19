import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Zap,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Users,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Cpu,
  Database,
  Radio,
  Clock,
  Layers
} from 'lucide-react';

export default function HomeLandingPage({
  onNavigateTab,
  currentUser,
  criticalCount = 0,
  productsCount = 0,
  suppliersCount = 0
}) {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  const faqItems = [
    {
      q: "What is BeforeStock and how does it prevent supply chain stockouts?",
      a: "BeforeStock is an autonomous supply chain threat intelligence platform that continuously monitors inventory depletion against vendor lead times using a 1.20x deterministic safety buffer, detecting stockout risks days before they occur."
    },
    {
      q: "How does the Deterministic Engine differ from probabilistic AI models?",
      a: "Unlike generative LLMs that can hallucinate arithmetic, our core runway formula is mathematically deterministic: Runway = Current Stock / (Rolling Daily Average × 1.20). Ollama AI and Vapi are only used for reasoning analysis and voice dialogue, never for the underlying mathematics."
    },
    {
      q: "How does the autonomous Vapi AI voice sourcing loop work?",
      a: "When a product reaches low stock or critical runway, the system autonomously phones alternate suppliers via Vapi AI telephony. It speaks directly with supplier representatives, inquires about immediate ready inventory, negotiates delivery lead times and unit prices, and ingests the structured report back into the comparison radar."
    },
    {
      q: "Can autonomous actions dispatch real purchase orders without human review?",
      a: "No. BeforeStock enforces a strict Human Governance Gate. While the AI analyzes alternatives and drafts expedited orders, an authorized operator must review the live comparison radar and sign off before any purchase order or vendor switch executes."
    },
    {
      q: "How are supplier disruption shockwaves simulated in the Chaos Lab?",
      a: "The Chaos Sandbox allows operators to inject Black Friday demand spikes (+250%), primary vendor factory blackouts, or maritime port congestions (+14d) to evaluate whether secondary and tertiary suppliers prevent assembly halts."
    }
  ];

  return (
    <div className="w-full space-y-16 pb-12 animate-in fade-in duration-300">

      {/* ============================================================ */}
      {/* 1. HERO GRADIENT SHOWCASE CARD (screenshot_home_landing.png)   */}
      {/* ============================================================ */}
      <div className="relative w-full flex justify-center pt-2">
        <div
          style={{
            background: 'linear-gradient(135deg, #FDEBD0 0%, #F5CBA7 18%, #E51A24 55%, #9E1017 80%, #2E0507 100%)',
            boxShadow: '0 30px 90px -15px rgba(229, 26, 36, 0.45), 0 0 50px rgba(255, 255, 255, 0.15), inset 0 1.5px 3px rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.65)'
          }}
          className="relative w-full max-w-6xl rounded-[36px] sm:rounded-[44px] px-6 py-16 sm:px-12 sm:py-24 flex flex-col items-center justify-center text-center overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow inside hero */}
          <div className="absolute inset-0 bg-radial from-white/25 via-transparent to-black/35 pointer-events-none" />

          {/* Glowing Pill Tag */}
          <div className="relative z-10 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-xs font-bold shadow-md mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="tracking-wide uppercase text-[11px]">Autonomous Supply Chain Defense 2.0</span>
          </div>

          {/* Hero Typography */}
          <h1 className="relative z-10 text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-sm font-sans">
            BeforeStock.
          </h1>

          <h2 className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-serif italic text-amber-50/95 font-normal mt-2 sm:mt-3 drop-shadow-sm tracking-normal">
            Before you&apos;re out of stock.
          </h2>

          <p className="relative z-10 text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl leading-relaxed mt-6 font-medium">
            AI-driven stockout prediction, real-time demand forecasting, and automated supplier reordering. Catch inventory shortages before your customers do.
          </p>

          {/* Action CTAs */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 mt-8 sm:mt-10">
            {currentUser ? (
              <button
                onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                className="flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-sm font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 text-[#E51A24]" />
                <span>Open Your Dashboard ({currentUser.username})</span>
                <ArrowRight className="h-4 w-4 text-slate-400 ml-1" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('login')}
                  className="flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-sm font-extrabold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#E51A24]" />
                  <span>Sign In to Your Dashboard</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-1" />
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('signup')}
                  className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white text-sm font-bold border border-white/30 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#E51A24]" />
                  <span>Create Account</span>
                </button>
              </>
            )}

            <button
              onClick={() => onNavigateTab && onNavigateTab(currentUser ? 'products' : 'login')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white text-sm font-bold border border-white/30 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneCall className="h-4 w-4 text-red-400" />
              <span>AI Voice Sourcing</span>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab(currentUser ? 'simulator' : 'login')}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-white text-sm font-semibold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Chaos Sandbox</span>
            </button>
          </div>

          {/* Quick Metrics Bar inside Hero */}
          <div className="relative z-10 mt-12 pt-8 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center text-white">
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-mono">1.20x</span>
              <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider">Safety Runway Buffer</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-mono">Vapi AI</span>
              <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider">Voice Telephony Fleet</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-mono">100%</span>
              <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider">Deterministic Arithmetic</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black font-mono">&lt; 2 min</span>
              <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider">Vendor Response Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STAGE / PROCESS CARDS (screenshot_faq_stage_ot.png)       */}
      {/* ============================================================ */}
      <div className="relative max-w-6xl mx-auto space-y-8 px-2">

        {/* Backdrop Decorative Text */}
        <div className="text-center space-y-2 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E51A24] text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Logistics Architecture</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How BeforeStock Defends Your Supply Chain
          </h3>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From deterministic sensor telemetry to automated voice negotiation with worldwide backup vendors.
          </p>
        </div>

        {/* 6 Staggered Stage Cards matching screenshot_faq_stage_ot.png */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch relative">

          {/* Background Ambient "OT LOGISTICS" Watermark */}
          <div className="absolute right-4 top-1/3 -translate-y-1/2 text-red-600/[0.04] text-7xl sm:text-9xl font-black uppercase tracking-widest pointer-events-none select-none z-0">
            LOGISTICS
          </div>

          {/* 01. Dark Card */}
          <div className="md:col-span-4 rounded-3xl bg-[#0F111A]/90 border border-white/10 p-7 flex flex-col justify-between shadow-xl relative z-10 hover:border-white/25 transition">
            <div className="space-y-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">01.</span>
              <h4 className="text-lg font-bold text-white leading-snug">
                Real-Time Demand &amp; Consumption Sensing
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-6">
              Continuous 7-day rolling daily usage calculations paired with lead-time telemetry ensure risk detection days before inventory is breached.
            </p>
          </div>

          {/* 02. Red Glowing Gradient Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E51A24 0%, #B8151E 50%, #400609 100%)',
              boxShadow: '0 20px 50px -10px rgba(229, 26, 36, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)'
            }}
            className="md:col-span-8 rounded-3xl p-7 flex flex-col justify-between text-white shadow-xl relative z-10"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md font-medium">
                At BeforeStock, every mitigation begins with deterministic forecasting. We evaluate consumption patterns, rolling usage variance, and supplier velocity to prevent inventory collapse.
              </p>
              <div className="p-2 rounded-xl bg-white/20 shrink-0 ml-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-8">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">02.</span>
            </div>
          </div>

          {/* 03. Red Glowing Gradient Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E51A24 0%, #B8151E 50%, #400609 100%)',
              boxShadow: '0 20px 50px -10px rgba(229, 26, 36, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)'
            }}
            className="md:col-span-8 rounded-3xl p-7 flex flex-col justify-between text-white shadow-xl relative z-10"
          >
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">03.</span>
            </div>
            <div className="flex items-end justify-between mt-8">
              <div className="p-2 rounded-xl bg-white/20 shrink-0 mr-3">
                <Radio className="h-5 w-5 text-white animate-pulse" />
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md text-right font-medium">
                We design autonomous agentic pipelines that dial alternate vendors directly via Vapi AI telephony, negotiate availability and order quantities, and extract delivery timetables live.
              </p>
            </div>
          </div>

          {/* 04. Dark Card */}
          <div className="md:col-span-4 rounded-3xl bg-[#0F111A]/90 border border-white/10 p-7 flex flex-col justify-between shadow-xl relative z-10 hover:border-white/25 transition">
            <div className="text-right">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">04.</span>
            </div>
            <div className="space-y-2 mt-8">
              <h4 className="text-lg font-bold text-white leading-snug">
                Human Governance &amp; Cryptographic Sign-Off
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict human governance ensures no autonomous purchase order or vendor switch is executed without operator review and verification.
              </p>
            </div>
          </div>

          {/* 05. Dark Card */}
          <div className="md:col-span-4 rounded-3xl bg-[#0F111A]/90 border border-white/10 p-7 flex flex-col justify-between shadow-xl relative z-10 hover:border-white/25 transition">
            <div className="space-y-4">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">05.</span>
              <h4 className="text-lg font-bold text-white leading-snug">
                Relational Topology &amp; Chaos Sandbox
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-6">
              Interactive node-link relational maps and Chaos Sandbox disruption injection stress-test supplier shockwaves before real-world port blackouts hit.
            </p>
          </div>

          {/* 06. Red Glowing Gradient Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #E51A24 0%, #B8151E 50%, #400609 100%)',
              boxShadow: '0 20px 50px -10px rgba(229, 26, 36, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)'
            }}
            className="md:col-span-8 rounded-3xl p-7 flex flex-col justify-between text-white shadow-xl relative z-10"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-md font-medium">
                Immutable multi-tier cryptographic audit trails record every AI diagnostic reasoning, Vapi call transcript, and merchant authorization for enterprise compliance.
              </p>
              <div className="p-2 rounded-xl bg-white/20 shrink-0 ml-3">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-8">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tighter">06.</span>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PLATFORM CORE MODULES NAVIGATION CAROUSEL                */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-2 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Platform Modules &amp; Direct Views</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click any module to jump directly to that operational command view.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'dashboard',
              title: 'Bento Dashboard',
              desc: 'Live Threat Radar, SKU spotlight dial & deterministic telemetry matrix.',
              icon: LayoutDashboard,
              badge: criticalCount > 0 ? `${criticalCount} Critical Threats` : 'Live Telemetry'
            },
            {
              id: 'products',
              title: 'Product Catalog',
              desc: 'Monitored SKUs, on-hand inventory levels & autonomous voice call buttons.',
              icon: Boxes,
              badge: `${productsCount || '8+'} SKUs Active`
            },
            {
              id: 'suppliers',
              title: 'Supplier Hub',
              desc: 'Global supplier reliability, lead-time scores & factory disruption switches.',
              icon: Truck,
              badge: `${suppliersCount || '4'} Vendors`
            },
            {
              id: 'simulator',
              title: 'Chaos Sandbox',
              desc: 'Inject real-time demand surges (+250%) and maritime port delays.',
              icon: Zap,
              badge: 'Chaos Lab'
            },
            {
              id: 'inbox',
              title: 'Supplier Mailbox',
              desc: 'Autonomous emergency PO drafts and verified supplier email chains.',
              icon: PhoneCall,
              badge: 'Automated Outreach'
            },
            {
              id: 'graph',
              title: 'Supply Chain Graph',
              desc: 'Interactive node-link visual topology mapping primary and secondary vendors.',
              icon: Layers,
              badge: 'Topology'
            },
            {
              id: 'audit',
              title: 'Audit Trail & Logs',
              desc: 'Cryptographic ledger of human approvals and voice call transcripts.',
              icon: ShieldAlert,
              badge: 'Immutable Log'
            },
            {
              id: 'settings',
              title: 'Settings & Profile',
              desc: 'Operator credentials, company KYB verification, safety rules & API keys.',
              icon: Users,
              badge: 'Configuration'
            }
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab && onNavigateTab(mod.id)}
                className="group cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 p-5 transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-[#E51A24] transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {mod.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  <span>Launch View</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform text-[#E51A24]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. SYSTEM & ENGINEERING TEAM SHOWCASE                        */}
      {/* ============================================================ */}
      <div className="max-w-6xl mx-auto px-2 space-y-6">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 lg:p-10 space-y-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-[#E51A24] text-white shadow-md">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">BeforeStock Engineering Team</h3>
                <p className="text-xs text-slate-400 mt-0.5">Autonomous Supply Chain Intelligence Core</p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold font-mono">
              Hackathon Production Build
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-black/40 border border-white/10 p-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-white">Dhanush</span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Lead System Architect
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conceived and engineered BeforeStock&apos;s end-to-end architecture, deterministic telemetry calculus, human governance gates, Vapi AI telephony integrations, and real-time WebSocket infrastructure.
              </p>
            </div>

            <div className="rounded-2xl bg-black/40 border border-white/10 p-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-lg text-white">DeepMind Antigravity Agent</span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Autonomous AI Pair Programmer
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Collaborative agentic pair programming of Matter.js 2D zero-gravity physics, React Bits SwipeToast notification loops, Spring Boot REST controllers, and Talentsy-inspired design systems.
              </p>
            </div>
          </div>

          {/* Architecture Spec Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono pt-2">
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <Cpu className="h-4 w-4 text-red-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-sans">Core Engine</span>
              <span className="font-bold text-white">Spring Boot 3.2</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <Radio className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-sans">Voice AI</span>
              <span className="font-bold text-white">Vapi Telephony</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <Sparkles className="h-4 w-4 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-sans">AI Reasoning</span>
              <span className="font-bold text-white">Ollama Llama-3</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <Database className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block font-sans">Databases</span>
              <span className="font-bold text-white">MySQL + Mongo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS ACCORDION                      */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto px-2 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5 text-red-400" />
            <span>Knowledge Base</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-400">Everything you need to know about BeforeStock Autonomous Procurement.</p>
        </div>

        <div className="space-y-3 pt-2">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <span className="pr-4">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#E51A24]' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/10 bg-black/20">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
