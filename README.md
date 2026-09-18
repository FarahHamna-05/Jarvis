# SupplyGuard AI (Ripple)

### AI-Powered Supply Chain Risk Intelligence & Supplier Response Agent

SupplyGuard AI is an AI-driven supply chain intelligence platform that
detects potential inventory shortages, identifies supplier options,
and automates supplier outreach through email and AI voice calls.

The system combines deterministic inventory-risk calculations with
AI-assisted reasoning and automated supplier communication.

The final supplier/procurement decision remains under human control.

---

## 🏆 Hackathon Information

| Field | Details |
|---|---|
| Hackathon Domain | AI & Agents |
| Problem Statement | AI-02 — Supply Chain Risk Intelligence Agent |
| Project Name | SupplyGuard AI (Ripple) |
| Frontend | React |
| Backend | Java Spring Boot |
| Database | MongoDB |
| AI Reasoning | Ollama |
| Email Automation | Gmail SMTP |
| AI Voice Calling | Vapi.ai |

---

# 1. Problem Statement

Supply chain disruptions and sudden demand increases can cause
businesses to run out of critical products before procurement teams
have enough time to respond.

When an inventory risk is detected, procurement teams may have to
manually:

- Identify suitable suppliers
- Contact multiple suppliers
- Check product availability
- Ask for available stock
- Compare supplier prices
- Check delivery timelines
- Select the most suitable supplier
- Follow up with suppliers who cannot fulfill the requirement

These manual steps increase response time and make it difficult to
react quickly to an approaching stockout.

### Core Problem

> How can an intelligent system detect supply risk early and
> automatically coordinate supplier communication so that a human
> operator can make a faster, evidence-based procurement decision?

---

# 2. Solution

SupplyGuard AI connects inventory risk detection with automated
supplier communication.

The system follows this workflow:

```text
Inventory / Product Data
          |
          v
   Risk Detection
          |
          v
   Supplier Identification
          |
          v
 +-------------------------+
 | Automated Outreach      |
 |                         |
 | Gmail SMTP   Vapi.ai    |
 +------------+------------+
              |
              v
      Supplier Response
              |
              v
     Structured Extraction
              |
              v
      Supplier Comparison
              |
              v
       AI Recommendation
              |
              v
        Human Approval
```

The goal is not to replace the procurement operator.

Instead, SupplyGuard AI reduces the time required to gather supplier
information and presents the operator with structured evidence for
the final decision.

---

# 3. Core Implementation

## 3.1 Deterministic Inventory Risk Engine

SupplyGuard AI does not use an LLM to perform the underlying
inventory-risk arithmetic.

The current design uses a deterministic safety calculation:

```text
Runway =
Current Stock /
(Rolling Daily Average Usage × Safety Multiplier)
```

The default safety multiplier is:

```text
1.20x
```

### Example

```text
Current Stock       = 120 units
Daily Average Usage = 40 units/day
Safety Multiplier   = 1.20

Runway = 120 / (40 × 1.20)
       = 2.5 days
```

The calculated runway can then be compared with supplier lead time
and procurement requirements.

### Why deterministic calculation?

The numerical risk calculation is:

- Reproducible
- Auditable
- Explainable
- Independent of LLM output

The LLM is used for reasoning and explanations rather than deciding
the raw numerical risk.

---

# 4. Supplier Communication Agent

Once a supply risk requires supplier action, SupplyGuard AI can
initiate supplier communication.

Two communication channels are supported:

### Email

Gmail SMTP is integrated for sending supplier emails.

### AI Voice

Vapi.ai is used to automate supplier availability calls.

The voice workflow is designed to ask suppliers about:

- Product availability
- Available quantity
- Price per unit
- Delivery timeline
- Interest in fulfilling the requirement

---

# 5. AI Voice Calling with Vapi.ai

The project currently uses Vapi.ai for automated supplier calls.

The Vapi assistant has been:

- Created
- Configured with a supplier availability conversation
- Published
- Configured with structured data extraction fields
- Connected to the development backend through ngrok

