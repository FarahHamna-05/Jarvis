'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'motion/react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileCheck,
  Check,
  Sparkles
} from 'lucide-react';
import './FeatureTour.css';
import { RectangleButtons } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <RectangleButtons
        variant="glassmorphism-cta"
        mode="dark"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

/* ─────────────────────────
   Typed Motion Curves (Exact from FeatureTour)
───────────────────────── */

const EASE_OUT = [0.16, 1, 0.3, 1];
const FAST_OUT = [0.22, 1, 0.36, 1];

const SPRING_ICON = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

const SPRING_BG = {
  type: 'spring',
  stiffness: 340,
  damping: 30,
  mass: 0.8,
};

/* Custom SVG Folder with Check Badge matching screenshot */
function FolderSuccessBadge() {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        position: 'absolute',
        top: '-14px',
        right: '14px',
        background: '#2563eb',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.45)',
        zIndex: 2
      }}>
        <Check size={14} strokeWidth={3.5} color="#ffffff" />
      </div>
      <svg width="64" height="52" viewBox="0 0 68 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 11C2 7.13401 5.13401 4 9 4H23.5858C25.4422 4 27.2227 4.7375 28.5355 6.05025L32.4142 9.92893C33.727 11.2417 35.5075 12 37.3639 12H59C62.866 12 66 15.134 66 19V45C66 48.866 62.866 52 59 52H9C5.13401 52 2 48.866 2 45V11Z"
          fill="#2563eb"
        />
        <path
          d="M34 22V40M34 22L27 29M34 22L41 29"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function DocumentVerification({
  onBack,
  onComplete,
  onShowToast
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Business profile selected from step 1
  const [profile] = useState(() => {
    try {
      const saved = localStorage.getItem('ripple_business_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current tour step (0: PAN, 1: Aadhaar, 2: Bank IFSC)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Uploaded files
  const [panFile, setPanFile] = useState(null);
  const [panNumber, setPanNumber] = useState('');

  const [aadharFile, setAadharFile] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('');

  const [bankFile, setBankFile] = useState(null);
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Tour steps definition
  const steps = [
    {
      id: 'pan',
      title: 'Upload PAN Card',
      subtitle: 'Tax & Entity Verification',
      description: 'Upload a clear front image or PDF of your PAN card for business tax compliance.',
      file: panFile,
      setFile: setPanFile,
      icon: panFile ? (
        <FolderSuccessBadge />
      ) : (
        <CreditCard size={44} strokeWidth={1.8} />
      ),
      accept: 'image/*,.pdf',
      docName: 'PAN Card',
      sampleName: 'pan_card_verified.pdf'
    },
    {
      id: 'aadhar',
      title: 'Upload Aadhaar Card',
      subtitle: 'Identity & Address Proof',
      description: 'Upload front and back photo or official e-Aadhaar PDF for KYC verification.',
      file: aadharFile,
      setFile: setAadharFile,
      icon: aadharFile ? (
        <FolderSuccessBadge />
      ) : (
        <ShieldCheck size={44} strokeWidth={1.8} />
      ),
      accept: 'image/*,.pdf',
      docName: 'Aadhaar Card',
      sampleName: 'aadhar_card_verified.pdf'
    },
    {
      id: 'ifsc',
      title: 'Bank & IFSC Details',
      subtitle: 'Payouts & Settlement Account',
      description: 'Upload a cancelled cheque or bank passbook copy showing account number & IFSC.',
      file: bankFile,
      setFile: setBankFile,
      icon: bankFile ? (
        <FolderSuccessBadge />
      ) : (
        <Building2 size={44} strokeWidth={1.8} />
      ),
      accept: 'image/*,.pdf',
      docName: 'Bank / IFSC Document',
      sampleName: 'cancelled_cheque.pdf'
    }
  ];

  const currentStep = steps[currentIndex];

  const goToStep = useCallback((index) => {
    setCurrentIndex((prev) => (index === prev ? prev : index));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === steps.length - 1 ? prev : prev + 1));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? prev : prev - 1));
  }, []);

  // Keyboard navigation matching FeatureTour (ArrowRight, ArrowLeft, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onBack?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onBack]);

  // Safe file open
  const triggerChooseFile = () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    } catch (err) {
      console.warn('File input trigger failed:', err);
    }
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      currentStep.setFile(file);
      onShowToast?.(`Uploaded ${file.name} for ${currentStep.docName}`);
    }
  };

  const handleFileChange = (e) => {
    if (e.target?.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      currentStep.setFile(file);
      onShowToast?.(`Uploaded ${file.name} for ${currentStep.docName}`);
      e.target.value = '';
    }
  };

  // Quick fallback attachment if OS dialog has issues
  const handleUseSample = (e) => {
    e.stopPropagation();
    currentStep.setFile({
      name: currentStep.sampleName,
      size: '1.4 MB'
    });
    onShowToast?.(`Attached verified demo for ${currentStep.docName}`);
  };

  const isAllUploaded = Boolean(panFile && aadharFile && bankFile);
  const isAnyUploaded = Boolean(panFile || aadharFile || bankFile);

  const handleSubmit = () => {
    const payload = {
      category: profile?.category || 'Retail',
      scale: profile?.scale || 'Growth',
      documents: {
        pan: {
          uploaded: Boolean(panFile),
          fileName: panFile?.name || null,
          number: panNumber.trim().toUpperCase()
        },
        aadhar: {
          uploaded: Boolean(aadharFile),
          fileName: aadharFile?.name || null,
          number: aadharNumber.trim()
        },
        bank: {
          uploaded: Boolean(bankFile),
          fileName: bankFile?.name || null,
          ifsc: ifscCode.trim().toUpperCase(),
          accountNumber: accountNumber.trim()
        }
      },
      completedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('ripple_verified_documents', JSON.stringify(payload));
      localStorage.setItem('ripple_business_profile', JSON.stringify({
        ...profile,
        verified: true,
        onboarding_step: 3
      }));
    } catch {}

    onShowToast?.('All documents verified & submitted successfully!');
    onComplete?.();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={currentStep.accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Top Bar Context (Selected Category & Scale) */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '13.5px',
            fontWeight: 650,
            color: '#475569',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <ArrowLeft size={16} />
          Back to Category
        </button>

        {profile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            padding: '6px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
          }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Profile:</span>
            <span style={{
              fontSize: '12.5px',
              fontWeight: 750,
              color: '#0f172a',
              textTransform: 'capitalize'
            }}>
              {profile.category || 'Business'} • {profile.scale || 'Standard'}
            </span>
          </div>
        )}
      </div>

      {/* Center FeatureTour Upload Card (Previous UI format from screenshot) */}
      <div
        className="flex items-center justify-center w-full"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 16,
            filter: 'blur(4px)',
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            y: 12,
          }}
          transition={{
            duration: 0.18,
            ease: EASE_OUT,
          }}
          className={`relative w-full max-w-[420px] sm:aspect-[1/1.3] min-h-[540px] sm:min-h-0 rounded-[34px] border shadow-sm p-6 sm:p-8 flex flex-col items-center overflow-hidden transition-all duration-300 bg-neutral-900 border-neutral-800 ${
            isDragOver
              ? 'border-blue-500 ring-4 ring-blue-900/30'
              : 'border-neutral-800'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Top Close Button */}
          <button
            onClick={onBack}
            aria-label="Close"
            className="absolute top-6 right-6 p-2 rounded-full transition-colors z-50 bg-neutral-800 hover:bg-neutral-700"
          >
            <X
              size={20}
              strokeWidth={3}
              className="text-white"
            />
          </button>

          {/* Main Card Body */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
            
            {/* Step Counter Tag */}
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#ff6200',
              marginBottom: '16px',
              background: 'rgba(255, 98, 0, 0.14)',
              padding: '4px 12px',
              borderRadius: '9999px'
            }}>
              Step {currentIndex + 1} of {steps.length}
            </div>

            {/* Icon Morph */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id + (currentStep.file ? '-uploaded' : '')}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: 8,
                  filter: 'blur(3px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  y: -6,
                  filter: 'blur(3px)',
                }}
                transition={{
                  duration: 0.16,
                  ease: FAST_OUT,
                }}
                className="relative flex items-center justify-center min-h-[120px]"
              >
                <motion.div
                  layoutId="tour-icon-bg"
                  transition={SPRING_BG}
                  className={`absolute w-24 h-24 rounded-3xl shadow-inner ${
                    currentStep.file
                      ? 'bg-blue-950/40 shadow-blue-900/20'
                      : 'bg-neutral-800 shadow-black/40'
                  }`}
                />

                <motion.div
                  layoutId="tour-icon"
                  transition={SPRING_ICON}
                  className="relative text-neutral-200 drop-shadow-[0_4px_16px_rgba(255,255,255,0.12)]"
                >
                  {currentStep.icon}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Content Slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentStep.id}`}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : -14,
                }}
                transition={{
                  duration: 0.16,
                  ease: EASE_OUT,
                }}
                className="space-y-2 px-4 mt-6 sm:mt-8 text-center w-full"
              >
                <h2 className="text-[24px] font-bold text-white tracking-tight">
                  {currentStep.title}
                </h2>

                <p className="text-[15px] font-medium leading-normal text-neutral-400 max-w-[320px] mx-auto">
                  {currentStep.description}
                </p>

                {/* Upload Status or Trigger */}
                <div className="pt-2 flex flex-col items-center">
                  {currentStep.file ? (
                    /* State: When file is uploaded */
                    <div className="w-full flex flex-col items-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-900/50 text-blue-300 text-xs font-semibold max-w-[280px] truncate">
                        <FileCheck size={14} />
                        <span className="truncate">{currentStep.file.name}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={triggerChooseFile}
                          className="text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          Change file
                        </button>
                        <span className="text-neutral-500">•</span>
                        <button
                          type="button"
                          onClick={() => currentStep.setFile(null)}
                          className="text-rose-400 font-semibold hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Next / Submit Button */}
                      {currentIndex < steps.length - 1 ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                          onClick={goNext}
                          className="mt-4 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <span>Next: {steps[currentIndex + 1].docName}</span>
                          <ArrowRight size={15} />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                          onClick={handleSubmit}
                          className="mt-4 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all bg-[#ff6200] text-white hover:bg-[#ea580c] shadow-md shadow-orange-500/25 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                        >
                          <span>Submit & Complete Verification</span>
                          <CheckCircle2 size={15} />
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    /* State: When file is NOT yet uploaded */
                    <div className="w-full flex flex-col items-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                        onClick={triggerChooseFile}
                        className="mt-3.5 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-colors bg-neutral-800 text-white hover:bg-neutral-700 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Upload size={15} />
                        <span>Choose File or Drag & Drop</span>
                      </motion.button>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[12px] text-neutral-400">
                          500 MB max file size • JPG, PNG, PDF
                        </span>
                        <span className="text-neutral-500">•</span>
                        <button
                          type="button"
                          onClick={handleUseSample}
                          className="text-[12px] text-orange-400 hover:text-orange-300 underline cursor-pointer font-medium"
                        >
                          Use demo file
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator (exact FeatureTour structure & spring scale) */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3" role="tablist">
            {steps.map((step, index) => {
              const isCurrent = index === currentIndex;
              const hasUploaded = Boolean(step.file);

              return (
                <button
                  key={step.id}
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Go to ${step.title}`}
                  onClick={() => goToStep(index)}
                  className="relative h-3 focus:outline-none cursor-pointer flex items-center justify-center p-1"
                >
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.25 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={`h-[12px] w-[12px] rounded-full transition-colors ${
                      isCurrent
                        ? 'bg-neutral-100 ring-2 ring-neutral-700'
                        : hasUploaded
                        ? 'bg-blue-500'
                        : 'bg-neutral-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* FeatureTour Gradient Overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-[40px] bg-linear-to-br from-white/5 via-transparent to-black/40" />
        </motion.div>
      </div>

      {/* Subtle Finish Shortcut at Bottom */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 10
      }}>
        {isAnyUploaded && (
          <button
            onClick={handleSubmit}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#ff6200',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Submit with uploaded documents ({[panFile, aadharFile, bankFile].filter(Boolean).length}/3 ready) →
          </button>
        )}
      </div>
    </div>
  );
}
