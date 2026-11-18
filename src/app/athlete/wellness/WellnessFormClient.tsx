"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wellnessRecordSchema } from "@/lib/validations";
import { calculateReadinessScore } from "@/lib/calculations/readiness";
import { submitWellnessCheckin } from "@/actions/athlete.actions";
import { createClient } from "@/lib/supabase/client";
import { WellnessRecord } from "@/types/database";
import { WellnessHistoryTable } from "@/components/athlete/WellnessHistoryTable";
import {
  HeartPulse,
  Moon,
  Droplets,
  Smile,
  Zap,
  Dumbbell,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { z } from "zod";

type WellnessFormValues = z.infer<typeof wellnessRecordSchema>;

interface WellnessFormClientProps {
  athleteId: string;
  initialRecords: WellnessRecord[];
}

export function WellnessFormClient({ athleteId, initialRecords }: WellnessFormClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const todayStr = new Date().toISOString().split("T")[0];

  const [records, setRecords] = useState<WellnessRecord[]>(initialRecords);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const existingRecord = records.find((r) => r.record_date === selectedDate);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<WellnessFormValues>({
    resolver: zodResolver(wellnessRecordSchema),
    defaultValues: {
      record_date: todayStr,
      sleep_hours: existingRecord?.sleep_hours ?? 8,
      sleep_quality: existingRecord?.sleep_quality ?? 8,
      water_intake_ml: existingRecord?.water_intake_ml ?? 3000,
      mood_rating: existingRecord?.mood_rating ?? 8,
      fatigue_level: existingRecord?.fatigue_level ?? 3,
      soreness_level: existingRecord?.soreness_level ?? 2,
      activity_notes: existingRecord?.activity_notes ?? "",
      wellness_notes: existingRecord?.wellness_notes ?? "",
    },
  });

  const watchedSleep = watch("sleep_hours");
  const watchedSleepQuality = watch("sleep_quality");
  const watchedWater = watch("water_intake_ml");
  const watchedMood = watch("mood_rating");
  const watchedFatigue = watch("fatigue_level");
  const watchedSoreness = watch("soreness_level");

  const liveBreakdown = calculateReadinessScore({
    sleep_hours: Number(watchedSleep) || 0,
    sleep_quality: Number(watchedSleepQuality) || 1,
    water_intake_ml: Number(watchedWater) || 0,
    mood_rating: Number(watchedMood) || 1,
    fatigue_level: Number(watchedFatigue) || 1,
    soreness_level: Number(watchedSoreness) || 1,
  });

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setValue("record_date", newDate);
    const rec = records.find((r) => r.record_date === newDate);
    if (rec) {
      setValue("sleep_hours", Number(rec.sleep_hours));
      setValue("sleep_quality", rec.sleep_quality);
      setValue("water_intake_ml", rec.water_intake_ml);
      setValue("mood_rating", rec.mood_rating);
      setValue("fatigue_level", rec.fatigue_level);
      setValue("soreness_level", rec.soreness_level);
      setValue("activity_notes", rec.activity_notes || "");
      setValue("wellness_notes", rec.wellness_notes || "");
    } else {
      setValue("sleep_hours", 8);
      setValue("sleep_quality", 8);
      setValue("water_intake_ml", 3000);
      setValue("mood_rating", 8);
      setValue("fatigue_level", 3);
      setValue("soreness_level", 2);
      setValue("activity_notes", "");
      setValue("wellness_notes", "");
    }
  };

  const onSubmit = async (values: WellnessFormValues) => {
    setLoading(true);
    setMessage(null);

    const result = await submitWellnessCheckin(values);

    if (!result.success) {
      setMessage({ type: "error", text: result.error });
      setLoading(false);
      return;
    }

    const calculatedScore = calculateReadinessScore({
      sleep_hours: values.sleep_hours,
      sleep_quality: values.sleep_quality,
      water_intake_ml: values.water_intake_ml,
      mood_rating: values.mood_rating,
      fatigue_level: values.fatigue_level,
      soreness_level: values.soreness_level,
    }).totalScore;

    setMessage({
      type: "success",
      text: `Daily wellness check-in for ${values.record_date} saved! Readiness score: ${calculatedScore}/100.`,
    });

    const newRecord: WellnessRecord = {
      id: crypto.randomUUID(),
      athlete_id: athleteId,
      record_date: values.record_date,
      sleep_hours: values.sleep_hours,
      sleep_quality: values.sleep_quality,
      water_intake_ml: values.water_intake_ml,
      mood_rating: values.mood_rating,
      fatigue_level: values.fatigue_level,
      soreness_level: values.soreness_level,
      activity_notes: values.activity_notes || null,
      wellness_notes: values.wellness_notes || null,
      readiness_score: calculatedScore,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setRecords((prev) => {
      const filtered = prev.filter((r) => r.record_date !== values.record_date);
      return [newRecord, ...filtered].sort(
        (a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime()
      );
    });

    setLoading(false);
    router.refresh();
  };

  const handleDelete = async (id: string, date: string) => {
    if (!confirm(`Are you sure you want to delete the wellness record for ${date}?`)) {
      return;
    }

    const { error } = await supabase.from("wellness_records").delete().eq("id", id);
    if (!error) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setMessage({ type: "success", text: `Record for ${date} removed.` });
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-sports-green" />
              Daily Athletic Wellness Check-In
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Input daily physiological and psychological markers to calculate your readiness
            </p>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sports-green shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-navy-850 border border-navy-800 text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sports-green"
            />
          </div>
        </div>

        {message && (
          <div
            className={`my-6 p-4 rounded-xl flex items-start gap-3 text-xs ${
              message.type === "success"
                ? "bg-sports-green/10 border border-sports-green/30 text-sports-green"
                : "bg-rose-950/30 border border-rose-900/50 text-rose-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Live Calculated Readiness Pill */}
          <div className="p-4 rounded-xl bg-navy-850/80 border border-navy-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sports-green" />
              <div>
                <span className="text-xs font-bold text-slate-200">
                  Live Calculated Readiness Preview
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {liveBreakdown.statusLabel}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-2xl font-black ${
                  liveBreakdown.statusColor === "green"
                    ? "text-sports-green"
                    : liveBreakdown.statusColor === "yellow"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {liveBreakdown.totalScore}
              </span>
              <span className="text-xs text-slate-400"> / 100</span>
            </div>
          </div>

          {/* Form Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Sleep Duration */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Sleep Duration (Hours)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedSleep} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                {...register("sleep_hours", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 hrs</span>
                <span>8 hrs (Optimal)</span>
                <span>14 hrs</span>
              </div>
            </div>

            {/* 2. Sleep Quality */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-purple-400" />
                  Sleep Quality (1 to 10)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedSleepQuality}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                {...register("sleep_quality", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Restless)</span>
                <span>5 (Average)</span>
                <span>10 (Deep &amp; Rested)</span>
              </div>
            </div>

            {/* 3. Water Intake */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Hydration Target (ml)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedWater} ml
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="6000"
                step="250"
                {...register("water_intake_ml", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>500 ml</span>
                <span>3000 ml (Target)</span>
                <span>6000 ml</span>
              </div>
            </div>

            {/* 4. Mood & Readiness */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-400" />
                  Mood Rating (1 to 10)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedMood}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                {...register("mood_rating", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Low / Stressed)</span>
                <span>5 (Neutral)</span>
                <span>10 (Excited &amp; Energetic)</span>
              </div>
            </div>

            {/* 5. Fatigue Level */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-rose-400" />
                  Fatigue Level (1 to 10)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedFatigue}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                {...register("fatigue_level", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (Completely Fresh)</span>
                <span>5 (Normal)</span>
                <span>10 (Exhausted)</span>
              </div>
            </div>

            {/* 6. Muscle Soreness */}
            <div className="p-4 rounded-xl bg-navy-850/40 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-rose-400" />
                  Muscle Soreness (1 to 10)
                </label>
                <span className="text-xs font-bold text-slate-100">
                  {watchedSoreness}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                {...register("soreness_level", { valueAsNumber: true })}
                className="w-full accent-sports-green"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1 (No soreness)</span>
                <span>5 (Moderate)</span>
                <span>10 (Extreme stiffness)</span>
              </div>
            </div>
          </div>

          {/* Activity & Optional Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Physical Activity Notes
              </label>
              <textarea
                {...register("activity_notes")}
                rows={2}
                placeholder="e.g. 60 min endurance run, sprint intervals, batting practice..."
                className="w-full px-3 py-2 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sports-green"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Optional Wellness Notes
              </label>
              <textarea
                {...register("wellness_notes")}
                rows={2}
                placeholder="e.g. slight tightness in right calf after morning session..."
                className="w-full px-3 py-2 bg-navy-850 border border-navy-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-sports-green"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-navy-800">
            <span className="text-xs text-slate-400">
              {existingRecord ? "Updating existing record for this date" : "New daily record"}
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 font-bold text-sm shadow-md disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Daily Wellness Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Wellness Records Table Component */}
      <WellnessHistoryTable
        records={records}
        onSelectDate={handleDateChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
