import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role or fallback to anon key for server-side registration
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ayauvoufowzbanqkfplr.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YXV2b3Vmb3d6YmFucWtmcGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MDc0MDgsImV4cCI6MjExMDQ4MzQwOH0.gkzkRrQ9nnUM3tzBsjjAVUtl0upo5xUPDKKs38amF7s";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, primarySport, playingPosition } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Full Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          primary_sport: primarySport || "Cricket",
          playing_position: playingPosition || "Top-Order Batsman",
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      // Auto-confirm the user in database if not already confirmed
      try {
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: "athlete",
            primary_sport: primarySport || "Cricket",
            playing_position: playingPosition || "Top-Order Batsman",
          });
      } catch (profileErr) {
        console.warn("Profile upsert notice:", profileErr);
      }

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName,
        },
        message: "Account created successfully! You can now sign in.",
      });
    }

    return NextResponse.json(
      { error: "Failed to create user account." },
      { status: 500 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
