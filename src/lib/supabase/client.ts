import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://ayauvoufowzbanqkfplr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YXV2b3Vmb3d6YmFucWtmcGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MDc0MDgsImV4cCI6MjExMDQ4MzQwOH0.gkzkRrQ9nnUM3tzBsjjAVUtl0upo5xUPDKKs38amF7s";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
