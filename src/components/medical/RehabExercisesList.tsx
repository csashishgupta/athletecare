"use client";

import React from "react";
import { RehabilitationExercise } from "@/types/database";
import { Dumbbell, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface RehabExercisesListProps {
  exercises: Array<RehabilitationExercise & { athlete_name?: string }>;
}

export function RehabExercisesList({ exercises }: RehabExercisesListProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-navy-800 space-y-4">
      <div className="flex items-center gap-2">
        <Dumbbell className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Prescribed Rehab Protocols ({exercises.length})
        </h3>
      </div>

      <div className="space-y-3">
        {exercises.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 bg-navy-900/40 rounded-xl border border-navy-800">
            No rehabilitation exercises prescribed yet.
          </div>
        ) : (
          exercises.map((ex) => (
            <div
              key={ex.id}
              className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{ex.exercise_name}</span>
                  <Badge variant={ex.completed ? "success" : "warning"}>
                    {ex.completed ? "Completed" : "Scheduled"}
                  </Badge>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{ex.instructions}</p>
                <span className="text-[10px] text-purple-400 font-semibold block">
                  Athlete: {ex.athlete_name || "Assigned Athlete"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-[11px] shrink-0 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Date: {ex.scheduled_date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
