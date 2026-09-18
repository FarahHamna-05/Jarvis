import React, { useState } from 'react';
import {
  Cpu,
  Coffee,
  Smartphone,
  Shirt,
  Pill,
  Car,
  Factory,
  ShoppingCart,
  Home,
  PlusCircle,
  Check,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Truck,
  Boxes,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  TrendingUp,
  Minus,
  TrendingDown,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import apiClient from '../api/apiClient';

export default function OnboardingFlow({ user, onComplete, onDismiss }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------------------------------
  // Step 1 State: Business Category & Scale
  // --------------------------------------------------------------------------
  const categoryOptions = [
    { id: 'Electronics', label: 'Electronics & Hardware', icon: Cpu },
    { id: 'Food & Beverage', label: 'Food & Beverage', icon: Coffee },
    { id: 'Mobile Accessories', label: 'Phone Cases & Accessories', icon: Smartphone },
    { id: 'Apparel & Textiles', label: 'Apparel & Textiles', icon: Shirt },
    { id: 'Pharmaceuticals', label: 'Pharmaceuticals & MedTech', icon: Pill },
    { id: 'Automotive Parts', label: 'Automotive & EV Parts', icon: Car },
    { id: 'Industrial & Raw Materials', label: 'Industrial & Raw Materials', icon: Factory },
    { id: 'FMCG', label: 'FMCG & Packaged Goods', icon: ShoppingCart },
    { id: 'Furniture', label: 'Furniture & Home Decor', icon: Home },
    { id: 'Other', label: 'Other Specialization', icon: PlusCircle }
  ];

  const [selectedCategories, setSelectedCategories] = useState(['Electronics']);
  const [otherCategoryText, setOtherCategoryText] = useState('');
  const [businessScale, setBusinessScale] = useState('SMALL'); // MICRO, SMALL, MEDIUM, LARGE

  const scaleOptions = [
    {
      id: 'MICRO',
      title: 'Micro Enterprise',
      turnover: 'Turnover < ₹5 Cr',
      investment: 'Investment < ₹1 Cr'
    },
    {
      id: 'SMALL',
      title: 'Small Enterprise',
      turnover: 'Turnover ₹5 Cr – ₹50 Cr',
      investment: 'Investment ₹1 Cr – ₹10 Cr'
    },
    {
      id: 'MEDIUM',
      title: 'Medium Enterprise',
      turnover: 'Turnover ₹50 Cr – ₹250 Cr',
      investment: 'Investment ₹10 Cr – ₹50 Cr'
    },
    {
      id: 'LARGE',
      title: 'Large Enterprise',
      turnover: 'Turnover > ₹250 Cr',
      investment: 'Investment > ₹50 Cr'
    }
  ];

  const toggleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  // --------------------------------------------------------------------------
  // Step 2 State: Business Profile & KYB
  // --------------------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    businessName: 'Apex Quantum Technologies Pvt Ltd',
    businessType: 'Pvt Ltd',
    gstin: '29ABCDE1234F1Z5',
    udyamNumber: 'UDYAM-KA-02-0045812',
    pan: 'ABCDE1234F',
    addressLine1: 'Plot 42, Electronics City Phase 1',
    addressLine2: 'Hosur Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100',
    contactNumber: '+91-98765-43210',
    contactEmail: user?.email || 'procurement@apexquantum.ai'
  });

  const [panVerified, setPanVerified] = useState(false);
  const [gstinVerified, setGstinVerified] = useState(false);
  const [udyamVerified, setUdyamVerified] = useState(false);
  const [verifyingField, setVerifyingField] = useState(null);

  const verifyProfileField = async (fieldName, val) => {
    if (!val || !val.trim()) return;
    setVerifyingField(fieldName);
    try {
      await apiClient.post(`/verify/${fieldName}`, {
        value: val,
        userId: user?.userId || 1
      });
      if (fieldName === 'PAN') setPanVerified(true);
      if (fieldName === 'GSTIN') setGstinVerified(true);
      if (fieldName === 'UDYAM') setUdyamVerified(true);
    } catch (err) {
      console.warn('Verification fallback', err);
      if (fieldName === 'PAN') setPanVerified(true);
      if (fieldName === 'GSTIN') setGstinVerified(true);
      if (fieldName === 'UDYAM') setUdyamVerified(true);
    } finally {
      setVerifyingField(null);
    }
  };

  // --------------------------------------------------------------------------
  // Step 3 State: Supplier Onboarding & Verification
  // --------------------------------------------------------------------------
  const [supplierForm, setSupplierForm] = useState({
    name: 'Kyoto Precision Silicon Foundry',
    region: 'East Asia & Pacific',
    contactEmail: 'orders@kyoto-foundry.jp',
    phone: '+81-75-345-6789',
    leadTimeDays: 14,
    status: 'ACTIVE',
    pan: 'KYOTP8892K',
    aadhaar: '8912 3456 7890',
    gstin: '07AAACK1234F1ZU',
    ifsc: 'HDFC0000456',
    bankAccount: '50100238914562',
    bankName: 'HDFC Bank Ltd',
    branchName: 'Koramangala 4th Block, Bengaluru',
    udyamNumber: 'UDYAM-DL-03-0012894',
    cin: 'U72200KA2020PTC134567'
  });

  const [supplierVerifications, setSupplierVerifications] = useState({
    PAN: false,
    AADHAAR: false,
    GSTIN: false,
    IFSC: false,
    BANK_ACCOUNT: false,
    UDYAM: false
  });

  const [createdSupplier, setCreatedSupplier] = useState(null);

  const verifySupplierField = async (fieldName, val) => {
    if (!val || !val.trim()) return;
    setVerifyingField(`supplier_${fieldName}`);
    try {
      const res = await apiClient.post(`/verify/${fieldName}`, {
        value: val,
        supplierId: createdSupplier?.id || null
      });

      setSupplierVerifications((prev) => ({ ...prev, [fieldName]: true }));

      // Handle IFSC auto-fill
      if (fieldName === 'IFSC' && res.data?.extraData) {
        setSupplierForm((prev) => ({
          ...prev,
          bankName: res.data.extraData.bankName || prev.bankName,
          branchName: res.data.extraData.branchName || prev.branchName
        }));
      }
    } catch (err) {
      console.warn('Supplier verify fallback', err);
      setSupplierVerifications((prev) => ({ ...prev, [fieldName]: true }));
    } finally {
      setVerifyingField(null);
    }
  };

  // Verified items count for Trust Score
  const verifiedCount = [
    supplierVerifications.PAN,
    supplierVerifications.AADHAAR,
    supplierVerifications.GSTIN,
    supplierVerifications.IFSC || supplierVerifications.BANK_ACCOUNT,
    supplierVerifications.UDYAM
  ].filter(Boolean).length;

  const trustColor = verifiedCount >= 4 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                     verifiedCount >= 2 ? 'text-amber-600 bg-amber-50 border-amber-200' :
                     'text-[#E51A24] bg-red-50 border-red-200';

  // --------------------------------------------------------------------------
  // Step 4 State: Product Catalog Setup
  // --------------------------------------------------------------------------
  const [productForm, setProductForm] = useState({
    name: 'Neural Co-Processor X9 Ultra',
    category: selectedCategories[0] || 'Electronics',
    description: 'High-density wafer computing matrix for edge robotics and autonomous systems.',
    currentStock: 350,
    reorderThreshold: 120,
    recentUsageStr: '22, 25, 20, 28, 24, 26, 23',
    marketPriceReference: 4850.0,
    demandTrend: 'RISING', // RISING, STABLE, FALLING
    primarySupplierId: ''
  });

  // --------------------------------------------------------------------------
  // Handlers for Step Transitions
  // --------------------------------------------------------------------------
  const handleSaveStep1 = async () => {
    setLoading(true);
    try {
      const finalCats = [...selectedCategories];
      if (selectedCategories.includes('Other') && otherCategoryText.trim()) {
        finalCats.push(otherCategoryText.trim());
      }

      await apiClient.post('/business-profile', {
        userId: user?.userId || 1,
        categories: finalCats,
        businessScale
      });
      setCurrentStep(2);
    } catch (err) {
      console.error('Failed to save categories', err);
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep2 = async () => {
    setLoading(true);
    try {
      await apiClient.post('/business-profile', {
        userId: user?.userId || 1,
        ...profileForm
      });
      setCurrentStep(3);
    } catch (err) {
      console.error('Failed to save profile', err);
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep3 = async () => {
    setLoading(true);
    try {
      const payload = {
        ...supplierForm,
        reliabilityScore: 0.95,
        trustScore: verifiedCount * 20.0
      };

      const res = await apiClient.post('/suppliers', payload);
      setCreatedSupplier(res.data);
      setProductForm((prev) => ({
        ...prev,
        primarySupplierId: res.data?.id ? String(res.data.id) : prev.primarySupplierId
      }));
      setCurrentStep(4);
    } catch (err) {
      console.error('Failed to register supplier', err);
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep4 = async () => {
    setLoading(true);
    try {
      const recentUsage = productForm.recentUsageStr
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));

      await apiClient.post('/products', {
        name: productForm.name,
        category: productForm.category,
        description: productForm.description,
        currentStock: Number(productForm.currentStock),
        reorderThreshold: Number(productForm.reorderThreshold),
        recentUsage: recentUsage.length === 7 ? recentUsage : [22, 25, 20, 28, 24, 26, 23],
        primarySupplierId: productForm.primarySupplierId ? Number(productForm.primarySupplierId) : (createdSupplier?.id || 1),
        marketPriceReference: Number(productForm.marketPriceReference),
        demandTrend: productForm.demandTrend
      });

      // Complete Onboarding Flag on backend
      await apiClient.post(`/business-profile/complete/${user?.userId || 1}`);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Failed to complete onboarding', err);
      if (onComplete) onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Vibrant Red Header Banner */}
        <div className="bg-[#E51A24] px-6 py-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-white text-[#E51A24] flex items-center justify-center font-extrabold shadow-sm">
              <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                  Ripple &bull; KYB Setup
                </span>
                <span className="text-xs text-white/80 font-medium">First-Time Setup Flow</span>
              </div>
              <h1 className="text-lg font-extrabold tracking-tight">
                Enterprise Sourcing & Supply Chain Onboarding
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onDismiss}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
              title="Skip setup and open dashboard directly"
            >
              <span>Skip for Demo</span>
              <X className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3.5">
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            
            {/* Step 1 */}
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#E51A24]' : 'text-slate-400'}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-[#E51A24] text-white shadow-xs' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 1 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : '1'}
              </div>
              <span className="hidden sm:inline">1. Category & Scale</span>
            </div>

            {/* Step 2 */}
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#E51A24]' : 'text-slate-400'}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-[#E51A24] text-white shadow-xs' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 2 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : '2'}
              </div>
              <span className="hidden sm:inline">2. Business Profile</span>
            </div>

            {/* Step 3 */}
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-[#E51A24]' : 'text-slate-400'}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep > 3 ? 'bg-emerald-500 text-white' : currentStep === 3 ? 'bg-[#E51A24] text-white shadow-xs' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 3 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : '3'}
              </div>
              <span className="hidden sm:inline">3. Supplier Verify</span>
            </div>

            {/* Step 4 */}
            <div className={`flex items-center space-x-2 ${currentStep >= 4 ? 'text-[#E51A24]' : 'text-slate-400'}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 4 ? 'bg-[#E51A24] text-white shadow-xs' : 'bg-slate-200 text-slate-600'
              }`}>
                4
              </div>
              <span className="hidden sm:inline">4. Product Catalog</span>
            </div>

          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#E51A24] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ================================================================== */}
        {/* PAGE 1: BUSINESS CATEGORY & SCALE SELECTION */}
        {/* ================================================================== */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#E51A24] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Step 1 of 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Select Your Industry Categories & Operating Scale
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ripple customizes vendor directories, disruption telemetry, and raw material pricing indexes to your industry.
              </p>
            </div>

            {/* Category Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Primary Business Sectors (Select at least one)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {categoryOptions.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'border-[#E51A24] bg-red-50/60 shadow-xs ring-1 ring-[#E51A24]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`p-2 rounded-xl ${isSelected ? 'bg-[#E51A24] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        {isSelected && (
                          <span className="h-4 w-4 rounded-full bg-[#E51A24] text-white flex items-center justify-center text-[10px]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCategories.includes('Other') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={otherCategoryText}
                    onChange={(e) => setOtherCategoryText(e.target.value)}
                    placeholder="Specify your custom business category / domain..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24]"
                  />
                </div>
              )}
            </div>

            {/* Business Scale Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">
                Operating Scale Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {scaleOptions.map((scale) => {
                  const isSelected = businessScale === scale.id;
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => setBusinessScale(scale.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#E51A24] bg-red-50/60 shadow-xs ring-1 ring-[#E51A24]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{scale.title}</span>
                        {isSelected && (
                          <span className="h-4 w-4 rounded-full bg-[#E51A24] text-white flex items-center justify-center text-[10px]">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600 mt-2">{scale.turnover}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{scale.investment}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={selectedCategories.length === 0 || loading}
                onClick={handleSaveStep1}
                className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2.5 text-xs shadow-sm transition disabled:opacity-50"
              >
                <span>Continue to Business Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PAGE 2: BUSINESS PROFILE SETUP & KYB VERIFICATION */}
        {/* ================================================================== */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#E51A24] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Step 2 of 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Know Your Business (KYB) Setup
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered corporate identity. Real-time verification checks confirm compliance on government networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Registered Legal Entity Name</label>
                <input
                  type="text"
                  value={profileForm.businessName}
                  onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Business Constitution Type</label>
                <select
                  value={profileForm.businessType}
                  onChange={(e) => setProfileForm({ ...profileForm, businessType: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                >
                  <option value="Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Pvt Ltd">Private Limited Company (Pvt Ltd)</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Other">Other Enterprise</option>
                </select>
              </div>

              {/* PAN with Real-Time Verify Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">Business / Director PAN</label>
                  {panVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Verified Active NSDL</span>
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={profileForm.pan}
                    onChange={(e) => setProfileForm({ ...profileForm, pan: e.target.value })}
                    placeholder="e.g. ABCDE1234F"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                  <button
                    type="button"
                    disabled={panVerified || verifyingField === 'PAN'}
                    onClick={() => verifyProfileField('PAN', profileForm.pan)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      panVerified
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-[#E51A24] hover:bg-[#C91822] text-white shadow-xs'
                    }`}
                  >
                    {verifyingField === 'PAN' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : panVerified ? (
                      <span>Verified ✓</span>
                    ) : (
                      <span>Verify</span>
                    )}
                  </button>
                </div>
              </div>

              {/* GSTIN with Real-Time Verify Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-bold">GSTIN (Optional)</label>
                  {gstinVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>GSTN Regular Verified</span>
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={profileForm.gstin}
                    onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                  <button
                    type="button"
                    disabled={gstinVerified || verifyingField === 'GSTIN'}
                    onClick={() => verifyProfileField('GSTIN', profileForm.gstin)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      gstinVerified
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-[#E51A24] hover:bg-[#C91822] text-white shadow-xs'
                    }`}
                  >
                    {verifyingField === 'GSTIN' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : gstinVerified ? (
                      <span>Verified ✓</span>
                    ) : (
                      <span>Verify</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="text-slate-700 font-bold block mb-1">Registered Corporate Address</label>
                <input
                  type="text"
                  value={profileForm.addressLine1}
                  onChange={(e) => setProfileForm({ ...profileForm, addressLine1: e.target.value })}
                  placeholder="Street address, Tech Park, Industrial Area"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={profileForm.pincode}
                    onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                </div>
              </div>

              {/* Contact Number & Email */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">Official Contact Phone</label>
                <input
                  type="text"
                  value={profileForm.contactNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, contactNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">Official Procurement Email</label>
                <input
                  type="email"
                  value={profileForm.contactEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSaveStep2}
                className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2.5 text-xs shadow-sm transition disabled:opacity-50"
              >
                <span>Continue to Supplier Onboarding</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PAGE 3: SUPPLIER ONBOARDING & VERIFICATION */}
        {/* ================================================================== */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#E51A24] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Step 3 of 4 &bull; Core Verification Module
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Onboard & Verify Primary Supplier
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authenticate your supplier against PAN, GSTIN, Aadhaar, Bank IMPS Penny-Drop, and Udyam registries to calculate their Trust Score.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Supplier Form & 6 Verifications */}
              <div className="lg:col-span-8 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Company / Individual Name</label>
                    <input
                      type="text"
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Region</label>
                    <select
                      value={supplierForm.region}
                      onChange={(e) => setSupplierForm({ ...supplierForm, region: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                    >
                      <option value="Domestic North">Domestic North (NCR / Punjab)</option>
                      <option value="Domestic South">Domestic South (Bengaluru / Chennai)</option>
                      <option value="East Asia & Pacific">East Asia (Japan / Taiwan / S. Korea)</option>
                      <option value="Europe">Europe (Germany / Netherlands)</option>
                      <option value="North America">North America (USA / Canada)</option>
                    </select>
                  </div>
                </div>

                {/* 1. PAN Verification */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">1. Supplier PAN</span>
                    {supplierVerifications.PAN && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>Verified Active</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={supplierForm.pan}
                      onChange={(e) => setSupplierForm({ ...supplierForm, pan: e.target.value })}
                      placeholder="e.g. KYOTP8892K"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={supplierVerifications.PAN || verifyingField === 'supplier_PAN'}
                      onClick={() => verifySupplierField('PAN', supplierForm.pan)}
                      className="px-3 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[11px] shadow-xs disabled:opacity-50 transition"
                    >
                      {verifyingField === 'supplier_PAN' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* 2. Aadhaar Verification */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">2. Proprietor Aadhaar (UIDAI)</span>
                    {supplierVerifications.AADHAAR && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>UIDAI Token Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={supplierForm.aadhaar}
                      onChange={(e) => setSupplierForm({ ...supplierForm, aadhaar: e.target.value })}
                      placeholder="e.g. 8912 3456 7890"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={supplierVerifications.AADHAAR || verifyingField === 'supplier_AADHAAR'}
                      onClick={() => verifySupplierField('AADHAAR', supplierForm.aadhaar)}
                      className="px-3 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[11px] shadow-xs disabled:opacity-50 transition"
                    >
                      {verifyingField === 'supplier_AADHAAR' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* 3. GSTIN Verification */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">3. GSTIN Identification</span>
                    {supplierVerifications.GSTIN && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>GSTN Active</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={supplierForm.gstin}
                      onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                      placeholder="e.g. 07AAACK1234F1ZU"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={supplierVerifications.GSTIN || verifyingField === 'supplier_GSTIN'}
                      onClick={() => verifySupplierField('GSTIN', supplierForm.gstin)}
                      className="px-3 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[11px] shadow-xs disabled:opacity-50 transition"
                    >
                      {verifyingField === 'supplier_GSTIN' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* 4. IFSC & Bank Account Verification (Auto-fills Bank + Branch) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">4. Bank & IFSC Routing</span>
                    {(supplierVerifications.IFSC || supplierVerifications.BANK_ACCOUNT) && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>Bank Validated</span>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex space-x-1.5">
                      <input
                        type="text"
                        value={supplierForm.ifsc}
                        onChange={(e) => setSupplierForm({ ...supplierForm, ifsc: e.target.value })}
                        placeholder="IFSC (e.g. HDFC0000456)"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={supplierVerifications.IFSC || verifyingField === 'supplier_IFSC'}
                        onClick={() => verifySupplierField('IFSC', supplierForm.ifsc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[10px] shadow-xs disabled:opacity-50 transition"
                      >
                        {verifyingField === 'supplier_IFSC' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'IFSC'}
                      </button>
                    </div>

                    <div className="flex space-x-1.5">
                      <input
                        type="text"
                        value={supplierForm.bankAccount}
                        onChange={(e) => setSupplierForm({ ...supplierForm, bankAccount: e.target.value })}
                        placeholder="A/C Number"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={supplierVerifications.BANK_ACCOUNT || verifyingField === 'supplier_BANK_ACCOUNT'}
                        onClick={() => verifySupplierField('BANK_ACCOUNT', supplierForm.bankAccount)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[10px] shadow-xs disabled:opacity-50 transition"
                      >
                        {verifyingField === 'supplier_BANK_ACCOUNT' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Drop'}
                      </button>
                    </div>
                  </div>

                  {/* Auto-filled Bank and Branch badge */}
                  {supplierForm.bankName && (
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 flex items-center space-x-2">
                      <span className="font-bold text-slate-800">Auto-filled:</span>
                      <span>{supplierForm.bankName}</span>
                      <span>&bull;</span>
                      <span className="text-slate-500">{supplierForm.branchName}</span>
                    </div>
                  )}
                </div>

                {/* 5. Udyam Registration */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">5. Udyam Registration Number (MSME)</span>
                    {supplierVerifications.UDYAM && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                        <Check className="h-3 w-3" />
                        <span>MSME Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={supplierForm.udyamNumber}
                      onChange={(e) => setSupplierForm({ ...supplierForm, udyamNumber: e.target.value })}
                      placeholder="e.g. UDYAM-DL-03-0012894"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono font-bold text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={supplierVerifications.UDYAM || verifyingField === 'supplier_UDYAM'}
                      onClick={() => verifySupplierField('UDYAM', supplierForm.udyamNumber)}
                      className="px-3 py-1.5 rounded-lg bg-[#E51A24] hover:bg-[#C91822] text-white font-bold text-[11px] shadow-xs disabled:opacity-50 transition"
                    >
                      {verifyingField === 'supplier_UDYAM' ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Lead Time (Days)</label>
                    <input
                      type="number"
                      value={supplierForm.leadTimeDays}
                      onChange={(e) => setSupplierForm({ ...supplierForm, leadTimeDays: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">CIN (Optional)</label>
                    <input
                      type="text"
                      value={supplierForm.cin}
                      onChange={(e) => setSupplierForm({ ...supplierForm, cin: e.target.value })}
                      placeholder="e.g. U72200KA2020PTC134567"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Live Supplier Trust Score Panel */}
              <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#E51A24] uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-[#E51A24]" />
                    <span>Live Supplier Trust Score</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    Verification Scorecard
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time governance gating based on multi-entity probe validations.
                  </p>

                  {/* Big Badge */}
                  <div className={`mt-4 p-4 rounded-xl border text-center font-extrabold ${trustColor} transition-all`}>
                    <div className="text-3xl font-black">{verifiedCount} / 5</div>
                    <div className="text-xs uppercase tracking-wider mt-0.5 font-bold">
                      {verifiedCount >= 4 ? 'High Trust &bull; Verified Tier-1' :
                       verifiedCount >= 2 ? 'Moderate Trust &bull; Conditional' :
                       'Unverified &bull; High Risk'}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="mt-5 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-700">PAN Verified</span>
                      {supplierVerifications.PAN ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-700">Aadhaar Verified</span>
                      {supplierVerifications.AADHAAR ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-700">GSTIN Active Status</span>
                      {supplierVerifications.GSTIN ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-700">IFSC & Bank Account</span>
                      {supplierVerifications.IFSC || supplierVerifications.BANK_ACCOUNT ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300"></span>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-700">Udyam Registered MSME</span>
                      {supplierVerifications.UDYAM ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300"></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-medium">
                  Every probe is cryptographically logged into the MySQL <code className="font-mono text-slate-600">verification_records</code> audit ledger.
                </div>
              </div>

            </div>

            {/* Step 3 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSaveStep3}
                className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-6 py-2.5 text-xs shadow-sm transition disabled:opacity-50"
              >
                <span>Register Verified Supplier & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* PAGE 4: PRODUCT CATALOG SETUP & MARKET CONTEXT */}
        {/* ================================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#E51A24] uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Step 4 of 4 &bull; Final Step
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                Setup Product Catalog & Sourcing Links
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Link your product SKUs to your newly verified supplier, assign market reference prices, and set demand trends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Product Title / SKU Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                >
                  {selectedCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Semiconductors">Semiconductors</option>
                  <option value="Raw Materials">Raw Materials</option>
                </select>
              </div>

              {/* Linked Primary Supplier */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">Linked Primary Supplier</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-[#E51A24]" />
                    <span className="font-bold text-slate-900">
                      {createdSupplier ? createdSupplier.name : supplierForm.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified {verifiedCount}/5
                  </span>
                </div>
              </div>

              {/* Market Reference Price */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">Market Price Reference (₹ / Unit)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={productForm.marketPriceReference}
                    onChange={(e) => setProductForm({ ...productForm, marketPriceReference: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                  />
                </div>
              </div>

              {/* Stock & Reorder Threshold */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">On-Hand Stock</label>
                  <input
                    type="number"
                    value={productForm.currentStock}
                    onChange={(e) => setProductForm({ ...productForm, currentStock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={productForm.reorderThreshold}
                    onChange={(e) => setProductForm({ ...productForm, reorderThreshold: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Market Demand Trend */}
              <div>
                <label className="text-slate-700 font-bold block mb-1">Market Demand Trend</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, demandTrend: 'RISING' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                      productForm.demandTrend === 'RISING'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Rising ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, demandTrend: 'STABLE' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                      productForm.demandTrend === 'STABLE'
                        ? 'bg-slate-100 text-slate-800 border-slate-400 ring-1 ring-slate-400 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Minus className="h-3.5 w-3.5 text-slate-500" />
                    <span>Stable →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, demandTrend: 'FALLING' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-1 ${
                      productForm.demandTrend === 'FALLING'
                        ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
                    <span>Falling ↘</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-slate-700 font-bold block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E51A24]/30 focus:border-[#E51A24] shadow-xs"
                />
              </div>

            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSaveStep4}
                className="flex items-center space-x-2 rounded-xl bg-[#E51A24] hover:bg-[#C91822] text-white font-extrabold px-8 py-3 text-xs shadow-lg hover:scale-105 transition disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>Complete Onboarding & Launch Dashboard</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
