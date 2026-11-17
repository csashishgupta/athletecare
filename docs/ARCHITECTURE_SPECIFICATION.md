# AthleteCare Platform Architecture & System Engineering Specification

## 1. Executive Summary

AthleteCare is an enterprise-grade sports fitness, health, and biometric readiness management system designed specifically for collegiate athletic departments, amateur sports academies, coaches, and sports medical practitioners (physiotherapists). 

The platform addresses a critical gap in amateur sports technology: the fragmentation of daily wellness tracking, workload monitoring (ACWR), nutritional hydration compliance, and physical therapy rehabilitation tracking.

---

## 2. System Architecture & Tech Stack

```
+----------------------------------------------------------------------------+
|                                Client Layer                                |
|  - Next.js 15 (App Router, Server Components & Suspense Streaming)         |
|  - Tailwind CSS + Titanium Glassmorphism Design Tokens                     |
|  - Lucide React Iconography + Recharts Biometric Visualizations            |
|  - React Hook Form + Zod Schema Validation                                 |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                            Application Server                              |
|  - Next.js 15 Server Actions (Type-safe RPC & Form Handlers)               |
|  - Route Handlers (/api/auth/callback, /api/seed)                          |
|  - Middleware Session Guard & RBAC Router                                  |
|  - Edge Fluid Compute on Vercel Infrastructure                             |
+----------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
|                        Data & Authentication Layer                         |
|  - Supabase Cloud PostgreSQL 15 (ap-south-1 Mumbai)                         |
|  - Row Level Security (RLS) Enforced at Postgres Kernel                    |
|  - PostgreSQL Triggers (Auto-confirmation on auth.users insert)           |
|  - Immutable Audit Logging Trail (audit_logs table)                        |
+----------------------------------------------------------------------------+
```

### 2.1 Technology Rationale
- **Next.js 15 App Router:** Provides lightning-fast initial server renders (SSR) and streaming loading states via `loading.tsx` skeletons, eliminating user-perceived latency on route transitions.
- **Supabase PostgreSQL & Auth:** Guarantees relational ACID integrity, real-time trigger pipelines, and hardware-accelerated queries.
- **Row Level Security (RLS):** Prevents privilege escalation and cross-tenant leakage. Even if a client bypasses the frontend, the PostgreSQL engine rejects unauthorized queries.

---

## 3. Mathematical Models & Sports Science Algorithms

### 3.1 The 6-Pillar Athlete Readiness Score (0-100)

The AthleteCare readiness algorithm computes a daily composite score ($R$) upon morning check-in:

$$R = w_{\text{dur}} \cdot S_{\text{dur}} + w_{\text{qual}} \cdot S_{\text{qual}} + w_{\text{hyd}} \cdot S_{\text{hyd}} + w_{\text{mood}} \cdot S_{\text{mood}} + w_{\text{fat}} \cdot (10 - S_{\text{fat}}) + w_{\text{sor}} \cdot (10 - S_{\text{sor}})$$

Where normalized weights sum to $100\%$:
- Sleep Duration Score ($S_{\text{dur}}$): **30% weight** (Target 7.0 - 9.0 hours baseline).
- Sleep Quality Score ($S_{\text{qual}}$): **15% weight** (Subjective depth scale 1-10).
- Hydration Volume Score ($S_{\text{hyd}}$): **15% weight** (Benchmark 2,500 - 3,500 ml/day).
- Mood Rating Score ($S_{\text{mood}}$): **10% weight** (Mental wellness 1-10).
- Inverse Fatigue Score ($10 - S_{\text{fat}}$): **15% weight** (Fatigue rating 1-10).
- Inverse Muscle Soreness Score ($10 - S_{\text{sor}}$): **15% weight** (Localized muscle soreness 1-10).

#### Readiness Score Interpretation Tiers
- **Green Tier ($80 - 100$):** Optimal Readiness. High autonomic recovery; primed for maximum match intensity.
- **Amber Tier ($60 - 79$):** Moderate Readiness. Moderate neuromuscular fatigue; volume adjustment recommended.
- **Red Tier ($0 - 59$):** Compromised Recovery. Severe fatigue or under-recovery; high injury risk. Coach flagged.

### 3.2 Acute:Chronic Workload Ratio (ACWR)

Following the peer-reviewed methodology of Dr. Tim Gabbett (2016), AthleteCare measures the relationship between recent training load and historical baseline training load:

$$\text{Daily Session Workload (AU)} = \text{Session Duration (min)} \times \text{Borg Session RPE (1-10)}$$

$$\text{Acute Workload} = \frac{1}{7} \sum_{i=1}^{7} \text{Load}_i$$

$$\text{Chronic Workload} = \frac{1}{28} \sum_{j=1}^{28} \text{Load}_j$$

$$\text{ACWR} = \frac{\text{Acute Workload}}{\text{Chronic Workload}}$$

#### ACWR Risk Zones
- **$< 0.80$ (Under-training Zone):** Fitness decay; athlete is unconditioned for competitive match spikes.
- **$0.80 - 1.30$ (Sweet Spot):** Optimal training stimulus with minimal injury risk.
- **$1.30 - 1.50$ (Elevated Risk):** Fatigued threshold; monitor recovery closely.
- **$> 1.50$ (Danger Zone):** Critical spike; injury risk increases exponentially by 200-400%.

---

## 4. Security, Privacy & Role-Based Access Control (RBAC)

AthleteCare enforces 4 distinct stakeholder roles:

1. **Athlete:**
   - Full read/write access to their own daily check-ins, hydration, nutrition, and ACWR logs.
   - Read-only access to prescribed rehabilitation exercises.
   - Cannot view clinical physiotherapist notes or other athletes' wellness metrics.

2. **Coach:**
   - Read-only team roster view of readiness scores, fatigue levels, and injury statuses.
   - **Medical Privacy Guard:** Strictly prohibited from accessing clinical diagnostic notes or medical chart histories.

3. **Medical Staff (Physiotherapist):**
   - Full read/write access to injury diagnostic cases, rehabilitation prescriptions, and confidential clinical notes.
   - Read-only access to athlete readiness metrics.

4. **Administrator:**
   - Full platform governance: role assignment, user activation/suspension, audit trail inspection, and demo telemetry simulation.

---

## 5. Indian Athletic Standards & Localization

To align with collegiate programs in India, AthleteCare enforces:
- **Height Units:** Centimetres (`cm`).
- **Weight Units:** Kilograms (`kg`).
- **Hydration Units:** Millilitres (`ml`) and Litres (`L`).
- **Date Format:** `DD-MM-YYYY`.
- **Time Zone Standard:** `Asia/Kolkata` (Indian Standard Time, UTC +5:30).

---

## 6. Verification & Quality Assurance

- **Static Type Checking:** Zero TypeScript compiler errors (`npx tsc --noEmit`).
- **Linter Standards:** Zero ESLint warnings or errors (`npm run lint`).
- **Automated Unit Testing:** Node test runner coverage across readiness scoring, ACWR Gabbett ratio, and consecutive pain safety alerts (`node --test tests/`).
