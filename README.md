# UniCore — Nigerian University Management SaaS (Interactive Demo MVP)

> **Enterprise-Grade Higher Education Management Platform for Universities, Polytechnics, and Colleges of Education.**

UniCore is a modern, multi-tenant university management software-as-a-service (SaaS) platform built specifically around the regulatory, administrative, financial, and examination realities of Nigerian higher education institutions.

This repository is an **interactive frontend-only demonstration application (MVP)** designed to demonstrate end-to-end institutional workflows to prospective university management boards, Governing Councils, Vice Chancellors, Registrars, Bursars, Directors of ICT, Deans, Lecturers, and Students.

---

## 🌟 Key Functional Modules Demonstrated

1. **Multi-Tenant Institutional Governance**
   - Manage multiple institutions simultaneously (e.g. *Greenfield University of Technology*, *Royal Crest Polytechnic*, *Excellence College of Education*).
   - Dynamic tenant context switching, custom branding colors, and isolated student/applicant data pools.

2. **Access-Code Lifecycle & Stage Entitlement Engine**
   - Clean architectural separation between **Credentials**, **Payment Records**, and **Stage Entitlements**.
   - Progressive unlocking: Provisional Offer Acceptance → Student Matriculation Activation → Tuition Settlement → Course Registration (12–24 Credit Units) → Examination Eligibility → Senate Result Publication.
   - Preserves previously earned academic entitlements when new single-use codes are issued or revoked.

3. **Bursary & Simulated Financial Operations**
   - Invoicing and simulated collections for School Fees, Acceptance Fees, Departmental Charges, and Hostel Accommodation.
   - 100% simulated transactions (no real payment gateway or cards charged).
   - Demonstration of transaction reconciliation, failure states, and Senate/Bursary refunds and reversals.

4. **Admissions Screening & Provisional Offers**
   - Candidate UTME scores, O'Level qualifications (WAEC/NECO), state of origin, and verification status.
   - Admissions committee review notes, document inspection, and formal offer letter generation.

5. **Course Allocation, Lecturing & Score Entry**
   - Departmental teaching allocations for academic staff.
   - Continuous Assessment (CA max 30 marks) and Examination marks (max 70 marks) entry.
   - Real-time client-side range validation (prevents out-of-bounds scores).

6. **Senate Examination Board & Results Publishing**
   - Score approval queue, correction requests with mandatory feedback, and official publishing.
   - Versioned result amendment tracking preserving version numbers, reasons, actor identities, and timestamps.
   - GPA & CGPA calculation adhering to Nigerian University Commission (NUC) 5-point benchmark scales.

7. **Print-Ready Document Generator**
   - Watermarked demonstration copy generator for Admission Offer Letters, Tuition Payment Receipts, Semester Course Registration Slips, and Unofficial Academic Transcripts.

8. **Chronological Audit Trail & Compliance Ledger**
   - Live audit logging recording Actor, Role, Institution, Action, Outcome, and Correlation IDs with CSV export.

---

## 👥 11 Preconfigured Stakeholder Roles

Switch between any role in 1 click without logging out:

| Role | Domain | Primary Focus |
|---|---|---|
| **Super Administrator** | Platform HQ | Multi-tenant governance, revenue metrics, global audit ledger |
| **School ICT Administrator** | Campus ICT | Academic sessions, semesters, faculties, departments, curricula |
| **School Administrator** | Executive Management | Institutional operations and student population oversight |
| **Admissions Officer** | Admissions Board | Candidate screening, UTME/O'Level vetting, offer issuance |
| **University Registrar** | Registry & Senate | Matriculation numbers, student standing, Senate reports |
| **Bursar / Finance Officer** | Bursary | Tuition invoices, simulated settlements, reversals |
| **Faculty Officer** | Faculty Board | Course allocations, registration form endorsement |
| **Lecturer / Academic Staff** | Teaching Department | Class rosters, CA (30%) & Exam (70%) score submission |
| **Examination Officer** | Senate Exams | Score review queue, publishing, result amendments |
| **Undergraduate Student** | Student Portal | Tuition invoices, course registration, live GPA/CGPA |
| **Prospective Applicant** | Candidate Portal | Application progress, offer acceptance, matriculation code |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript with strict type checking
- **Styling:** Tailwind CSS with enterprise navy/slate palette
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** Centralized React Context with automatic browser `localStorage` persistence
- **Testing:** Node.js native test runner (`node:test`, `node:assert`)
- **Deployment:** Vercel-ready (zero backend, zero database, zero external API keys)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js `v18.17+` or `v20+` or `v22+`
- npm `v9+` or `v10+`

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd uniPortal

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing and Production Build

```bash
# Run pure business logic unit tests (GPA, grading scale, access codes)
npm test

# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## ☁️ Vercel Deployment Instructions

Deploying UniCore to Vercel requires **no configuration, no databases, and no environment secrets**:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New..." → "Project"**.
3. Select your repository.
4. Leave all build settings at their defaults:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
5. Click **"Deploy"**. The site will be live and functional in under 2 minutes.

---

## 🔄 Resetting Demonstration Data

To return all records to the original seeded dataset:
- Click the **"Reset Demo"** button located in the top navigation bar or Super Admin dashboard.
- Confirm the dialog to clear `localStorage` and re-seed all tables.

---

## ⚠️ Limitations of this Frontend MVP

1. **Client-Side State Only:** Changes made during the demo are saved in the user's browser `localStorage`. Data is not shared between different devices or browser profiles.
2. **Simulated Security:** Role switching and access-code verifications occur on the client side for demonstration purposes only.
3. **No Real Financial Transactions:** No real banking, card processing, or payment gateways are integrated.
4. **No Real Document Storage:** Uploaded candidate credentials are held in browser memory; no cloud object storage (e.g. AWS S3) is connected.

---

## 🏗️ Production Architecture Recommendations

For an institutional production deployment:
- **Backend & Database:** Node.js / Go microservices with PostgreSQL (schema-per-tenant or row-level security).
- **Access Codes:** Redis-backed token engine with cryptographic signatures and expiration TTLs.
- **Payment Gateway:** Direct integrations with CBN-licensed switches (Paystack, Flutterwave, Remita) utilizing idempotent webhook verifications.
- **Regulatory Compliance:** Adherence to NUC Core Curriculum and Minimum Academic Standards (CCMAS) and NBTE/NCCE guidelines.
- **Audit & Identity:** Tamper-evident write-only append logs (WORM storage) and SAML 2.0 / OpenID Connect SSO.

---

## ⚖️ Legal & Compliance Disclaimer

*UniCore is a demonstration product created for software capability evaluation. All institutions (Greenfield University, Royal Crest Polytechnic, Excellence College of Education), student names, matriculation numbers, and financial data are purely fictional. This demonstration does not claim real institutional accreditations or endorsements.*
