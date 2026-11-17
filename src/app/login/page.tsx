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
  Sparkles,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Query user profile to route correctly
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

  // Demo accounts helper
  const fillDemo = (email: string) => {
    setValue("email", email);
    setValue("password", "AthleteCare@2026");
  };

  return (
    <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-navy-800">
      {registeredNotice && (
        <div className="mb-5 p-3.5 rounded-xl bg-sports-green/10 border border-sports-green/30 flex items-start gap-2.5 text-xs text-sports-green">
          <CheckCircle2 className="w-4 h-4 text-sports-green shrink-0 mt-0.5" />
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
              placeholder="athlete@athletecare.in"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
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
              className="text-xs text-sports-green hover:underline font-medium"
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
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-sports-green hover:bg-sports-green-hover text-navy-950 transition-all duration-200 shadow-lg shadow-sports-green/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Section for College Evaluation */}
      <div className="mt-8 pt-6 border-t border-navy-800">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sports-green" />
          College Demo Quick-Fill:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillDemo("athlete@athletecare.in")}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-left transition-colors group"
          >
            <span className="font-bold text-emerald-400 block group-hover:text-emerald-300">
              Athlete Demo
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              athlete@athletecare.in
            </span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("coach@athletecare.in")}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-left transition-colors group"
          >
            <span className="font-bold text-cyan-400 block group-hover:text-cyan-300">
              Coach Demo
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              coach@athletecare.in
            </span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("medical@athletecare.in")}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-left transition-colors group"
          >
            <span className="font-bold text-purple-400 block group-hover:text-purple-300">
              Medical Staff
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              medical@athletecare.in
            </span>
          </button>
          <button
            type="button"
            onClick={() => fillDemo("admin@athletecare.in")}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-left transition-colors group"
          >
            <span className="font-bold text-rose-400 block group-hover:text-rose-300">
              Admin Demo
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              admin@athletecare.in
            </span>
          </button>
        </div>
      </div>

      <div className="text-center mt-6">
        <span className="text-xs text-slate-400">
          Don&apos;t have an athlete account?{" "}
          <Link
            href="/register"
            className="text-sports-green hover:underline font-semibold"
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
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 subtle-gradient relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sports-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-sports-green flex items-center justify-center text-navy-950 shadow-lg shadow-sports-green/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Athlete<span className="text-sports-green">Care</span> Portal
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Sign in to access your daily sports wellness & readiness analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <Suspense
          fallback={
            <div className="glass-card p-8 rounded-2xl h-80 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-sports-green border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
