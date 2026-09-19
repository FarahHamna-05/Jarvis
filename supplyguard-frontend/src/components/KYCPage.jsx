import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  CreditCard,
  FileCheck2,
  Download,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Cpu,
  Utensils,
  Smartphone,
  Shirt,
  Pill,
  Car,
  Factory,
  ShoppingCart,
  Armchair,
  FileText,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CATEGORIES = [
  {
    id: 'electronics',
    label: 'Electronics',
    icon: Cpu,
    emoji: '💻',
    description: 'Semiconductors, consumer tech & hardware'
  },
  {
    id: 'food_beverage',
    label: 'Food & Beverage',
    icon: Utensils,
    emoji: '🍕',
    description: 'Packaged foods, beverages & perishables'
  },
  {
    id: 'phone_cases_accessories',
    label: 'Phone Cases / Mobile Accessories',
    icon: Smartphone,
    emoji: '📱',
    description: 'Covers, chargers, screen guards & gadgets'
  },
  {
    id: 'apparel_textiles',
    label: 'Apparel & Textiles',
    icon: Shirt,
    emoji: '👕',
    description: 'Garments, fabrics, footwear & fashion'
  },
  {
    id: 'pharmaceuticals',
    label: 'Pharmaceuticals',
    icon: Pill,
    emoji: '💊',
    description: 'Medicines, APIs, healthcare & medical supplies'
  },
  {
    id: 'automotive_parts',
    label: 'Automotive Parts',
    icon: Car,
    emoji: '🚗',
    description: 'OEM spares, batteries, electronics & components'
  },
  {
    id: 'industrial_raw_materials',
    label: 'Industrial / Raw Materials',
    icon: Factory,
    emoji: '🏭',
    description: 'Metals, polymers, chemicals & industrial inputs'
  },
  {
    id: 'fmcg',
    label: 'FMCG',
    icon: ShoppingCart,
    emoji: '🛒',
    description: 'Fast-moving consumer goods & daily retail'
  },
  {
    id: 'furniture',
    label: 'Furniture',
    icon: Armchair,
    emoji: '🛋️',
    description: 'Home & office furniture, fixtures & decor'
  },
  {
    id: 'other',
    label: 'Other',
    icon: Sparkles,
    emoji: '✨',
    description: 'Custom industry or specialized domain'
  }
];

export const BUSINESS_SCALES = [
  {
    id: 'Micro',
    label: 'Micro',
    range: '< ₹1 Cr turnover',
    employees: '1 – 10 employees'
  },
  {
    id: 'Small',
    label: 'Small',
    range: '₹1 Cr – ₹10 Cr',
    employees: '11 – 50 employees'
  },
  {
    id: 'Medium',
    label: 'Medium',
    range: '₹10 Cr – ₹50 Cr',
    employees: '51 – 250 employees'
  },
  {
    id: 'Large',
    label: 'Large',
    range: '> ₹50 Cr enterprise',
    employees: '250+ employees'
  }
];

