"use client";

import React, { useState } from "react";
import { UserPlus, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AddAthleteFormProps {
  onAddEmail: (email: string) => Promise<{ success: boolean; message: string }>;
}

export function AddAthleteForm({ onAddEmail }: AddAthleteFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMsg(null);

    const result = await onAddEmail(email.trim());
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
      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-cyan-400" />
        Assign Athlete to Team Roster
      </h3>
      <p className="text-xs text-slate-400">
        Add an athlete by their registered email address to view their training readiness indicators
      </p>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-sports-green/10 border border-sports-green/30 text-sports-green"
              : "bg-rose-950/30 border border-rose-900/50 text-rose-300"
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

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter registered athlete email..."
          required
          className="flex-1 px-4 py-2.5 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
        />
        <Button
          type="submit"
          isLoading={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5 mr-2" />
          Add to Roster
        </Button>
      </form>
    </div>
  );
}
