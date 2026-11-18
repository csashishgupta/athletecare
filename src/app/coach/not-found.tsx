import React from "react";
import Link from "next/link";
import { Compass, Users } from "lucide-react";

export default function CoachNotFound() {
  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-white/[0.08] text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Coach Resource Not Located
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The coach squad or training load sheet requested could not be found.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/coach/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Go to Coach Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
