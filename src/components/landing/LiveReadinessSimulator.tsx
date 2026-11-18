"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { calculateReadinessScore } from "@/lib/calculations/readiness";
import { Activity, Moon, Droplets, Smile, Zap, Sparkles, ArrowRight } from "lucide-react";

export function LiveReadinessSimulator() {
  const [sleepHours, setSleepHours] = useState<number>(8.0);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(3000);
  const [moodRating, setMoodRating] = useState<number>(8);
  const [fatigueLevel, setFatigueLevel] = useState<number>(2);
  const [sorenessLevel, setSorenessLevel] = useState<number>(2);

  const breakdown = useMemo(() => {
    return calculateReadinessScore({
      sleep_hours: sleepHours,
      sleep_quality: sleepQuality,
      water_intake_ml: waterIntakeMl,
      mood_rating: moodRating,
      fatigue_level: fatigueLevel,
      soreness_level: sorenessLevel,
    });
  }, [sleepHours, sleepQuality, waterIntakeMl, moodRating, fatigueLevel, sorenessLevel]);

  const score = breakdown.totalScore ?? 85;

  const statusBadge = useMemo(() => {
    if (score >= 80) {
      return {
        label: "Peak Performance Ready",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/30",
        bar: "from-cyan-400 to-emerald-400",
        desc: "Cleared for full training intensity and competition.",
      };
    } else if (score >= 60) {
      return {
        label: "Moderate Readiness",
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/30",
        bar: "from-amber-400 to-yellow-400",
        desc: "Maintain regular workload. Monitor warm-up and hydration.",
      };
    } else {
      return {
        label: "High Fatigue / Rest Required",
        color: "text-rose-400",
        bg: "bg-rose-500/10 border-rose-500/30",
        bar: "from-rose-500 to-orange-400",
        desc: "Significant recovery deficit. Modify session or active recovery.",
      };
    }
  }, [score]);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Interactive Readiness Engine Simulator
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-semibold">
                Live 6-Pillar Formula
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Drag the biometric sliders below to test how sleep, water, and fatigue calculate daily athlete readiness
            </p>
          </div>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
        >
          <span>Log Real Data</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Left Side: Sliders */}
        <div className="lg:col-span-7 space-y-4">
          {/* Slider 1: Sleep */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Sleep Duration (Hours)
              </span>
              <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                {sleepHours.toFixed(1)} hrs
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={11}
              step={0.5}
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>4.0h (Deficit)</span>
              <span>8.0h (Collegiate Target)</span>
              <span>11.0h</span>
            </div>
          </div>

          {/* Slider 2: Water */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Water Intake (ml)
              </span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {waterIntakeMl} ml
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={4500}
              step={250}
              value={waterIntakeMl}
              onChange={(e) => setWaterIntakeMl(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1000 ml</span>
              <span>3000 ml (Target)</span>
              <span>4500 ml</span>
            </div>
          </div>

          {/* Slider 3: Quality & Mood Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  Sleep Quality
                </span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                  {sleepQuality}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={sleepQuality}
                onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                className="w-full accent-indigo-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Restless)</span>
                <span>10 (Deep)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-sky-400" />
                  Mood Rating
                </span>
                <span className="font-mono font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                  {moodRating}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={moodRating}
                onChange={(e) => setMoodRating(parseInt(e.target.value))}
                className="w-full accent-sky-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Low)</span>
                <span>10 (Energized)</span>
              </div>
            </div>
          </div>

          {/* Slider 4: Soreness & Fatigue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Muscle Soreness
                </span>
                <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                  {sorenessLevel}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={sorenessLevel}
                onChange={(e) => setSorenessLevel(parseInt(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (None)</span>
                <span>10 (Severe)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-emerald-400" />
                  Fatigue Level
                </span>
                <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  {fatigueLevel}/10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(parseInt(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 (Fresh)</span>
                <span>10 (Exhausted)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Dynamic Output Display */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/[0.08] relative">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Simulated Output
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-100 font-mono tracking-tight">
                {score}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 100 PTS</span>
            </div>

            {/* Live Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${statusBadge.bar} transition-all duration-300`}
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>

            {/* Dynamic Status Pill */}
            <div className={`mt-4 p-3 rounded-xl border ${statusBadge.bg}`}>
              <div className={`text-xs font-bold ${statusBadge.color}`}>
                {statusBadge.label}
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {statusBadge.desc}
              </p>
            </div>

            {/* Points Breakdown */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Sleep</span>
                <span className="font-bold text-indigo-300">{breakdown.components.sleep.score}/25</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Water</span>
                <span className="font-bold text-cyan-300">{breakdown.components.hydration.score}/20</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Soreness</span>
                <span className="font-bold text-amber-300">{breakdown.components.soreness.score}/20</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Fatigue</span>
                <span className="font-bold text-emerald-300">{breakdown.components.fatigue.score}/20</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Formula: Tim Gabbett & Collegiate ACSM standard
            </span>
            <Link
              href="/register"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Start Free &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