## Structured Data Extraction

The voice agent is configured to extract the following fields:

| Field | Purpose |
|---|---|
| `availability` | Whether the requested product is available |
| `stockQuantity` | Quantity available from the supplier |
| `deliveryDays` | Expected delivery time |
| `pricePerUnit` | Supplier price per unit |
| `interested` | Whether the supplier is interested in fulfilling the requirement |

---

## Example Voice Workflow

```text
SupplyGuard AI
      |
      v
"Hello, this is SupplyGuard AI calling
regarding a {{product}} supply requirement."
      |
      v
Confirm Supplier
      |
      v
Check Product Availability
      |
      +---------------- YES ----------------+
      |                                     |
      |                                     v
      |                           Collect supplier data
      |                           - Stock quantity
      |                           - Price
      |                           - Delivery days
      |                           - Interest
      |
      +---------------- NO -----------------+
                                            |
                                            v
                                   Contact next supplier
```

---

# 6. Dynamic Supplier Data

Supplier and product information is retrieved from the application
data layer and passed to the voice agent as dynamic information.

Example variables include:

```text
product
owner_name
required_quantity
business_name
delivery_location
```

Example:

```text
Hello, this is SupplyGuard AI calling regarding a
{{product}} supply requirement.

Am I speaking with {{owner_name}}?
```

This allows the same voice agent to handle different products and
suppliers without hard-coding each conversation.

---

# 7. Vapi to Spring Boot Integration

The current development architecture exposes the local Spring Boot
backend to Vapi using ngrok.

```text
                    Vapi.ai
                       |
                       | HTTPS
                       v
                    ngrok
                       |
                       v
              localhost:8085
                       |
                       v
                Spring Boot
                       |
                       v
                   MongoDB
```

The ngrok tunnel is currently used during local development and
testing.

The Vapi Server URL has been configured to point to the development
backend.

---

# 8. Supplier Response Processing

The voice agent produces structured supplier information.

The backend workflow being implemented is:

```text
Vapi Voice Call
      |
      v
Supplier Conversation
      |
      v
Structured Response
      |
      v
POST /api/calls/webhook
      |
      v
Spring Boot
      |
      v
MongoDB
      |
      v
Supplier Comparison
      |
      v
AI Recommendation
```

## Current Status

### Completed

- Vapi assistant creation
- Supplier availability conversation
- Structured extraction configuration
- ngrok backend tunnel

### In Progress

- Vapi webhook controller
- Call-result persistence
- SupplierCallService
- SupplierComparisonService
- Frontend supplier comparison
- Recommendation display
- Approve / Reject workflow

---

# 9. Supplier Comparison

SupplyGuard AI is being designed to compare supplier responses using
structured information rather than relying only on free-form LLM
responses.

The comparison considers:

```text
1. Availability
       |
       v
2. Stock Sufficiency
       |
       v
3. Delivery Timeline
       |
       v
4. Price per Unit
```

Example supplier response:

| Supplier | Available | Stock | Delivery | Price |
|---|---:|---:|---:|---:|
| Supplier A | Yes | 500 | 3 days | ₹120 |
| Supplier B | Yes | 300 | 2 days | ₹125 |
| Supplier C | No | 0 | - | - |

The structured responses can then be passed to the recommendation
layer.

---

# 10. AI Reasoning Layer

SupplyGuard AI uses Ollama as a local AI reasoning layer.

The LLM is intended to assist with:

- Risk explanations
- Supplier-response interpretation
- Procurement reasoning
- Recommendation generation

The LLM does not determine the underlying inventory arithmetic.

```text
              Inventory Data
                    |
                    v
        +---------------------+
        | Deterministic Risk  |
        |       Engine        |
        +----------+----------+
                   |
                   | Risk Result
                   v
        +---------------------+
        |    Ollama / LLM     |
        | Strategic Reasoning |
        +----------+----------+
                   |
                   | Recommendation
                   v
             Human Operator
```

