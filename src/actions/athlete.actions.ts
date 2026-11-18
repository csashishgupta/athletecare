"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  wellnessRecordSchema,
  nutritionRecordSchema,
  injuryRecordSchema,
  profileUpdateSchema,
} from "@/lib/validations";
import { calculateReadinessScore } from "@/lib/calculations/readiness";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Submit daily wellness check-in for the authenticated athlete.
 */
export async function submitWellnessCheckin(
  formData: unknown
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required to submit wellness log." };
    }

    const validated = wellnessRecordSchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const readiness = calculateReadinessScore({
      sleep_hours: validated.data.sleep_hours,
      sleep_quality: validated.data.sleep_quality,
      water_intake_ml: validated.data.water_intake_ml,
      mood_rating: validated.data.mood_rating,
      fatigue_level: validated.data.fatigue_level,
      soreness_level: validated.data.soreness_level,
    });

    const { error: insertError } = await supabase.from("wellness_records").upsert(
      {
        athlete_id: user.id,
        record_date: validated.data.record_date,
        sleep_hours: validated.data.sleep_hours,
        sleep_quality: validated.data.sleep_quality,
        water_intake_ml: validated.data.water_intake_ml,
        mood_rating: validated.data.mood_rating,
        fatigue_level: validated.data.fatigue_level,
        soreness_level: validated.data.soreness_level,
        activity_notes: validated.data.activity_notes || null,
        wellness_notes: validated.data.wellness_notes || null,
        readiness_score: readiness.totalScore,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "athlete_id,record_date" }
    );

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/athlete/wellness");
    revalidatePath("/athlete/dashboard");
    revalidatePath("/coach/dashboard");
    return { success: true, message: "Daily wellness recorded successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record wellness";
    return { success: false, error: message };
  }
}

/**
 * Log a meal/nutrition entry for the authenticated athlete.
 */
export async function logNutritionMeal(
  formData: unknown
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required to log nutrition." };
    }

    const validated = nutritionRecordSchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { error: insertError } = await supabase.from("nutrition_records").insert({
      athlete_id: user.id,
      record_date: validated.data.record_date,
      meal_type: validated.data.meal_type,
      meal_description: validated.data.meal_description,
      protein_g: validated.data.protein_g,
      carbohydrates_g: validated.data.carbohydrates_g,
      fats_g: validated.data.fats_g,
      water_intake_ml: validated.data.water_intake_ml,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/athlete/nutrition");
    revalidatePath("/athlete/dashboard");
    return { success: true, message: "Nutrition entry saved successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save nutrition";
    return { success: false, error: message };
  }
}

/**
 * Report a new injury for the authenticated athlete.
 */
export async function reportInjury(
  formData: unknown
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required to report injury." };
    }

    const validated = injuryRecordSchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { error: insertError } = await supabase.from("injury_records").insert({
      athlete_id: user.id,
      body_area: validated.data.body_area,
      pain_level: validated.data.pain_level,
      injury_description: validated.data.injury_description,
      injury_date: validated.data.injury_date,
      status: "active",
      medical_notes: null,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/athlete/injuries");
    revalidatePath("/medical/dashboard");
    return { success: true, message: "Injury report logged. Medical staff notified." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to report injury";
    return { success: false, error: message };
  }
}

/**
 * Mark a prescribed rehab exercise as completed.
 */
export async function completeRehabExercise(
  exerciseId: string,
  completed: boolean = true
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    const { error: updateError } = await supabase
      .from("rehabilitation_exercises")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", exerciseId)
      .eq("athlete_id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/athlete/injuries");
    revalidatePath("/medical/dashboard");
    return { success: true, message: "Rehab exercise status updated." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update exercise";
    return { success: false, error: message };
  }
}

/**
 * Update the authenticated athlete's bio profile.
 */
export async function updateProfile(
  formData: unknown
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    const validated = profileUpdateSchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: validated.data.full_name,
        date_of_birth: validated.data.date_of_birth || null,
        height_cm: validated.data.height_cm || null,
        weight_kg: validated.data.weight_kg || null,
        primary_sport: validated.data.primary_sport || null,
        playing_position: validated.data.playing_position || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/athlete/profile");
    revalidatePath("/athlete/dashboard");
    return { success: true, message: "Profile updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
