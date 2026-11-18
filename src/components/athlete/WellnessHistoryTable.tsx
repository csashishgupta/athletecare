"use client";

import React from "react";
import { WellnessRecord } from "@/types/database";
import { Trash2, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface WellnessHistoryTableProps {
  records: WellnessRecord[];
  onSelectDate: (date: string) => void;
  onDelete: (id: string, date: string) => void;
}

export function WellnessHistoryTable({
  records,
  onSelectDate,
  onDelete,
}: WellnessHistoryTableProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800">
      <h3 className="text-lg font-bold text-slate-100 mb-1">
        Wellness History &amp; Logs
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Review previous check-ins, inspect historical trends, and update records
      </p>

      {records.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-navy-800 rounded-xl">
          No wellness check-ins recorded yet. Submit your daily metrics above.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-navy-800">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Sleep</th>
                <th className="pb-3">Hydration</th>
                <th className="pb-3">Mood</th>
                <th className="pb-3">Fatigue</th>
                <th className="pb-3">Soreness</th>
                <th className="pb-3">Score</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {records.map((r) => {
                const score = r.readiness_score ?? 0;
                const scoreVariant =
                  score >= 80 ? "success" : score >= 60 ? "warning" : "danger";

                return (
                  <tr key={r.id} className="hover:bg-navy-850/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-200">
                      {r.record_date}
                    </td>
                    <td className="py-3 text-slate-300">
                      {r.sleep_hours}h ({r.sleep_quality}/10)
                    </td>
                    <td className="py-3 text-slate-300">
                      {r.water_intake_ml} ml
                    </td>
                    <td className="py-3 text-slate-300">{r.mood_rating}/10</td>
                    <td className="py-3 text-slate-300">{r.fatigue_level}/10</td>
                    <td className="py-3 text-slate-300">{r.soreness_level}/10</td>
                    <td className="py-3">
                      <Badge variant={scoreVariant}>{score}/100</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectDate(r.record_date)}
                          className="p-1 rounded-lg hover:bg-navy-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Edit check-in"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(r.id, r.record_date)}
                          className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
