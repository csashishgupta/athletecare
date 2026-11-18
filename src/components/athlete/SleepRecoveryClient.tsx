"use client";

import React, { useState, useMemo } from "react";
import {
  Moon,
  BatteryCharging,
  Clock,
  Sparkles,
  Heart,
  TrendingUp,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface SleepEntry {
  id: string;
  date: string;
  duration: number;
  quality: number;
  deepSleep: number;
  remSleep: number;
  restingHr: number;
  recoveryScore: number;
}

export function SleepRecoveryClient() {
  const [duration, setDuration] = useState<number>(8.0);
  const [quality, setQuality] = useState<number>(8);
  const [restingHr, setRestingHr] = useState<number>(50);
  const [awakenings, setAwakenings] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Dynamic live calculations
  const liveStats = useMemo(() => {
    // Deep sleep is influenced by duration and quality
    const deepHours = Number((duration * 0.28 * (quality / 10)).toFixed(1));
    const remHours = Number((duration * 0.24 * (quality / 10)).toFixed(1));
    const lightHours = Number((duration - deepHours - remHours).toFixed(1));

    // Recovery score based on collegiate athletic benchmarks
    const durationFactor = Math.min(1, duration / 8.0) * 45;
    const qualityFactor = (quality / 10) * 35;
    const hrFactor = restingHr <= 55 ? 20 : Math.max(5, 20 - (restingHr - 55));
    const rawRecovery = Math.round(durationFactor + qualityFactor + hrFactor - awakenings * 3);
    const recoveryScore = Math.min(100, Math.max(10, rawRecovery));

    return {
      deepHours,
      remHours,
      lightHours,
      recoveryScore,
    };
  }, [duration, quality, restingHr, awakenings]);

  const [history, setHistory] = useState<SleepEntry[]>([
    {
      id: "1",
      date: "17-11-2026",
      duration: 8.2,
      quality: 9,
      deepSleep: 2.3,
      remSleep: 2.0,
      restingHr: 48,
      recoveryScore: 94,
    },
    {
      id: "2",
      date: "16-11-2026",
      duration: 7.5,
      quality: 7,
      deepSleep: 1.8,
      remSleep: 1.7,
      restingHr: 52,
      recoveryScore: 82,
    },
    {
      id: "3",
      date: "15-11-2026",
      duration: 8.0,
      quality: 8,
      deepSleep: 2.1,
      remSleep: 1.9,
      restingHr: 49,
      recoveryScore: 89,
    },
  ]);

  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: todayStr,
      duration,
      quality,
      deepSleep: liveStats.deepHours,
      remSleep: liveStats.remHours,
      restingHr,
      recoveryScore: liveStats.recoveryScore,
    };

    setHistory((prev) => [newEntry, ...prev]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              Biometric Sleep Staging
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Sleep & Recovery Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log your nocturnal sleep to compute real-time deep staging, REM restorative index, and autonomic recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span>Live Recovery: {liveStats.recoveryScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Logger Form */}
        <div className="lg:col-span-6 glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Log Last Night&apos;s Sleep
            </h2>
            <span className="text-[10px] font-mono text-cyan-400">Interactive Inputs</span>
          </div>

          <form onSubmit={handleSaveSleep} className="mt-5 space-y-4">
            {/* Duration Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Total Sleep Duration
                </span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                  {duration.toFixed(1)} Hours
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={11}
                step={0.25}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>4.0h</span>
                <span>8.0h (Optimal target)</span>
                <span>11.0h</span>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Sleep Quality Rating
                </span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {quality}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Poor / Restless)</span>
                <span>10 (Deep / Unbroken)</span>
              </div>
            </div>

            {/* Resting HR and Awakenings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Resting Heart Rate
                  </span>
                  <span className="font-mono font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                    {restingHr} bpm
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={85}
                  value={restingHr}
                  onChange={(e) => setRestingHr(parseInt(e.target.value))}
                  className="w-full accent-rose-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>40 bpm (Athletic)</span>
                  <span>85 bpm</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                  Night Awakenings
                </label>
                <select
                  value={awakenings}
                  onChange={(e) => setAwakenings(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={0}>0 times (Solid unbroken)</option>
                  <option value={1}>1 time (Brief)</option>
                  <option value={2}>2 times</option>
                  <option value={3}>3+ times (Disrupted)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Calculate Recovery Index</span>
            </button>

            {savedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sleep logged successfully! Added to your historical timeline.</span>
              </div>
            )}
          </form>
        </div>

        {/* Real-Time Live Architecture Breakdown */}
        <div className="lg:col-span-6 flex flex-col justify-between glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Computed Sleep Architecture
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                {liveStats.recoveryScore}% Restored
              </span>
            </div>

            {/* 3 Computed Stage Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Deep Sleep
                </span>
                <div className="mt-1 text-2xl font-black text-cyan-300">
                  {liveStats.deepHours}h
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Cellular repair</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  REM Sleep
                </span>
                <div className="mt-1 text-2xl font-black text-indigo-300">
                  {liveStats.remHours}h
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Cognitive repair</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Light Sleep
                </span>
                <div className="mt-1 text-2xl font-black text-slate-300">
                  {liveStats.lightHours}h
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Maintenance</span>
              </div>
            </div>

            {/* Staging Distribution Bar */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-semibold">Hypnogram Staging Ratio</span>
                <span className="font-mono text-[11px] text-slate-400">Total: {duration}h</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 flex overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full"
                  style={{ width: `${(liveStats.deepHours / duration) * 100}%` }}
                  title="Deep Sleep"
                />
                <div
                  className="bg-indigo-400 h-full"
                  style={{ width: `${(liveStats.remHours / duration) * 100}%` }}
                  title="REM Sleep"
                />
                <div
                  className="bg-slate-600 h-full flex-1"
                  title="Light Sleep"
                />
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Deep ({((liveStats.deepHours / duration) * 100).toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" /> REM ({((liveStats.remHours / duration) * 100).toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-600" /> Light ({((liveStats.lightHours / duration) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center justify-between">
            <span>Clinical guidance: Aim for at least 1.8 hours of deep sleep prior to intense match days.</span>
          </div>
        </div>
      </div>

      {/* Historical Sleep Log Table */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <h2 className="text-sm font-bold text-slate-100 mb-3">
          Recent Sleep Entries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Quality</th>
                <th className="py-2.5 px-3">Deep / REM</th>
                <th className="py-2.5 px-3">Resting HR</th>
                <th className="py-2.5 px-3">Recovery Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-200">{row.date}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.duration} hrs</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold">{row.quality}/10</td>
                  <td className="py-2.5 px-3 text-slate-400">{row.deepSleep}h / {row.remSleep}h</td>
                  <td className="py-2.5 px-3 text-rose-300 font-mono">{row.restingHr} bpm</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      {row.recoveryScore}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
