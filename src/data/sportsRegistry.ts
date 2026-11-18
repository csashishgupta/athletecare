export interface SportDefinition {
  name: string;
  positions: string[];
}

export const SPORTS_REGISTRY: Record<string, string[]> = {
  Cricket: [
    "Top-Order Batsman",
    "Middle-Order Batsman",
    "Wicketkeeper-Batsman",
    "All-Rounder",
    "Fast Bowler",
    "Spin Bowler",
  ],
  Football: [
    "Forward / Striker",
    "Winger",
    "Attacking Midfielder",
    "Central Midfielder",
    "Defensive Midfielder",
    "Full-Back / Wing-Back",
    "Centre-Back",
    "Goalkeeper",
  ],
  Basketball: [
    "Point Guard (PG)",
    "Shooting Guard (SG)",
    "Small Forward (SF)",
    "Power Forward (PF)",
    "Center (C)",
  ],
  Badminton: [
    "Singles Specialist",
    "Doubles Specialist",
    "Mixed Doubles Specialist",
  ],
  Athletics: [
    "Sprinter (100m / 200m / 400m)",
    "Middle Distance (800m / 1500m)",
    "Long Distance (5000m / 10000m)",
    "Hurdles Specialist",
    "Long / High / Triple Jump",
    "Javelin / Shot Put Thrower",
  ],
  Tennis: [
    "Singles Player",
    "Doubles Player",
  ],
  Kabaddi: [
    "Raider",
    "Corner Defender",
    "Cover Defender",
    "All-Rounder",
  ],
  Hockey: [
    "Forward / Striker",
    "Midfielder",
    "Full-Back / Defender",
    "Goalkeeper",
  ],
  Swimming: [
    "Freestyle Sprinter",
    "Distance Freestyle",
    "Butterfly Specialist",
    "Backstroke Specialist",
    "Breaststroke Specialist",
    "Individual Medley (IM)",
  ],
  Volleyball: [
    "Outside Hitter",
    "Opposite Hitter",
    "Setter",
    "Middle Blocker",
    "Libero",
  ],
  "Other Sport": [
    "General Athlete",
    "Captain",
    "Reserve / Specialist",
  ],
};

export const POPULAR_SPORTS = Object.keys(SPORTS_REGISTRY);
