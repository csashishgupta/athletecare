"use client";

import React, { useState } from "react";
import { Profile } from "@/types/database";
import { Dumbbell, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PrescribeRehabFormProps {
  athletes: Profile[];
  onPrescribe: (data: {
    athlete_id: string;
    exercise_name: string;
    instructions: string;
    scheduled_date: string;
  }) => Promise<boolean>;
}

export function PrescribeRehabForm({ athletes, onPrescribe }: PrescribeRehabFormProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [athleteId, setAthleteId] = useState(athletes[0]?.id || "");
  const [exerciseName, setExerciseName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteId || !exerciseName.trim() || !instructions.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const ok = await onPrescribe({
      athlete_id: athleteId,
      exercise_name: exerciseName.trim(),
      instructions: instructions.trim(),
      scheduled_date: scheduledDate,
    });

    if (ok) {
      setSuccess(true);
      setExerciseName("");
      setInstructions("");
    } else {
      setError("Failed to prescribe rehabilitation exercise.");
    }
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-navy-800 space-y-4">
      <div className="flex items-center gap-2">
        <Dumbbell className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Prescribe Rehabilitation Protocol
        </h3>
      </div>
      <p className="text-xs text-slate-400">
        Assign clinical mobility, activation, and recovery drills directly to athlete schedules
      </p>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Rehab exercise successfully scheduled and athlete notified.</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Target Athlete *
            </label>
            <select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-200 focus:outline-none focus:border-purple-400"
              required
            >
              {athletes.length === 0 ? (
                <option value="">No athletes assigned</option>
              ) : (
                athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name} ({a.primary_sport || "Athlete"})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Scheduled Date *
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-200 focus:outline-none focus:border-purple-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Exercise Name *
          </label>
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="e.g. Eccentric Hamstring Sliders / Banded Glute Bridges"
            className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Clinical Instructions &amp; Sets/Reps *
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="e.g. 3 sets x 10 reps slow eccentric tempo. Cease drill if acute joint pain exceeds 3/10."
            className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          isLoading={loading}
          disabled={athletes.length === 0}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold"
        >
          <Send className="w-3.5 h-3.5 mr-2" />
          Assign Protocol
        </Button>
      </form>
    </div>
  );
}
