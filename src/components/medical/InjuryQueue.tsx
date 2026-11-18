"use client";

import React, { useState } from "react";
import { InjuryRecord } from "@/types/database";
import { Bandage, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface InjuryQueueProps {
  injuries: Array<InjuryRecord & { athlete_name?: string }>;
  updatingInjuryId: string | null;
  onUpdateStatus: (
    injuryId: string,
    status: "active" | "recovering" | "resolved",
    athleteId: string,
    notes?: string
  ) => Promise<void>;
}

export function InjuryQueue({
  injuries,
  updatingInjuryId,
  onUpdateStatus,
}: InjuryQueueProps) {
  const [filter, setFilter] = useState<"all" | "active" | "recovering" | "resolved">("all");
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  const filteredInjuries = injuries.filter((i) => {
    if (filter === "all") return true;
    return i.status === filter;
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-navy-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Bandage className="w-4 h-4 text-rose-400" />
            Athlete Discomfort &amp; Injury Queue ({injuries.length})
          </h3>
          <p className="text-xs text-slate-400">
            Real-time medical tracking and return-to-play clearance protocols
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-navy-900 border border-navy-800">
          {(["all", "active", "recovering", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-medium transition-colors ${
                filter === tab
                  ? "bg-purple-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredInjuries.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-navy-900/40 rounded-xl border border-dashed border-navy-800">
            No injury reports matching current filter.
          </div>
        ) : (
          filteredInjuries.map((injury) => {
            const isUpdating = updatingInjuryId === injury.id;
            const statusVariant =
              injury.status === "active"
                ? "danger"
                : injury.status === "recovering"
                ? "warning"
                : "success";

            return (
              <div
                key={injury.id}
                className="p-4 rounded-xl bg-navy-900/60 border border-navy-800/80 hover:border-navy-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">
                      {injury.athlete_name || "Athlete"}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-rose-300">
                      {injury.body_area}
                    </span>
                    <Badge variant={statusVariant}>{injury.status}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reported {injury.injury_date}</span>
                    <span className="font-mono text-rose-400 font-bold ml-2">
                      Pain: {injury.pain_level}/10
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-navy-950/60 p-3 rounded-lg border border-navy-850">
                  {injury.injury_description}
                </p>

                {/* Clinical Notes & Update Section */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text"
                    defaultValue={injury.medical_notes || ""}
                    placeholder="Enter clinical notes or prescription..."
                    onChange={(e) =>
                      setEditingNotes((prev) => ({ ...prev, [injury.id]: e.target.value }))
                    }
                    className="flex-1 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />

                  <div className="flex items-center gap-1.5 shrink-0">
                    {injury.status !== "active" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        isLoading={isUpdating}
                        onClick={() =>
                          onUpdateStatus(
                            injury.id,
                            "active",
                            injury.athlete_id,
                            editingNotes[injury.id]
                          )
                        }
                        className="text-[11px] text-rose-400 hover:bg-rose-500/10"
                      >
                        Mark Active
                      </Button>
                    )}
                    {injury.status !== "recovering" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={isUpdating}
                        onClick={() =>
                          onUpdateStatus(
                            injury.id,
                            "recovering",
                            injury.athlete_id,
                            editingNotes[injury.id]
                          )
                        }
                        className="text-[11px]"
                      >
                        Mark Recovering
                      </Button>
                    )}
                    {injury.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={isUpdating}
                        onClick={() =>
                          onUpdateStatus(
                            injury.id,
                            "resolved",
                            injury.athlete_id,
                            editingNotes[injury.id]
                          )
                        }
                        className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Clear Athlete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
