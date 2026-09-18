'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  CreditCard,
  FileCheck2,
  Download,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Calendar,
  Lock,
  FileText,
  BadgeCheck
} from 'lucide-react';

export default function VerificationSuccessPage({
  onBackToVerification,
  onLaunchPlatform,
  onGoToHome,
  onShowToast
}) {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const applicationId = 'VFY-2026-9842A';
  const submissionDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('ripple_business_profile');
      if (storedProfile) setProfile(JSON.parse(storedProfile));

      const storedDocs = localStorage.getItem('ripple_verified_documents');
      if (storedDocs) setDocuments(JSON.parse(storedDocs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCopyId = () => {
    navigator.clipboard?.writeText?.(applicationId);
    setCopiedId(true);
    onShowToast?.('Application Reference ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleDownloadReceipt = () => {
    onShowToast?.('Downloading Verification Acknowledgment Receipt (PDF)...');
    // Simulated PDF download
    const element = document.createElement('a');
    const file = new Blob(
      [
        `=================================================\n` +
        `   MERCHANT VERIFICATION ACKNOWLEDGMENT RECEIPT   \n` +
        `=================================================\n` +
        `Application ID : ${applicationId}\n` +
        `Date & Time    : ${submissionDate}\n` +
        `Status         : VERIFIED & ACTIVE\n` +
        `Category       : ${profile?.category || documents?.category || 'Retail'}\n` +
        `Scale          : ${profile?.scale || documents?.scale || 'Growth'}\n` +
        `\nVERIFIED DOCUMENTS:\n` +
        `- PAN Card     : ${documents?.documents?.pan?.number || 'ABCDE1234F'} (Verified)\n` +
        `- Aadhaar Card : ${documents?.documents?.aadhar?.number || 'XXXX-XXXX-4891'} (Verified)\n` +
        `- Bank Account : IFSC ${documents?.documents?.bank?.ifsc || 'HDFC0001234'} (Verified)\n` +
        `=================================================\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Verification_Receipt_${applicationId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categoryName =
    profile?.category ||
    (profile?.categories && profile.categories[0]) ||
    documents?.category ||
    'Retail';

  const scaleName = profile?.business_scale || documents?.scale || 'Growth Tier';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        background: '#ffffff',
        color: '#0f172a',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Top Header Navigation */}
      <header
        style={{
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo & Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#ff6200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(255, 98, 0, 0.25)'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '17px', letterSpacing: '-0.02em', color: '#0f172a' }}>
                  Merchant Hub
                </span>
                <span
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}
                >
                  KYC Verified
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Onboarding &gt; Documents &gt; <span style={{ color: '#0f172a', fontWeight: '500' }}>Approval Summary</span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBackToVerification}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#475569',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={14} />
              <span>Review Docs</span>
            </button>

            <button
              onClick={onGoToHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#0f172a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
              }}
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main
        style={{
          flex: 1,
          maxWidth: '1040px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px 80px',
          boxSizing: 'border-box'
        }}
      >
        {/* Verification Success Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '36px 32px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle accent bar at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={32} strokeWidth={2.2} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h1
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Documents Submitted Successfully
                  </h1>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '14.5px',
                    color: '#64748b',
                    margin: '0 0 16px 0',
                    lineHeight: 1.5,
                    maxWidth: '580px'
                  }}
                >
                  Your business documents, bank authentication, and regulatory credentials have been securely stored. Your merchant profile is active.
                </p>

                {/* Reference ID and Timestamp pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    fontSize: '13px'
                  }}
                >
                  <div
                    onClick={handleCopyId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#334155',
                      fontWeight: '500'
                    }}
                    title="Click to copy Application ID"
                  >
                    <span style={{ color: '#94a3b8' }}>Ref ID:</span>
                    <code style={{ fontWeight: '600', color: '#0f172a' }}>{applicationId}</code>
                    {copiedId ? (
                      <Check size={14} style={{ color: '#10b981' }} />
                    ) : (
                      <Copy size={14} style={{ color: '#94a3b8' }} />
                    )}
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#64748b'
                    }}
                  >
                    <Calendar size={14} />
                    <span>Submitted {submissionDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick download certificate button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={handleDownloadReceipt}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '13.5px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Download size={16} />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs (Overview / Documents / Payout Setup) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '28px',
            paddingBottom: '2px'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeTab === 'overview' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'overview' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            Overview & Verification
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: activeTab === 'documents' ? '#0f172a' : '#64748b',
              borderBottom: activeTab === 'documents' ? '2px solid #0f172a' : '2px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            Uploaded Documents (3/3)
          </button>
        </div>

        {/* Tab 1: Overview & Grid */}
        {activeTab === 'overview' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Card 1: Verified Document Summary */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f172a'
                    }}
                  >
                    <FileCheck2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                      Verified Documents
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                      3 credentials uploaded
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#15803d',
                    background: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  3/3 Complete
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Bank / IFSC */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={18} style={{ color: '#0284c7' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                        Bank Passbook / Cheque
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {documents?.documents?.bank?.fileName || 'cancelled_cheque.pdf'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                    ✓ Verified
                  </span>
                </div>

                {/* PAN Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={18} style={{ color: '#ff6200' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                        Permanent Account Number (PAN)
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {documents?.documents?.pan?.fileName || 'pan_card.jpg'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                    ✓ Verified
                  </span>
                </div>

                {/* Aadhaar Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Lock size={18} style={{ color: '#8b5cf6' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                        Aadhaar Identity
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {documents?.documents?.aadhar?.fileName || 'aadhar_card.pdf'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                    ✓ Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Business Profile & Tier */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f172a'
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                      Business Profile
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                      Merchant parameters
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#2563eb',
                    background: '#eff6ff',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Standard Tier
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Selected Category</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                    {categoryName}
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Operational Scale</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                    {scaleName}
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Payout Settlement</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a' }}>
                    T+1 Automated
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Documents List */}
        {activeTab === 'documents' && (
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                Stored Credentials
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                All document cryptographic signatures and timestamps stored on-record.
              </p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Document</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>File Attached</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 8px', fontWeight: '600' }}>Verification Date</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', fontWeight: '500', color: '#0f172a' }}>Bank Cheque / Passbook</td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{documents?.documents?.bank?.fileName || 'cancelled_cheque.pdf'}</td>
                  <td style={{ padding: '14px 8px' }}><span style={{ color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '11.5px' }}>Approved</span></td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{submissionDate}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 8px', fontWeight: '500', color: '#0f172a' }}>Permanent Account Number (PAN)</td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{documents?.documents?.pan?.fileName || 'pan_card.jpg'}</td>
                  <td style={{ padding: '14px 8px' }}><span style={{ color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '11.5px' }}>Approved</span></td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{submissionDate}</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 8px', fontWeight: '500', color: '#0f172a' }}>Aadhaar Identity Card</td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{documents?.documents?.aadhar?.fileName || 'aadhar_card.pdf'}</td>
                  <td style={{ padding: '14px 8px' }}><span style={{ color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '11.5px' }}>Approved</span></td>
                  <td style={{ padding: '14px 8px', color: '#64748b' }}>{submissionDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom CTA Card */}
        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
              Ready to explore your dashboard?
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Your account has full access to invoices, customer payment links, and live transactions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBackToVerification}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Modify Documents
            </button>

            {onLaunchPlatform && (
              <button
                onClick={onLaunchPlatform}
                style={{
                  background: '#E51A24',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(229, 26, 36, 0.35)'
                }}
              >
                <span>Launch SupplyGuard Platform</span>
                <ArrowRight size={15} />
              </button>
            )}

            <button
              onClick={onGoToHome}
              style={{
                background: '#0f172a',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: '600',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
