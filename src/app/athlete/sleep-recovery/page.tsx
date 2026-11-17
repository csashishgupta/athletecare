import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/database";
import {
  Moon,
  BatteryCharging,
  Clock,
} from "lucide-react";

export default async function SleepRecoveryPage() {
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

  // Biometric sleep architecture benchmarks
  const sleepDurationHours = 8.2;
  const sleepQuality = 9;
  const remSleepHours = 2.1;
  const deepSleepHours = 2.4;
  const lightSleepHours = 3.7;
  const restingHeartRate = 48; // bpm (collegiate athletic standard)
  const recoveryScore = 91; // %

  return (
    <DashboardLayout profile={profile as Profile}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Sleep Architecture & Autonomic Recovery
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Sleep & Recovery Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Quantitative sleep staging, deep restorative sleep hours, and resting heart rate monitoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
              Quality: {sleepQuality}/10
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              Recovery Index: {recoveryScore}%
            </span>
          </div>
        </div>

        {/* 4 Sleep Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Total Sleep Time</span>
            <div className="mt-2 text-3xl font-black text-slate-100 flex items-baseline gap-1.5">
              {sleepDurationHours}<span className="text-xs font-semibold text-slate-400">Hours</span>
            </div>
            <p className="mt-2 text-[10px] text-emerald-400 font-medium">
              Surpassed collegiate target (&gt;8.0 hrs)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Restorative Deep Sleep</span>
            <div className="mt-2 text-3xl font-black text-slate-100 flex items-baseline gap-1.5">
              {deepSleepHours}<span className="text-xs font-semibold text-slate-400">Hours</span>
            </div>
            <p className="mt-2 text-[10px] text-cyan-400 font-medium">
              29% of sleep (Physical cellular repair)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">REM Cognitive Sleep</span>
            <div className="mt-2 text-3xl font-black text-slate-100 flex items-baseline gap-1.5">
              {remSleepHours}<span className="text-xs font-semibold text-slate-400">Hours</span>
            </div>
            <p className="mt-2 text-[10px] text-indigo-300 font-medium">
              25% of sleep (Motor skill consolidation)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Resting Heart Rate (RHR)</span>
            <div className="mt-2 text-3xl font-black text-slate-100 flex items-baseline gap-1.5">
              {restingHeartRate}<span className="text-xs font-semibold text-slate-400">bpm</span>
            </div>
            <p className="mt-2 text-[10px] text-emerald-400 font-medium">
              Low baseline indicates strong parasympathetic tone
            </p>
          </div>
        </div>

        {/* Sleep Staging Breakdown Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Sleep Architecture Distribution (Last Check-in)
          </h3>

          <div className="w-full bg-slate-950 rounded-xl h-6 relative overflow-hidden flex">
            <div
              style={{ width: `${(deepSleepHours / sleepDurationHours) * 100}%` }}
              className="bg-indigo-600 h-full flex items-center justify-center text-[10px] font-bold text-white"
              title="Deep Sleep (2.4h)"
            >
              Deep (29%)
            </div>
            <div
              style={{ width: `${(remSleepHours / sleepDurationHours) * 100}%` }}
              className="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-950"
              title="REM Sleep (2.1h)"
            >
              REM (25%)
            </div>
            <div
              style={{ width: `${(lightSleepHours / sleepDurationHours) * 100}%` }}
              className="bg-slate-700 h-full flex items-center justify-center text-[10px] font-bold text-slate-200"
              title="Light Sleep (3.7h)"
            >
              Light (46%)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-indigo-400 block">Deep Sleep (Physical)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Human Growth Hormone (HGH) release, tissue reconstruction, and immune replenishment.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">REM Sleep (Neurological)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Tactical processing, tactical memory formation, and reaction time restoration.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-300 block">Light Sleep (Transition)</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Body temperature down-regulation, heart rate stabilization, and resting baseline maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
