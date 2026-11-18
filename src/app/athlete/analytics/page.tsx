import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile, WellnessRecord } from "@/types/database";
import { AnalyticsClient } from "@/components/athlete/AnalyticsClient";

export default async function AnalyticsPage() {
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

  const { data: records } = await supabase
    .from("wellness_records")
    .select("*")
    .eq("athlete_id", user.id)
    .order("record_date", { ascending: true });

  return (
    <DashboardLayout profile={profile as Profile}>
      <AnalyticsClient records={(records || []) as WellnessRecord[]} />
    </DashboardLayout>
  );
}
