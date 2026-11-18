import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/database";
import { SleepRecoveryClient } from "@/components/athlete/SleepRecoveryClient";

export default async function SleepRecoveryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <DashboardLayout profile={profile as Profile}>
      <SleepRecoveryClient />
    </DashboardLayout>
  );
}
