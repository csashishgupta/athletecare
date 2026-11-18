"use client";

import React from "react";
import { Server, Database, Shield, Globe } from "lucide-react";

export function TelemetryStats() {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-cyan-400" />
          Cloud Infrastructure & Security Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Database className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Primary Database
              </span>
            </div>
            <strong className="text-sm font-bold text-slate-200">Supabase Postgres 15</strong>
            <p className="text-[11px] text-emerald-400 mt-1">Region: ap-southeast-1 (Active)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Deployment Platform
              </span>
            </div>
            <strong className="text-sm font-bold text-slate-200">Vercel Edge & Server Actions</strong>
            <p className="text-[11px] text-cyan-400 mt-1">Next.js App Router 15</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Data Isolation
              </span>
            </div>
            <strong className="text-sm font-bold text-slate-200">Row Level Security (RLS)</strong>
            <p className="text-[11px] text-indigo-400 mt-1">Enforced at Database Layer</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Server className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Biometric Standards
              </span>
            </div>
            <strong className="text-sm font-bold text-slate-200">Asia/Kolkata (IST)</strong>
            <p className="text-[11px] text-amber-400 mt-1">Units: cm, kg, ml/L</p>
          </div>
        </div>
      </div>
    </div>
  );
}
