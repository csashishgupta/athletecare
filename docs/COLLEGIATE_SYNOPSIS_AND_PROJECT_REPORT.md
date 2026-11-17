# AthleteCare: A Centralized Daily Sports Wellness, Workload & Rehabilitation Platform
## Academic Project Synopsis, Architecture Blueprint & Final Engineering Report

---

### Project Metadata
- **Project Name:** AthleteCare
- **Project Title:** A Daily Wellness Tracking Platform for Athletes, Coaches, and Medical Staff
- **Category:** Sports Fitness / Health and Wellness Management
- **Type:** Full-Stack Web Development Capstone Project
- **Target Audience:** Collegiate athletic departments, amateur sports teams, sports physiotherapists, and team coaches
- **Primary Technical Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase Cloud (PostgreSQL 15), Row Level Security (RLS), Vercel Edge Hosting

---

## 1. Problem Statement & Synopsis

### 1.1 The Context of Amateur & Collegiate Athletics
In amateur and inter-collegiate athletic programs across India, athletic monitoring is frequently disorganized, informal, or completely absent. Athletes often train through dangerous thresholds of accumulated physical and neural fatigue without objective measurement. 

Communication between athletes, strength and conditioning coaches, and team physiotherapists suffers from three core bottlenecks:
1. **Subjective Data Silos:** Daily sleep hours, sleep quality, hydration volume, and localized muscle soreness are rarely tracked on a systematic daily basis. When tracked, data is scattered across manual paper charts, messaging apps, or personal spreadsheets.
2. **Workload Blind Spots:** Without quantifying Acute-to-Chronic Workload Ratios (ACWR), training spikes (excessive rapid increases in drill duration and intensity) trigger preventable non-contact soft-tissue injuries such as hamstring tears, groin strains, and patellar tendinitis.
3. **Clinical Rehabilitation Disconnect:** When an athlete is injured, rehabilitation exercises (sets, reps, targeted muscle lengthening) prescribed by sports medical personnel are rarely synchronized with the head coach's drill rosters, resulting in premature match return and re-injury.

### 1.2 Proposed Solution: The AthleteCare Architecture
AthleteCare delivers a centralized, multi-stakeholder platform with real-time role isolation:
- **Athletes:** Complete a rapid (<60-second) morning check-in logging sleep, water intake in millilitres, mood rating, muscle soreness, and completed rehab exercises. They instantly view an algorithmic 0-100 Readiness Index and ACWR workload status.
- **Coaches:** Monitor an aggregated squad readiness board, highlighting athletes at risk (readiness score <60 or high consecutive pain) prior to morning drills, while clinical medical privacy remains strictly shielded.
- **Medical Staff (Physiotherapists):** Document active injury cases with anatomical body mapping, prescribe structured rehabilitation protocols with target sets and repetitions, and retain confidential clinical consultation notes.
- **Administrators:** Govern user role assignments (RBAC), monitor database telemetry, inspect immutable audit logs, and simulate demonstration cohorts.

---

## 2. Mathematical Models & Sports Science Algorithms

### 2.1 The 6-Pillar Athlete Readiness Score (0-100)
The readiness calculation implemented in `src/lib/calculations/readiness.ts` employs a clinically weighted biometric model:

$$R = 0.30 \times S_{\text{sleep}} + 0.15 \times S_{\text{quality}} + 0.15 \times S_{\text{hydration}} + 0.10 \times S_{\text{mood}} + 0.15 \times (10 - S_{\text{fatigue}}) + 0.15 \times (10 - S_{\text{soreness}})$$

#### Normalization Rules:
1. **Sleep Duration ($S_{\text{sleep}}$):**
   - $\ge 8.0 \text{ hrs}$: 100 points
   - $7.0 - 7.9 \text{ hrs}$: 85 points
   - $6.0 - 6.9 \text{ hrs}$: 65 points
   - $< 6.0 \text{ hrs}$: 35 points
2. **Sleep Quality ($S_{\text{quality}}$):**
   - Scaled linearly: $\text{Rating (1-10)} \times 10$ points.
3. **Hydration Volume ($S_{\text{hydration}}$):**
   - $\ge 3,000 \text{ ml}$: 100 points
   - $2,500 - 2,999 \text{ ml}$: 85 points
   - $2,000 - 2,499 \text{ ml}$: 60 points
   - $< 2,000 \text{ ml}$: 30 points
4. **Mood & Mental Resilience ($S_{\text{mood}}$):**
   - Scaled linearly: $\text{Rating (1-10)} \times 10$ points.
