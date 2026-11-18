"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin console error:", error);
  }, [error]);

  return (
    <div className="p-6 sm:p-12 max-w-lg mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-rose-500/30 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-100">
            Admin Console Exception
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            System administration console failed to query users, security audit logs, or telemetry.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry Console
          </Button>
          <Link href="/admin/dashboard">
            <Button variant="secondary" size="sm">
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
