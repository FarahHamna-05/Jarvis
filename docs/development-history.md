# SupplyGuard AI — Development History

## Project Evolution

SupplyGuard AI was developed incrementally from an inventory-risk
monitoring concept into an AI-assisted supplier communication system.

### 1. Initial Supply Chain Risk System

- Defined the inventory shortage detection workflow.
- Implemented product and supplier data management.
- Added deterministic inventory runway calculation.

### 2. Deterministic Risk Engine

Implemented the inventory runway calculation:

```text
Runway =
Current Stock /
(Rolling Daily Average Usage × 1.20)
```

The calculation is kept independent of the LLM to ensure predictable
and auditable numerical results.

### 3. Supplier Email Automation

Integrated Gmail SMTP for automated supplier communication.

The email workflow was tested with real email delivery.

### 4. AI Voice Agent

The initial voice approach explored Twilio and ElevenLabs.

Development encountered account, authentication and regional calling
limitations, so the voice architecture was changed to Vapi.ai.

### 5. Vapi.ai Integration

Created and published the Vapi supplier availability assistant.

Configured structured extraction for:

```text
availability
stockQuantity
deliveryDays
pricePerUnit
interested
```

### 6. Dynamic Supplier Information

The voice workflow was configured to use dynamic product and supplier
information, allowing the same assistant to handle different
supplier requests.

Example:

```text
{{product}}
{{owner_name}}
{{required_quantity}}
```

### 7. Backend Connectivity

Configured ngrok to expose the local Spring Boot backend to Vapi.

```text
Vapi.ai
   ↓
ngrok
   ↓
Spring Boot :8085
```

### 8. Current Development

The current implementation is focused on connecting Vapi call
results back into the application.

```text
Vapi Call
   ↓
Webhook
   ↓
Spring Boot
   ↓
MongoDB
   ↓
Supplier Comparison
   ↓
AI Recommendation
   ↓
Human Approval
```

Current work includes:

- Vapi webhook processing
- Call-result persistence
- Supplier response comparison
- AI recommendation
- Frontend supplier comparison
- Human approval/rejection workflow

---

## Technology Evolution

```text
Initial Voice Approach
        ↓
Twilio + ElevenLabs
        ↓
Account / Regional Limitations
        ↓
Vapi.ai
        ↓
AI Supplier Voice Agent
```

The architecture was adapted based on actual integration and testing
constraints during development.
