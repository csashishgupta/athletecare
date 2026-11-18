import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { LiveReadinessSimulator } from "@/components/landing/LiveReadinessSimulator";
import {
  HeartPulse,
  Stethoscope,
  ArrowRight,
  Flame,
  ShieldAlert,
  Users,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none subtle-gradient" />

      <Navbar />

      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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

              {/* Punchy Subtitle - No Essay */}
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
                A centralized biometric health platform for squads and athletes. Daily morning readiness, ACWR training load, hydration, nutrition, and clinical rehab in one unified system.
              </p>

              {/* Clean Primary Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:scale-[1.02]"
                >
                  <span>Start Tracking Wellness</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 font-semibold text-xs sm:text-sm transition-all duration-200"
                >
                  <span>Sign In to Dashboard &rarr;</span>
                </Link>
              </div>

              <div className="mt-5">
                <DisclaimerBanner compact />
              </div>
            </div>

            {/* LIVE INTERACTIVE SIMULATOR */}
            <div id="simulator" className="mt-12 max-w-5xl mx-auto">
              <LiveReadinessSimulator />
            </div>
          </div>
        </section>

        {/* 4 STAKEHOLDER PORTAL QUICK ACCESS (INTERACTIVE TILES) */}
        <section id="portals" className="py-14 border-t border-white/[0.06] bg-slate-950/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Role-Based Workspaces
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-100">
                  Select Your Portal
                </h2>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Click any portal to log in and access dedicated athletic, coaching, medical, or administrative workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Portal 1: Athlete */}
              <Link
                href="/login?role=athlete"
                className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Role 01
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 group-hover:text-cyan-300 transition-colors">
                    Athlete Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    60-second morning check-in, ACWR training load, sleep log, hydration, and medical clearances.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Portal 2: Coach */}
              <Link
                href="/login?role=coach"
                className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    Role 02
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 group-hover:text-blue-300 transition-colors">
                    Coach Command
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Squad readiness grid, low-readiness fatigue flags (&lt;60), workload distribution, and squad notes.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Portal 3: Medical */}
              <Link
                href="/login?role=medical"
                className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    Role 03
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 group-hover:text-purple-300 transition-colors">
                    Medical & Physio
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Clinical injury cases, anatomical body maps, rehab protocol compliance, and return-to-play clearance.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Portal 4: Admin */}
              <Link
                href="/login?role=admin"
                className="group p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Role 04
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 group-hover:text-amber-300 transition-colors">
                    Admin Console
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    User RBAC management, database table health, security audit trails, and multi-tenant telemetry.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SPORTS SCIENCE CALLOUT STRIP */}
        <section id="science" className="py-10 border-t border-white/[0.06] bg-slate-900/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    Scientific Foundation: Tim Gabbett ACWR & ACSM Standards
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Metric units standard: Height (cm), Weight (kg), Hydration (ml). Safe zone workload ratio between 0.8 and 1.3.
                  </p>
                </div>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-colors shrink-0"
              >
                <span>Create Athlete Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
