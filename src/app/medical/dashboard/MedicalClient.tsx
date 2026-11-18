"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateInjuryStatus as updateInjuryAction, prescribeRehabExercise as prescribeRehabAction } from "@/actions/medical.actions";
import { InjuryRecord, RehabilitationExercise, Profile } from "@/types/database";
import { Stethoscope, User, Bandage, Dumbbell, ShieldAlert } from "lucide-react";
import { InjuryQueue } from "@/components/medical/InjuryQueue";
import { PrescribeRehabForm } from "@/components/medical/PrescribeRehabForm";
import { AssignedAthletesList } from "@/components/medical/AssignedAthletesList";
import { RehabExercisesList } from "@/components/medical/RehabExercisesList";

interface MedicalClientProps {
  medicalStaffId: string;
  assignedAthletes: Profile[];
  injuries: Array<InjuryRecord & { athlete_name?: string }>;
  exercises: Array<RehabilitationExercise & { athlete_name?: string }>;
}

export function MedicalClient({
  medicalStaffId,
  assignedAthletes,
  injuries,
  exercises,
}: MedicalClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [athleteList, setAthleteList] = useState<Profile[]>(assignedAthletes);
  const [injuryList, setInjuryList] = useState(injuries);
  const [exerciseList, setExerciseList] = useState(exercises);
  const [updatingInjuryId, setUpdatingInjuryId] = useState<string | null>(null);

  // Assign athlete by email
  const handleAssignAthlete = async (email: string) => {
    const { data: athlete, error: pErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (pErr || !athlete) {
      return { success: false, message: "No athlete found with that email address." };
    }

    const { error: aErr } = await supabase.from("medical_assignments").insert({
      medical_staff_id: medicalStaffId,
      athlete_id: athlete.id,
    });

    if (aErr) {
      if (aErr.code === "23505") {
        return { success: false, message: "Athlete is already assigned to your care." };
      }
      return { success: false, message: aErr.message };
    }

    setAthleteList((prev) => [...prev, athlete as Profile]);
    router.refresh();
    return { success: true, message: `Assigned ${athlete.full_name} to your medical care!` };
  };

  // Prescribe rehabilitation exercise
  const handlePrescribeRehab = async (data: {
    athlete_id: string;
    exercise_name: string;
    instructions: string;
    scheduled_date: string;
  }) => {
    const result = await prescribeRehabAction(data);
    if (result.success) {
      const athleteObj = athleteList.find((a) => a.id === data.athlete_id);
      const newEx: RehabilitationExercise & { athlete_name?: string } = {
        id: crypto.randomUUID(),
        athlete_id: data.athlete_id,
        assigned_by: medicalStaffId,
        injury_id: null,
        exercise_name: data.exercise_name,
        instructions: data.instructions,
        scheduled_date: data.scheduled_date,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
        athlete_name: athleteObj?.full_name,
      };
      setExerciseList((prev) => [newEx, ...prev]);
      router.refresh();
      return true;
    }
    return false;
  };

  // Update injury status and clinical notes
  const handleUpdateInjuryStatus = async (
    injuryId: string,
    status: "active" | "recovering" | "resolved",
    athleteId: string,
    notes?: string
  ) => {
    setUpdatingInjuryId(injuryId);
    const result = await updateInjuryAction(injuryId, {
      status,
      medical_notes: notes || null,
    });

    if (result.success) {
      setInjuryList((prev) =>
        prev.map((i) =>
          i.id === injuryId
            ? { ...i, status, medical_notes: notes ?? i.medical_notes }
            : i
        )
      );
      router.refresh();
    }
    setUpdatingInjuryId(null);
  };

  const activeInjuries = injuryList.filter((i) => i.status !== "resolved");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
              Sports Physiotherapy & Medical Care Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Medical & Rehabilitation Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage assigned collegiate athletes, diagnose discomfort reports, and assign rehabilitation drills
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-300">
          <Stethoscope className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Authorized Sports Medicine Console</span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Supervised Athletes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-100">
              {athleteList.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Assigned</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Active Discomfort Cases</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bandage className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-400">
              {activeInjuries.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Under Care</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Prescribed Rehab Drills</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-100">
              {exerciseList.length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Protocols</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-navy-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Return-to-Play Cleared</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-400">
              {injuryList.filter((i) => i.status === "resolved").length}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">Resolved</span>
          </div>
        </div>
      </div>

      {/* Injury Queue */}
      <InjuryQueue
        injuries={injuryList}
        updatingInjuryId={updatingInjuryId}
        onUpdateStatus={handleUpdateInjuryStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prescribe Rehab Form */}
        <PrescribeRehabForm
          athletes={athleteList}
          onPrescribe={handlePrescribeRehab}
        />

        {/* Assigned Athletes List */}
        <AssignedAthletesList
          athletes={athleteList}
          onAssignEmail={handleAssignAthlete}
        />
      </div>

      {/* Rehab Protocols History */}
      <RehabExercisesList exercises={exerciseList} />
    </div>
  );
}