---

# 11. Human-in-the-Loop Governance

SupplyGuard AI is designed so that AI recommendations do not directly
finalize procurement decisions.

The intended workflow is:

```text
Supplier Responses
        |
        v
AI-Assisted Recommendation
        |
        v
Human Operator Review
        |
        +---------- Approve
        |
        +---------- Reject
```

This keeps the final procurement decision under human control.

---

# 12. System Architecture

```text
                         +---------------------+
                         |    React Frontend   |
                         |                     |
                         | Risk Monitoring     |
                         | Supplier Actions    |
                         | Recommendations     |
                         +----------+----------+
                                    |
                                  REST
                                    |
                                    v
                         +---------------------+
                         |   Spring Boot API   |
                         |                     |
                         | Risk Engine         |
                         | Supplier Services   |
                         | Communication       |
                         | Vapi Webhook        |
                         +------+---------+----+
                                |         |
                       +--------+         +-----------+
                       v                              v
              +-----------------+           +-----------------+
              |    MongoDB      |           |     Ollama      |
              |                 |           |                 |
              | Products        |           | AI Reasoning    |
              | Suppliers       |           | Recommendations |
              | Call Logs       |           +-----------------+
              | Conversations   |
              +--------+--------+
                       |
                       |
                       v
              +-----------------+
              |     Vapi.ai     |
              |   Voice Agent   |
              +--------+--------+
                       |
                       | Phone Call
                       v
                    Supplier


              Gmail SMTP
                   |
                   v
                Supplier
                  Email
```

---

# 13. Data Flow

The current data flow is centered around the Spring Boot backend.

```text
Product / Supplier Data
          |
          v
       MongoDB
          |
          v
     Spring Boot
          |
     +----+----+
     |         |
     v         v
 Risk Engine  Supplier
              Communication
     |         |
     |    +----+----+
     |    |         |
     |    v         v
     |  Gmail      Vapi
     |  SMTP       Voice
     |    |         |
     |    +----+----+
     |         |
     |         v
     |   Supplier Response
     |         |
     +----+----+
          |
          v
  Recommendation Layer
          |
          v
    Human Operator
```

---

# 14. Problem Statement Alignment

| Problem | SupplyGuard AI Implementation |
|---|---|
| Inventory shortages can be detected too late | Deterministic inventory runway calculation |
| Supplier communication can be manual | Automated supplier communication |
| Email communication takes time | Gmail SMTP automation |
| Supplier phone calls are manual | Vapi AI voice agent |
| Supplier responses may be unstructured | Structured Vapi extraction |
| Multiple supplier responses are difficult to compare | Supplier comparison service |
| AI-generated numerical decisions may be unreliable | Deterministic risk engine |
| Procurement decisions require accountability | Human-in-the-loop approval |
| Decisions need traceability | Supplier communication and response logging |

---

# 15. Technology Stack

## Frontend

- React
- Vite
- Axios
- JavaScript
- CSS

## Backend

- Java
- Spring Boot
- Maven
- REST APIs

## Database

- MongoDB

Used for application data including products, suppliers,
communications, call information and related records.

## AI

- Ollama
- Local LLM reasoning

## Communication

- Gmail SMTP
- Vapi.ai

## Development Infrastructure

- ngrok
- Local Spring Boot server

---

# 16. Project Structure

```text
SupplyGuard-AI/
|
+-- supplyguard-backend/
|   +-- src/
|   |   +-- main/
|   |   |   +-- java/
|   |   |   +-- resources/
|   |   +-- test/
|   +-- pom.xml
|
+-- supplyguard-frontend/
|   +-- src/
|   +-- public/
|   +-- package.json
|
+-- docs/
|   +-- architecture.md
|   +-- development-history.md
|   +-- implementation-plan.md
|
+-- screenshots/
|
+-- .env.example
+-- .gitignore
+-- README.md
```

---

# 17. Development History

SupplyGuard AI has evolved through multiple technical iterations.

