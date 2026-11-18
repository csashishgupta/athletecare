import React from "react";
import Link from "next/link";
import { Compass, LayoutDashboard } from "lucide-react";

export default function AthleteNotFound() {
  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-white/[0.08] text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-sports-green/10 border border-sports-green/20 text-sports-green flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Athlete Section Not Found
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The wellness or training tracking resource you requested does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/athlete/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 text-xs font-bold transition-all shadow-md"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Go to Athlete Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
