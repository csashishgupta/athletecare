export interface RehabProtocol {
  injuryType: string;
  anatomicalRegion: string;
  phases: {
    phase: string;
    focus: string;
    exercises: string[];
    criteriaForAdvancement: string;
  }[];
}

export const REHABILITATION_PROTOCOLS: RehabProtocol[] = [
  {
    injuryType: "Grade-1 Hamstring Strain",
    anatomicalRegion: "Posterior Thigh (Biceps Femoris)",
    phases: [
      {
        phase: "Phase 1 (Days 1-5)",
        focus: "Pain reduction & active mobilization within pain-free threshold",
        exercises: [
          "Isometric single-leg bridge (3 sets x 30 sec)",
          "Prone knee flexion actively to 90 degrees",
          "Stationary cycling low resistance (15 min)",
        ],
        criteriaForAdvancement: "Pain-free walking and isometric contraction strength >70% contralateral",
      },
      {
        phase: "Phase 2 (Days 6-14)",
        focus: "Eccentric strengthening & lengthening under tension",
        exercises: [
          "Nordic hamstring curls assisted (3 sets x 6 reps)",
          "Romanian Deadlifts with kettlebell (4 sets x 8 reps)",
          "High knee agility ladder mechanics",
        ],
        criteriaForAdvancement: "Full pain-free active range of motion and 80% maximum sprint speed",
      },
      {
        phase: "Phase 3 (Days 15+)",
        focus: "Sport-specific maximal velocity deceleration & match return",
        exercises: [
          "High-speed acceleration and deceleration cuts",
          "Unassisted Nordic hamstring curls (3 sets x 8 reps)",
          "Full simulated match training scrimmage",
        ],
        criteriaForAdvancement: "Medical staff clearance and 100% sprint test match",
      },
    ],
  },
  {
    injuryType: "Lateral Ankle Inversion Sprain",
    anatomicalRegion: "Ankle (Anterior Talofibular Ligament - ATFL)",
    phases: [
      {
        phase: "Phase 1 (Acute Protection)",
        focus: "Edema management, cryotherapy & proprioceptive wake-up",
        exercises: [
          "Towel calf stretches (3 sets x 30 sec)",
          "Ankle alphabet active dorsiflexion/plantarflexion",
          "Single-leg static balance on firm surface (3 x 30 sec)",
        ],
        criteriaForAdvancement: "Normal gait pattern without antalgic limp",
      },
      {
        phase: "Phase 2 (Dynamic Stability)",
        focus: "Neuromuscular balance, resistance bands & multi-planar control",
        exercises: [
          "Resistance band eversion & inversion (4 sets x 15 reps)",
          "BOSU ball single-leg balance with ball toss (3 x 45 sec)",
          "Single-leg hops forward and lateral (3 sets x 10 hops)",
        ],
        criteriaForAdvancement: "Y-Balance dynamic test within 95% of uninjured limb",
      },
    ],
  },
];
