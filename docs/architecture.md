# SupplyGuard AI — Architecture

## System Overview

SupplyGuard AI uses a React frontend, Spring Boot backend, MongoDB,
Ollama for AI reasoning, Gmail SMTP for email communication and
Vapi.ai for AI voice calls.

```text
                 React Frontend
                       |
                       v
                Spring Boot API
                 |           |
                 v           v
              MongoDB      Ollama
                 |
                 v
              Vapi.ai
                 |
                 v
              Supplier

        Spring Boot ---> Gmail SMTP ---> Supplier
```

## Core Data Flow

```text
Product / Inventory Data
          |
          v
   Deterministic Risk
       Calculation
          |
          v
   Identify Suppliers
          |
          v
   Email / AI Voice Call
          |
          v
   Supplier Response
          |
          v
 Structured Information
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

## Risk Engine

Inventory runway is calculated deterministically:

```text
Runway =
Current Stock /
(Rolling Daily Average Usage × 1.20)
```

The LLM does not perform the underlying risk calculation.

Ollama is used for reasoning, explanations and recommendations.

## Voice Integration

Vapi.ai handles supplier availability calls.

The voice agent extracts:

```text
availability
stockQuantity
deliveryDays
pricePerUnit
interested
```

During local development, Vapi reaches the Spring Boot backend
through an ngrok HTTPS tunnel:

```text
Vapi.ai
   |
   v
 ngrok
   |
   v
Spring Boot :8085
   |
   v
 MongoDB
```

## Email Integration

Supplier email communication uses Gmail SMTP:

```text
Spring Boot
     |
     v
Gmail SMTP
     |
     v
Supplier
```

## Human-in-the-Loop

AI does not directly finalize procurement.

```text
Supplier Responses
        |
        v
Supplier Comparison
        |
        v
AI Recommendation
        |
        v
Human Review
        |
    +---+---+
    |       |
 Approve  Reject
```

The human operator makes the final procurement decision.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Java + Spring Boot |
| Database | MongoDB |
| AI Reasoning | Ollama |
| Email | Gmail SMTP |
| Voice Agent | Vapi.ai |
| Development Tunnel | ngrok |
