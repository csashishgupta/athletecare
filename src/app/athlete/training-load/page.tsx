import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/database";
import {
  Flame,
  Dumbbell,
} from "lucide-react";

export default async function TrainingLoadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Simulated ACWR Gabbett calculations
  // Acute Load (last 7 days average workload)
  // Chronic Load (last 28 days average workload)
  const acuteLoad = 485; // AU (Arbitrary Units)
  const chronicLoad = 450; // AU
  const acwrRatio = Number((acuteLoad / chronicLoad).toFixed(2)); // 1.08

  const acwrStatus =
    acwrRatio < 0.8
      ? { label: "Under-training Zone", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", note: "Fitness decay risk; training stimulus below maintenance." }
      : acwrRatio <= 1.3
      ? { label: "Sweet Spot (Optimal)", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", note: "Maximized fitness gains with lowest injury risk (Tim Gabbett model)." }
      : acwrRatio <= 1.5
      ? { label: "Elevated Fatigue Zone", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", note: "Moderate risk of overtraining. Recommend active recovery." }
      : { label: "Danger Zone (>1.5)", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", note: "High risk of soft-tissue strain or injury. Reduce workload immediately." };

  const recentSessions = [
    { date: "17-11-2026", type: "High-Intensity Interval Drills", duration: 75, rpe: 8, load: 600 },
    { date: "16-11-2026", type: "Strength & Power Conditioning", duration: 60, rpe: 7, load: 420 },
    { date: "15-11-2026", type: "Active Recovery & Mobility", duration: 45, rpe: 4, load: 180 },
    { date: "14-11-2026", type: "Tactical Match Simulation", duration: 90, rpe: 8, load: 720 },
    { date: "13-11-2026", type: "Aerobic Capacity Run", duration: 50, rpe: 6, load: 300 },
  ];

  return (
    <DashboardLayout profile={profile as Profile}>
      <div className="space-y-6">
        {/* Page Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                Workload Management Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Training Load & ACWR Ratio
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Acute:Chronic Workload Ratio (Session RPE &times; Duration in Minutes) based on the Tim Gabbett sports science model
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              Acute: {acuteLoad} AU • Chronic: {chronicLoad} AU
            </span>
          </div>
        </div>

        {/* ACWR Status Card */}
        <div className={`p-6 rounded-2xl border ${acwrStatus.bg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current ACWR Ratio
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl font-black text-slate-100">{acwrRatio}</span>
                <span className={`text-sm font-bold ${acwrStatus.color}`}>
                  {acwrStatus.label}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300 max-w-xl">
                {acwrStatus.note}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Sweet Spot
              </span>
              <span className="text-xl font-black text-emerald-400">0.80 - 1.30</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Optimal Adaptation Band</span>
            </div>
          </div>

          {/* ACWR Visual Range Meter */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <div className="w-full bg-slate-950 rounded-full h-3 relative overflow-hidden flex">
              <div className="bg-amber-500/70 h-full w-[20%]" title="Under-training (0 - 0.8)" />
              <div className="bg-emerald-500 h-full w-[45%]" title="Sweet Spot (0.8 - 1.3)" />
              <div className="bg-amber-500 h-full w-[15%]" title="Elevated Risk (1.3 - 1.5)" />
              <div className="bg-rose-500 h-full w-[20%]" title="Danger Zone (>1.5)" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>0.0</span>
              <span>0.8 (Sweet Spot)</span>
              <span>1.3</span>
              <span>1.5 (High Risk)</span>
              <span>2.0+</span>
            </div>
          </div>
        </div>

        {/* Recent Training Sessions Log Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              Recent Training Sessions & Session RPE
            </h3>
            <span className="text-xs text-slate-400">Formula: Duration (min) &times; RPE (1-10)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Date (DD-MM-YYYY)</th>
                  <th className="py-2.5 px-3">Session Type</th>
                  <th className="py-2.5 px-3">Duration (min)</th>
                  <th className="py-2.5 px-3">Borg RPE (1-10)</th>
                  <th className="py-2.5 px-3 text-right">Session Load (AU)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recentSessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{s.date}</td>
                    <td className="py-3 px-3 font-sans font-bold text-slate-200">{s.type}</td>
                    <td className="py-3 px-3">{s.duration} min</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        {s.rpe}/10
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-100">
                      {s.load} AU
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
