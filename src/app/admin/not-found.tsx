import React from "react";
import Link from "next/link";
import { Compass, ShieldAlert } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-white/[0.08] text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Administrative Resource Not Found
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The requested admin module, directory filter, or telemetry log does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Go to Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
