"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  Lock,
  Mail,
  User,
  Trophy,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    fullName: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      primarySport: "",
      playingPosition: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setLoading(true);

    try {
      // 1. Sign up user via Supabase Auth
      // Role is intentionally NOT passed or accepted here.
      // Database trigger automatically assigns role 'athlete'.
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });

      if (error) {
        setServerError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // If sports info was provided, update profile with primary_sport & playing_position
        if (values.primarySport || values.playingPosition) {
          await supabase
            .from("profiles")
            .update({
              primary_sport: values.primarySport || null,
              playing_position: values.playingPosition || null,
            })
            .eq("id", data.user.id);
        }

        // To ensure the canonical onboarding flow:
        // Landing Page -> Get Started -> Sign Up -> Success / Confirm -> Log In -> Dashboard
        // Sign out any active auto-session so the user explicitly logs in.
        await supabase.auth.signOut();

        setSuccessData({
          fullName: values.fullName,
          email: values.email,
        });
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to complete registration.";
      setServerError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 subtle-gradient relative">
      {/* Background radial highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sports-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-sports-green flex items-center justify-center text-navy-950 shadow-lg shadow-sports-green/20 group-hover:scale-105 transition-transform duration-200">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Join Athlete<span className="text-sports-green">Care</span>
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Create your athlete profile to start logging daily wellness & recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-2xl shadow-2xl border border-navy-800">
          {successData ? (
            /* Registration Success Celebration Screen */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-sports-green/15 border border-sports-green/40 text-sports-green flex items-center justify-center mx-auto shadow-lg shadow-sports-green/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-2">
                  <Sparkles className="w-3 h-3" /> Registration Confirmed
                </span>
                <h3 className="text-xl font-black text-slate-100">
                  Account Created Successfully!
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Welcome to AthleteCare,{" "}
                  <strong className="text-sports-green">{successData.fullName}</strong>.
                  Your athlete profile has been registered in our centralized database.
                </p>
              </div>

              {/* Onboarding Steps Visual Indicator */}
              <div className="p-4 rounded-xl bg-navy-900/90 border border-navy-800 text-left space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-emerald-500/30">
                    1
                  </div>
                  <span>Account profile initialized with <strong>Athlete</strong> role.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-500/30">
                    2
                  </div>
                  <span>Wellness & readiness scoring algorithm ready.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-sports-green/20 text-sports-green flex items-center justify-center font-bold text-[11px] shrink-0 border border-sports-green/30">
                    3
                  </div>
                  <span>Sign in with your email to access your personal dashboard.</span>
                </div>
              </div>

              {/* Primary CTA leading to Login */}
              <Link
                href={`/login?registered=true&email=${encodeURIComponent(successData.email)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-sports-green hover:bg-sports-green-hover text-navy-950 transition-all duration-200 shadow-lg shadow-sports-green/25 hover:scale-[1.02]"
              >
                <LogIn className="w-4 h-4" /> Proceed to Sign In &rarr;
              </Link>

              <p className="text-[11px] text-slate-400">
                Registered Email:{" "}
                <span className="font-mono text-slate-200">{successData.email}</span>
              </p>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{serverError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="athlete@team.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
                )}
              </div>

              {/* Sport & Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sport
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <input
                      {...register("primarySport")}
                      type="text"
                      placeholder="e.g. Cricket"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Position
                  </label>
                  <input
                    {...register("playingPosition")}
                    type="text"
                    placeholder="e.g. Fast Bowler"
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password *
                </label>
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-sports-green transition-colors"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="p-3 rounded-xl bg-navy-850/80 border border-navy-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sports-green shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Role Protection:</strong> Public registrations are granted the default <strong>Athlete</strong> role. Privileged Coach, Medical, and Admin roles are provisioned by team administrators.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-sports-green hover:bg-sports-green-hover text-navy-950 transition-all duration-200 shadow-lg shadow-sports-green/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Athlete Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-sports-green hover:underline font-semibold"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
