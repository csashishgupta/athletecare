"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { medicalUpdateInjurySchema, rehabExerciseSchema } from "@/lib/validations";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Update clinical status and medical notes for an injury report.
 */
export async function updateInjuryStatus(
  injuryId: string,
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "medical" && profile.role !== "admin")) {
      return { success: false, error: "Unauthorized. Medical or Admin role required." };
    }

    const validated = medicalUpdateInjurySchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { error: updateError } = await supabase
      .from("injury_records")
      .update({
        status: validated.data.status,
        medical_notes: validated.data.medical_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", injuryId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/medical/dashboard");
    revalidatePath("/athlete/injuries");
    return { success: true, message: "Injury clinical review updated." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update injury";
    return { success: false, error: message };
  }
}

/**
 * Prescribe a rehabilitation exercise program for an athlete.
 */
export async function prescribeRehabExercise(
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "medical" && profile.role !== "admin")) {
      return { success: false, error: "Unauthorized. Medical or Admin role required." };
    }

    const validated = rehabExerciseSchema.safeParse(formData);
    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { error: insertError } = await supabase
      .from("rehabilitation_exercises")
      .insert({
        athlete_id: validated.data.athlete_id,
        injury_id: validated.data.injury_id || null,
        assigned_by: user.id,
        exercise_name: validated.data.exercise_name,
        instructions: validated.data.instructions,
        scheduled_date: validated.data.scheduled_date,
        completed: false,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/medical/dashboard");
    revalidatePath("/athlete/injuries");
    return { success: true, message: "Rehab exercise prescribed successfully." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to prescribe exercise";
    return { success: false, error: message };
  }
}
