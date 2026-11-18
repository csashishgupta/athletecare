"use client";

import React, { useEffect, useState } from "react";
import { SPORTS_REGISTRY, POPULAR_SPORTS } from "@/data/sportsRegistry";
import { Trophy, Target } from "lucide-react";

interface SportPositionSelectorProps {
  initialSport?: string | null;
  initialPosition?: string | null;
  onSportChange: (sport: string) => void;
  onPositionChange: (position: string) => void;
}

export function SportPositionSelector({
  initialSport = "Cricket",
  initialPosition = "Top-Order Batsman",
  onSportChange,
  onPositionChange,
}: SportPositionSelectorProps) {
  const [selectedSport, setSelectedSport] = useState<string>(initialSport || "Cricket");
  const [selectedPosition, setSelectedPosition] = useState<string>(
    initialPosition || "Top-Order Batsman"
  );

  const availablePositions = SPORTS_REGISTRY[selectedSport] || ["General Athlete"];

  useEffect(() => {
    if (initialSport) setSelectedSport(initialSport);
    if (initialPosition) setSelectedPosition(initialPosition);
  }, [initialSport, initialPosition]);

  const handleSelectSport = (sport: string) => {
    setSelectedSport(sport);
    onSportChange(sport);
    const newPositions = SPORTS_REGISTRY[sport] || ["General Athlete"];
    const firstPos = newPositions[0] || "General Athlete";
    setSelectedPosition(firstPos);
    onPositionChange(firstPos);
  };

  const handleSelectPosition = (pos: string) => {
    setSelectedPosition(pos);
    onPositionChange(pos);
  };

  return (
    <div className="space-y-3">
      {/* Sport Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-cyan-400" />
          Primary Sport *
        </label>
        <select
          value={selectedSport}
          onChange={(e) => handleSelectSport(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
        >
          {POPULAR_SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Quick Sports Chips for instant 1-click selection */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {["Cricket", "Football", "Basketball", "Athletics", "Badminton"].map((sport) => (
            <button
              type="button"
              key={sport}
              onClick={() => handleSelectSport(sport)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${
                selectedSport === sport
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Position Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-400" />
          Playing Position / Discipline *
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => handleSelectPosition(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
        >
          {availablePositions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
