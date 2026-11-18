"use client";

import React, { useState } from "react";
import { Profile } from "@/types/database";
import { Users, UserPlus, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AssignedAthletesListProps {
  athletes: Profile[];
  onAssignEmail: (email: string) => Promise<{ success: boolean; message: string }>;
}

export function AssignedAthletesList({
  athletes,
  onAssignEmail,
}: AssignedAthletesListProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMsg(null);
    const result = await onAssignEmail(email.trim());
    if (result.success) {
      setMsg({ type: "success", text: result.message });
      setEmail("");
    } else {
      setMsg({ type: "error", text: result.message });
    }
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-navy-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Supervised Athletes Roster ({athletes.length})
          </h3>
          <p className="text-xs text-slate-400">
            Athletes currently mapped to your medical caseload
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Assign by email..."
            className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 w-48 sm:w-56"
          />
          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            className="bg-purple-600 hover:bg-purple-500 text-white shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Assign
          </Button>
        </form>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {athletes.length === 0 ? (
          <div className="col-span-full text-center py-6 text-xs text-slate-400 bg-navy-900/40 rounded-xl border border-navy-800">
            No athletes assigned yet. Use the form above to add an athlete by email.
          </div>
        ) : (
          athletes.map((athlete) => (
            <div
              key={athlete.id}
              className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-center gap-3 hover:border-navy-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                {athlete.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-xs text-slate-100 block truncate">
                  {athlete.full_name}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {athlete.primary_sport || "Athlete"}
                  {athlete.playing_position && ` • ${athlete.playing_position}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
