export const MOCK_SUMMARY = {
  activeDisruptions: 2,
  highRiskSuppliers: 3,
  pendingHumanApprovals: 1,
  autonomousResolutions24h: 14,
  healthScore: 86
};

export const MOCK_RISKS = [
  {
    id: 'risk-1',
    supplierName: 'Shenzhen Microelectronics Co.',
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW',
    impactScore: 92,
    predictedDaysUntilStockout: 4,
    aiRecommendation: 'Activate alternative supplier in Malaysia; autonomous voice check dispatched.',
    timestamp: '2026-09-18T18:30:00Z'
  },
  {
    id: 'risk-2',
    supplierName: 'Hamburg Logistics GmbH',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    impactScore: 78,
    predictedDaysUntilStockout: 7,
    aiRecommendation: 'Port congestion detected. Reroute air freight option.',
    timestamp: '2026-09-18T17:15:00Z'
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'High-Bandwidth Memory (HBM3e)',
    category: 'Semiconductors',
    currentStock: 450,
    reorderThreshold: 300,
    averageDailyUsage: 35,
    daysUntilStockout: 12,
    primarySupplierName: 'SK Hynix (Korea)',
    primarySupplierLeadTime: 21,
    primarySupplierStatus: 'ACTIVE',
    recentUsage: [32, 38, 34, 40, 36, 35, 33]
  },
  {
    id: 'prod-2',
    name: 'Ceramic Substrate Capacitors 0402',
    category: 'Passive Components',
    currentStock: 120,
    reorderThreshold: 200,
    averageDailyUsage: 25,
    daysUntilStockout: 4,
    primarySupplierName: 'Murata Manufacturing',
    primarySupplierLeadTime: 14,
    primarySupplierStatus: 'DISRUPTED',
    recentUsage: [22, 28, 24, 25, 26, 27, 25]
  }
];

export const MOCK_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Murata Manufacturing',
    country: 'Japan',
    leadTimeDays: 14,
    reliabilityScore: 94,
    status: 'DISRUPTED',
    contactPhone: '+81-3-1234-5678',
    contactEmail: 'orders@murata.co.jp'
  },
  {
    id: 'sup-2',
    name: 'TDK Electronics India',
    country: 'India',
    leadTimeDays: 7,
    reliabilityScore: 91,
    status: 'ACTIVE',
    contactPhone: '+919876543210',
    contactEmail: 'sales.india@tdk.com'
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    supplierName: 'TDK Electronics India',
    channel: 'PHONE_VOICE',
    status: 'COMPLETED',
    summary: 'Verified ready stock of 250 units at $41.20/unit with 5-day dispatch.',
    timestamp: '2026-09-18T19:00:00Z'
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'audit-1',
    action: 'ALTERNATIVE_SUPPLIER_APPROVED',
    details: 'Approved TDK Electronics India for Ceramic Substrate Capacitors.',
    performedBy: 'Autonomous AI Engine (Vapi Voice Verification)',
    timestamp: '2026-09-18T19:05:00Z'
  }
];