## Phase 1 — Problem Definition

Defined the supply-chain risk problem and the need to detect potential
stockouts before they occur.

## Phase 2 — Backend Foundation

Created the Spring Boot backend and established the application API
structure.

## Phase 3 — Database Integration

Integrated MongoDB for product, supplier and communication-related
data.

## Phase 4 — Deterministic Risk Engine

Implemented the inventory runway calculation using a deterministic
safety multiplier.

## Phase 5 — Supplier Email Automation

Integrated Gmail SMTP and verified real supplier email delivery.

## Phase 6 — Initial Voice Approach

Explored Twilio and ElevenLabs for automated supplier calls.

The approach encountered limitations involving:

- Trial account restrictions
- Authentication issues
- Regional number availability
- Indian telecom requirements

## Phase 7 — Migration to Vapi.ai

The voice architecture was changed to Vapi.ai to simplify the
supplier voice-agent integration.

## Phase 8 — Vapi Agent Configuration

Created and published the Vapi assistant and configured structured
supplier-response extraction.

Current extraction fields:

```text
availability
stockQuantity
deliveryDays
pricePerUnit
interested
```

## Phase 9 — Backend Connectivity

Configured ngrok to expose the local Spring Boot backend to Vapi.

## Phase 10 — Current Development

The current implementation work focuses on:

- Vapi webhook processing
- Saving call results to MongoDB
- Supplier response comparison
- AI recommendation generation
- Frontend supplier availability workflow
- Human approval/rejection workflow

---

# 18. Development Progress

## ✅ Completed

### Backend

- Spring Boot backend
- MongoDB integration
- Product/supplier data workflow
- Deterministic inventory-risk calculation

### Email

- Gmail SMTP integration
- Real email delivery to supplier addresses

### Voice Agent

- Vapi assistant created
- Vapi assistant published
- Supplier availability conversation configured
- Structured response extraction configured
- Vapi phone number provisioned

### Development Infrastructure

- ngrok configured
- Local Spring Boot backend exposed through HTTPS
- Vapi Server URL configured

---

## 🔧 In Progress

### Vapi Backend Integration

- Vapi API credential configuration
- Vapi webhook controller
- Call-result persistence
- SupplierCallService

### Supplier Intelligence

- SupplierComparisonService
- Supplier response ranking
- AI recommendation generation

### Frontend

- "Check Supplier Availability" action
- Supplier comparison table
- AI recommendation display
- Approve / Reject workflow

---

# 19. Known Constraints

## Vapi Development Limits

The current development environment is subject to the limitations
of the Vapi account and available calling resources.

## Local Webhook

During local development, the Vapi webhook depends on an active
ngrok tunnel.

```text
Vapi
  |
  v
ngrok
  |
  v
localhost:8085
```

For production deployment, the backend can be deployed to a public
cloud environment and the Vapi webhook can be updated accordingly.

---

# 20. Getting Started

## Prerequisites

Install:

- Node.js 18+
- Java JDK 17+
- Maven 3.8+
- MongoDB
- Ollama
- Vapi.ai account
- ngrok

---

## Backend

### Windows

```bash
cd supplyguard-backend
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
cd supplyguard-backend
./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8085
```

---

## Frontend

```bash
cd supplyguard-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 21. Environment Configuration

Use `.env.example` as the template for local configuration.

Example:

```env
MONGODB_URI=

OLLAMA_URL=
OLLAMA_MODEL=

VAPI_API_KEY=
VAPI_ASSISTANT_ID=
VAPI_PHONE_NUMBER_ID=
```

Never commit:

- API keys
- Passwords
- Database credentials
- JWT secrets
- Private tokens

Only example/placeholder values should be stored in the repository.

---

# 22. Demo Workflow

A complete demonstration is designed around the following flow:

```text
1. Login
      |
      v
2. Select a product
      |
      v
3. View inventory risk
      |
      v
4. Identify supplier
      |
      v
5. Click "Check Supplier Availability"
      |
      v
