import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Mail,
  ShieldCheck,
  Building2,
  Briefcase,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AuthModal({ onClose, onAuthSuccess, initialMode = 'login' }) {
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
  const [department, setDepartment] = useState('Procurement & Supply Chain');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Quick Demo account prefill
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

  // Quick Demo signup prefill
  const fillDemoSignup = () => {
    const rand = Math.floor(100 + Math.random() * 900);
    setFullName('Priya Sharma');
    setUsername(`priya_ops_${rand}`);
    setEmail(`priya.sharma${rand}@supplytech.in`);
    setPassword('SupplyGuard@2026');
    setConfirmPassword('SupplyGuard@2026');
    setCompanyName('NexGen Robotics India Pvt Ltd');
    setDepartment('Global Sourcing & Hardware');
    setPhone('+91 98765 12345');
    setAgreedToTerms(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all mandatory fields.');
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
        setError('You must accept the autonomous safety and governance terms to continue.');
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
          companyName: companyName || 'SupplyGuard Enterprise',
          phone,
          department
        };

        const res = await apiClient.post('/auth/register', payload);

        if (res.data && res.data.token) {
          localStorage.setItem('supplyguard_token', res.data.token);
          localStorage.setItem('supplyguard_user', JSON.stringify(res.data));
          onAuthSuccess(res.data);
          onClose();
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
          onAuthSuccess(res.data);
          onClose();
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
        setError(isRegister ? 'Registration failed. Username or email may already be registered.' : 'Invalid credentials. Please verify your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="rounded-3xl border border-slate-200 bg-white text-slate-900 p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150 shadow-2xl relative my-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E51A24] text-white flex items-center justify-center font-black shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {isRegister ? 'Create Operator Account' : 'Sign In to SupplyGuard'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRegister ? 'Set up your organization & begin KYB verification' : 'Autonomous Supply Chain Threat Intelligence Core'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`py-2 rounded-xl transition cursor-pointer ${
              isRegister
                ? 'bg-[#E51A24] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-[#E51A24] font-bold animate-in fade-in">
            {error}
          </div>
        )}

        {/* ============================================================ */}
        {/* LOGIN FORM                                                   */}
        {/* ============================================================ */}
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

            {/* Quick Demo Fill Buttons */}
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                <span>Quick Demo Accounts:</span>
                <span className="text-slate-400">Password: password123</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('dhanush')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px] transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <KeyRound className="h-3 w-3 text-[#E51A24]" />
                  <span>Dhanush (Lead)</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px] transition shadow-2xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Admin (System)</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold py-3 text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Operator...' : 'Sign In to SupplyGuard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* SIGNUP FORM                                                  */}
        {/* ============================================================ */}
        {isRegister && (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Need a quick test account?</span>
              <button
                type="button"
                onClick={fillDemoSignup}
                className="text-[11px] font-bold text-[#E51A24] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Auto-fill Sample Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Full Name</label>
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
                <label className="text-slate-700 font-bold block mb-1">Desired Username</label>
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
                <label className="text-slate-700 font-bold block mb-1">Work / Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. p.sharma@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="e.g. NexGen Robotics Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Department / Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                  >
                    <option value="Procurement & Supply Chain">Procurement & Supply Chain</option>
                    <option value="Operations & Logistics">Operations & Logistics</option>
                    <option value="Inventory Management">Inventory Management</option>
                    <option value="Executive / Leadership">Executive / Leadership</option>
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

            {/* Terms checkbox */}
            <div className="pt-1 flex items-start space-x-2">
              <input
                type="checkbox"
                id="termsCheck"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#E51A24] cursor-pointer"
              />
              <label htmlFor="termsCheck" className="text-[11px] text-slate-500 cursor-pointer">
                I accept the <span className="text-slate-800 font-bold">Autonomous Supply Chain Governance Protocols</span> and agree to conduct KYB onboarding verification.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold py-3 text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <span>{loading ? 'Creating Operator Account...' : 'Create Account & Start Onboarding'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Footer switch */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs">
          <p className="text-slate-500">
            {isRegister ? 'Already have an operator account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-[#E51A24] hover:underline font-extrabold ml-1 cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
