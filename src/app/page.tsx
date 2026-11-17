import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import {
  Activity,
  HeartPulse,
  Bandage,
  Stethoscope,
  ArrowRight,
  Moon,
  Sparkles,
  Zap,
  BarChart3,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none subtle-gradient" />

      <Navbar />

      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>AthleteCare Enterprise • Sports Wellness Intelligence</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 leading-[1.12]">
                Precision Sports Wellness &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  Readiness Intelligence.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                A centralized biometric health platform for collegiate and professional sports. Consolidate daily morning readiness, ACWR training load, hydration, nutrition, and clinical rehabilitation in a unified system.
              </p>

              {/* Primary Single CTA Pair */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-white/5 hover:scale-[1.02]"
                >
                  <span>Start Tracking Wellness</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-xs sm:text-sm transition-all duration-200"
                >
                  <span>Portal Sign In &rarr;</span>
                </Link>
              </div>

              <div className="mt-6">
                <DisclaimerBanner compact />
              </div>
            </div>

            {/* LIVE BIOMETRIC SHOWCASE CARD */}
            <div className="mt-12 max-w-5xl mx-auto">
              <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-2xl border border-white/[0.08] relative">
                {/* Showcase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 ml-1">
                      Live Biometric Performance Suite • Athlete View
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Supabase Cloud (ap-south-1)
                    </span>
                    <span className="hidden sm:inline px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                      Asia/Kolkata
                    </span>
                  </div>
                </div>

                {/* 4 Biometric Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                  {/* Readiness Index */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Readiness Index</span>
                      <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      88<span className="text-xs font-bold text-emerald-400">/100 Optimal</span>
                    </div>
                    <div className="mt-2.5 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full w-[88%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Low fatigue • Cleared for full competition</p>
                  </div>

                  {/* ACWR Workload Ratio */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Workload (ACWR)</span>
                      <Flame className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      1.06<span className="text-xs font-bold text-cyan-400">Sweet Spot</span>
                    </div>
                    <div className="mt-2.5 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1.5 rounded-full w-[70%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Gabbett 2016 model (0.8 - 1.3 safe zone)</p>
                  </div>

                  {/* Sleep Architecture */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Sleep & Recovery</span>
                      <Moon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      8.2<span className="text-xs font-semibold text-slate-400">Hours</span>
                    </div>
                    <div className="mt-2.5 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-400 h-1.5 rounded-full w-[85%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-indigo-300">Quality score: 9/10 (Deep restorative)</p>
                  </div>

                  {/* Soreness & Rehab */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold">Pain & Soreness</span>
                      <Bandage className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-100 flex items-baseline gap-1.5">
                      Level 2<span className="text-xs font-bold text-emerald-400">Mild</span>
                    </div>
                    <div className="mt-2.5 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-1.5 rounded-full w-[25%]" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">Hamstring rehab protocol: 100% adherence</p>
                  </div>
                </div>

                {/* Status footnote */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Indian standard measurements: Height in cm, Weight in kg, Hydration in ml</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-[11px] hidden sm:inline">
                    Algorithm: 6-Pillar Weighted Biometrics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS SECTION */}
        <section id="pillars" className="py-16 border-t border-white/[0.06] bg-slate-900/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Core Architectural Pillars
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-100">
                Engineered for High-Performance Athletic Squads
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">1. Daily Biometric Readiness</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Athletes complete a 60-second morning check-in covering sleep duration, quality, hydration (ml), mood, and muscle soreness. Automated algorithmic scoring computes a 0-100 index before morning training.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">2. ACWR Training Load Engine</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Calculates Acute-to-Chronic Workload Ratio (ACWR) via Session RPE $\times$ Duration. Flags acute workload spikes exceeding 1.3 to proactively prevent soft-tissue injuries.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">3. Physical Therapy & Rehab</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Sports physiotherapists log injury cases, anatomical body maps, and prescribed rehabilitation protocols. Protected clinical notes remain shielded from non-medical staff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 STAKEHOLDER PORTAL MATRIX */}
        <section id="architecture" className="py-16 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Stakeholder Portals
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-100">
                Tailored Interfaces by Role
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Portal 01</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Athlete Workspace</h4>
                <p className="text-xs text-slate-400 mt-2">
                  Daily wellness check-in, ACWR training load logging, macro nutrition, rehab adherence, and printable fitness clearances.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Portal 02</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Coach Roster Dashboard</h4>
                <p className="text-xs text-slate-400 mt-2">
                  Squad readiness board, low readiness alerts (&lt;60), fatigue warnings, and squad announcements.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Portal 03</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Medical & Physio Clinic</h4>
                <p className="text-xs text-slate-400 mt-2">
                  Injury case records, rehab exercise sets/reps, pain trend analysis, and confidential clinical notes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Portal 04</span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Admin Command Center</h4>
                <p className="text-xs text-slate-400 mt-2">
                  User RBAC governance, database table inspection, system telemetry, audit trail, and 7-day demo simulation factory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNICAL SPECS SECTION */}
        <section id="specs" className="py-16 border-t border-white/[0.06] bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08]">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                Engineering Specifications & Compliance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Framework</span>
                  <strong className="text-slate-200">Next.js 15 (App Router)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Database</span>
                  <strong className="text-slate-200">Supabase PostgreSQL 15</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Security</span>
                  <strong className="text-slate-200">Row Level Security (RLS)</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Deployment</span>
                  <strong className="text-slate-200">Vercel Production Edge</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
