"use client";

import React, { useState } from "react";
import { AuditLog } from "@/types/database";
import { FileText, Filter } from "lucide-react";

interface AuditLogViewerProps {
  logs: AuditLog[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.action === filter;
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Security Audit Trail ({logs.length})
          </h3>
          <p className="text-xs text-slate-400">
            Immutable log of system role changes, account toggles, and administrative operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter audit actions"
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Audit Actions</option>
            <option value="ROLE_CHANGE">ROLE_CHANGE</option>
            <option value="UPDATE_USER_ROLE">UPDATE_USER_ROLE</option>
            <option value="USER_ACTIVATED">USER_ACTIVATED</option>
            <option value="USER_DEACTIVATED">USER_DEACTIVATED</option>
            <option value="SEED_TRIGGERED">SEED_TRIGGERED</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            No audit records matching &quot;{filter}&quot;
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                  {log.action}
                </span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                  {JSON.stringify(log.details)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
