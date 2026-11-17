import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import {
  Activity,
  HeartPulse,
  Bandage,
  Users,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Moon,
  Droplets,
  Sparkles,
  Zap,
  ShieldAlert,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-sports-green selection:text-navy-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none subtle-gradient" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 w-96 h-96 bg-sports-green/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sports-green/10 border border-sports-green/30 text-sports-green text-xs font-bold mb-6 shadow-sm shadow-sports-green/10">
                <span className="w-2 h-2 rounded-full bg-sports-green animate-ping" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>AthleteCare 2.0 • Precision Wellness & Readiness Intelligence</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-[1.12]">
                Elevate Athlete Health.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sports-green via-emerald-300 to-cyan-400">
                  Track Readiness.
                </span>{" "}
                Prevent Injury.
              </h1>

              {/* Sub-headline */}
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                A centralized sports wellness platform connecting collegiate athletes, coaches, and sports physiotherapists. Monitor sleep, hydration, mood, nutrition, and rehabilitation progress with automated readiness scoring.
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 font-black text-sm transition-all duration-200 shadow-xl shadow-sports-green/25 hover:scale-[1.02]"
                >
                  <span>Start Tracking Wellness</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-navy-900/90 hover:bg-navy-850 text-slate-200 border border-navy-800 hover:border-slate-700 font-bold text-sm transition-all duration-200"
                >
                  <span>Stakeholder Portal Login &rarr;</span>
                </Link>
              </div>

              {/* Educational Disclaimer Pill */}
              <div className="mt-7">
                <DisclaimerBanner compact />
              </div>
            </div>

            {/* High-tech Interactive Dashboard Preview Card */}
            <div className="mt-14 max-w-5xl mx-auto">
              <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-2xl border border-navy-800 relative glow-border">
                {/* Mock Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-navy-800/80 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 ml-1">
                      AthleteCare Live Performance Suite • Athlete View
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Supabase Cloud: Connected
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-navy-900 px-2 py-1 rounded-lg border border-navy-800">
                      Asia/Kolkata (IST)
                    </span>
                  </div>
                </div>

                {/* Simulated Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {/* Readiness Metric */}
                  <div className="p-4 rounded-xl bg-navy-850/80 border border-navy-800 hover:border-sports-green/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Readiness Index</span>
                      <Activity className="w-4 h-4 text-sports-green" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      88<span className="text-xs font-bold text-sports-green">/100 Optimal</span>
                    </div>
                    <div className="mt-2.5 w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-sports-green to-emerald-400 h-1.5 rounded-full w-[88%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Low injury risk • Cleared for full training</p>
                  </div>

                  {/* Sleep Metric */}
                  <div className="p-4 rounded-xl bg-navy-850/80 border border-navy-800 hover:border-cyan-400/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Sleep Duration</span>
                      <Moon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      8.2<span className="text-xs font-semibold text-slate-400">Hours</span>
                    </div>
                    <div className="mt-2.5 w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-1.5 rounded-full w-[91%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-cyan-400">Quality score: 9/10 (Deep restorative sleep)</p>
                  </div>

                  {/* Hydration Metric */}
                  <div className="p-4 rounded-xl bg-navy-850/80 border border-navy-800 hover:border-blue-400/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Hydration Log</span>
                      <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      3,200<span className="text-xs font-semibold text-slate-400">ml</span>
                    </div>
                    <div className="mt-2.5 w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-400 h-1.5 rounded-full w-[100%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-blue-300">Target surpassed (+200 ml Indian standard)</p>
                  </div>

                  {/* Soreness & Rehab Metric */}
                  <div className="p-4 rounded-xl bg-navy-850/80 border border-navy-800 hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Pain & Soreness</span>
                      <Bandage className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      Level 2<span className="text-xs font-bold text-emerald-400">Mild</span>
                    </div>
                    <div className="mt-2.5 w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[25%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Hamstring rehab protocol: 100% completed</p>
                  </div>
                </div>

                {/* Simulated Quick Action Bar */}
                <div className="mt-5 p-3 rounded-xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-sports-green" />
                    <span>Today&apos;s check-in logged at 07:15 IST • Automatic Coach sync active</span>
                  </div>
                  <Link
                    href="/register"
                    className="text-sports-green font-bold hover:underline flex items-center gap-1 shrink-0"
                  >
                    Experience Athlete Portal &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 STAKEHOLDER ARCHITECTURE BENTO GRID */}
        <section id="roles" className="py-20 border-t border-navy-800/80 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sports-green">
                Role-Based Architecture
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
                Built Specifically for 4 Core Stakeholders
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Each stakeholder receives a customized workspace engineered around their specific responsibilities and privacy constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Athlete Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">1. Athletes</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Log daily wellness check-ins in under 60 seconds. Track sleep hours, sleep quality, water intake (ml), mood, muscle soreness, and completed rehab exercises.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Instant Readiness Gauge (0-100)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Nutrition & Water Logging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Injury & Rehab Tracker</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-navy-800">
                  <span className="text-[11px] font-bold text-emerald-400">
                    Role: Athlete Dashboard &rarr;
                  </span>
                </div>
              </div>

              {/* Coach Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">2. Coaches</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Monitor team-wide readiness scores before morning drills. Receive proactive warnings when an athlete exhibits high fatigue or consecutive pain reports.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Team Readiness Heatmap</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Fatigue & Soreness Alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Privacy Guard (No medical notes)</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-navy-800">
                  <span className="text-[11px] font-bold text-cyan-400">
                    Role: Coach Dashboard &rarr;
                  </span>
                </div>
              </div>

              {/* Medical Staff Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">3. Physiotherapists</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Document injuries with anatomical body location, severity, and status. Prescribe customized rehabilitation exercises with target sets and reps.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Injury Case Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Rehab Exercise Prescription</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Protected Clinical Notes</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-navy-800">
                  <span className="text-[11px] font-bold text-purple-400">
                    Role: Medical Dashboard &rarr;
                  </span>
                </div>
              </div>

              {/* Administrator Card */}
              <div className="glass-card glass-card-hover rounded-2xl p-6 border border-navy-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">4. Administrators</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Manage team user profiles, assign roles, inspect system health telemetry, review immutable security audit logs, and simulate demonstration data.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Full User & Role Governance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Security & Audit Trails</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Telemetry & Demo Generator</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-navy-800">
                  <span className="text-[11px] font-bold text-amber-400">
                    Role: Admin Command Center &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6-PILLAR ALGORITHMIC READINESS ENGINE */}
        <section id="readiness" className="py-20 border-t border-navy-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sports-green">
                  Sports Science Methodology
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
                  The 6-Pillar Athlete Readiness Score (0-100)
                </h2>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  AthleteCare aggregates subjective and objective biometric inputs into a validated collegiate readiness score, preventing overtraining syndrome while maximizing athletic output.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        30%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Sleep Duration</p>
                        <p className="text-[11px] text-slate-400">7-9 hours baseline target</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300">Weight: 30 pts</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        15%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Sleep Quality</p>
                        <p className="text-[11px] text-slate-400">Restorative depth scale (1-10)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300">Weight: 15 pts</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                        15%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Hydration Volume</p>
                        <p className="text-[11px] text-slate-400">Target 2,500-3,500 ml/day</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300">Weight: 15 pts</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                        40%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Fatigue, Mood & Soreness</p>
                        <p className="text-[11px] text-slate-400">Inverse fatigue (15%) + Soreness (15%) + Mood (10%)</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-300">Weight: 40 pts</span>
                  </div>
                </div>
              </div>

              {/* Readiness Zones Card */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800 space-y-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sports-green" />
                  Clinical Readiness Interpretation Tiers
                </h3>

                <div className="space-y-4">
                  {/* Green Tier */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                        80 - 100 • Optimal Readiness
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Green Tier</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      The athlete is fully primed for high-intensity training, competitive matches, and heavy strength loading.
                    </p>
                  </div>

                  {/* Amber Tier */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                        60 - 79 • Moderate Fatigue
                      </span>
                      <span className="text-xs font-bold text-amber-400">Amber Tier</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      Moderate fatigue or incomplete recovery. Recommend adjusting training volume or prioritizing active mobility.
                    </p>
                  </div>

                  {/* Red Tier */}
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-rose-400 uppercase tracking-wide">
                        0 - 59 • High Fatigue / Risk
                      </span>
                      <span className="text-xs font-bold text-rose-400">Red Tier</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      High risk of strain or illness. Coach flagged immediately; recommend mandatory rest or physiotherapist check-in.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/70 border border-navy-800 text-xs text-slate-400">
                  <strong className="text-slate-200">Built-in Safety Rule:</strong> If an athlete logs a muscle soreness or pain rating $\ge 7$ for 2 consecutive days, the system automatically flags a medical review alert for team physiotherapists.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP-BY-STEP PROGRESSION */}
        <section id="features" className="py-20 border-t border-navy-800/80 bg-navy-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-sports-green">
                Streamlined User Journey
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-100">
                How AthleteCare Works in Practice
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card rounded-2xl p-6 border border-navy-800 relative">
                <div className="w-10 h-10 rounded-xl bg-sports-green text-navy-950 font-black flex items-center justify-center text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-100">Morning Check-In</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Upon waking, the athlete opens AthleteCare on their phone or laptop and completes the 6-question check-in in under 60 seconds.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-navy-800 relative">
                <div className="w-10 h-10 rounded-xl bg-cyan-400 text-navy-950 font-black flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-100">Automated Scoring</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The backend computes the 0-100 Readiness score, detects high soreness triggers, and updates the athlete&apos;s 7-day trend chart.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-navy-800 relative">
                <div className="w-10 h-10 rounded-xl bg-purple-400 text-navy-950 font-black flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-100">Team Optimization</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Coaches review the team roster before training to adapt drill intensities, while medical staff inspect rehabilitation adherence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-20 border-t border-navy-800/80 relative">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
              Ready to Upgrade Your Sports Wellness Tracking?
            </h2>
            <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join collegiate athletes, coaches, and sports medical practitioners on AthleteCare today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 font-black text-sm transition-all duration-200 shadow-xl shadow-sports-green/25"
              >
                Create Free Athlete Account <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 border border-navy-800 font-bold text-sm"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
