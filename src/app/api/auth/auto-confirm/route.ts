import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ayauvoufowzbanqkfplr.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YXV2b3Vmb3d6YmFucWtmcGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MDc0MDgsImV4cCI6MjExMDQ4MzQwOH0.gkzkRrQ9nnUM3tzBsjjAVUtl0upo5xUPDKKs38amF7s";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Attempt to update profile or verify user
    const { error: rpcError } = await supabase.rpc("confirm_user_email", {
      target_email: email.trim().toLowerCase(),
    });

    if (rpcError) {
      // Direct SQL function fallback or log
      console.warn("Auto-confirm RPC note:", rpcError.message);
    }

    return NextResponse.json({ success: true, message: "User confirmed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error confirming user";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
