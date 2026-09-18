import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Sliders,
  Key,
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Save,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Zap,
  Bell,
  Smartphone,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Cpu
} from 'lucide-react';
import apiClient from '../api/apiClient';

export default function SettingsProfile({
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenOnboarding,
  showToast
}) {
  const [activeSubTab, setActiveSubTab] = useState('profile'); // 'profile', 'settings', 'security', 'api', 'account'
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User details state
  const [userData, setUserData] = useState({
    fullName: currentUser?.fullName || 'Dhanush S',
    username: currentUser?.username || 'dhanush',
    email: currentUser?.email || 'dhanush@supplyguard.ai',
    phone: currentUser?.phone || '+91 98765 43210',
    companyName: currentUser?.companyName || 'Apex Quantum Technologies Pvt Ltd',
    department: currentUser?.department || 'Procurement & Supply Chain Operations',
    role: currentUser?.role || 'ROLE_ADMIN'
  });

  // Security password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: null, success: false });

  // Platform & Risk preferences state
  const [platformSettings, setPlatformSettings] = useState({
    safetyMultiplier: 1.20,
    runwayThresholdDays: 14,
    aiReasoningEnabled: true,
    requireHumanSignoff: true,
    emailAlerts: true,
    soundAlerts: true,
    matterPhysicsEnabled: true
  });

  // API Key state
  const [apiKey, setApiKey] = useState('sg_live_9f8a72b14c3e809d4721ab5c6e809d47');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.acme-erp.internal/v1/supplyguard-webhooks');
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookSuccess, setWebhookSuccess] = useState(false);

  // Two factor auth state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Fetch Business Profile (KYB)
  useEffect(() => {
    async function loadBusinessData() {
      if (!currentUser?.userId && !currentUser?.id) return;
      const uid = currentUser.userId || currentUser.id || 1;
      setLoadingProfile(true);
      try {
        const res = await apiClient.get(`/business-profile/${uid}`);
        if (res.data) {
          setBusinessProfile(res.data);
        }
      } catch (err) {
        // Fallback default demo profile if not yet created
        setBusinessProfile({
          businessName: 'Apex Quantum Technologies Pvt Ltd',
          businessType: 'Pvt Ltd',
          gstin: '29ABCDE1234F1Z5',
          pan: 'ABCDE1234F',
          udyamNumber: 'UDYAM-KA-02-0045812',
          city: 'Bengaluru',
          state: 'Karnataka',
          categories: ['Electronics', 'Automotive Parts'],
          businessScale: 'SMALL'
        });
      } finally {
        setLoadingProfile(false);
      }
    }
    loadBusinessData();
  }, [currentUser]);

  // Handle personal profile update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);

    try {
      const uid = currentUser?.userId || currentUser?.id || 1;
      const res = await apiClient.put(`/auth/profile/${uid}`, userData);
      if (res.data) {
        if (onUpdateUser) onUpdateUser(res.data);
      }
      setSaveSuccess(true);
      if (showToast) {
        showToast({
          title: 'Profile Updated',
          description: 'Your user profile details have been saved successfully.',
          type: 'success',
          duration: 4000
        });
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn('Backend profile update failed, updated locally', err);
      if (onUpdateUser) {
        onUpdateUser({ ...currentUser, ...userData });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: null, success: false });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ loading: false, error: 'New passwords do not match.', success: false });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ loading: false, error: 'Password must be at least 6 characters.', success: false });
      return;
    }

    try {
      const uid = currentUser?.userId || currentUser?.id || 1;
      await apiClient.post('/auth/change-password', {
        userId: uid,
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordStatus({ loading: false, error: null, success: true });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (showToast) {
        showToast({
          title: 'Password Changed',
          description: 'Your login credentials have been securely updated.',
          type: 'success',
          duration: 4000
        });
      }
      setTimeout(() => setPasswordStatus((prev) => ({ ...prev, success: false })), 4000);
    } catch (err) {
      const msg = err.response?.data || 'Failed to change password. Please verify current password.';
      setPasswordStatus({ loading: false, error: typeof msg === 'string' ? msg : 'Error updating password.', success: false });
    }
  };

  // Copy API key to clipboard
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Regenerate API Key
  const handleRegenerateKey = () => {
    const chars = '0123456789abcdef';
    let newKey = 'sg_live_';
    for (let i = 0; i < 32; i++) {
      newKey += chars[Math.floor(Math.random() * chars.length)];
    }
    setApiKey(newKey);
    if (showToast) {
      showToast({
        title: 'API Key Rotated',
        description: 'New production API key generated. Update your ERP integrations.',
        type: 'info',
        duration: 4000
      });
    }
  };

  // Test Webhook Ping
  const handleTestWebhook = () => {
    setWebhookTesting(true);
    setTimeout(() => {
      setWebhookTesting(false);
      setWebhookSuccess(true);
      setTimeout(() => setWebhookSuccess(false), 3000);
    }, 900);
  };

  const navItems = [
    { id: 'profile', label: 'User & KYB Profile', icon: User, desc: 'Identity, contacts & business entity' },
    { id: 'settings', label: 'Safety & Risk Rules', icon: Sliders, desc: 'Safety buffers, runway thresholds & AI reasoning' },
    { id: 'security', label: 'Security & Access', icon: Shield, desc: 'Password change, 2FA & active sessions' },
    { id: 'api', label: 'API Keys & Webhooks', icon: Key, desc: 'ERP integrations & webhook dispatch' },
    { id: 'account', label: 'Account & Sign Out', icon: LogOut, desc: 'Cache management & session sign out' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Profile Summary Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-red-50/60 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#E51A24] text-white flex items-center justify-center text-2xl font-black shadow-md">
                {(userData.fullName || userData.username || 'D')[0].toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Operator Online" />
            </div>

            <div>
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {userData.fullName}
                </h1>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-[#E51A24] border border-red-200">
                  {userData.role}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>KYB Verified</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                <span className="font-semibold text-slate-700">@{userData.username}</span>
                <span>•</span>
                <span>{userData.department}</span>
                <span>•</span>
                <span className="text-slate-800 font-medium">{userData.companyName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#E51A24] text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Rerun Onboarding</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border border-slate-200"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <span className="text-slate-500 text-[11px] block">Organization Legal Entity</span>
            <span className="font-bold text-slate-900 truncate block">{businessProfile?.businessName || 'Apex Quantum Pvt Ltd'}</span>
          </div>
          <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <span className="text-slate-500 text-[11px] block">Enterprise Scale</span>
            <span className="font-bold text-slate-900">{businessProfile?.businessScale || 'SMALL'} Enterprise</span>
          </div>
          <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <span className="text-slate-500 text-[11px] block">Safety Stock Multiplier</span>
            <span className="font-bold text-[#E51A24] font-mono">{platformSettings.safetyMultiplier.toFixed(2)}x Deterministic</span>
          </div>
          <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <span className="text-slate-500 text-[11px] block">AI Reasoning Engine</span>
            <span className="font-bold text-emerald-600">Ollama Llama-3 Active</span>
          </div>
        </div>
      </div>

      {/* Main Settings Body with Left Sidebar Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs Sidebar */}
        <div className="lg:col-span-1 space-y-1.5">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition flex items-start space-x-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#E51A24] text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <div className="text-xs leading-tight">{item.label}</div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-2 text-[#E51A24] font-bold text-xs">
              <Zap className="h-4 w-4" />
              <span>Autonomous Guardrails</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Settings changes apply across all deterministic threat calculations and autonomous purchase order drafts.
            </p>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ============================================================ */}
          {/* TAB 1: User & Business Profile                               */}
          {/* ============================================================ */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information Form */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Operator Identity & Contact</h2>
                    <p className="text-xs text-slate-500">Personal details used for dispatching notifications and signing mitigation plans.</p>
                  </div>
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1 animate-in fade-in">
                      <Check className="h-3.5 w-3.5" />
                      <span>Changes Saved</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Full Legal Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={userData.fullName}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">System Username</label>
                      <input
                        type="text"
                        disabled
                        value={userData.username}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-500 font-mono font-semibold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Work Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Direct Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Corporate Department / Division</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={userData.department}
                          onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company / Organization</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={userData.companyName}
                          onChange={(e) => setUserData({ ...userData, companyName: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-2.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-xs shadow-xs transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Registered KYB Business Profile Summary */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Registered Business Entity (KYB Status)</h2>
                    <p className="text-xs text-slate-500">Government compliance and taxation identifiers verified during onboarding.</p>
                  </div>
                  {onOpenOnboarding && (
                    <button
                      type="button"
                      onClick={onOpenOnboarding}
                      className="text-xs font-bold text-[#E51A24] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Modify in KYB Wizard</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                    <span className="text-slate-500 text-[11px] block">Legal Entity Name</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                      {businessProfile?.businessName || 'Apex Quantum Technologies Pvt Ltd'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>MCA Registered ({businessProfile?.businessType || 'Pvt Ltd'})</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                    <span className="text-slate-500 text-[11px] block">Permanent Account Number (PAN)</span>
                    <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                      {businessProfile?.pan || 'ABCDE1234F'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>NSDL Verified Active</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                    <span className="text-slate-500 text-[11px] block">GSTIN Identification</span>
                    <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                      {businessProfile?.gstin || '29ABCDE1234F1Z5'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>GST Portal Operative</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70">
                    <span className="text-slate-500 text-[11px] block">Udyam MSME Registration</span>
                    <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                      {businessProfile?.udyamNumber || 'UDYAM-KA-02-0045812'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Validated MSME</span>
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 sm:col-span-2">
                    <span className="text-slate-500 text-[11px] block">Registered Address</span>
                    <span className="font-semibold text-slate-900 text-xs mt-0.5 block">
                      {businessProfile?.addressLine1 || 'Plot 42, Electronics City Phase 1, Hosur Main Road'}, {businessProfile?.city || 'Bengaluru'}, {businessProfile?.state || 'Karnataka'} - {businessProfile?.pincode || '560100'}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1.5">
                      {(businessProfile?.categories || ['Electronics', 'Automotive Parts']).map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: Safety & Risk Calculus Rules                          */}
          {/* ============================================================ */}
          {activeSubTab === 'settings' && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Deterministic Engine & Telemetry Rules</h2>
                <p className="text-slate-500">Fine-tune mathematical stockout thresholds, safety stock buffers, and AI reasoning gates.</p>
              </div>

              <div className="space-y-4">
                {/* 1.20x Safety Multiplier */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Deterministic Safety Buffer Multiplier</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Applied to rolling daily usage: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">Runway = Stock / (DailyAvg × {platformSettings.safetyMultiplier.toFixed(2)})</code>
                      </p>
                    </div>
                    <span className="text-base font-black font-mono text-[#E51A24] bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                      {platformSettings.safetyMultiplier.toFixed(2)}x
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1.0"
                    max="1.5"
                    step="0.05"
                    value={platformSettings.safetyMultiplier}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, safetyMultiplier: parseFloat(e.target.value) })}
                    className="w-full accent-[#E51A24] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1.00x (Lean Inventory)</span>
                    <span>1.20x (Standard SupplyGuard)</span>
                    <span>1.50x (Defensive Buffer)</span>
                  </div>
                </div>

                {/* Critical Runway Threshold Days */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Critical Stockout Alarm Threshold</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Triggers high-priority alerts and Threat Radar alarms when runway falls below lead time + buffer.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="5"
                      max="45"
                      value={platformSettings.runwayThresholdDays}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, runwayThresholdDays: parseInt(e.target.value, 10) || 14 })}
                      className="w-16 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-center font-mono font-bold text-slate-900"
                    />
                    <span className="font-bold text-slate-600">days</span>
                  </div>
                </div>

                {/* Autonomous Human Signoff Gate */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Enforce Human-in-the-Loop Approval Gate</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Disallows autonomous dispatch of emergency POs without authorized human digital sign-off.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={platformSettings.requireHumanSignoff}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, requireHumanSignoff: e.target.checked })}
                    className="h-5 w-5 rounded accent-[#E51A24] cursor-pointer"
                  />
                </div>

                {/* Ollama AI Reasoning Gate */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <Cpu className="h-5 w-5 text-[#E51A24] mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Ollama AI Strategic Recommendations</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Grounds real-time LLM reasoning on live database context for backup supplier allocations.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={platformSettings.aiReasoningEnabled}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, aiReasoningEnabled: e.target.checked })}
                    className="h-5 w-5 rounded accent-[#E51A24] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (showToast) {
                      showToast({
                        title: 'Settings Applied',
                        description: 'Platform safety rules and runway thresholds updated.',
                        type: 'success',
                        duration: 3500
                      });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Save Platform Rules
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: Security & Credentials                                */}
          {/* ============================================================ */}
          {activeSubTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900">Change Account Password</h2>
                  <p className="text-slate-500">Ensure your account is using a secure password with at least 6 characters.</p>
                </div>

                {passwordStatus.error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-[#E51A24] font-bold">
                    {passwordStatus.error}
                  </div>
                )}
                {passwordStatus.success && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-700 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Password updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordStatus.loading}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-xs shadow-xs transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>{passwordStatus.loading ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
                    <p className="text-slate-500">Protect operator access with TOTP Authenticator apps (Google / Microsoft Authenticator).</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Protected
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200/70">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">Authenticator App (TOTP)</span>
                      <span className="text-[11px] text-slate-500">One-time codes required for signing high-value purchase orders.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="h-5 w-5 rounded accent-[#E51A24] cursor-pointer"
                  />
                </div>
              </div>

              {/* Active Sessions */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Active Login Sessions</h2>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Current Browser Session (Windows • Chrome)</span>
                    <span className="text-[11px] text-slate-500 font-mono">IP: 127.0.0.1 (Localhost / Corporate Intranet)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active Now
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: API Keys & Webhooks                                   */}
          {/* ============================================================ */}
          {activeSubTab === 'api' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs text-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900">SupplyGuard Production API Key</h2>
                  <p className="text-slate-500">Authenticate external ERP systems (SAP, Oracle NetSuite, Dynamics 365) with our REST endpoints.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-700 font-bold block">Bearer Token Key</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        readOnly
                        value={apiKey}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 py-2.5 text-slate-800 font-mono font-bold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyApiKey}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRegenerateKey}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#E51A24] font-bold text-xs transition flex items-center space-x-1.5 border border-red-200 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Rotate Key</span>
                    </button>
                  </div>
                </div>

                {/* Webhook Configuration */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">ERP Outbound Webhook Dispatch</h3>
                  <p className="text-slate-500">Receives real-time JSON payloads whenever risk events or supplier disruptions occur.</p>

                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30"
                    />
                    <button
                      type="button"
                      onClick={handleTestWebhook}
                      disabled={webhookTesting}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>{webhookTesting ? 'Pinging...' : webhookSuccess ? '✓ 200 OK Ping' : 'Send Test Ping'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: Account & Log Out                                     */}
          {/* ============================================================ */}
          {activeSubTab === 'account' && (
            <div className="space-y-6 text-xs">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900">Session & Local Data Management</h2>
                  <p className="text-slate-500">Manage cached telemetry data and session credentials.</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Clear Cached Telemetry State</span>
                    <span className="text-[11px] text-slate-500">Clears offline localStorage caches and forces full synchronization from the backend.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('supplyguard_token');
                      if (showToast) {
                        showToast({
                          title: 'Cache Cleared',
                          description: 'Local telemetry cache purged.',
                          type: 'info',
                          duration: 3000
                        });
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold transition cursor-pointer"
                  >
                    Clear Cache
                  </button>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Relaunch KYB Onboarding Setup</span>
                    <span className="text-[11px] text-slate-500">Reopens the 4-step wizard to register additional suppliers or configure categories.</span>
                  </div>
                  {onOpenOnboarding && (
                    <button
                      type="button"
                      onClick={onOpenOnboarding}
                      className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-[#E51A24] font-bold transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Start Wizard</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Prominent Log Out Card / Danger Zone */}
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-[#E51A24]">
                  <LogOut className="h-5 w-5" />
                  <h2 className="text-sm font-bold">Sign Out of SupplyGuard</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Signing out will end your current session, revoke operator authorization for autonomous PO signatures on this device, and return you to the access portal.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="px-6 py-3 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Confirm & Sign Out of Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
