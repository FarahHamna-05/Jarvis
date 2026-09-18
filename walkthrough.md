# Low-Stock Automated AI Voice Sourcing Campaign & Supplier Call Connectivity

## Summary of Accomplishments
When a product's stock drops to or below the safety reorder threshold (`currentStock <= reorderThreshold` or critical runway), the system now seamlessly guides the user to the **Supplier Sourcing Campaign**, empowers one-click voice call dispatching to alternate suppliers, and autonomously initiates voice check calls in the background.

**Git Commit**: `62d39ea` (*feat: low-stock automated AI voice sourcing campaign and one-click supplier call connectivity*)  
**Repository**: [`FarahHamna-05/Jarvis`](https://github.com/FarahHamna-05/Jarvis) on branch `main`

---

## 1. What Was Implemented

### A. Backend Autonomous Voice Call Trigger on Low Stock
- **File**: [`RiskEngineService.java`](file:///c:/dhanush/project/hackathon/supplyguard-backend/src/main/java/com/supplyguard/service/RiskEngineService.java)
- Previously, autonomous Vapi AI voice calls only fired when a supplier was marked `DISRUPTED` or severity was `CRITICAL`.
- Added automated low-stock evaluation:
  ```java
  boolean isLowStock = product.getCurrentStock() != null &&
                       product.getReorderThreshold() != null &&
                       product.getCurrentStock() <= product.getReorderThreshold();
  ```
- When `isLowStock` evaluates to `true`, the risk engine asynchronously launches:
  ```java
  supplierComparisonService.checkAllSuppliers(product.getId(), neededQty);
  ```
  connecting voice calls to alternate suppliers and debouncing duplicate bursts within 10 minutes.

---

### B. Global Navigation & Deep-Linking to Sourcing Campaign
- **File**: [`App.jsx`](file:///c:/dhanush/project/hackathon/supplyguard-frontend/src/App.jsx)
- Added `selectedVoiceProduct` state and universal handler `handleOpenVoiceSourcing(productOrRisk, autoConnect)`.
- When triggered, it automatically sets the active tab to `'products'` and passes the targeted low-stock SKU directly to `ProductCatalog`.

---

### C. Direct Action CTA on Home Bento Dashboard
- **File**: [`BentoHomeDashboard.jsx`](file:///c:/dhanush/project/hackathon/supplyguard-frontend/src/components/BentoHomeDashboard.jsx)
- **Stock Gauge Banner**: When a product breaches threshold (`currentStock <= reorderThreshold`), a pulsing `Critical Low Stock Alert` banner appears with a direct link: `"Campaign & Call »"`.
- **Action CTA Bar**: Added a primary `Compare & Call Suppliers` button with phone icon next to "Execute Mitigation Plan".
- **Bottom Action Drawer**: Added a full-width `Compare & Call Suppliers` button below the swipe button.

---

### D. Live Risk Feed & Mitigation Modal Integration
- **File**: [`LiveRiskFeed.jsx`](file:///c:/dhanush/project/hackathon/supplyguard-frontend/src/components/LiveRiskFeed.jsx)
  - Added a dedicated `Compare & Call` button to each risk event card so operators can immediately investigate and call alternate vendors for that SKU.
- **File**: [`MitigationModal.jsx`](file:///c:/dhanush/project/hackathon/supplyguard-frontend/src/components/MitigationModal.jsx)
  - Added a `Compare & Call Suppliers` button in the human governance approval modal footer, allowing the operator to verify live supplier quotes and lead times before approving a switch.

---

### E. Product Catalog Deep-Link & Low-Stock Call Actions
- **File**: [`ProductCatalog.jsx`](file:///c:/dhanush/project/hackathon/supplyguard-frontend/src/components/ProductCatalog.jsx)
  - **Auto-Open Deep Link**: Added `useEffect` listening for `selectedVoiceProduct`, automatically opening the Voice Sourcing & Comparison Radar.
  - **Critical Low Stock Warning Banner**: When the modal opens for a low-stock SKU, a prominent banner warns:
    > *"Critical Low Stock Detected: Current stock (X units) has breached safety threshold (Y units). Connect voice calls to alternate suppliers to replenish inventory immediately."*
    with a direct `"Connect Call Now"` button.
  - **List View, Stack View & Grid View**: Every SKU below threshold now features a glowing/pulsing `"Low Stock • Call"` button that opens the campaign and connects calls.

---

## 2. Verification Results

1. **Backend Tests & Compilation**:
   - `.\mvnw.cmd test-compile`: Passed with 0 errors.
   - Spring Boot backend running smoothly on port `8085`.
   - Tested `/api/products/{id}/supplier-comparison`: Returns ranked suppliers, live lead times, pricing, transcripts, and AI reasoning.
2. **Frontend Build**:
   - `npm run build`: Vite production bundle generated cleanly (0 errors).
3. **Git Sync**:
   - Rebased and pushed commit `62d39ea` directly to `origin/main`.
