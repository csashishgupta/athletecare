"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  Plus,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";

interface TrainingSession {
  id: string;
  date: string;
  type: string;
  duration: number; // mins
  rpe: number; // 1-10
  load: number; // duration * rpe
}

export function TrainingLoadClient() {
  const [sessionType, setSessionType] = useState<string>("High-Intensity Interval Drills");
  const [durationMins, setDurationMins] = useState<number>(60);
  const [rpe, setRpe] = useState<number>(7);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Initial baseline sessions
  const [sessions, setSessions] = useState<TrainingSession[]>([
    { id: "1", date: "17-11-2026", type: "High-Intensity Interval Drills", duration: 75, rpe: 8, load: 600 },
    { id: "2", date: "16-11-2026", type: "Strength & Power Conditioning", duration: 60, rpe: 7, load: 420 },
    { id: "3", date: "15-11-2026", type: "Active Recovery & Mobility", duration: 45, rpe: 4, load: 180 },
    { id: "4", date: "14-11-2026", type: "Tactical Match Simulation", duration: 90, rpe: 8, load: 720 },
    { id: "5", date: "13-11-2026", type: "Aerobic Capacity Run", duration: 50, rpe: 6, load: 300 },
  ]);

  // Live session calculation
  const currentSessionLoad = useMemo(() => {
    return durationMins * rpe;
  }, [durationMins, rpe]);

  // Tim Gabbett ACWR calculations
  const acwrMetrics = useMemo(() => {
    const totalRecentLoad = sessions.slice(0, 7).reduce((acc, s) => acc + s.load, 0);
    const acuteLoad = Math.round(totalRecentLoad / Math.min(sessions.length, 7));
    // Chronic load based on historical baseline
    const chronicLoad = 450;
    const ratio = Number((acuteLoad / chronicLoad).toFixed(2));

    let status = {
      label: "Optimal Sweet Spot",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      bar: "from-cyan-400 to-emerald-400",
      advice: "Lowest injury risk zone with high aerobic and anaerobic fitness adaptation.",
    };

    if (ratio < 0.8) {
      status = {
        label: "Under-training Zone",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/30",
        bar: "from-yellow-400 to-amber-500",
        advice: "Training stimulus is below maintenance. Potential decay in match fitness.",
      };
    } else if (ratio > 1.5) {
      status = {
        label: "High Danger Zone (>1.5)",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/30",
        bar: "from-rose-500 to-orange-500",
        advice: "Excessive acute workload spike. High risk of soft-tissue or ligament strain.",
      };
    } else if (ratio > 1.3) {
      status = {
        label: "Elevated Fatigue Zone",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        bar: "from-amber-400 to-orange-400",
        advice: "Moderate overtraining risk. Recommend tapering volume or active recovery.",
      };
    }

    return {
      acuteLoad,
      chronicLoad,
      ratio,
      status,
    };
  }, [sessions]);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    const newSession: TrainingSession = {
      id: Date.now().toString(),
      date: todayStr,
      type: sessionType,
      duration: durationMins,
      rpe,
      load: currentSessionLoad,
    };

    setSessions((prev) => [newSession, ...prev]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-cyan-400" />
              Workload Monitoring
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Training Load & ACWR Ratio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log training drills with Session RPE to calculate real-time Acute:Chronic Workload Ratio (Tim Gabbett model).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Acute: {acwrMetrics.acuteLoad} AU • Chronic: {acwrMetrics.chronicLoad} AU
          </span>
        </div>
      </div>

      {/* Main Grid: Logger + ACWR Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Session Logger Form */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Log Training Session
            </h2>
            <span className="text-[10px] font-mono text-cyan-400">RPE &times; Duration</span>
          </div>

          <form onSubmit={handleAddSession} className="mt-5 space-y-4">
            {/* Session Type */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Session / Drill Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Tactical Match Simulation">Tactical Match Simulation</option>
                <option value="High-Intensity Interval Drills">High-Intensity Interval Drills</option>
                <option value="Strength & Power Conditioning">Strength & Power Conditioning</option>
                <option value="Speed & Agility Drills">Speed & Agility Drills</option>
                <option value="Aerobic Capacity Run">Aerobic Capacity Run</option>
                <option value="Active Recovery & Mobility">Active Recovery & Mobility</option>
              </select>
            </div>

            {/* Duration Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Session Duration</span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {durationMins} Minutes
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={150}
                step={5}
                value={durationMins}
                onChange={(e) => setDurationMins(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>15 mins (Light)</span>
                <span>60 mins (Standard)</span>
                <span>150 mins (Extended)</span>
              </div>
            </div>

            {/* RPE Intensity Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">
                  Session RPE (Borg CR-10 Intensity)
                </span>
                <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                  RPE {rpe}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={rpe}
                onChange={(e) => setRpe(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Very Easy)</span>
                <span>5 (Moderate)</span>
                <span>10 (Maximal Effort)</span>
              </div>
            </div>

            {/* Calculated Session Workload */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-300">Computed Session Load:</span>
              <span className="text-sm font-black font-mono text-cyan-400">
                {currentSessionLoad} Arbitrary Units (AU)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Record Training Session</span>
            </button>

            {savedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Session logged! ACWR updated in real time.</span>
              </div>
            )}
          </form>
        </div>

        {/* Live ACWR Ratio Gauge & Status */}
        <div className="lg:col-span-6 flex flex-col justify-between glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Acute:Chronic Ratio Status
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${acwrMetrics.status.bg} ${acwrMetrics.status.color}`}>
                {acwrMetrics.status.label}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-5xl font-black text-slate-100 font-mono">
                {acwrMetrics.ratio}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                (Sweet spot: 0.8 - 1.3)
              </span>
            </div>

            {/* Gauge Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 mt-4 overflow-hidden border border-slate-800 relative">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${acwrMetrics.status.bar} transition-all duration-300`}
                style={{ width: `${Math.min(100, Math.max(15, (acwrMetrics.ratio / 2.0) * 100))}%` }}
              />
            </div>

            {/* Zone breakdown marks */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>0.5 (Under)</span>
              <span className="text-emerald-400 font-bold">0.8 - 1.3 (Optimal)</span>
              <span>1.5 (High)</span>
              <span className="text-rose-400">2.0+ (Critical)</span>
            </div>

            {/* Status Details Box */}
            <div className={`mt-5 p-4 rounded-xl border ${acwrMetrics.status.bg}`}>
              <div className={`text-xs font-bold ${acwrMetrics.status.color}`}>
                {acwrMetrics.status.label}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {acwrMetrics.status.advice}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Formula: Acute Load (last 7 days average) / Chronic Load (last 28 days baseline).</span>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <h2 className="text-sm font-bold text-slate-100 mb-3">
          Logged Sessions History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Session Type</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">RPE</th>
                <th className="py-2.5 px-3">Session Load (AU)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sessions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-200">{row.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{row.type}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.duration} mins</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">RPE {row.rpe}/10</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{row.load} AU</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
