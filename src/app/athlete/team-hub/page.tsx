import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Profile } from "@/types/database";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Users,
  Megaphone,
} from "lucide-react";

export default async function TeamHubPage() {
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

  const announcements = [
    {
      id: 1,
      author: "Head Coach Vikram Malhotra",
      role: "Lead Performance Coach",
      title: "Tactical Match Preparation & Morning Readiness Protocol",
      date: "17-11-2026 • 07:00 IST",
      content:
        "All collegiate athletes must complete their AthleteCare morning wellness check-in before 07:30 IST. Athletes exhibiting Readiness Scores below 60 will be placed on modified low-impact drills.",
      priority: "high",
    },
    {
      id: 2,
      author: "Dr. Ananya Roy",
      role: "Lead Sports Physiotherapist",
      title: "Mandatory Post-Practice Hamstring & Hip Mobility Screenings",
      date: "16-11-2026 • 16:30 IST",
      content:
        "Athletes with active Grade-1 hamstring or groin strain reports must complete their prescribed rehab exercises and ice protocols before leaving the athletic complex.",
      priority: "normal",
    },
  ];

  const trainingSchedule = [
    { day: "Monday", time: "06:30 - 08:30 IST", session: "Strength & Power (Lower Body Focus)", location: "Varsity High Performance Gym" },
    { day: "Wednesday", time: "07:00 - 09:00 IST", session: "Speed Endurance & Tactical Drills", location: "Main Athletic Track & Field" },
    { day: "Friday", time: "16:00 - 18:00 IST", session: "Match Simulation & Scrimmage", location: "Stadium Ground A" },
    { day: "Saturday", time: "08:00 - 09:30 IST", session: "Active Recovery, Hydrotherapy & Mobility", location: "Physiotherapy Complex" },
    { day: "Sunday", time: "09:00 - 13:00 IST", session: "Inter-Collegiate Championship Match", location: "Central University Stadium" },
  ];

  return (
    <DashboardLayout profile={profile as Profile}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Team Communication Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Squad Noticeboard & Schedule
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Centralized broadcasts from head coaches, physiotherapists, and weekly training schedules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-cyan-400" />
              Squad: Varsity Athletic Team
            </span>
          </div>
        </div>

        {/* Coach Announcements Stream */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            Official Team Announcements
          </h3>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{a.title}</span>
                    {a.priority === "high" && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Priority Broadcast
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{a.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="font-bold text-slate-200">{a.author}</span>
                  <span>•</span>
                  <span>{a.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Training Drills Calendar Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-cyan-400" />
            Weekly Practice & Match Itinerary (Asia/Kolkata Standard Time)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Time Window</th>
                  <th className="py-2.5 px-3">Session Description</th>
                  <th className="py-2.5 px-3">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {trainingSchedule.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-400">{s.day}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{s.time}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{s.session}</td>
                    <td className="py-3 px-3 text-slate-400 flex items-center gap-1.5 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{s.location}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
