"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CoachError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Coach portal rendering error:", error);
  }, [error]);

  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-rose-500/30 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Coach Squad View Error
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Failed to aggregate squad readiness indicators or team trend models.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
          <Link href="/coach/dashboard">
            <Button variant="secondary" size="sm">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Coach Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