5. **Inverse Fatigue:**
   - $(10 - \text{Fatigue Rating (1-10)}) \times 10$ points.
6. **Inverse Muscle Soreness:**
   - $(10 - \text{Soreness Rating (1-10)}) \times 10$ points.

#### Built-in Clinical Safety Alert:
If an athlete logs a localized muscle soreness or pain rating $\ge 7$ for two or more consecutive check-ins, the system automatically triggers an urgent medical flag notifying team physiotherapists for immediate clinical assessment.

---

### 2.2 Tim Gabbett Acute:Chronic Workload Ratio (ACWR)
AthleteCare incorporates the Foster et al. Session Rating of Perceived Exertion (sRPE) multiplied by session duration in minutes to calculate daily training strain:

$$\text{Session Load (AU)} = \text{Duration (min)} \times \text{Borg CR-10 RPE}$$

$$\text{Acute Workload (7-Day Rolling Average)} = \frac{1}{7} \sum_{i=1}^{7} \text{Load}_i$$

$$\text{Chronic Workload (28-Day Historical Baseline)} = \frac{1}{28} \sum_{j=1}^{28} \text{Load}_j$$

$$\text{ACWR} = \frac{\text{Acute Workload}}{\text{Chronic Workload}}$$

- **$< 0.80$ (Under-training Zone):** Deconditioning phase; injury risk on match intensity spikes.
- **$0.80 - 1.30$ (The Sweet Spot):** Optimal physiological stimulus with lowest documented injury rate (<5%).
- **$1.30 - 1.50$ (Elevated Fatigue Zone):** Critical fatigue accumulation.
- **$> 1.50$ (Danger Zone):** High non-contact injury likelihood. Immediate volume reduction advised.

---

## 3. Database Schema & Relational Architecture

AthleteCare operates on PostgreSQL 15 managed through Supabase Cloud.

```
                           +-------------------+
                           |    auth.users     |
                           +-------------------+
                                     |
                                     | 1:1 Trigger
                                     v
                           +-------------------+
                           |     profiles      |
                           +-------------------+
                           | id (PK, UUID)     |
                           | full_name (text)  |
                           | email (text)      |
                           | role (UserRole)   |
                           | height_cm (int)   |
                           | weight_kg (int)   |
                           | is_active (bool)  |
                           +-------------------+
                                     |
          +--------------------------+--------------------------+
          | 1:N                      | 1:N                      | 1:N
          v                          v                          v
+--------------------+     +--------------------+     +--------------------+
|  wellness_records  |     | nutrition_records  |     |   injury_records   |
+--------------------+     +--------------------+     +--------------------+
| id (PK, UUID)      |     | id (PK, UUID)      |     | id (PK, UUID)      |
| athlete_id (FK)    |     | athlete_id (FK)    |     | athlete_id (FK)    |
| record_date (date) |     | record_date (date) |     | body_location      |
| sleep_hours (num)  |     | water_intake_ml    |     | severity (text)    |
| sleep_quality      |     | meals_logged (json)|     | status (text)      |
| water_intake_ml    |     | calories_consumed  |     | clinical_notes     |
| fatigue_level      |     | protein_grams      |     +--------------------+
| soreness_level     |     +--------------------+               |
| readiness_score    |                                          | 1:N
+--------------------+                                          v
                                                      +--------------------+
                                                      | rehabilitation_ex  |
                                                      +--------------------+
                                                      | id (PK, UUID)      |
                                                      | injury_id (FK)     |
                                                      | exercise_name      |
                                                      | target_sets        |
                                                      | target_reps        |
                                                      | is_completed (bool)|
                                                      +--------------------+
```

---

## 4. Security Engineering & Row Level Security (RLS)

All public endpoints and database tables are protected by Row Level Security policies:
1. `profiles`: Every authenticated user can read profile basics; users can only update their own profile; admins can modify roles and active flags.
2. `wellness_records`: Athletes can read and insert their own records; coaches can read records of athletes in their squad; medical staff have read access.
3. `injury_records`: Athletes can view their injury reports; medical staff have full create/read/update access; coaches have status-only visibility.
4. `audit_logs`: Append-only security audit trail recording all administrative role transitions and account deactivations.

---

## 5. Indian Collegiate Standard Compliance
- **Physical Metrics:** Height in centimetres (`cm`), Weight in kilograms (`kg`), Hydration volume in millilitres (`ml`).
- **Calendar & Time:** Date format strictly `DD-MM-YYYY`, Timezone pinned to `Asia/Kolkata` (IST).
