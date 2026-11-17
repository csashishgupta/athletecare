export interface MockAthleteBiometric {
  id: string;
  fullName: string;
  email: string;
  sport: string;
  position: string;
  heightCm: number;
  weightKg: number;
  readinessScore: number;
  acwrRatio: number;
  sleepHours: number;
  waterIntakeMl: number;
  fatigueRating: number;
  sorenessRating: number;
  status: "cleared" | "modified" | "rest";
}

export const MOCK_COLLEGIATE_ATHLETES: MockAthleteBiometric[] = [
  {
    id: "ath-001",
    fullName: "Arjun Verma",
    email: "arjun.verma@athletecare.in",
    sport: "Cricket",
    position: "Fast Bowler",
    heightCm: 188,
    weightKg: 82,
    readinessScore: 88,
    acwrRatio: 1.06,
    sleepHours: 8.2,
    waterIntakeMl: 3400,
    fatigueRating: 2,
    sorenessRating: 2,
    status: "cleared",
  },
  {
    id: "ath-002",
    fullName: "Rohan Kulkarni",
    email: "rohan.kulkarni@athletecare.in",
    sport: "Cricket",
    position: "All-Rounder",
    heightCm: 182,
    weightKg: 78,
    readinessScore: 74,
    acwrRatio: 1.18,
    sleepHours: 7.1,
    waterIntakeMl: 2900,
    fatigueRating: 4,
    sorenessRating: 3,
    status: "cleared",
  },
  {
    id: "ath-003",
    fullName: "Deepak Yadav",
    email: "deepak.yadav@athletecare.in",
    sport: "Track & Field",
    position: "400m Sprinter",
    heightCm: 176,
    weightKg: 70,
    readinessScore: 56,
    acwrRatio: 1.48,
    sleepHours: 5.8,
    waterIntakeMl: 2400,
    fatigueRating: 7,
    sorenessRating: 6,
    status: "modified",
  },
  {
    id: "ath-004",
    fullName: "Karan Singhania",
    email: "karan.singhania@athletecare.in",
    sport: "Football",
    position: "Center Midfielder",
    heightCm: 179,
    weightKg: 74,
    readinessScore: 92,
    acwrRatio: 1.02,
    sleepHours: 8.5,
    waterIntakeMl: 3600,
    fatigueRating: 2,
    sorenessRating: 1,
    status: "cleared",
  },
  {
    id: "ath-005",
    fullName: "Sameer Joshi",
    email: "sameer.joshi@athletecare.in",
    sport: "Badminton",
    position: "Singles",
    heightCm: 180,
    weightKg: 72,
    readinessScore: 48,
    acwrRatio: 1.62,
    sleepHours: 5.2,
    waterIntakeMl: 2200,
    fatigueRating: 8,
    sorenessRating: 8,
    status: "rest",
  },
];
