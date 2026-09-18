# SupplyGuard AI

### AI-Powered Supply Chain Risk Intelligence Agent

SupplyGuard AI detects potential inventory shortages and automatically
contacts suppliers to check product availability, stock, price and
delivery time. Supplier responses are structured, compared and used
to generate an AI-assisted recommendation for human approval.

**Hackathon:** AI & Agents  
**Problem Statement:** AI-02 — Supply Chain Risk Intelligence Agent

---

## 1. Problem

When inventory is at risk of running out, procurement teams often
need to manually contact multiple suppliers and compare:

- Product availability
- Available quantity
- Price
- Delivery time

This delays procurement decisions and makes supplier coordination
difficult.

---

## 2. Solution

SupplyGuard AI connects **inventory risk detection → automated supplier
outreach → structured response collection → supplier comparison →
AI recommendation → human approval**.

```text
Inventory Data
      ↓
Risk Detection
      ↓
Supplier Selection
      ↓
 ┌───────────────┐
 │ Email / Voice │
 └───────┬───────┘
         ↓
 Supplier Response
         ↓
 Structured Data
         ↓
 Supplier Comparison
         ↓
 AI Recommendation
         ↓
 Human Approval
```

---

## 3. Key Features

### Inventory Risk Detection

Uses a deterministic calculation to estimate inventory runway:

```text
Runway =
Current Stock /
(Rolling Daily Average Usage × 1.20)
```

The numerical risk calculation does not depend on the LLM.

### Automated Supplier Outreach

- Gmail SMTP for supplier emails
- Vapi.ai for AI voice calls
- Dynamic product and supplier information

### Structured Voice Response

Vapi extracts:

```text
availability
stockQuantity
deliveryDays
pricePerUnit
interested
```

### Supplier Comparison

Supplier responses are compared using:

- Availability
- Stock sufficiency
- Delivery time
- Price

### AI-Assisted Recommendation

Ollama is used to explain supplier responses and generate
recommendations.

### Human-in-the-Loop

The final supplier/procurement decision requires human approval.

---

## 4. Architecture

```text
                 React Frontend
                       │
                       ▼
                Spring Boot API
                 │           │
                 ▼           ▼
              MongoDB      Ollama
                 │
                 ▼
              Vapi.ai
                 │
                 ▼
              Supplier

        Spring Boot ──→ Gmail SMTP ──→ Supplier
```

During local development:

```text
Vapi.ai → ngrok → Spring Boot :8085 → MongoDB
```

---

## 5. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Java + Spring Boot |
| Database | MongoDB |
| AI Reasoning | Ollama |
| Email | Gmail SMTP |
| Voice Agent | Vapi.ai |
| Development Tunnel | ngrok |

---

## 6. Current Development Progress

### Completed

- React frontend
- Spring Boot backend
- MongoDB integration
- Deterministic inventory-risk calculation
- Gmail SMTP email delivery
- Vapi AI voice assistant
- Vapi structured data extraction
- Dynamic supplier/product information
- ngrok connectivity between Vapi and local backend

### In Progress

- Vapi webhook processing
- Saving call results to MongoDB
- Supplier response comparison
- AI recommendation
- Frontend comparison and recommendation UI
- Human approval/rejection workflow

---

## 7. Development History

The project evolved from an initial voice-calling approach using
Twilio + ElevenLabs to Vapi.ai after encountering account,
authentication and regional calling limitations.

The current architecture uses Vapi.ai for supplier voice automation
and Gmail SMTP for supplier email communication.

See:

- `docs/architecture.md`
- `docs/development-history.md`
- `docs/implementation-plan.md`

---

## 8. Project Structure

```text
SupplyGuard-AI/
│
├── supplyguard-backend/
├── supplyguard-frontend/
│
├── docs/
│   ├── architecture.md
│   ├── development-history.md
│   └── implementation-plan.md
│
├── screenshots/
├── .env.example
├── .gitignore
└── README.md
```

---

## 9. Getting Started

### Backend

```bash
cd supplyguard-backend
mvnw.cmd spring-boot:run
```

Runs on:

```text
http://localhost:8085
```

### Frontend

```bash
cd supplyguard-frontend
npm install
npm run dev
```

Runs on:

```text
http://localhost:5173
```

### Required Services

- MongoDB
- Ollama
- Vapi.ai
- Gmail SMTP

For local Vapi webhook testing, ngrok must also be running.

---

## 10. Security

API keys, passwords, database credentials and other secrets are not
stored in the repository.

Use `.env.example` as the configuration template.

---

## 11. Demo Credentials

| Role | Username | Password |
|---|---|---|
| Lead Operator | `dhanush` | `password123` |
| System Admin | `admin` | `password123` |

> Demo credentials are intended for local/hackathon use only.

---

## Team

### Ripple

**SupplyGuard AI — AI-02 Supply Chain Risk Intelligence Agent**
