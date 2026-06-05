# Fortress — AI-Powered Vendor Compliance Pipeline

Fortress automates third-party vendor security reviews using AI. Vendors submit their compliance documentation through a secure portal, which is instantly analysed by an AI CISO against regional regulations and company-specific policies. Results are synced to Salesforce CRM and email notifications are dispatched automatically.

---

## Architecture

```
[React Portal]  →  [Node.js / Express]  →  [Ollama / OpenAI]
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
    [Salesforce CRM]         [Email (Gmail SMTP)]
  Account + Contact +        Vendor confirmation +
  Compliance_Review__c       Admin notification
```

---

## Features

- **Two-page vendor intake** — Company details + file upload with corporate email enforcement
- **AI compliance scoring** — Documents scored 1–100 by a CISO-persona LLM prompt
- **Policy-driven analysis** — Checks against regional regulatory frameworks (DPDP Act 2023, CERT-In, RBI, GDPR, HIPAA, SOC 2, ISO 27001, and more) plus admin-defined custom policies
- **Async processing** — Vendors get an instant confirmation (HTTP 202); AI analysis runs in the background
- **Salesforce integration** — Account, Contact, and `Compliance_Review__c` records created automatically
- **Email notifications** — Vendor confirmation email + admin notification with full AI results
- **Admin policy API** — REST endpoints to configure region and custom compliance policies
- **Dual theme UI** — Professional dark/light mode with animated landing page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS 3 |
| Backend | Node.js, Express, Multer, Zod |
| AI | Ollama (`qwen2.5-coder:1.5b`) or OpenAI (`gpt-4o`) |
| CRM | Salesforce REST API (OAuth 2.0) |
| Email | Nodemailer (Gmail SMTP / Ethereal fallback) |
| Logging | Winston + Morgan |

---

## Prerequisites

- Node.js 22+
- [Ollama](https://ollama.com) installed with `qwen2.5-coder:1.5b` pulled:
  ```
  ollama pull qwen2.5-coder:1.5b
  ```
- Salesforce Developer Edition org (optional — app works without it)
- Gmail account with App Password (optional — Ethereal used as fallback)

---

## Project Structure

```
fortress/
  client/          React frontend (vendor portal)
  server/          Node.js backend (API + AI + Salesforce)
  salesforce/      SFDX metadata (custom object, app, layout)
```

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/KatLeo27/AI-GRC-Analyser.git
cd AI-GRC-Analyser
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your credentials (see Environment Variables section below).

### 3. Frontend setup

```bash
cd ../client
npm install
```

---

## Running the App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
# Server
PORT=3000
CORS_ORIGINS=http://localhost:5173

# AI Provider — "ollama" (free, local) or "openai" (paid)
AI_PROVIDER=ollama
AI_MODEL=qwen2.5-coder:1.5b
OLLAMA_BASE_URL=http://localhost:11434/v1
# OPENAI_API_KEY=sk-...   (only needed if AI_PROVIDER=openai)

# Email (leave SMTP_USER blank to use Ethereal test account)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Fortress <your@gmail.com>
ADMIN_EMAIL=admin@yourcompany.com

# Salesforce (optional)
SF_LOGIN_URL=https://login.salesforce.com
SF_CLIENT_ID=your-consumer-key
SF_CLIENT_SECRET=your-consumer-secret
SF_USERNAME=your-sf-username
SF_PASSWORD=your-sf-password
SF_SECURITY_TOKEN=your-security-token

# Development
ALLOW_FREE_EMAILS=false   # set true to bypass corporate email check in dev
LOG_LEVEL=info
```

---

## Admin Policy API

Configure which compliance frameworks are checked:

```bash
# Set your region (India, USA, EU, UK, Singapore, Global)
curl -X POST http://localhost:3000/api/policies/region \
  -H "Content-Type: application/json" \
  -d '{"region": "India"}'

# Add a custom policy
curl -X POST http://localhost:3000/api/policies/custom \
  -H "Content-Type: application/json" \
  -d '{"name": "ISO 27001 Required", "description": "All vendors must hold a valid ISO 27001 certificate"}'

# View current config
curl http://localhost:3000/api/policies
```

**Supported regional frameworks:**
- 🇮🇳 India: DPDP Act 2023, IT Act 2000, RBI Cybersecurity Framework, CERT-In Guidelines 2022
- 🇺🇸 USA: HIPAA, SOC 2, NIST CSF, CCPA, PCI-DSS
- 🇪🇺 EU: GDPR, NIS2 Directive
- 🇬🇧 UK: UK GDPR, Cyber Essentials
- 🇸🇬 Singapore: PDPA, MAS TRM Guidelines
- 🌐 Global: ISO 27001, SOC 2 Type II

---

## Salesforce Setup

Deploy the custom schema using the Salesforce CLI:

```bash
# Install SF CLI
npm install -g @salesforce/cli

# Authenticate
sf org login web --alias fortress-dev --instance-url https://login.salesforce.com

# Deploy schema
cd salesforce
sf project deploy start --source-dir force-app --target-org fortress-dev
sf project deploy start --metadata "PermissionSet:Fortress_API_Access" --target-org fortress-dev
sf org assign permset --name Fortress_API_Access --target-org fortress-dev
```

Enable OAuth password flow in Salesforce:
**Setup → OAuth and OpenID Connect Settings → Allow OAuth Username-Password Flows → ON**

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/compliance` | Submit vendor document for analysis |
| `GET` | `/api/policies` | Get current policy configuration |
| `POST` | `/api/policies/region` | Set admin region |
| `POST` | `/api/policies/custom` | Add custom policy |
| `DELETE` | `/api/policies/custom/:id` | Remove custom policy |
| `GET` | `/health` | Server health check |

---

## How It Works

1. Vendor fills in company details and uploads a compliance document (`.pdf`, `.txt`, `.docx`)
2. Backend returns **HTTP 202** immediately — vendor sees a confirmation screen instantly
3. In the background:
   - Text is extracted from the document
   - AI analyses the document against active regional frameworks and custom policies
   - Results are synced to Salesforce (Account → Contact → Compliance_Review__c)
   - Vendor receives a confirmation email
   - Admin receives a notification email with the full AI analysis

---

## Test Documents

Two sample compliance documents are included for testing:

| File | Expected Score | Description |
|---|---|---|
| `test-vendor-realistic.txt` | 85+ / Approved | Strong security posture, ISO 27001, full DPDP compliance |
| `test-vendor-full.txt` | 75–85 / Approved | Good posture with minor gaps |
| `test-vendor-weak.txt` | < 50 / Pending Human Review | Poor security practices, non-compliant |

---

## Built With

Developed as an internship project at **WarpDrive Tech Works** (May–June 2026).