6. Retrieve product + supplier information
      |
      v
7. Pass dynamic information to Vapi
      |
      v
8. Start AI supplier call
      |
      v
9. Supplier responds
      |
      v
10. Extract structured information
      |
      +-- Availability
      +-- Stock Quantity
      +-- Price
      +-- Delivery Days
      +-- Interest
      |
      v
11. Store response
      |
      v
12. Compare supplier responses
      |
      v
13. Generate recommendation
      |
      v
14. Human reviews recommendation
      |
      v
15. Approve / Reject
```

---

# 23. Screenshots

Screenshots demonstrating the current frontend and system development
are available in the `screenshots/` directory.

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Products

![Products](screenshots/products.png)

### Suppliers

![Suppliers](screenshots/suppliers.png)

### Supplier Workflow

![Supplier Workflow](screenshots/simulator.png)

### Audit Trail

![Audit](screenshots/audit.png)

> Screenshots should represent functionality currently implemented
> in the project.

---

# 24. Testing

Current development testing covers:

### Backend

- MongoDB connectivity
- Product data retrieval
- Supplier data retrieval
- Deterministic risk calculation

### Email

- Gmail SMTP configuration
- Real email delivery

### Voice

- Vapi assistant configuration
- Supplier availability conversation
- Structured extraction configuration
- Vapi → ngrok → Spring Boot connectivity

### Remaining Integration Testing

- Vapi webhook → Spring Boot
- Call result → MongoDB
- Multi-supplier comparison
- Recommendation generation
- Human approval workflow

---

# 25. Current Status

| Component | Status |
|---|---|
| React Frontend | ✅ Implemented |
| Spring Boot Backend | ✅ Implemented |
| MongoDB Integration | ✅ Implemented |
| Inventory Risk Calculation | ✅ Implemented |
| Gmail SMTP | ✅ Working |
| Vapi Voice Agent | ✅ Configured |
| Supplier Availability Flow | ✅ Configured |
| Structured Voice Extraction | ✅ Configured |
| ngrok Connectivity | ✅ Configured |
| Vapi Webhook Processing | 🔧 In Progress |
| Call Result Persistence | 🔧 In Progress |
| Supplier Comparison | 🔧 In Progress |
| AI Recommendation | 🔧 In Progress |
| Human Approval UI | 🔧 In Progress |
| Production Deployment | ⏳ Planned |

---

# 26. Development Evidence

The repository contains the following evidence of development:

### Source Code

- `supplyguard-backend/`
- `supplyguard-frontend/`

### Architecture Documentation

- `docs/architecture.md`

### Development History

- `docs/development-history.md`

### Implementation Planning

- `docs/implementation-plan.md`

### UI / Feature Evidence

- `screenshots/`

### Configuration

- `.env.example`
- `.gitignore`

The Git commit history also records the progression of the project
from the initial supply-chain concept through backend implementation,
email automation, Vapi integration and ongoing supplier intelligence
development.

---

# 27. Security

Sensitive credentials are not stored directly in the repository.

The project uses environment-based configuration for external service
credentials.

The following should never be committed:

```text
.env
API keys
database passwords
JWT secrets
Vapi credentials
email credentials
```

The repository contains `.env.example` only as a configuration
template.

---

# 28. Future Improvements

Planned improvements include:

- Production backend deployment
- Permanent Vapi webhook endpoint
- Expanded supplier intelligence
- Improved supplier ranking
- Procurement system integrations
- Additional supplier verification
- Production security hardening
- More comprehensive automated testing

---

# 29. Demo Credentials

| Role | Username | Password |
|---|---|---|
| Lead Operator | `dhanush` | `password123` |
| System Admin | `admin` | `password123` |

> These credentials are intended for local/demo environments only.
> Do not use them in production.

---

# 30. Team

## Ripple

**SupplyGuard AI**

Hackathon Domain: **AI & Agents**

Problem Statement:

**AI-02 — Supply Chain Risk Intelligence Agent**
