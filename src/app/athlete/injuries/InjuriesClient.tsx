"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { injuryRecordSchema } from "@/lib/validations";
import { reportInjury as reportInjuryAction, completeRehabExercise as completeRehabAction } from "@/actions/athlete.actions";
import { InjuryRecord, RehabilitationExercise } from "@/types/database";
import { checkConsecutivePainAlert } from "@/lib/calculations/readiness";
import { RehabProtocolList } from "@/components/athlete/RehabProtocolList";
import { InjuryHistoryList } from "@/components/athlete/InjuryHistoryList";
import {
  Bandage,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
} from "lucide-react";
import { z } from "zod";

type InjuryFormValues = z.infer<typeof injuryRecordSchema>;

interface InjuriesClientProps {
  athleteId: string;
  initialInjuries: InjuryRecord[];
  initialExercises: RehabilitationExercise[];
}

export function InjuriesClient({
  athleteId,
  initialInjuries,
  initialExercises,
}: InjuriesClientProps) {
  const router = useRouter();
  const todayStr = new Date().toISOString().split("T")[0];

  const [injuries, setInjuries] = useState<InjuryRecord[]>(initialInjuries);
  const [exercises, setExercises] = useState<RehabilitationExercise[]>(initialExercises);
  const [loading, setLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InjuryFormValues>({
    resolver: zodResolver(injuryRecordSchema),
    defaultValues: {
      body_area: "Knee",
      pain_level: 4,
      injury_description: "",
      injury_date: todayStr,
    },
  });

  const watchedPain = watch("pain_level");
  const painAlert = checkConsecutivePainAlert(injuries);

  const bodyAreas = [
    "Head / Neck",
    "Shoulder (Rotator cuff)",
    "Upper Arm / Biceps / Triceps",
    "Elbow",
    "Wrist / Hand",
    "Upper Back / Thoracic",
    "Lower Back (Lumbar)",
    "Hip / Groin",
    "Thigh / Hamstring / Quadriceps",
    "Knee (ACL/MCL/Meniscus)",
    "Lower Leg / Shin / Calf",
    "Ankle",
    "Foot / Plantar",
  ];

  const onSubmit = async (values: InjuryFormValues) => {
    setLoading(true);
    setReportSuccess(false);
    setErrorMessage(null);

    const result = await reportInjuryAction(values);

    if (result.success) {
      const newRecord: InjuryRecord = {
        id: crypto.randomUUID(),
        athlete_id: athleteId,
        body_area: values.body_area,
        pain_level: values.pain_level,
        injury_description: values.injury_description,
        injury_date: values.injury_date,
        status: "active",
        medical_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setInjuries((prev) => [newRecord, ...prev]);
      setReportSuccess(true);
      reset({
        body_area: "Knee",
        pain_level: 4,
        injury_description: "",
        injury_date: todayStr,
      });
      router.refresh();
    } else {
      setErrorMessage(result.error);
    }
    setLoading(false);
  };

  const handleToggleExercise = async (id: string, currentCompleted: boolean) => {
    const updatedStatus = !currentCompleted;
    const result = await completeRehabAction(id, updatedStatus);

    if (result.success) {
      setExercises((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                completed: updatedStatus,
                completed_at: updatedStatus ? new Date().toISOString() : null,
              }
            : e
        )
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 border border-navy-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Bandage className="w-5 h-5 text-sports-green" />
          Injury Management &amp; Rehabilitation Care
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Log physical discomfort, complete prescribed rehabilitation exercises, and track recovery
        </p>
      </div>

      {/* 4-Day Consecutive Pain Flag */}
      {painAlert.hasConsecutivePain && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 flex items-start gap-3 text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-rose-300">
              High Pain Alert Flagged
            </h4>
            <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
              {painAlert.alertMessage} Please inform your team coach and arrange a clinical assessment with athletic medical personnel.
            </p>
          </div>
        </div>
      )}

      {/* Assigned Rehabilitation Exercises Component */}
      <RehabProtocolList
        exercises={exercises}
        onToggleExercise={handleToggleExercise}
      />

      {/* Report Injury / Pain Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800">
        <h3 className="text-base font-bold text-slate-100 mb-1">
          Report Pain or Injury Discomfort
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Notify medical staff about pain, sprains, or joint stiffness
        </p>

        {reportSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-sports-green/10 border border-sports-green/30 text-sports-green text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Injury report successfully logged. Your assigned medical staff has been notified.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Affected Body Area *
              </label>
              <select
                {...register("body_area")}
                className="w-full px-3 py-2 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-sports-green"
              >
                {bodyAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {errors.body_area && (
                <p className="text-[11px] text-rose-400 mt-1">
                  {errors.body_area.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date of Injury / Onset *
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("injury_date")}
                  className="w-full px-3 py-2 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-sports-green"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
              {errors.injury_date && (
                <p className="text-[11px] text-rose-400 mt-1">
                  {errors.injury_date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Pain Severity Level (1 to 10) *
              </label>
              <span className="text-xs font-bold text-sports-green">
                {watchedPain} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              {...register("pain_level", { valueAsNumber: true })}
              className="w-full accent-sports-green"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1 (Mild discomfort)</span>
              <span>5 (Moderate / Limits training)</span>
              <span>10 (Severe / Unable to bear weight)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Symptoms &amp; Incident Description *
            </label>
            <textarea
              {...register("injury_description")}
              rows={3}
              placeholder="Describe when the pain began, what movement triggers it, and whether swelling or popping occurred..."
              className="w-full px-3 py-2 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sports-green resize-none"
            />
            {errors.injury_description && (
              <p className="text-[11px] text-rose-400 mt-1">
                {errors.injury_description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 font-bold text-sm shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Submit Discomfort Report
              </>
            )}
          </button>
        </form>
      </div>

      {/* Injury History List Component */}
      <InjuryHistoryList injuries={injuries} />
    </div>
  );
}
