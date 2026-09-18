import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import LiveRiskFeed from './components/LiveRiskFeed';
import ProductCatalog from './components/ProductCatalog';
import SupplierHub from './components/SupplierHub';
import DisruptionSimulator from './components/DisruptionSimulator';
import CommunicationsInbox from './components/CommunicationsInbox';
import SupplyChainGraph from './components/SupplyChainGraph';
import AuditTrail from './components/AuditTrail';
import AIChatWidget from './components/AIChatWidget';
import MitigationModal from './components/MitigationModal';
import ProductModal from './components/ProductModal';
import SupplierModal from './components/SupplierModal';
import AuthModal from './components/AuthModal';
import BentoHomeDashboard from './components/BentoHomeDashboard';
import OnboardingFlow from './components/OnboardingFlow';
import SettingsProfile from './components/SettingsProfile';
import AuthPage from './components/AuthPage';
import apiClient from './api/apiClient';
import { createWebSocketClient } from './api/websocket';
import ToastContainer from './components/ToastContainer';
import { showToast } from './utils/toast';

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') || 'dashboard';
    } catch (e) {
      return 'dashboard';
    }
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
    } catch (e) {}
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        setActiveTabState(params.get('tab') || 'dashboard');
      } catch (e) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [summary, setSummary] = useState(null);
  const [risks, setRisks] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('supplyguard_user');
    return saved ? JSON.parse(saved) : { username: 'dhanush', role: 'ROLE_USER' };
  });

  const [activeMitigationEvent, setActiveMitigationEvent] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetailedFeed, setShowDetailedFeed] = useState(false);

  // Load all telemetry
  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [summaryRes, risksRes, productsRes, suppliersRes, convosRes, auditRes] = await Promise.all([
        apiClient.get('/risks/dashboard-summary'),
        apiClient.get('/risks'),
        apiClient.get('/products'),
        apiClient.get('/suppliers'),
        apiClient.get('/communications'),
        apiClient.get('/approvals/audit-logs'),
      ]);

      setSummary(summaryRes.data);
      setRisks(risksRes.data);
      setProducts(productsRes.data);
      setSuppliers(suppliersRes.data);
      setConversations(convosRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Welcome SwipeToast announcement on initial load
  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      showToast({
        title: 'SupplyGuard Telemetry Online',
        description: 'AI continuous inventory risk monitoring is live.',
        type: 'info',
        actionLabel: 'Check Radar',
        onAction: () => setActiveTab('dashboard'),
        duration: 7000
      });
    }, 400);
    return () => clearTimeout(welcomeTimer);
  }, []);

  // WebSocket Live Real-Time Risk Subscriptions
  useEffect(() => {
    const wsClient = createWebSocketClient((updatedRisk) => {
      console.log('[App] WebSocket Live Update received:', updatedRisk);
      setRisks((prev) => {
        const idx = prev.findIndex((r) => r.id === updatedRisk.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedRisk;
          return next;
        }
        return [updatedRisk, ...prev];
      });

      // Show interactive SwipeToast on live incoming risk update
      showToast({
        title: `Live Risk Alert: ${updatedRisk.productName || 'Inventory Alert'}`,
        description: `${updatedRisk.severity} threat — Runway: ${updatedRisk.daysUntilStockout}d`,
        type: updatedRisk.severity === 'CRITICAL' ? 'critical' : updatedRisk.severity === 'HIGH' ? 'warning' : 'info',
        actionLabel: 'Review',
        onAction: () => {
          setActiveMitigationEvent(updatedRisk);
        }
      });

      // Refresh summary to reflect changed metrics
      apiClient.get('/risks/dashboard-summary')
        .then((res) => setSummary(res.data))
        .catch(() => {});
    });

    try {
      wsClient.activate();
    } catch (e) {
      console.warn('WS activation error:', e);
    }

    return () => {
      try {
        wsClient.deactivate();
      } catch (e) {}
    };
  }, []);

  // Recalculate all deterministic risks
  const handleRecalculateAll = async () => {
    setIsRefreshing(true);
    try {
      await apiClient.post('/risks/recalculate-all');
      await fetchAllData();
    } catch (err) {
      console.error('Recalculate error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle supplier active / disrupted
  const handleToggleSupplierStatus = async (supplierId, newStatus) => {
    try {
      await apiClient.patch(`/suppliers/${supplierId}/toggle-status`, { status: newStatus });
      await fetchAllData();
      showToast({
        title: `Supplier Status Updated: ${newStatus}`,
        description: `Supplier #${supplierId} set to ${newStatus}. Telemetry updated.`,
        type: newStatus === 'DISRUPTED' ? 'warning' : 'success'
      });
    } catch (err) {
      console.error('Error toggling supplier status:', err);
    }
  };

  // Human-in-the-loop Approval / Rejection
  const handleApproveMitigation = async (payload) => {
    try {
      await apiClient.post('/approvals/action', payload, {
        params: { approvedBy: currentUser?.username || 'Operator' }
      });
      await fetchAllData();
      showToast({
        title: payload.approved ? 'Mitigation Authorized & Executed' : 'Mitigation Plan Rejected',
        description: payload.notes || (payload.approved ? 'Alternate supplier allocation sealed in audit log.' : 'Dismissed by operator.'),
        type: payload.approved ? 'success' : 'info'
      });
    } catch (err) {
      console.error('Approval submission error:', err);
    }
  };

  // Product Save / Edit
  const handleSaveProduct = async (payload) => {
    try {
      if (editingProduct) {
        await apiClient.put(`/products/${editingProduct.id}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }
      setEditingProduct(null);
      await fetchAllData();
      showToast({
        title: editingProduct ? 'Product SKU Updated' : 'New SKU Onboarded',
        description: `${payload.name} catalog specifications and runway synced.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      await fetchAllData();
      showToast({
        title: 'Product Removed',
        description: 'SKU deleted from active telemetry monitoring.',
        type: 'info'
      });
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  // Supplier Save
  const handleSaveSupplier = async (payload) => {
    try {
      await apiClient.post('/suppliers', payload);
      await fetchAllData();
      showToast({
        title: 'Supplier Registered',
        description: `${payload.name} added to supplier network directory.`,
        type: 'success'
      });
    } catch (err) {
      console.error('Save supplier error:', err);
    }
  };

  // Disruption Simulation
  const handleSimulateDisruption = async (payload) => {
    try {
      await apiClient.post('/simulator/disrupt', payload);
      await fetchAllData();
      showToast({
        title: 'Chaos Shockwave Injected',
        description: 'Disruption parameters injected. Risk engine recalculated.',
        type: 'simulation',
        actionLabel: 'View Risks',
        onAction: () => setActiveTab('dashboard')
      });
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  const handleResetSimulator = async () => {
    try {
      await apiClient.post('/simulator/reset');
      await fetchAllData();
      showToast({
        title: 'Chaos Sandbox Reset',
        description: 'All suppliers and lead times restored to nominal baseline.',
        type: 'success'
      });
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Email Outreach Actions
  const handleDraftEmailForRisk = async (event) => {
    try {
      const riskId = event.id || 1;
      await apiClient.post(`/communications/draft/${riskId}`);
      await fetchAllData();
      setActiveTab('inbox');
      showToast({
        title: 'Procurement Draft Created',
        description: `Draft prepared for ${event.supplierName || 'supplier'}. Pending sign-off.`,
        type: 'communication'
      });
    } catch (err) {
      console.error('Draft email error:', err);
      setActiveTab('inbox');
    }
  };

  const handleSendApprovedEmail = async (convoId, messageId, approvedBy) => {
    try {
      await apiClient.post(`/communications/${convoId}/send/${messageId}`, null, {
        params: { approvedBy }
      });
      await fetchAllData();
      showToast({
        title: 'PO Dispatch Authorized',
        description: `Autonomous procurement email dispatched by ${approvedBy}.`,
        type: 'communication'
      });
    } catch (err) {
      console.error('Send email error:', err);
    }
  };

  const handleSimulateSupplierReply = async (convoId, replyBody, promisedLeadTimeDays) => {
    try {
      await apiClient.post(`/communications/${convoId}/reply`, {
        replyBody,
        promisedLeadTimeDays
      });
      await fetchAllData();
      showToast({
        title: 'Supplier Webhook Ingested',
        description: `Vendor confirmed priority air freight batch in ${promisedLeadTimeDays} days.`,
        type: 'success',
        actionLabel: 'Open Inbox',
        onAction: () => setActiveTab('inbox')
      });
    } catch (err) {
      console.error('Reply ingestion error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('supplyguard_token');
    localStorage.removeItem('supplyguard_user');
    setCurrentUser(null);
    showToast({
      title: 'Signed Out Successfully',
      description: 'You have been safely signed out. Please sign in or create an account.',
      type: 'info',
      duration: 4000
    });
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center py-0 selection:bg-[#E51A24] selection:text-white bg-[#F4F6F9]">
      {/* Top Vibrant Red Talentsy Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setActiveTab(mode || 'login');
        }}
        onLogout={handleLogout}
        onRefresh={handleRecalculateAll}
        isRefreshing={isRefreshing}
        criticalCount={summary?.criticalRisks || 0}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Page Content Wrapper */}
      <div className="w-full max-w-[1780px] px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* 1. Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <BentoHomeDashboard
                  summary={summary}
                  risks={risks}
                  products={products}
                  suppliers={suppliers}
                  conversations={conversations}
                  onApproveAction={(riskId, approved, notes) =>
                    handleApproveMitigation({ riskEventId: riskId, approved, notes })
                  }
                  onOpenMitigationModal={(event) => setActiveMitigationEvent(event)}
                  onOpenDraftEmail={handleDraftEmailForRisk}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onPromptChat={(promptText) => {
                    window.dispatchEvent(new CustomEvent('supplyguard-ai-prompt', { detail: promptText }));
                  }}
                  onRefresh={handleRecalculateAll}
                  isRefreshing={isRefreshing}
                  currentUser={currentUser}
                  activeTab={activeTab}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onLogout={handleLogout}
                />

                {/* Collapsible Deep-Dive Risk Feed & KPI Statistics */}
                <div className="pt-2">
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 pb-2 px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Detailed Risk Ledger & Inventory Telemetry
                    </span>
                    <button
                      onClick={() => setShowDetailedFeed(!showDetailedFeed)}
                      className="text-xs font-bold text-[#E51A24] hover:underline transition flex items-center space-x-1"
                    >
                      <span>{showDetailedFeed ? '▲ Collapse Ledger' : '▼ Expand Full Risk Ledger & Table'}</span>
                    </button>
                  </div>

                  {showDetailedFeed && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <StatsCards
                        summary={summary}
                        onFilterSeverity={(sev) => {
                          setFilterSeverity(sev);
                          setActiveTab('dashboard');
                        }}
                      />
                      <LiveRiskFeed
                        risks={risks}
                        filter={filterSeverity}
                        setFilter={setFilterSeverity}
                        onApproveAction={(riskId, approved, notes) =>
                          handleApproveMitigation({ riskEventId: riskId, approved, notes })
                        }
                        onOpenMitigationModal={(event) => setActiveMitigationEvent(event)}
                        onOpenDraftEmail={handleDraftEmailForRisk}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. Product Catalog View */}
            {activeTab === 'products' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <ProductCatalog
                  products={products}
                  onOpenAddProduct={() => {
                    setEditingProduct(null);
                    setIsProductModalOpen(true);
                  }}
                  onEditProduct={(p) => {
                    setEditingProduct(p);
                    setIsProductModalOpen(true);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            )}

            {/* 3. Supplier Hub View */}
            {activeTab === 'suppliers' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <SupplierHub
                  suppliers={suppliers}
                  onToggleStatus={handleToggleSupplierStatus}
                  onOpenAddSupplier={() => setIsSupplierModalOpen(true)}
                  onOpenDraftEmail={handleDraftEmailForRisk}
                />
              </div>
            )}

            {/* 4. Chaos Sandbox View */}
            {activeTab === 'simulator' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <DisruptionSimulator
                  suppliers={suppliers}
                  products={products}
                  onSimulate={handleSimulateDisruption}
                  onReset={handleResetSimulator}
                />
              </div>
            )}

            {/* 5. Supplier Mailbox View */}
            {activeTab === 'inbox' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <CommunicationsInbox
                  conversations={conversations}
                  onSendEmail={handleSendApprovedEmail}
                  onSimulateReply={handleSimulateSupplierReply}
                  currentUser={currentUser}
                />
              </div>
            )}

            {/* 6. Supply Chain Graph View */}
            {activeTab === 'graph' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <SupplyChainGraph
                  products={products}
                  suppliers={suppliers}
                  risks={risks}
                />
              </div>
            )}

            {/* 7. Audit Trail & Logs View */}
            {activeTab === 'audit' && (
              <div className="rounded-2xl border border-slate-200/80 bg-white text-slate-900 p-6 lg:p-7 shadow-sm min-h-[700px]">
                <AuditTrail auditLogs={auditLogs} />
              </div>
            )}

            {/* 8. Settings & Profile View */}
            {activeTab === 'settings' && (
              <SettingsProfile
                currentUser={currentUser}
                onUpdateUser={(updated) => {
                  setCurrentUser(updated);
                  localStorage.setItem('supplyguard_user', JSON.stringify(updated));
                }}
                onLogout={handleLogout}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                showToast={showToast}
              />
            )}

            {/* 9. Dedicated Full-Page Login & Signup */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <AuthPage
                initialMode={activeTab === 'signup' ? 'signup' : 'login'}
                onAuthSuccess={(user) => {
                  setCurrentUser(user);
                  setActiveTab('dashboard');
                  if (!user.onboardingCompleted) {
                    setIsOnboardingOpen(true);
                  }
                }}
                onNavigateDashboard={() => setActiveTab('dashboard')}
                showToast={showToast}
              />
            )}

          </main>
        </div>
      </div>

      {/* Site-Wide Floating AI Assistant */}
      <AIChatWidget />

      {/* Human-in-the-Loop Mitigation Modal */}
      {activeMitigationEvent && (
        <MitigationModal
          event={activeMitigationEvent}
          suppliers={suppliers}
          onClose={() => setActiveMitigationEvent(null)}
          onApprove={handleApproveMitigation}
        />
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <ProductModal
          product={editingProduct}
          suppliers={suppliers}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Supplier Add Modal */}
      {isSupplierModalOpen && (
        <SupplierModal
          onClose={() => setIsSupplierModalOpen(false)}
          onSave={handleSaveSupplier}
        />
      )}

      {/* Auth Modal (Sign In & Sign Up) */}
      {isAuthModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            showToast({
              title: `Welcome, ${user.fullName || user.username}!`,
              description: 'Successfully authenticated with SupplyGuard.',
              type: 'success',
              duration: 4500
            });
            if (!user.onboardingCompleted) {
              setIsOnboardingOpen(true);
            }
          }}
        />
      )}

      {/* 4-Step Post-Login Onboarding & Verification Flow */}
      {isOnboardingOpen && (
        <OnboardingFlow
          user={currentUser}
          onComplete={() => {
            setIsOnboardingOpen(false);
            if (currentUser) {
              const updated = { ...currentUser, onboardingCompleted: true };
              setCurrentUser(updated);
              localStorage.setItem('supplyguard_user', JSON.stringify(updated));
            }
            fetchAllData();
            showToast({
              title: 'Onboarding Complete!',
              description: 'Your business profile, verified vendor, and product catalog are live.',
              type: 'success',
              duration: 6000
            });
          }}
          onDismiss={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* React Bits <SwipeToast /> Global Notification Stack */}
      <ToastContainer />
    </div>
  );
}
