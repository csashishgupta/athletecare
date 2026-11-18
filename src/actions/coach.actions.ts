"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Add an athlete to the coach's roster/squad.
 */
export async function addAthleteToSquad(athleteId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    // Verify role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "coach" && profile.role !== "admin")) {
      return { success: false, error: "Unauthorized. Coach or Admin role required." };
    }

    const { error: insertError } = await supabase.from("team_memberships").insert({
      coach_id: user.id,
      athlete_id: athleteId,
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/coach/dashboard");
    return { success: true, message: "Athlete added to squad successfully." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add athlete";
    return { success: false, error: message };
  }
}

/**
 * Remove an athlete from the coach's roster/squad.
 */
export async function removeAthleteFromSquad(membershipId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    const { error: deleteError } = await supabase
      .from("team_memberships")
      .delete()
      .eq("id", membershipId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/coach/dashboard");
    return { success: true, message: "Athlete removed from squad roster." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove athlete";
    return { success: false, error: message };
  }
}
