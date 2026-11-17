# Comprehensive Sports Science Formulas & Biometric Specifications

This reference document outlines the clinical and physiological formulas implemented within AthleteCare.

---

## 1. Acute-to-Chronic Workload Ratio (ACWR)

The Acute:Chronic Workload Ratio is a validated sports science metric developed to monitor training stress and minimize non-contact soft-tissue injuries.

### Mathematical Formulation
Given an athlete's daily training sessions, each session load is quantified in **Arbitrary Units (AU)** using the Foster et al. Session Rating of Perceived Exertion (sRPE) method:

$$\text{Session Load (AU)} = \text{Duration (minutes)} \times \text{Borg CR-10 RPE}$$

- **Acute Workload ($AW$):** The moving average of daily loads over the most recent 7 days:
  $$AW = \frac{1}{7} \sum_{k=0}^{6} \text{Load}_{t-k}$$

- **Chronic Workload ($CW$):** The moving average of daily loads over the historical 28 days:
  $$CW = \frac{1}{28} \sum_{m=0}^{27} \text{Load}_{t-m}$$

- **Coupled ACWR:**
  $$\text{ACWR} = \frac{AW}{CW}$$

### Clinical Interpretation (Gabbett Sweet Spot)
| ACWR Range | Classification | Injury Likelihood | Recommended Action |
| :--- | :--- | :--- | :--- |
| **$< 0.80$** | Under-training | Elevated long-term risk | Progressive overload required |
| **$0.80 - 1.30$** | **Optimal "Sweet Spot"** | **Lowest Risk (< 5%)** | **Maintain planned drill volume** |
| **$1.30 - 1.50$** | Fatigued State | Moderate Risk (8 - 12%) | Monitor recovery closely |
| **$> 1.50$** | **Danger Spike Zone** | **High Risk (> 20%)** | **Immediate workload reduction** |

---

## 2. Collegiate Hydration Requirements (ICMR Standard)

AthleteCare applies hydration targets aligned with the Indian Council of Medical Research (ICMR) and National Institute of Nutrition (NIN) guidelines for athletic populations exercising in tropical and subtropical Indian climates:

$$\text{Baseline Water (ml)} = \text{Body Weight (kg)} \times 35 \text{ ml/kg}$$

$$\text{Exercise Replenishment (ml)} = \text{Training Duration (hours)} \times 800 \text{ ml/hour}$$

$$\text{Target Daily Intake (ml)} = \text{Baseline Water} + \text{Exercise Replenishment}$$

### Hydration Scale Tiers:
- **Optimal:** $\ge 3,000 \text{ ml}$ (Score: 10/10)
- **Adequate:** $2,500 - 2,999 \text{ ml}$ (Score: 8/10)
- **Mild Dehydration:** $2,000 - 2,499 \text{ ml}$ (Score: 5/10)
- **Severe Dehydration:** $< 2,000 \text{ ml}$ (Score: 2/10)

---

## 3. Sleep Architecture & Autonomic Recovery Score

Sleep architecture is broken down into physiological phases:
1. **Slow Wave / Deep Sleep (N3):** Crucial for somatic tissue regeneration, protein synthesis, and immune modulation. Optimal collegiate athlete proportion: **$20\% - 30\%$ of total sleep**.
2. **Rapid Eye Movement (REM):** Essential for neural plasticity, motor skill refinement, and perceptual-cognitive performance. Optimal proportion: **$20\% - 25\%$**.
3. **Light Sleep (N1 + N2):** Cardiovascular decompression and physical resting baseline. Normal proportion: **$45\% - 55\%$**.

### Sleep Debt Formula:
$$\text{Sleep Debt} = \max(0, \text{Baseline Need (8.0h)} - \text{Actual Sleep Hours})$$

---

## 4. Body Mass Index & Somatotype Ratios

$$\text{BMI} = \frac{\text{Weight (kg)}}{\left(\frac{\text{Height (cm)}}{100}\right)^2}$$

- Underweight: $< 18.5$
- Normal Athletic: $18.5 - 24.9$
- Heavyweight / Muscular Athletic: $25.0 - 29.9$
