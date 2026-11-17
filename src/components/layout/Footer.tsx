import React from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#050810] border-t border-white/[0.08] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
                <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-slate-100">
                Athlete<span className="text-cyan-400">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A centralized daily sports wellness, training load (ACWR), and rehabilitation platform designed for collegiate athletes, coaches, and sports medical practitioners.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Indian Standard Units (cm, kg, ml/L)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Timezone: Asia/Kolkata
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/athlete/dashboard" className="hover:text-cyan-400 transition-colors">
                  Athlete Dashboard
                </Link>
              </li>
              <li>
                <Link href="/athlete/wellness" className="hover:text-cyan-400 transition-colors">
                  Daily Wellness Check-in
                </Link>
              </li>
              <li>
                <Link href="/coach/dashboard" className="hover:text-cyan-400 transition-colors">
                  Coach Squad Overview
                </Link>
              </li>
              <li>
                <Link href="/medical/dashboard" className="hover:text-cyan-400 transition-colors">
                  Medical & Physical Therapy
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-cyan-400 transition-colors">
                  Admin Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Project Governance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>College Capstone Project</li>
              <li>PostgreSQL Row Level Security (RLS)</li>
              <li>Next.js 15 App Router & Vercel Edge</li>
              <li className="pt-1">
                <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                  Sign In to System &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed mb-6">
          <strong className="text-slate-300 font-semibold block mb-0.5">
            Academic & Demonstrative Scope:
          </strong>
          AthleteCare is developed strictly for educational demonstration and sports wellness tracking. It is not an emergency medical response or diagnostic tool. Biometric readiness indicators are educational estimations.
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <span>&copy; {new Date().getFullYear()} AthleteCare Platform. All rights reserved.</span>
          <span className="font-mono text-[11px] text-slate-400">
            Engineered by Senior Full-Stack Engineering Team
          </span>
        </div>
      </div>
    </footer>
  );
}
