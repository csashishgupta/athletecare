# AthleteCare — Architecture & Technical Reference

## Executive Summary
**AthleteCare** is a production-grade Sports Health, Daily Wellness, and Injury Rehabilitation Platform engineered for collegiate athletic departments, academies, and competitive teams. It provides transparent biometrics, automated readiness modeling (Tim Gabbett Acute:Chronic Workload Ratio), role-governed portals, and HIPAA/GDPR-aligned privacy isolation.

---

## Architecture Diagram & Flow

```
[ Next.js 15 App Router (Edge / Fluid Compute) ]
        │                       │
   Server Actions          Route Handlers
 (Direct Mutations)     (/api/datasets, /api/seed)
        │                       │
        ▼                       ▼
[ Supabase PostgreSQL 15 (ap-southeast-1) ]
   ├── Row Level Security (RLS) on all tables
   ├── Role Isolation: athlete / coach / medical / admin
   └── Audit Logging Trail (audit_logs table)
```

---

## Security & Compliance Architecture

1. **Row Level Security (RLS):**
   - Direct database access enforces role-based constraints.
   - Athletes can only access and update their own records (`auth.uid() = athlete_id`).
   - Coaches can only view aggregated readiness and availability for assigned roster athletes, with zero access to confidential clinical injury details.
   - Medical personnel can inspect injuries, assign rehab protocols, and clear athletes.
   - Administrators have cross-tenant governance and audit capabilities.

2. **Server Actions Layer:**
   - Mutations (`submitWellnessCheckin`, `logNutritionMeal`, `reportInjury`, `completeRehabExercise`, `updateInjuryStatus`, `prescribeRehabExercise`, `updateUserRole`, `toggleUserStatus`) validate with Zod schemas and verify caller session cookies server-side.
   - Automatic `revalidatePath()` guarantees instant cache invalidation without client race conditions.

3. **HTTP Security Headers:**
   - `X-Frame-Options: DENY` (Anti-clickjacking protection)
   - `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Biometric & Mathematical Foundations

### 1. 100-Point Daily Readiness Index
- **Sleep Architecture (Max 25 pts):**
  - Duration Score (15 pts): Optimal 8h window (15 pts), 7–9h (13–15 pts).
  - Sleep Quality (10 pts): Linear scale from subjective restorative rating (1–10).
- **Hydration Volume (Max 20 pts):**
  - Target 3,000 ml: Linear scale up to 3,000 ml (20 pts).
- **Psychological Mood (Max 15 pts):**
  - Linear scaling from 1–10 mood rating.
- **Fatigue Quotient (Max 20 pts):**
  - Inverted scale: 1 (Completely Fresh = 20 pts) to 10 (Exhausted = 0 pts).
- **Musculoskeletal Soreness (Max 20 pts):**
  - Inverted scale: 1 (No Soreness = 20 pts) to 10 (Severe Pain = 0 pts).

### 2. Acute:Chronic Workload Ratio (ACWR) — Tim Gabbett Model
- **Acute Load:** 7-day rolling exponential workload average.
- **Chronic Load:** 28-day rolling exponential workload average.
- **Zones:**
  - `ACWR < 0.80`: Under-training (Fitness decay risk).
  - `0.80 <= ACWR <= 1.30`: Sweet Spot (Maximum performance gains, minimal injury risk).
  - `1.30 < ACWR <= 1.50`: Elevated Fatigue (Active recovery indicated).
  - `ACWR > 1.50`: Danger Spike (>2x elevated soft-tissue injury probability).

---

## Verification & Testing Suite
All algorithms are backed by automated tests running under Node.js native test runner:
- `node --test tests/readiness.test.mjs tests/acwr.test.mjs`
- 100% test pass rate across optimal condition, low readiness, incomplete inputs, and 4-day consecutive pain alerts.
