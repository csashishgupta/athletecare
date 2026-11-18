"use client";

import React from "react";
import { RehabilitationExercise } from "@/types/database";
import { Dumbbell, Calendar, CheckCircle2 } from "lucide-react";

interface RehabProtocolListProps {
  exercises: RehabilitationExercise[];
  onToggleExercise: (id: string, currentCompleted: boolean) => Promise<void>;
}

export function RehabProtocolList({
  exercises,
  onToggleExercise,
}: RehabProtocolListProps) {
  const completedCount = exercises.filter((e) => e.completed).length;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            Prescribed Rehabilitation Exercises
          </h3>
          <p className="text-xs text-slate-400">
            Exercises assigned to you by authorized sports medical staff
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {completedCount} / {exercises.length} Completed
        </span>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-navy-800 rounded-xl">
          No active rehabilitation exercises currently assigned.
        </div>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                ex.completed
                  ? "bg-navy-900/40 border-navy-800/60 opacity-80"
                  : "bg-navy-850/80 border-navy-800"
              }`}
            >
              <input
                type="checkbox"
                checked={ex.completed}
                onChange={() => onToggleExercise(ex.id, ex.completed)}
                aria-label={`Mark ${ex.exercise_name} completed`}
                className="mt-1 w-4 h-4 rounded border-navy-700 bg-navy-900 text-sports-green focus:ring-sports-green accent-sports-green cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm font-bold ${
                      ex.completed ? "line-through text-slate-400" : "text-slate-100"
                    }`}
                  >
                    {ex.exercise_name}
                  </p>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {ex.scheduled_date}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {ex.instructions}
                </p>

                {ex.completed && ex.completed_at && (
                  <span className="text-[10px] text-sports-green font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed on {new Date(ex.completed_at).toLocaleDateString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
