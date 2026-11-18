import React from "react";
import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-white/[0.08] text-center space-y-5 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
            404 Error: Resource Not Located
          </span>
          <h1 className="text-2xl font-black text-slate-100">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The sports medicine or athletic telemetry resource you requested does not exist or has been relocated within the AthleteCare directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 text-xs font-bold transition-all shadow-md w-full sm:w-auto"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Landing</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-bold transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sign In Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
