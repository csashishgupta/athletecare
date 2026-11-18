import React from "react";
import Link from "next/link";
import { Compass, Stethoscope } from "lucide-react";

export default function MedicalNotFound() {
  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-white/[0.08] text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Medical File Not Located
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The requested clinical assessment or athlete rehabilitation file does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/medical/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Go to Medical Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
