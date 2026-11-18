"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface TeamAthlete {
  id: string;
  full_name: string;
  email: string;
  primary_sport: string | null;
  playing_position: string | null;
  latestScore: number | null;
  sleepHours: number | null;
  waterMl: number | null;
  trainingAvailability: "Full Training" | "Modified Drills" | "Rest Recommended" | "Awaiting Check-in";
  statusColor: "green" | "yellow" | "red" | "gray";
}

interface SquadRosterTableProps {
  athletes: TeamAthlete[];
}

export function SquadRosterTable({ athletes }: SquadRosterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.primary_sport && a.primary_sport.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.playing_position && a.playing_position.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === "attention") {
      return matchesSearch && a.latestScore != null && a.latestScore < 60;
    }
    if (filterStatus === "optimal") {
      return matchesSearch && a.latestScore != null && a.latestScore >= 80;
    }
    return matchesSearch;
  });

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Squad Daily Readiness &amp; Availability Board
          </h3>
          <p className="text-xs text-slate-400">
            Daily wellness aggregated indicators with confidential medical shielding
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter athlete name, sport..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-navy-950 border border-navy-800">
            {(["all", "attention", "optimal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-medium transition-colors ${
                  filterStatus === tab
                    ? "bg-cyan-500/20 text-cyan-400 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-800">
            <tr>
              <th className="pb-3">Athlete</th>
              <th className="pb-3">Sport &amp; Position</th>
              <th className="pb-3">Latest Readiness</th>
              <th className="pb-3">Sleep / Water</th>
              <th className="pb-3">Training Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60">
            {filteredAthletes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No athletes match current search criteria.
                </td>
              </tr>
            ) : (
              filteredAthletes.map((athlete) => {
                const badgeVariant =
                  athlete.statusColor === "green"
                    ? "success"
                    : athlete.statusColor === "yellow"
                    ? "warning"
                    : athlete.statusColor === "red"
                    ? "danger"
                    : "neutral";

                return (
                  <tr key={athlete.id} className="hover:bg-navy-850/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-100">{athlete.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {athlete.email}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-slate-200 font-medium">
                        {athlete.primary_sport || "Athlete"}
                      </span>
                      {athlete.playing_position && (
                        <span className="text-[10px] text-slate-400 block">
                          {athlete.playing_position}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {athlete.latestScore != null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-100">
                            {athlete.latestScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">
                          Awaiting check-in
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {athlete.sleepHours != null ? (
                        <span className="text-slate-300 font-mono">
                          {athlete.sleepHours}h • {athlete.waterMl}ml
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <Badge variant={badgeVariant}>
                        {athlete.trainingAvailability}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
