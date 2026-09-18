export const MOCK_SUMMARY = {
  totalProducts: 5,
  criticalRisks: 1,
  highRisks: 1,
  mediumRisks: 1,
  lowRisks: 2,
  activeSuppliers: 4,
  disruptedSuppliers: 1,
  averageRunwayDays: 20.2
};

export const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: 'Apex Microelectronics Corp',
    contactEmail: 'procurement@apex-micro.tw',
    phone: '+886-2-2883-9100',
    region: 'Hsinchu, Taiwan',
    reliabilityScore: 0.94,
    leadTimeDays: 12,
    status: 'ACTIVE',
    trustScore: 94.0
  },
  {
    id: 2,
    name: 'Bavaria Precision Sensors GmbH',
    contactEmail: 'orders@bavaria-sensors.de',
    phone: '+49-89-636-00',
    region: 'Munich, Germany',
    reliabilityScore: 0.97,
    leadTimeDays: 18,
    status: 'ACTIVE',
    trustScore: 97.0
  },
  {
    id: 3,
    name: 'Shenzhen Opto-Tech Logistics',
    contactEmail: 'sales@shenzhen-opto.cn',
    phone: '+86-755-8321-4400',
    region: 'Shenzhen, China',
    reliabilityScore: 0.78,
    leadTimeDays: 24,
    status: 'DISRUPTED',
    trustScore: 65.0
  },
  {
    id: 4,
    name: 'Saigon Power Components',
    contactEmail: 'b2b@saigon-power.vn',
    phone: '+84-28-3829-5000',
    region: 'Ho Chi Minh City, Vietnam',
    reliabilityScore: 0.90,
    leadTimeDays: 14,
    status: 'ACTIVE',
    trustScore: 90.0
  },
  {
    id: 5,
    name: 'Nordic Titanium Works AB',
    contactEmail: 'contracts@nordic-titanium.se',
    phone: '+46-8-123-4567',
    region: 'Stockholm, Sweden',
    reliabilityScore: 0.98,
    leadTimeDays: 10,
    status: 'ACTIVE',
    trustScore: 98.0
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'AI Neural Co-Processor X9',
    category: 'Semiconductors',
    description: 'High-density 4nm tensor chip for edge robotics and autonomous systems.',
    imageBase64: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
    launchDate: '2024-03-15',
    currentStock: 115,
    recentUsage: [22, 25, 24, 26, 28, 24, 23],
    reorderThreshold: 200,
    primarySupplierId: 3,
    alternateSupplierIds: [1, 4]
  },
  {
    id: 'prod-2',
    name: 'EV Battery Pack Cell 4680',
    category: 'Automotive Energy',
    description: 'High-nickel cylindrical lithium-ion power cell with dry electrode tech.',
    imageBase64: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=500&auto=format&fit=crop&q=60',
    launchDate: '2024-01-10',
    currentStock: 240,
    recentUsage: [35, 38, 40, 36, 42, 39, 38],
    reorderThreshold: 300,
    primarySupplierId: 4,
    alternateSupplierIds: [1]
  },
  {
    id: 'prod-3',
    name: 'MEMS Pressure Transducer PT-20',
    category: 'Industrial Sensors',
    description: 'Ceramic piezoresistive sensor for aerospace fuel injection telemetry.',
    imageBase64: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    launchDate: '2023-11-20',
    currentStock: 410,
    recentUsage: [15, 16, 14, 18, 17, 15, 16],
    reorderThreshold: 250,
    primarySupplierId: 2,
    alternateSupplierIds: [5]
  },
  {
    id: 'prod-4',
    name: 'Titanium Surgical Bone Screws 3.5mm',
    category: 'Medical Hardware',
    description: 'Biocompatible Grade 5 titanium orthopedic self-tapping osteosynthesis screws.',
    imageBase64: 'https://images.unsplash.com/photo-1583912267670-6575ad362e4a?w=500&auto=format&fit=crop&q=60',
    launchDate: '2023-08-05',
    currentStock: 580,
    recentUsage: [12, 14, 13, 11, 15, 14, 12],
    reorderThreshold: 150,
    primarySupplierId: 5,
    alternateSupplierIds: [2]
  },
  {
    id: 'prod-5',
    name: 'Optical Fiber Transceiver 100G QSFP28',
    category: 'Networking',
    description: 'Single-mode 1310nm CWDM4 optical transceiver module for data centers.',
    imageBase64: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=60',
    launchDate: '2024-02-01',
    currentStock: 820,
    recentUsage: [18, 20, 19, 22, 21, 19, 20],
    reorderThreshold: 200,
    primarySupplierId: 1,
    alternateSupplierIds: [4]
  }
];

