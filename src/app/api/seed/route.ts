import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin privilege required" }, { status: 403 });
  }

  // 1. Fetch all registered athletes
  const { data: athletes } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "athlete");

  if (!athletes || athletes.length === 0) {
    return NextResponse.json({
      error: "No athletes found in the database to seed.",
    }, { status: 400 });
  }

  // Generate 7 days of realistic collegiate wellness logs
  const today = new Date();
  let seededCount = 0;

  for (const athlete of athletes) {
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const recordDate = new Date(today);
      recordDate.setDate(recordDate.getDate() - dayOffset);
      const dateStr = recordDate.toISOString().split("T")[0];

      // Realistic sports biometric variation
      const sleepHours = 7.0 + Math.round((Math.random() * 2.0) * 10) / 10;
      const sleepQuality = 7 + Math.floor(Math.random() * 3);
      const waterIntake = 2600 + Math.floor(Math.random() * 1000);
      const mood = 7 + Math.floor(Math.random() * 3);
      const fatigue = 3 + Math.floor(Math.random() * 4);
      const soreness = 2 + Math.floor(Math.random() * 4);

      // Upsert wellness record
      await supabase.from("wellness_records").upsert(
        {
          athlete_id: athlete.id,
          record_date: dateStr,
          sleep_hours: sleepHours,
          sleep_quality: sleepQuality,
          water_intake_ml: waterIntake,
          mood_rating: mood,
          fatigue_level: fatigue,
          soreness_level: soreness,
          notes: dayOffset === 0 ? "Morning check-in: Feeling energized." : null,
        },
        { onConflict: "athlete_id,record_date" }
      );

      // Upsert nutrition record
      await supabase.from("nutrition_records").upsert(
        {
          athlete_id: athlete.id,
          record_date: dateStr,
          water_intake_ml: waterIntake,
          meals_logged: {
            breakfast: "Oats with protein shake, banana and almonds",
            lunch: "Brown rice, grilled chicken/paneer, dal and green salad",
            dinner: "Roti with steamed vegetables and curd",
            snacks: "Electrolyte hydration and fruit",
          },
          calories_consumed: 2400 + Math.floor(Math.random() * 400),
          protein_grams: 140 + Math.floor(Math.random() * 30),
        },
        { onConflict: "athlete_id,record_date" }
      );

      seededCount++;
    }
  }

  // Record admin audit log
  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "SEED_TRIGGERED",
    entity_type: "system",
    details: {
      athletes_count: athletes.length,
      records_seeded: seededCount,
      timestamp: new Date().toISOString(),
    },
  });

  return NextResponse.json({
    success: true,
    message: `Successfully seeded 7 days of realistic wellness & nutrition data for ${athletes.length} athlete(s).`,
    seededRecords: seededCount,
  });
}
