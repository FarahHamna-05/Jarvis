import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Building2,
  Briefcase,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Zap,
  Activity,
  Cpu,
  Layers,
  ArrowLeft,
  Check,
  Clock,
  ChevronRight
} from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AuthPage({
  initialMode = 'login',
  onAuthSuccess,
  onNavigateDashboard,
  showToast
}) {
  const [isRegister, setIsRegister] = useState(initialMode === 'signup' || initialMode === 'register');

  // Login State
  const [loginUsername, setLoginUsername] = useState('dhanush');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Signup State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Electronics & Hardware');
  const [department, setDepartment] = useState('Procurement & Supply Chain');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Quick Demo Account Pre-fill
  const fillDemoAccount = (roleType) => {
    setIsRegister(false);
    if (roleType === 'dhanush') {
      setLoginUsername('dhanush');
      setLoginPassword('password123');
    } else if (roleType === 'admin') {
      setLoginUsername('admin');
      setLoginPassword('password123');
    }
  };

  // Quick Demo Signup Pre-fill
  const fillDemoSignup = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    setFullName('Priya Sharma');
    setUsername(`priya_ops_${rand}`);
    setEmail(`priya.sharma${rand}@supplytech.in`);
    setPassword('SupplyGuard@2026');
    setConfirmPassword('SupplyGuard@2026');
    setCompanyName('NexGen Robotics India Pvt Ltd');
    setIndustry('Electronics & Hardware');
    setDepartment('Global Sourcing & Hardware');
    setPhone('+91 98765 12345');
    setAgreedToTerms(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (!agreedToTerms) {
        setError('You must accept the autonomous safety protocols to continue.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          username,
          email,
          password,
          role: 'ROLE_USER',
          fullName: fullName || username,
          companyName: companyName || 'Enterprise Sourcing Inc',
          phone,
          department
        };

        const res = await apiClient.post('/auth/register', payload);

        if (res.data && res.data.token) {
          localStorage.setItem('supplyguard_token', res.data.token);
          localStorage.setItem('supplyguard_user', JSON.stringify(res.data));
          if (showToast) {
            showToast({
              title: `Welcome, ${res.data.fullName || res.data.username}!`,
              description: 'Account created. Launching your KYB onboarding setup...',
              type: 'success',
              duration: 5000
            });
          }
          onAuthSuccess(res.data);
        }
      } else {
        const payload = {
          username: loginUsername,
          password: loginPassword
        };

        const res = await apiClient.post('/auth/login', payload);

        if (res.data && res.data.token) {
          localStorage.setItem('supplyguard_token', res.data.token);
          localStorage.setItem('supplyguard_user', JSON.stringify(res.data));
          if (showToast) {
            showToast({
              title: `Welcome back, ${res.data.fullName || res.data.username}!`,
              description: 'Signed in to SupplyGuard Autonomous Intelligence.',
              type: 'success',
              duration: 4000
            });
          }
          onAuthSuccess(res.data);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      const msg = err.response?.data;
      if (typeof msg === 'string') {
        setError(msg);
      } else if (msg?.message) {
        setError(msg.message);
      } else {
        setError(
          isRegister
            ? 'Registration failed. Username or email may already be taken.'
            : 'Invalid credentials. Please verify your username and password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 sm:px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: BRAND & VALUE SHOWCASE                          */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E51A24]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#E51A24]/15 blur-3xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E51A24] text-white flex items-center justify-center font-black shadow-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block">SupplyGuard</span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">Ripple Autonomous Core</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Deterministic Sourcing & Threat Radar.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Continuous inventory telemetry calculus powered by a 1.20x safety buffer, verified KYB supplier onboarding, and Ollama AI reasoning.
              </p>
            </div>
          </div>

          {/* Middle Feature Highlights */}
          <div className="relative z-10 my-8 space-y-3.5 text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">1.20x Safety Calculus</span>
                <span className="text-[11px] text-slate-400">Mathematical runway formula preventing stockouts before they occur.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">6-Point KYB Verification</span>
                <span className="text-[11px] text-slate-400">NSDL PAN, GST portal, Udyam MSME, and RBI IFSC bank gateway checks.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">Human-in-the-Loop Gate</span>
                <span className="text-[11px] text-slate-400">Autonomous PO drafting with authorized human cryptographic sign-off.</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>Real-Time Telemetry Gateway</span>
            </div>
            <span className="font-mono text-white/80">v2.4.0 Live</span>
          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: LOGIN & SIGNUP FORMS                           */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Top Navigation / Mode Toggle */}
            <div className="flex items-center justify-between">
              {onNavigateDashboard && (
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Dashboard</span>
                </button>
              )}

              {/* Mode Toggle Pills */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                    !isRegister
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                    isRegister
                      ? 'bg-[#E51A24] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Title Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isRegister ? 'Create Your Operator Account' : 'Welcome to SupplyGuard'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister
                  ? 'Complete your profile to unlock autonomous threat detection & KYB onboarding.'
                  : 'Enter your operator credentials to access the live threat radar and SKU inventory.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-[#E51A24] font-bold animate-in fade-in flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#E51A24] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* SIGN IN (LOGIN) FORM                                     */}
            {/* ======================================================== */}
            {!isRegister && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Username or Operator ID</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. dhanush"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold block">Password</label>
                    <span className="text-[11px] text-slate-400 hover:text-[#E51A24] cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Demo Pre-fill */}
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>1-Click Test Accounts:</span>
                    <span className="text-slate-400 font-mono">password123</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('dhanush')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px] transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <KeyRound className="h-3.5 w-3.5 text-[#E51A24]" />
                      <span>Dhanush (Lead)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoAccount('admin')}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px] transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Admin (System)</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold py-3 text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer mt-3"
                >
                  <span>{loading ? 'Connecting to Telemetry Gateway...' : 'Sign In to Command Center'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* ======================================================== */}
            {/* SIGN UP (CREATE ACCOUNT) FORM                            */}
            {/* ======================================================== */}
            {isRegister && (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Need instant sample values?</span>
                  <button
                    type="button"
                    onClick={fillDemoSignup}
                    className="text-[11px] font-bold text-[#E51A24] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Auto-fill Sample Data</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Operator Username</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. priya_ops"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-700 font-bold block mb-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. priya.sharma@nexgen.ai"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. NexGen Robotics Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Industry Sector</label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      >
                        <option value="Electronics & Hardware">Electronics & Hardware</option>
                        <option value="Automotive & EV">Automotive & EV</option>
                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                        <option value="Industrial & Raw Materials">Industrial & Raw Materials</option>
                        <option value="FMCG & Food">FMCG & Food</option>
                        <option value="Apparel & Textiles">Apparel & Textiles</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="pageTermsCheck"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#E51A24] cursor-pointer"
                  />
                  <label htmlFor="pageTermsCheck" className="text-[11px] text-slate-500 cursor-pointer">
                    I accept the <span className="text-slate-900 font-bold">Autonomous Supply Governance Protocols</span> and consent to KYB enterprise verification.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold py-3 text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <span>{loading ? 'Creating Account & Setting Up Space...' : 'Create Account & Start Onboarding'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            <p className="text-slate-500">
              {isRegister ? 'Already registered an account?' : "Don't have an operator profile yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="text-[#E51A24] hover:underline font-extrabold ml-1 cursor-pointer"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>

            {onNavigateDashboard && (
              <button
                type="button"
                onClick={onNavigateDashboard}
                className="text-slate-500 hover:text-slate-900 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Explore Demo as Guest</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