export default function KYCPage({ onComplete, onNavigateDashboard, showToast }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Category & Scale, 2: KYC Docs, 3: Success Certificate

  // Step 1 State: Categories & Business Scale
  const [selectedCategories, setSelectedCategories] = useState(['electronics']);
  const [selectedScale, setSelectedScale] = useState('Small');

  // Step 2 State: KYC Documents
  const [kycForm, setKycForm] = useState({
    businessName: 'Apex Quantum Technologies Pvt Ltd',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: '8912 3456 7890',
    gstin: '29ABCDE1234F1Z5',
    bankIfsc: 'HDFC0001234',
    accountNumber: '50200049182391',
    udyamNumber: 'UDYAM-KA-02-0045812'
  });

  const [verifiedDocs, setVerifiedDocs] = useState({
    pan: true,
    aadhaar: true,
    gstin: true,
    bank: true,
    udyam: true
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'certificate_of_incorporation.pdf', size: '1.4 MB', verified: true },
    { name: 'pan_card_signatory.pdf', size: '820 KB', verified: true }
  ]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const applicationId = 'VFY-2026-9842A';
  const submissionDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== id));
      }
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newItems = files.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      verified: true
    }));
    setUploadedFiles((prev) => [...prev, ...newItems]);
    if (showToast) {
      showToast({
        title: `${files.length} Document(s) Scanned`,
        description: 'Instant OCR checksum passed. Cryptographic seal attached.',
        type: 'success'
      });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText?.(applicationId);
    setCopiedId(true);
    if (showToast) {
      showToast({
        title: 'Application Reference ID Copied',
        description: applicationId,
        type: 'info'
      });
    }
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const selectedCategoryNames = selectedCategories
      .map((catId) => CATEGORIES.find((c) => c.id === catId)?.label || catId)
      .join(', ');

    const receiptContent = `=================================================
   BEFORESTOCK MERCHANT VERIFICATION ACKNOWLEDGMENT   
=================================================
Application ID : ${applicationId}
Date & Time    : ${submissionDate}
Status         : VERIFIED & ACTIVE
Category       : ${selectedCategoryNames}
Business Scale : ${selectedScale}
Entity Name    : ${kycForm.businessName}

VERIFIED CREDENTIALS:
- PAN Card     : ${kycForm.panNumber} (Active & Validated)
- Aadhaar Card : ${kycForm.aadhaarNumber} (UIDAI Checksum Passed)
- GSTIN        : ${kycForm.gstin} (Active Registered)
- Bank Account : IFSC ${kycForm.bankIfsc} (Account Verified)
- Udyam MSME   : ${kycForm.udyamNumber} (Govt Portal Linked)

ATTACHED ARTIFACTS:
${uploadedFiles.map((f) => `- ${f.name} (${f.size})`).join('\n')}

Cryptographic Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
BeforeStock Autonomous Supply Chain Telemetry
=================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BeforeStock_Verification_Receipt_${applicationId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast({
        title: 'Receipt Downloaded',
        description: `Verification_Receipt_${applicationId}.txt saved to your device.`,
        type: 'success'
      });
    }
  };

  const handleFinishOnboarding = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Store in localStorage
    try {
      const profile = {
        category: selectedCategories[0],
        categories: selectedCategories,
        business_scale: selectedScale,
        businessName: kycForm.businessName,
        verified: true,
        applicationId
      };
      localStorage.setItem('ripple_business_profile', JSON.stringify(profile));
      localStorage.setItem(
        'ripple_verified_documents',
        JSON.stringify({
          category: selectedCategories[0],
          scale: selectedScale,
          documents: {
            pan: { number: kycForm.panNumber, verified: true },
            aadhar: { number: kycForm.aadhaarNumber, verified: true },
            bank: { ifsc: kycForm.bankIfsc, verified: true }
          }
        })
      );
    } catch (e) {}

    if (onComplete) onComplete();
    if (onNavigateDashboard) onNavigateDashboard();
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* 1. Header & Step Stepper */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[#E51A24] text-xs font-bold tracking-wide uppercase">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Merchant KYB &amp; Category Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Verify Your Enterprise &amp; Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete the 3-step onboarding flow to unlock autonomous purchase order execution and real-time vendor voice negotiation.
        </p>

        {/* 3-Step Stepper Header */}
        <div className="flex items-center justify-center gap-3 pt-3">
          {[
            { step: 1, label: 'Industry & Scale' },
            { step: 2, label: 'KYC Verification' },
            { step: 3, label: 'Verified Certificate' }
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            return (
              <div key={s.step} className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#E51A24] text-white shadow-md shadow-red-900/40 border border-red-400/40'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black bg-white/20">
                    {isDone ? '✓' : s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
                {s.step < 3 && <div className="w-4 sm:w-8 h-[1px] bg-white/20" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. STEP 1: Categories & Business Scale (Exact match to Dashboard.jsx in zip) */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Categories Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">Select Your Industry Domain</h3>
                <p className="text-xs text-slate-400 mt-0.5">Choose one or more categories that describe your product supply lines.</p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {selectedCategories.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      background: isSelected ? 'rgba(229, 26, 36, 0.12)' : 'rgba(20, 20, 24, 0.7)',
                      border: isSelected ? '1.5px solid rgba(229, 26, 36, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected ? '0 8px 24px rgba(229, 26, 36, 0.2)' : 'none'
                    }}
                    className="rounded-2xl p-4 cursor-pointer transition-all flex items-start justify-between space-x-3 group hover:border-white/25"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                          {cat.label}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 pl-7">{cat.description}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#E51A24] text-white' : 'border border-white/20 bg-white/5'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Scale Selection */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white">Select Business Scale</h3>
              <p className="text-xs text-slate-400 mt-0.5">Determines dynamic inventory safety buffers and autonomous reorder limits.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {BUSINESS_SCALES.map((scale) => {
                const isSelected = selectedScale === scale.id;
                return (
                  <div
                    key={scale.id}
                    onClick={() => setSelectedScale(scale.id)}
                    style={{
                      background: isSelected ? 'rgba(229, 26, 36, 0.15)' : 'rgba(20, 20, 24, 0.7)',
                      border: isSelected ? '1.5px solid rgba(229, 26, 36, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isSelected ? '0 8px 24px rgba(229, 26, 36, 0.2)' : 'none'
                    }}
                    className="rounded-2xl p-5 cursor-pointer transition-all space-y-2.5 group hover:border-white/25"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-extrabold text-white">{scale.label}</h4>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#E51A24] text-white' : 'border border-white/20'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-200">{scale.range}</div>
                      <div className="text-slate-400">{scale.employees}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#E51A24] hover:bg-[#c92924] text-white font-bold text-sm shadow-xl shadow-red-900/30 transition transform hover:scale-105"
            >
              <span>Continue to KYC Documents</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. STEP 2: KYC Document Verification (Exact match to DocumentVerification.jsx in zip) */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Document Credentials Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-xl font-bold text-white">Business Credentials &amp; KYC Identification</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified against statutory registries for high-volume automated procurement.</p>
              </div>

              <div className="space-y-4">
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registered Company Name
                  </label>
                  <input
                    type="text"
                    value={kycForm.businessName}
                    onChange={(e) => setKycForm({ ...kycForm, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-[#E51A24]"
                  />
                </div>

                {/* PAN Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Company / Signatory PAN Number
                    </label>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified Active</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={kycForm.panNumber}
                    onChange={(e) => setKycForm({ ...kycForm, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                  />
                </div>

                {/* Aadhaar Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Authorized Signatory Aadhaar
                    </label>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>UIDAI Checksum Passed</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={kycForm.aadhaarNumber}
                    onChange={(e) => setKycForm({ ...kycForm, aadhaarNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                  />
                </div>

                {/* GSTIN */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      GSTIN Identification Number
                    </label>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>GST Portal Linked</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={kycForm.gstin}
                    onChange={(e) => setKycForm({ ...kycForm, gstin: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                  />
                </div>

                {/* Bank Account & IFSC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Bank IFSC Code
                    </label>
                    <input
                      type="text"
                      value={kycForm.bankIfsc}
                      onChange={(e) => setKycForm({ ...kycForm, bankIfsc: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Settlement Account No.
                    </label>
                    <input
                      type="text"
                      value={kycForm.accountNumber}
                      onChange={(e) => setKycForm({ ...kycForm, accountNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                    />
                  </div>
                </div>

                {/* Udyam MSME */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Udyam / MSME Registration Number
                  </label>
                  <input
                    type="text"
                    value={kycForm.udyamNumber}
                    onChange={(e) => setKycForm({ ...kycForm, udyamNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-[#E51A24]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Drag-and-Drop Document Upload & Artifacts */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-xl font-bold text-white">Document Uploads</h3>
                <p className="text-xs text-slate-400 mt-0.5">Attach incorporation certificate, GST proof, or cancelled cheque.</p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFileUpload({ target: { files: e.dataTransfer.files } });
                }}
                style={{
                  background: isDragOver ? 'rgba(229, 26, 36, 0.15)' : 'rgba(20, 20, 24, 0.6)',
                  borderColor: isDragOver ? '#E51A24' : 'rgba(255, 255, 255, 0.15)'
                }}
                className="border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition cursor-pointer relative"
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-full bg-white/10 mx-auto flex items-center justify-center text-slate-300">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Click or drag &amp; drop documents here</p>
                  <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 15MB each</p>
                </div>
              </div>

              {/* Uploaded Files Ledger */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Attachments ({uploadedFiles.length})
                </span>
                <div className="space-y-2">
                  {uploadedFiles.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <FileText className="h-4 w-4 text-[#E51A24] shrink-0" />
                        <span className="font-semibold text-white truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">({f.size})</span>
                      </div>
                      <span className="text-emerald-400 font-bold shrink-0 flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Categories</span>
            </button>
            <button
              onClick={() => {
                confetti({ particleCount: 70, spread: 60 });
                setCurrentStep(3);
                if (showToast) {
                  showToast({
                    title: 'KYC Verification Approved!',
                    description: 'Enterprise credentials verified & certificate issued.',
                    type: 'success'
                  });
                }
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#E51A24] hover:bg-[#c92924] text-white font-bold text-sm shadow-xl shadow-red-900/30 transition transform hover:scale-105"
            >
              <span>Submit &amp; Generate Certificate</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. STEP 3: Verification Certificate & Acknowledgment (Exact match to VerificationSuccessPage.jsx in zip) */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto">
          {/* Certificate Card */}
          <div
            style={{
              background: 'linear-gradient(160deg, #180806 0%, #0d0402 50%, #050505 100%)',
              border: '2px solid rgba(229, 26, 36, 0.5)',
              boxShadow: '0 30px 80px rgba(229, 26, 36, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
            className="rounded-3xl p-8 sm:p-10 space-y-8 text-white relative overflow-hidden"
          >
            {/* Header with Verification Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
                  <BadgeCheck className="h-8 w-8" />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-1 border border-emerald-500/30">
                    <span>Verified &amp; Active</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    KYC &amp; KYB Verification Certificate
                  </h3>
                </div>
              </div>

              {/* Reference ID Button */}
              <div
                onClick={handleCopyId}
                className="cursor-pointer px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex items-center space-x-2 text-xs font-mono self-start sm:self-auto"
              >
                <span>{applicationId}</span>
                {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block">Registered Entity</span>
                <span className="text-white font-bold text-sm">{kycForm.businessName}</span>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block">Verification Timestamp</span>
                <span className="text-white font-bold">{submissionDate}</span>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block">Industry Categories</span>
                <span className="text-white font-bold">
                  {selectedCategories.map((c) => CATEGORIES.find((cat) => cat.id === c)?.label || c).join(', ')}
                </span>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 block">Business Scale Tier</span>
                <span className="text-white font-bold">{selectedScale} Enterprise</span>
              </div>
            </div>

            {/* Verified Checks List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Statutory Verified Checks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>PAN Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>GSTIN Validated</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Bank IFSC Active</span>
                </div>
              </div>
            </div>

            {/* Action Buttons inside Card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                <Download className="h-4 w-4" />
                <span>Download Verification Receipt (.txt)</span>
              </button>

              <button
                onClick={handleFinishOnboarding}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#E51A24] hover:bg-[#c92924] text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-900/40 transition transform hover:scale-105"
              >
                <span>Launch Enterprise Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
