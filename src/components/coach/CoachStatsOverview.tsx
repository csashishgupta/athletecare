"use client";

import React from "react";
import { Users, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CoachStatsOverviewProps {
  totalAthletes: number;
  activeCount: number;
  teamAverageReadiness: number;
  attentionCount: number;
  peakAvailabilityCount: number;
}

export function CoachStatsOverview({
  totalAthletes,
  activeCount,
  teamAverageReadiness,
  attentionCount,
  peakAvailabilityCount,
}: CoachStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card p-5 rounded-2xl border border-navy-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Team Roster</span>
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-black text-slate-100">{totalAthletes}</span>
          <span className="text-xs text-slate-400 ml-1.5">Athletes</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {activeCount} active check-ins logged
        </p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-navy-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Avg Team Readiness</span>
          <div className="w-7 h-7 rounded-lg bg-sports-green/10 text-sports-green flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-black text-slate-100">
            {teamAverageReadiness}
          </span>
          <span className="text-xs text-sports-green ml-1.5 font-bold">/100</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {teamAverageReadiness >= 80
            ? "High team readiness for peak training"
            : teamAverageReadiness >= 60
            ? "Moderate baseline; monitor fatigue"
            : "Low team baseline; reduce workload"}
        </p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-navy-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Attention Flagged</span>
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-black text-rose-400">
            {attentionCount}
          </span>
          <span className="text-xs text-slate-400 ml-1.5">Athletes</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {attentionCount === 0
            ? "All athletes above fatigue threshold"
            : "Readiness score below 60/100"}
        </p>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-navy-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">Peak Availability</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-black text-sports-green">
            {peakAvailabilityCount}
          </span>
          <span className="text-xs text-slate-400 ml-1.5">Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Cleared for full competitive scrimmage
        </p>
      </div>
    </div>
  );
}
