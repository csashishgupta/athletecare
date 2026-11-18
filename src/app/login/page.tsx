"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredNotice, setRegisteredNotice] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const isDev = process.env.NODE_ENV === "development";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setRegisteredNotice(true);
      const prefillEmail = searchParams.get("email");
      if (prefillEmail) {
        setValue("email", prefillEmail);
      }
    }
  }, [searchParams, setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      // Self-healing: If email not confirmed, auto-confirm and retry once
      if (error && error.message.toLowerCase().includes("email not confirmed")) {
        try {
          await fetch("/api/auth/auto-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
          });
          // Retry sign-in
          const retry = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          data = retry.data;
          error = retry.error;
        } catch {
          // Keep original error
        }
      }

      if (error) {
        setServerError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, is_active")
          .eq("id", data.user.id)
          .single();

        if (profile?.is_active === false) {
          await supabase.auth.signOut();
          setServerError("This account has been deactivated by an administrator.");
          setLoading(false);
          return;
        }

        const role = profile?.role || "athlete";
        const redirectPath =
          role === "coach"
            ? "/coach/dashboard"
            : role === "medical"
            ? "/medical/dashboard"
            : role === "admin"
            ? "/admin/dashboard"
            : "/athlete/dashboard";

        router.push(redirectPath);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setServerError(msg);
      setLoading(false);
    }
  };

  const fillDevDemo = (envEmailVar?: string) => {
    if (!envEmailVar) return;
    setValue("email", envEmailVar);
  };

  return (
    <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-white/[0.08] bg-slate-900/90">
      {registeredNotice && (
        <div className="mb-5 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-400">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Registration Confirmed!</strong>
            Please enter your password below to access your AthleteCare dashboard.
          </div>
        </div>
      )}

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              {...register("email")}
              type="email"
              placeholder="name@athletecare.in"
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-white text-slate-950 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Development-only environment variable autofill helper (Gated strictly to dev) */}
      {isDev && process.env.NEXT_PUBLIC_DEMO_ATHLETE_EMAIL && (
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Local Dev Helper (NODE_ENV=dev)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDevDemo(process.env.NEXT_PUBLIC_DEMO_ATHLETE_EMAIL)}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-slate-700 font-mono text-[11px]"
            >
              Fill Athlete
            </button>
            <button
              type="button"
              onClick={() => fillDevDemo(process.env.NEXT_PUBLIC_DEMO_COACH_EMAIL)}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-left text-slate-300 hover:border-slate-700 font-mono text-[11px]"
            >
              Fill Coach
            </button>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <span className="text-xs text-slate-400">
          Don&apos;t have an athlete account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:underline font-semibold"
          >
            Register here
          </Link>
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 subtle-gradient relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          Athlete<span className="text-cyan-400">Care</span> Portal
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sign in to access daily sports wellness, ACWR & readiness analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <Suspense
          fallback={
            <div className="glass-card p-8 rounded-2xl h-80 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
