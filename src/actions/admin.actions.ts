"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/database";

export type ActionResult<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Update a user's role (admin only).
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: UserRole
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

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Access denied. Administrator privileges required." };
    }

    const validRoles: UserRole[] = ["athlete", "coach", "medical", "admin"];
    if (!validRoles.includes(newRole)) {
      return { success: false, error: "Invalid role specified." };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Insert audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: "UPDATE_USER_ROLE",
      entity_type: "profiles",
      entity_id: targetUserId,
      details: { new_role: newRole },
    });

    revalidatePath("/admin/dashboard");
    return { success: true, message: `User role updated to ${newRole}.` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update user role";
    return { success: false, error: message };
  }
}

/**
 * Toggle user active/suspended status (admin only).
 */
export async function toggleUserStatus(
  targetUserId: string,
  isActive: boolean
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

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!adminProfile || adminProfile.role !== "admin") {
      return { success: false, error: "Access denied. Administrator privileges required." };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUserId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Insert audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: isActive ? "ACTIVATE_USER" : "SUSPEND_USER",
      entity_type: "profiles",
      entity_id: targetUserId,
      details: { is_active: isActive },
    });

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      message: `User account ${isActive ? "activated" : "suspended"}.`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle user status";
    return { success: false, error: message };
  }
}