export const MOCK_RISKS = [
  {
    id: 101,
    productId: 'prod-1',
    productName: 'AI Neural Co-Processor X9',
    severity: 'CRITICAL',
    daysUntilStockout: 3.9,
    supplierId: 3,
    supplierName: 'Shenzhen Opto-Tech Logistics',
    supplierLeadTimeDays: 24,
    averageDailyUsage: 24.6,
    reason: 'PRIMARY SUPPLIER DISRUPTED: Factory stoppage triggers immediate stockout threat.',
    aiRecommendation: 'Divert replenishment orders to backup supplier Apex Microelectronics immediately.',
    actionRecommended: 'SWITCH_SUPPLIER_AND_EXPEDITE',
    status: 'ACTIVE'
  },
  {
    id: 102,
    productId: 'prod-2',
    productName: 'EV Battery Pack Cell 4680',
    severity: 'HIGH',
    daysUntilStockout: 5.2,
    supplierId: 4,
    supplierName: 'Saigon Power Components',
    supplierLeadTimeDays: 14,
    averageDailyUsage: 38.3,
    reason: 'DEMAND SURGE & LEAD TIME GAP: Consumption spiked 28% while lead time is 14 days.',
    aiRecommendation: 'Authorize split air-freight expedited lot to cover 5-day deficit.',
    actionRecommended: 'EXPEDITE_AIR_FREIGHT',
    status: 'ACTIVE'
  },
  {
    id: 103,
    productId: 'prod-3',
    productName: 'MEMS Pressure Transducer PT-20',
    severity: 'MEDIUM',
    daysUntilStockout: 21.6,
    supplierId: 2,
    supplierName: 'Bavaria Precision Sensors GmbH',
    supplierLeadTimeDays: 18,
    averageDailyUsage: 15.8,
    reason: 'STOCK DECAY: Lead time approaching runway threshold within 3 weeks.',
    aiRecommendation: 'Issue automated standard purchase order of 250 units.',
    actionRecommended: 'ISSUE_PURCHASE_ORDER',
    status: 'ACTIVE'
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: 201,
    supplierId: 3,
    supplierName: 'Shenzhen Opto-Tech Logistics',
    supplierEmail: 'ops@opto-tech.cn',
    threadSubject: 'Urgent: Maintenance Delay & Allocation Inquiry',
    productName: 'AI Neural Co-Processor X9',
    status: 'URGENT',
    messages: [
      {
        id: 'msg-201-1',
        sender: 'SUPPLYGUARD_AI',
        senderName: 'SupplyGuard AI Agent',
        text: 'Automated inquiry: Factory maintenance status and line restart verification requested for AI Neural Co-Processor X9.',
        body: 'Automated inquiry: Factory maintenance status and line restart verification requested for AI Neural Co-Processor X9.',
        deliveryStatus: 'DELIVERED',
        timestamp: '2 hours ago'
      },
      {
        id: 'msg-201-2',
        sender: 'SUPPLIER',
        senderName: 'Shenzhen Opto-Tech Logistics',
        text: 'Inspection ongoing. Factory line estimated to resume partial output in 10-14 days. Priority air shipments can be arranged.',
        body: 'Inspection ongoing. Factory line estimated to resume partial output in 10-14 days. Priority air shipments can be arranged.',
        deliveryStatus: 'RECEIVED',
        timestamp: '1 hour ago'
      },
      {
        id: 'msg-201-3',
        sender: 'SUPPLYGUARD_AI',
        senderName: 'SupplyGuard Autonomous Agent',
        text: 'Draft PO #PO-8821: Requesting priority allocation of 350 units at +8% premium to prevent stockout.',
        body: 'Draft PO #PO-8821: Requesting priority allocation of 350 units at +8% premium to prevent stockout.',
        deliveryStatus: 'PENDING_APPROVAL',
        timestamp: '15 mins ago'
      }
    ]
  },
  {
    id: 202,
    supplierId: 1,
    supplierName: 'Apex Microelectronics Corp',
    supplierEmail: 'orders@apex-semi.com',
    threadSubject: 'Expedited Backup Allocation Request - 500 Units',
    productName: 'AI Neural Co-Processor X9',
    status: 'PENDING_QUOTE',
    messages: [
      {
        id: 'msg-202-1',
        sender: 'SUPPLYGUARD_AI',
        senderName: 'SupplyGuard Autonomous Agent',
        text: 'Request for emergency backup allocation: 500 units X9 package with priority air shipment within 7 days.',
        body: 'Request for emergency backup allocation: 500 units X9 package with priority air shipment within 7 days.',
        deliveryStatus: 'DELIVERED',
        timestamp: '30 mins ago'
      },
      {
        id: 'msg-202-2',
        sender: 'SUPPLIER',
        senderName: 'Apex Microelectronics Corp',
        text: 'Quote received: 500 units confirmed ready for air freight dispatch. Awaiting cryptographic sign-off.',
        body: 'Quote received: 500 units confirmed ready for air freight dispatch. Awaiting cryptographic sign-off.',
        deliveryStatus: 'RECEIVED',
        timestamp: '5 mins ago'
      }
    ]
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 301,
    action: 'MITIGATION_APPROVED',
    actor: 'dhanush',
    details: 'Authorized alternate supplier allocation of 500 units to Apex Microelectronics.',
    timestamp: 'Just now'
  },
  {
    id: 302,
    action: 'SUPPLIER_STATUS_CHANGED',
    actor: 'SYSTEM_WATCHDOG',
    details: 'Shenzhen Opto-Tech Logistics flagged as DISRUPTED due to logistics stoppage.',
    timestamp: '3 hours ago'
  }
];
