# SupplyGuard AI (Ripple) — Autonomous Supply Chain Intelligence Platform

SupplyGuard is an autonomous supply chain threat intelligence and inventory runway risk management platform. It combines a **1.20x deterministic safety calculus** with **Ollama local AI reasoning** and **automated 6-point KYB vendor onboarding** to predict and mitigate stockouts days before they occur.

---

## 🌟 Key Features

1. **4-Step Post-Login KYB Onboarding Flow (Ripple)**:
   - **Step 1: Category & Scale Selection**: Multi-select industry tiles (*Electronics, Automotive, Pharma, FMCG, Industrial, etc.*) + custom niche input; MSME tier radio selector (*Micro, Small, Medium, Large*).
   - **Step 2: Business Profile Setup**: Legal Entity Name, constitution (*Pvt Ltd, LLP, Partnership, etc.*), registered address, and live API verification for PAN, GSTIN, and Udyam registration.
   - **Step 3: Supplier Onboarding & 6-Point Verification**: Primary supplier registration with live verification badges (PAN, Aadhaar, GSTIN, IFSC auto-fill branch, Bank Account penny drop, Udyam) and real-time **Supplier Trust Score** (`X / 5 Verified`).
   - **Step 4: Product Catalog Setup**: SKU details, auto-linking to verified primary supplier, market reference benchmark price (₹), and market demand trend selector (*Rising, Stable, Falling*).

2. **Bento Command Dashboard & Telemetry Matrix**:
   - Zero-gravity Threat Dossier powered by 2D physics.
   - Real-time inventory runway meters, stockout forecasting, and critical SKU spotlight.
   - Live WebSocket risk event broadcasting.

3. **Deterministic Risk Engine (No LLM Hallucinations in Math)**:
   - Mathematically computed: `Runway = CurrentStock / (RollingDailyAverage × 1.20)`.
   - Ollama Llama-3 AI is strictly used as a strategic reasoning gate to formulate mitigation recommendations, never for underlying arithmetic.

4. **Human-in-the-Loop Governance & Mitigation**:
   - Autonomous emergency purchase order drafting.
   - Requires authorized cryptographic sign-off from a human operator before dispatching orders to backup suppliers.

5. **Settings, Operator Profiles & Security**:
   - Operator Profile: Personal details, corporate title, department, and MCA KYB compliance records.
   - Safety Rules: Configurable safety multiplier (`1.00x`–`1.50x`), runway alarm thresholds, and AI reasoning gates.
   - Security: Password change with BCrypt, 2FA status, and active session telemetry.
   - API Keys: Production Bearer token generator, key rotation, and ERP webhook test ping.

6. **Dedicated Full-Page Login & Signup Portal**:
   - Modern split-screen layout with value showcase and interactive forms.
   - 1-Click demo test accounts (`Dhanush`, `Admin`) and 1-click sample signup auto-fill.
   - Direct seamless transition into the 4-step onboarding flow for newly registered accounts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS + Tailwind CSS (Talentsy modern crimson aesthetic `#E51A24`)
- **Icons**: Lucide React
- **Notifications**: Custom React Bits SwipeToast system
- **Celebration FX**: Canvas Confetti
- **HTTP Client**: Axios with JWT interceptors
- **Real-Time**: STOMP / SockJS WebSocket client

### Backend
- **Framework**: Spring Boot 3.2 (Java 17)
- **Security**: Spring Security with stateless JWT Bearer authentication & BCrypt
- **Databases**:
  - MySQL / H2 (JPA Hibernate for Users, Business Profiles, Suppliers, Verification Records, and Approvals)
  - MongoDB (Telemetry data, communications, and audit events)
- **AI Reasoning**: Ollama (Llama 3 local LLM) with deterministic fallback
- **Real-Time**: Spring WebSocket with STOMP message broker

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven 3.8+ (or included Maven wrapper `mvnw.cmd`)
- MySQL and MongoDB running locally (or configured in `application.yml`)
- Ollama running locally (`ollama run llama3`) [optional, automatic deterministic fallback included]

### 1. Backend Setup
```bash
cd supplyguard-backend
./mvnw.cmd spring-boot:run
```
*Backend runs at `http://localhost:8085`*

### 2. Real Email Delivery Setup (SendGrid)
To enable live supplier email dispatching to real inboxes:
1. **Free Account**: Create an account at [SendGrid](https://signup.sendgrid.com) (free plan includes 100 emails/day).
2. **Sender Verification (Required)**: 
   - Navigate to **Settings &rarr; Sender Authentication &rarr; Verify a Single Sender**.
   - Fill in your details (e.g., your real email or corporate address).
   - Check your inbox and click the verification link sent by SendGrid. SendGrid will reject emails if the `from` address has not completed verification.
3. **Generate API Key**:
   - Navigate to **Settings &rarr; API Keys &rarr; Create API Key**.
   - Choose **Restricted Access** with `Mail Send` permissions (or Full Access) and copy your key (`SG....`).
4. **Configure Credentials**:
   - Set in `supplyguard-backend/src/main/resources/application.properties` or set environment variables:
     ```bash
     export SENDGRID_API_KEY="SG.your_actual_sendgrid_key"
     export SENDGRID_FROM_EMAIL="your_verified_sender_address@domain.com"
     ```
   - *Note*: If `SENDGRID_API_KEY` is not set or uses the placeholder, the system will gracefully log status `"failed"` with diagnostic details in MongoDB without crashing.
5. **Live Inbox Testing**:
   - In the **Supplier Hub** or **Chaos Sandbox**, you can input any personal test email address (e.g., your Gmail/work email) to observe live delivery in your own inbox.

### 3. Frontend Setup
```bash
cd supplyguard-frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 👥 Demo Credentials
- **Lead Operator**: `dhanush` / `password123`
- **System Admin**: `admin` / `password123`
