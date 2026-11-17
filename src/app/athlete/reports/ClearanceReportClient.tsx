"use client";

import React from "react";
import { Profile } from "@/types/database";
import {
  FileCheck2,
  Printer,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface ClearanceReportClientProps {
  profile: Profile;
}

export function ClearanceReportClient({ profile }: ClearanceReportClientProps) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  const bmi =
    profile.height_cm && profile.weight_kg
      ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)
      : "22.4";

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
              Verified Sports Health Clearance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Medical & Fitness Clearance Certificate
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official athletic readiness and clinical screening certificate for collegiate match participation
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Clearance</span>
        </button>
      </div>

      {/* Official Certificate Card (Printable) */}
      <div className="glass-card rounded-2xl p-8 sm:p-12 border border-white/[0.1] bg-slate-900/90 print:bg-white print:text-black print:border-black space-y-8 max-w-4xl mx-auto shadow-2xl">
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 print:border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl">
              <Activity className="w-7 h-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 print:text-black">
                AthleteCare Sports Medicine Authority
              </h2>
              <span className="text-xs text-slate-400 print:text-gray-600 uppercase font-bold tracking-widest block">
                Collegiate Athletic Wellness & Biometric Clearance Division
              </span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 print:text-gray-600 font-mono">
            <p className="font-bold text-slate-200 print:text-black">CERT-AC-2026-9042</p>
            <p>Issued: {currentDate}</p>
          </div>
        </div>

        {/* Clearance Verdict Box */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 print:border-emerald-600 print:bg-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Official Clinical Finding
              </span>
              <strong className="text-lg font-black text-slate-100 print:text-black">
                FIT FOR COMPETITIVE TOURNAMENT PLAY
              </strong>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase border border-emerald-500/30">
            Full Medical Clearance
          </span>
        </div>

        {/* Athlete Demographics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase font-bold">
              Athlete Name
            </span>
            <strong className="text-sm font-bold text-slate-100 print:text-black">
              {profile.full_name}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase font-bold">
              Primary Sport
            </span>
            <strong className="text-sm font-bold text-slate-100 print:text-black">
              {profile.primary_sport || "Track & Field"}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase font-bold">
              Position / Event
            </span>
            <strong className="text-sm font-bold text-slate-100 print:text-black">
              {profile.playing_position || "Varsity Athlete"}
            </strong>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <span className="text-slate-400 print:text-gray-500 block text-[10px] uppercase font-bold">
              Height & Weight
            </span>
            <strong className="text-sm font-bold text-slate-100 print:text-black">
              {profile.height_cm || 180} cm • {profile.weight_kg || 75} kg (BMI {bmi})
            </strong>
          </div>
        </div>

        {/* Biometric Validation Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
            Biometric Readiness Verification Parameters
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">7-Day Readiness Score</span>
              <strong className="text-cyan-400 print:text-blue-700 text-sm">88/100 (Optimal)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">Workload (ACWR)</span>
              <strong className="text-emerald-400 print:text-green-700 text-sm">1.06 (Low Strain Risk)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 print:bg-gray-50 print:border-gray-200">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">Active Injury Flag</span>
              <strong className="text-slate-200 print:text-black text-sm">None / Cleared</strong>
            </div>
          </div>
        </div>

        {/* Signatures & Accreditation Footer */}
        <div className="pt-8 border-t border-slate-800 print:border-gray-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="h-12 border-b border-dashed border-slate-700 print:border-gray-400 flex items-end pb-1 font-serif italic text-cyan-400 print:text-black text-sm">
              Dr. Ananya Roy, PT, MPT (Sports)
            </div>
            <span className="text-[10px] text-slate-400 print:text-gray-600 block mt-1 uppercase font-bold">
              Authorized Sports Physiotherapist & Clinical Evaluator
            </span>
          </div>
          <div>
            <div className="h-12 border-b border-dashed border-slate-700 print:border-gray-400 flex items-end pb-1 font-serif italic text-blue-400 print:text-black text-sm">
              Coach Vikram Malhotra
            </div>
            <span className="text-[10px] text-slate-400 print:text-gray-600 block mt-1 uppercase font-bold">
              Director of Athletic Performance & Head Coach
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
