"use client";

import React from "react";
import { InjuryRecord } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

interface InjuryHistoryListProps {
  injuries: InjuryRecord[];
}

export function InjuryHistoryList({ injuries }: InjuryHistoryListProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800 space-y-4">
      <h3 className="text-base font-bold text-slate-100">
        Discomfort &amp; Injury Incident History ({injuries.length})
      </h3>
      <p className="text-xs text-slate-400">
        Track previous reports, medical review notes, and recovery status
      </p>

      {injuries.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-navy-800 rounded-xl">
          No injuries or pain incidents recorded.
        </div>
      ) : (
        <div className="space-y-3">
          {injuries.map((injury) => {
            const statusVariant =
              injury.status === "active"
                ? "danger"
                : injury.status === "recovering"
                ? "warning"
                : "success";

            return (
              <div
                key={injury.id}
                className="p-4 rounded-xl bg-navy-850/60 border border-navy-800 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">
                      {injury.body_area}
                    </span>
                    <Badge variant={statusVariant}>{injury.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{injury.injury_date}</span>
                    <span className="text-rose-400 font-bold ml-2">
                      Pain: {injury.pain_level}/10
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {injury.injury_description}
                </p>

                {injury.medical_notes && (
                  <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 text-xs">
                    <span className="font-semibold text-purple-300 block mb-1">
                      Clinical Notes from Medical Staff:
                    </span>
                    <p className="text-purple-200/90 leading-relaxed">
                      {injury.medical_notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
