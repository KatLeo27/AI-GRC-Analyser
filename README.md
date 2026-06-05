# Fortress — AI Vendor Compliance Pipeline

Automates third-party vendor security reviews using AI. Vendors submit compliance documents through a secure portal, which are scored against regional regulations (DPDP Act, GDPR, HIPAA, and more) and company policies. Results sync to Salesforce CRM with automatic email notifications.

**Live Demo:** [Add link after deployment]

---

## Tech Stack

| | |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, Multer, Zod |
| AI | Groq (cloud) / Ollama (local) |
| CRM | Salesforce REST API |
| Email | Nodemailer (Gmail SMTP) |

---

## Local Setup

**Prerequisites:** Node.js 22+, [Ollama](https://ollama.com) with `qwen2.5-coder:1.5b`

```bash
git clone https://github.com/KatLeo27/AI-GRC-Analyser.git
cd AI-GRC-Analyser

# Backend
cd server && npm install && cp .env.example .env
# Edit .env with your credentials

# Frontend
cd ../client && npm install
```

**Run:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Open **http://localhost:5173**

---

## Environment Variables

See `server/.env.example` for all options. Key variables:

```env
AI_PROVIDER=ollama              # or "groq" (cloud) / "openai"
GROQ_API_KEY=gsk_...            # get free at console.groq.com
SMTP_USER=your@gmail.com        # Gmail with App Password
SMTP_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@yourcompany.com
SF_CLIENT_ID=...                # Salesforce Connected App
SF_CLIENT_SECRET=...
SF_USERNAME=...
SF_PASSWORD=...
SF_SECURITY_TOKEN=...
```

---

## Admin Policy API

```bash
# Set region (India, USA, EU, UK, Singapore, Global)
curl -X POST http://localhost:3000/api/policies/region \
  -H "Content-Type: application/json" -d '{"region":"India"}'

# Add custom policy
curl -X POST http://localhost:3000/api/policies/custom \
  -H "Content-Type: application/json" \
  -d '{"name":"ISO 27001 Required","description":"All vendors must hold ISO 27001 certification"}'
```

---

## Salesforce Schema Deployment

```bash
cd salesforce
sf org login web --alias fortress-dev
sf project deploy start --source-dir force-app --target-org fortress-dev
sf org assign permset --name Fortress_API_Access --target-org fortress-dev
```

---

*Built at WarpDrive Tech Works internship, June 2026*
