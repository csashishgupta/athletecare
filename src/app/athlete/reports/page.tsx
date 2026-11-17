import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/database";
import { ClearanceReportClient } from "./ClearanceReportClient";

export default async function ReportsPage() {
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
      <ClearanceReportClient profile={profile as Profile} />
    </DashboardLayout>
  );
}
