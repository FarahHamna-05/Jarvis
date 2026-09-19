import React, { useState } from 'react';
import {
  Users,
  Cpu,
  Radio,
  Sparkles,
  Database,
  ShieldCheck,
  Code2,
  ExternalLink,
  Mail,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export default function OurTeamPage({ onNavigateTab }) {
  const [selectedDept, setSelectedDept] = useState('all');

  const teamMembers = [
    {
      name: 'Dhanush',
      role: 'Lead System Architect & Full Stack Engineer',
      tag: 'Core Creator',
      bio: 'Conceived, architected, and engineered BeforeStock from ground up. Engineered the deterministic inventory calculus, human governance verification gates, Vapi AI voice telephony pipelines, and WebSocket telemetry stream.',
      skills: ['System Architecture', 'Spring Boot 3.2', 'React 19', 'Vapi Telephony', 'Autonomous AI Agents', 'Distributed Systems'],
      gradient: 'from-[#E51A24] via-[#C92924] to-[#280B0B]',
      initials: 'DH',
      avatarBg: '#E51A24',
      badge: 'Architecture Lead'
    },
    {
      name: 'DeepMind Antigravity Agent',
      role: 'Autonomous AI Pair Programmer',
      tag: 'AI Partner',
      bio: 'Collaborative agentic pair programmer powering the 2D zero-gravity physics engine, React Bits SwipeToast notification loops, Spring Boot REST controllers, and glassmorphic design system.',
      skills: ['Advanced Agentic Coding', 'Prompt Architecture', 'Matter.js Physics', 'Real-time Telemetry', 'Security & KYB Systems'],
      gradient: 'from-[#2563eb] via-[#1d4ed8] to-[#0f172a]',
      initials: 'AG',
      avatarBg: '#2563eb',
      badge: 'AI Systems'
    }
  ];

  const engineeringPillars = [
    {
      icon: Cpu,
      title: 'Deterministic Calculus',
      desc: 'Runway is calculated with strict mathematical certainty: Runway = Stock / (RollingDailyAvg × 1.20). No hallucinations in the arithmetic.',
      color: 'text-red-400'
    },
    {
      icon: Radio,
      title: 'Vapi Voice Telephony',
      desc: 'Autonomous voice agents dial vendor dispatchers live, negotiate purchase order allocations, and stream call transcripts directly into the telemetry inbox.',
      color: 'text-emerald-400'
    },
    {
      icon: Sparkles,
      title: 'Ollama Llama-3 AI',
      desc: 'Local high-velocity LLM reasoning models generate tactical mitigation recommendations and analyze supplier reliability trends.',
      color: 'text-amber-400'
    },
    {
      icon: ShieldCheck,
      title: 'Human Governance Gate',
      desc: 'Zero autonomous actions execute without cryptographic operator sign-off, ensuring total compliance and institutional safety.',
      color: 'text-purple-400'
    }
  ];

  const openRoles = [
    {
      id: 'sr-ai-eng',
      title: 'Senior Autonomous Systems Engineer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Bengaluru / Remote',
      desc: 'Scale real-time WebSocket telemetry engines and engineer custom Vapi voice tool-calling pipelines.'
    },
    {
      id: 'supply-analyst',
      title: 'Supply Chain Intelligence Lead',
      department: 'Operations',
      type: 'Full-time',
      location: 'Hybrid',
      desc: 'Formulate predictive lead-time decay formulas and multi-tier supplier vulnerability indexes.'
    },
    {
      id: 'fe-designer',
      title: 'Design Technologist / UI Architect',
      department: 'Design',
      type: 'Contract / Full-time',
      location: 'Remote',
      desc: 'Craft next-generation zero-gravity physics visualizations, shaders, and micro-interactions.'
    }
  ];

  const departments = ['all', 'Engineering', 'Operations', 'Design'];

  const filteredRoles = selectedDept === 'all'
    ? openRoles
    : openRoles.filter((r) => r.department.toLowerCase() === selectedDept.toLowerCase());

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[#E51A24] text-xs font-bold tracking-wide uppercase">
          <Users className="h-3.5 w-3.5" />
          <span>The Minds Behind BeforeStock</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Engineered for <span className="bg-gradient-to-r from-[#E51A24] via-red-400 to-[#F9E7C9] bg-clip-text text-transparent">Zero Stockouts</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Meet the core engineering and design team revolutionizing autonomous supply chain resilience with deterministic telemetry, human governance, and AI voice negotiation.
        </p>
      </div>

      {/* 2. Core Team Profiles */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            style={{
              background: 'linear-gradient(165deg, rgba(24, 24, 27, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            }}
            className="rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-red-500/30 transition-all group"
          >
            <div className="space-y-5">
              {/* Header with Avatar and Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    style={{ background: member.avatarBg }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-black/40 border border-white/20"
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-red-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                      {member.role}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
                  {member.badge}
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {member.bio}
              </p>

              {/* Skills Tags */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Expertise</span>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-semibold px-2.5 py-0.8 rounded-lg bg-white/5 border border-white/10 text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Active in Production</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Hackathon Lead</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Core Architecture Pillars */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">System Architecture & Engineering Pillars</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Built on a hardened modern tech stack designed for high throughput, cryptographic compliance, and sub-second telemetry reaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {engineeringPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 hover:bg-white/10 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-white/10 w-fit">
                  <Icon className={`h-5 w-5 ${pillar.color}`} />
                </div>
                <h4 className="text-base font-bold text-white">{pillar.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Career Opportunities / Join Our Mission (inspired by career1 from zip) */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 lg:p-10 space-y-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#E51A24] text-xs font-bold uppercase tracking-wider mb-1">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Careers & Open Roles</span>
              </div>
              <h3 className="text-2xl font-black text-white">Join the BeforeStock Core Team</h3>
              <p className="text-xs text-slate-400 mt-1">Help us build the autonomous supply chain operating system for the next decade.</p>
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 self-start sm:self-auto">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    selectedDept === dept
                      ? 'bg-[#E51A24] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-3">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="rounded-2xl bg-black/40 border border-white/10 hover:border-white/25 p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {role.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {role.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl">{role.desc}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                    <span className="inline-flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      <span>{role.location}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{role.type}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Thank you for your interest in the ${role.title} position! Please send your portfolio and resume to careers@beforestock.ai.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E51A24] text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <span>Apply Now</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation CTA */}
      <div className="text-center pt-6 pb-8">
        <button
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#E51A24] hover:bg-[#c92924] text-white font-bold text-sm shadow-xl shadow-red-900/30 transition transform hover:scale-105"
        >
          <span>Enter Operational Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
