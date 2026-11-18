"use client";

import React from "react";
import { Sparkles, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DemoSimulationFactoryProps {
  seeding: boolean;
  onSeed: () => void;
}

export function DemoSimulationFactory({ seeding, onSeed }: DemoSimulationFactoryProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Biometric Demonstration Factory
        </h3>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
        Generate synthetic collegiate athletic wellness, sleep duration, hydration metrics, and nutrition logs across all active athletes to populate dashboard analytics and ACWR training load charts.
      </p>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Note: This action is exclusively available in development environments. In production environments, seed endpoints are protected with strict 403 Forbidden guards.
        </span>
      </div>

      <div className="pt-2">
        <Button
          onClick={onSeed}
          isLoading={seeding}
          variant="secondary"
          className="text-xs font-bold"
        >
          <Database className="w-4 h-4 mr-2" />
          {seeding ? "Generating 7-Day Demo Records..." : "Generate 7-Day Athletic Records"}
        </Button>
      </div>
    </div>
  );
}
