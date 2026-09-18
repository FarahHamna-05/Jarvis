import React, { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import CinematicViewer from './components/CinematicViewer';
import SwipeToast from './components/SwipeToast';
import './App.css';

const LoginPage = lazy(() => import('./components/LoginPage'));
const Pricing = lazy(() => import('./components/Pricing'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const DocumentVerification = lazy(() => import('./components/DocumentVerification'));
const VerificationSuccessPage = lazy(() => import('./components/VerificationSuccessPage'));
const SupplyGuardApp = lazy(() => import('./supplyguard/App'));
import ErrorBoundary from './supplyguard/components/ErrorBoundary';

export default function App() {
  const getInitialPage = () => {
    try {
      const p = new URLSearchParams(window.location.search).get('page');
      if (p === 'login' || p === 'signup') return 'login';
      if (p === 'pricing') return 'pricing';
      if (p === 'home' || p === 'team' || p === 'faq') return 'home';
      if (p === 'dashboard' || p === 'category' || p === 'categories' || p === 'interests') return 'dashboard';
    } catch {}
    return 'dashboard';
  };

  const getInitialStep = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('step');
      if (s) return parseInt(s, 10);
      if (params.get('tab')) return 3;
      const profile = localStorage.getItem('ripple_business_profile');
      if (profile && JSON.parse(profile)?.verified) return 3;
    } catch {}
    return 3;
  };

  const [toasts, setToasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(getInitialPage); // 'home' or 'login' or 'signup' or 'pricing' or 'category' or 'dashboard'
  const [onboardingStep, setOnboardingStep] = useState(getInitialStep);
  const [authMode, setAuthMode] = useState('login');

  const [goToFrontTrigger, setGoToFrontTrigger] = useState(0);
  const [goToTeamTrigger, setGoToTeamTrigger] = useState(0);
  const [goToFaqTrigger, setGoToFaqTrigger] = useState(0);

  const handleGoToFront = () => {
    try {
      window.history.pushState({}, '', '/?page=home');
    } catch (e) {}
    setCurrentPage('home');
    setGoToFrontTrigger((prev) => prev + 1);
  };

  const handleGoToTeam = () => {
    try {
      window.history.pushState({}, '', '/?page=home');
    } catch (e) {}
    setCurrentPage('home');
    setGoToTeamTrigger((prev) => prev + 1);
  };

  const handleGoToFaq = () => {
    try {
      window.history.pushState({}, '', '/?page=home');
    } catch (e) {}
    setCurrentPage('home');
    setGoToFaqTrigger((prev) => prev + 1);
  };

  const handleGoToPricing = () => {
    try {
      window.history.pushState({}, '', '/?page=pricing');
    } catch (e) {}
    setCurrentPage('pricing');
  };

  const showToast = (title, description = '') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, description }]);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setCurrentPage('login');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000000',
      color: '#ffffff',
      userSelect: 'none'
    }}>
      {/* 1. Fixed Top Floating Glass Pill Navbar (hidden on dashboard) */}
      {currentPage !== 'dashboard' && (
        <Navbar
          onOpenAuth={handleOpenAuth}
          onGoToTeam={handleGoToTeam}
          onGoToFront={handleGoToFront}
          onGoToFaq={handleGoToFaq}
          onGoToPricing={handleGoToPricing}
          onGoToDashboard={() => {
            try {
              window.history.pushState({}, '', '/?tab=dashboard');
            } catch (e) {}
            setCurrentPage('dashboard');
            setOnboardingStep(3);
          }}
        />
      )}

      {/* Main Home Page View */}
      {currentPage === 'home' && (
        /* 2. Fixed Browser Viewport Cinematic Transformation (Stage 1 -> 2 -> 3 -> 4) */
        <CinematicViewer onOpenAuth={handleOpenAuth} goToTeamTrigger={goToTeamTrigger} goToFrontTrigger={goToFrontTrigger} goToFaqTrigger={goToFaqTrigger} />
      )}

      {/* Lazy Suspended Route Views */}
      <ErrorBoundary onReset={() => { window.location.href = '/?page=home'; }}>
        <Suspense
          fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F4F6F9] z-50">
              <div className="w-10 h-10 border-3 border-[#E51A24] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loading SupplyGuard Platform...</p>
            </div>
          }
        >
          {/* Standalone Dedicated Pricing Page View */}
          {currentPage === 'pricing' && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1000,
                overflowY: 'auto',
                background: '#ffffff',
                paddingTop: '64px',
                boxSizing: 'border-box'
              }}
            >
              <Pricing
                onBackToHome={() => setCurrentPage('home')}
                onSelectPlan={(planName) => {
                  showToast(`Selected ${planName} plan! Redirecting to setup...`);
                  handleOpenAuth('signup');
                }}
              />
            </div>
          )}

          {/* Standalone Dedicated Login Page View */}
          {currentPage === 'login' && (
            <LoginPage
              defaultMode={authMode}
              onBackToHome={() => setCurrentPage('home')}
              onLoginSuccess={() => {
                let isVerified = false;
                try {
                  const profile = localStorage.getItem('ripple_business_profile');
                  if (profile) isVerified = Boolean(JSON.parse(profile)?.verified);
                } catch (e) {}
                setCurrentPage('dashboard');
                setOnboardingStep(isVerified ? 3 : 1);
              }}
              onSubmitSuccess={(msg) => showToast(msg)}
            />
          )}

          {/* Onboarding Flow: Step 1 (Category & Scale) -> Step 2 (Document Verification) */}
          {currentPage === 'dashboard' && onboardingStep === 1 && (
            <Dashboard
              onLogout={() => setCurrentPage('home')}
              onContinue={() => {
                setOnboardingStep(2);
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          )}

          {currentPage === 'dashboard' && onboardingStep === 2 && (
            <DocumentVerification
              onBack={() => setOnboardingStep(1)}
              onComplete={() => {
                showToast('KYC documents verified & submitted successfully! Welcome to BeforeStock.');
                try {
                  const url = new URL(window.location.href);
                  url.search = '';
                  window.history.pushState({}, '', url.pathname);
                } catch (e) {}
                setCurrentPage('home');
                setOnboardingStep(1);
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          )}

          {/* Step 3: Full-Function SupplyGuard Frontend Platform */}
          {currentPage === 'dashboard' && onboardingStep === 3 && (
            <SupplyGuardApp
              onBackToVerification={() => setOnboardingStep(2)}
              onViewCertificate={() => setOnboardingStep(4)}
              onGoToHome={() => {
                try {
                  window.history.pushState({}, '', '/?page=home');
                } catch (e) {}
                setCurrentPage('home');
                setOnboardingStep(1);
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          )}

          {/* Step 4: Verification Certificate & Acknowledgment Summary */}
          {currentPage === 'dashboard' && onboardingStep === 4 && (
            <VerificationSuccessPage
              onBackToVerification={() => setOnboardingStep(2)}
              onLaunchPlatform={() => setOnboardingStep(3)}
              onGoToHome={() => {
                try {
                  window.history.pushState({}, '', '/?page=home');
                } catch (e) {}
                setCurrentPage('home');
                setOnboardingStep(1);
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          )}
        </Suspense>
      </ErrorBoundary>

      {/* Right Side Notification Stack using React Bits SwipeToast */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 99999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <SwipeToast
              inline
              open={true}
              title={t.title}
              description={t.description}
              duration={3800}
              background="#18181b"
              color="#f4f4f5"
              fuseColor="#ff6200"
              width={356}
              radius={14}
              closeButton={true}
              fuse="bottom"
              pauseOnHover
              onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
