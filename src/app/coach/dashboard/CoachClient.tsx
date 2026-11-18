"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WeeklyWellnessChart } from "@/components/charts/WeeklyWellnessChart";
import { CoachStatsOverview } from "@/components/coach/CoachStatsOverview";
import { SquadRosterTable, TeamAthlete } from "@/components/coach/SquadRosterTable";
import { AddAthleteForm } from "@/components/coach/AddAthleteForm";
import { ShieldCheck } from "lucide-react";

interface CoachClientProps {
  coachId: string;
  athletes: TeamAthlete[];
  weeklyTeamTrend: Array<{
    date: string;
    displayDate: string;
    readiness: number;
    sleep: number;
    fatigue: number;
    soreness: number;
  }>;
}

export function CoachClient({ coachId, athletes, weeklyTeamTrend }: CoachClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const totalAthletes = athletes.length;
  const activeCount = athletes.filter((a) => a.latestScore != null).length;
  const attentionCount = athletes.filter(
    (a) => a.latestScore != null && a.latestScore < 60
  ).length;

  const validScores = athletes.filter((a) => a.latestScore != null).map((a) => a.latestScore!);
  const teamAverageReadiness =
    validScores.length > 0
      ? Math.round(validScores.reduce((sum, s) => sum + s, 0) / validScores.length)
      : 0;

  const peakAvailabilityCount = athletes.filter(
    (a) => a.trainingAvailability === "Full Training"
  ).length;

  const handleAddAthleteEmail = async (email: string) => {
    // 1. Search for profile by email
    const { data: athleteProfile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, role, full_name")
      .eq("email", email.toLowerCase())
      .single();

    if (profileErr || !athleteProfile) {
      return { success: false, message: "No registered athlete found with that email." };
    }

    if (athleteProfile.role !== "athlete") {
      return { success: false, message: "Selected user is not an athlete." };
    }

    // 2. Add to team_memberships
    const { error: teamErr } = await supabase.from("team_memberships").insert({
      coach_id: coachId,
      athlete_id: athleteProfile.id,
    });

    if (teamErr) {
      if (teamErr.code === "23505") {
        return { success: false, message: "Athlete is already in your team roster." };
      }
      return { success: false, message: teamErr.message };
    }

    router.refresh();
    return {
      success: true,
      message: `Added ${athleteProfile.full_name} to your team roster!`,
    };
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Head Coach Roster Hub
            </span>
            <span className="text-xs text-slate-500">&bull; Privacy Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Team Readiness &amp; Availability
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Calibrate daily training loads based on aggregated athlete wellness indicators
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-850 border border-navy-800 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-sports-green shrink-0" />
          <span>Strict Coach Privacy: Zero access to confidential medical details</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <CoachStatsOverview
        totalAthletes={totalAthletes}
        activeCount={activeCount}
        teamAverageReadiness={teamAverageReadiness}
        attentionCount={attentionCount}
        peakAvailabilityCount={peakAvailabilityCount}
      />

      {/* Weekly Team Trend Chart */}
      <WeeklyWellnessChart data={weeklyTeamTrend} />

      {/* Add Athlete to Team Form */}
      <AddAthleteForm onAddEmail={handleAddAthleteEmail} />

      {/* Squad Roster Table */}
      <SquadRosterTable athletes={athletes} />
    </div>
  );
}
