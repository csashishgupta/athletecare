"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  User,
  HeartPulse,
  Utensils,
  Bandage,
  Users,
  Stethoscope,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Clock,
  Wifi,
  Flame,
  Moon,
  LineChart,
  CalendarDays,
  FileCheck2,
} from "lucide-react";
import { Profile } from "@/types/database";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { createClient } from "@/lib/supabase/client";

interface DashboardLayoutProps {
  profile: Profile;
  children: React.ReactNode;
}

export function DashboardLayout({ profile, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setCurrentTime(`${formatted} IST`);
      } catch {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Comprehensive, Senior-Grade Role Navigation
  const getNavLinks = () => {
    if (profile.role === "athlete") {
      return [
        {
          group: "Core Dashboard",
          items: [
            {
              label: "Overview",
              href: "/athlete/dashboard",
              icon: LayoutDashboard,
              badge: "Live",
            },
            {
              label: "Daily Check-in",
              href: "/athlete/wellness",
              icon: HeartPulse,
              badge: "Daily",
            },
            {
              label: "Workload & ACWR",
              href: "/athlete/training-load",
              icon: Flame,
              badge: "Load",
            },
          ],
        },
        {
          group: "Biometrics & Health",
          items: [
            {
              label: "Sleep & Recovery",
              href: "/athlete/sleep-recovery",
              icon: Moon,
              badge: "REM",
            },
            {
              label: "Nutrition & Water",
              href: "/athlete/nutrition",
              icon: Utensils,
              badge: "Diet",
            },
            {
              label: "Injuries & Rehab",
              href: "/athlete/injuries",
              icon: Bandage,
              badge: "Physio",
            },
          ],
        },
        {
          group: "Intelligence & Team",
          items: [
            {
              label: "Analytics Hub",
              href: "/athlete/analytics",
              icon: LineChart,
              badge: "Trends",
            },
            {
              label: "Squad Noticeboard",
              href: "/athlete/team-hub",
              icon: CalendarDays,
              badge: "Team",
            },
            {
              label: "Medical Clearance",
              href: "/athlete/reports",
              icon: FileCheck2,
              badge: "PDF",
            },
            {
              label: "Athlete Profile",
              href: "/athlete/profile",
              icon: User,
              badge: "Bio",
            },
          ],
        },
      ];
    } else if (profile.role === "coach") {
      return [
        {
          group: "Coach Command",
          items: [
            {
              label: "Team Dashboard",
              href: "/coach/dashboard",
              icon: Users,
              badge: "Roster",
            },
            {
              label: "Squad Readiness Board",
              href: "/coach/dashboard",
              icon: LayoutDashboard,
              badge: "Readiness",
            },
          ],
        },
      ];
    } else if (profile.role === "medical") {
      return [
        {
          group: "Medical Clinic",
          items: [
            {
              label: "Physio Dashboard",
              href: "/medical/dashboard",
              icon: Stethoscope,
              badge: "Clinical",
            },
          ],
        },
      ];
    } else {
      // Admin
      return [
        {
          group: "Platform Administration",
          items: [
            {
              label: "Admin Command Center",
              href: "/admin/dashboard",
              icon: ShieldAlert,
              badge: "Master",
            },
          ],
        },
      ];
    }
  };

  const navGroups = getNavLinks();

  const roleTheme = {
    athlete: {
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      activeBg: "bg-slate-100 text-slate-950 font-bold shadow-md shadow-white/5",
      indicator: "bg-cyan-400",
    },
    coach: {
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      activeBg: "bg-slate-100 text-slate-950 font-bold shadow-md shadow-white/5",
      indicator: "bg-blue-400",
    },
    medical: {
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      activeBg: "bg-slate-100 text-slate-950 font-bold shadow-md shadow-white/5",
      indicator: "bg-purple-400",
    },
    admin: {
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      activeBg: "bg-slate-100 text-slate-950 font-bold shadow-md shadow-white/5",
      indicator: "bg-amber-400",
    },
  }[profile.role];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col md:flex-row relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-nav-progress shadow-sm" />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/[0.08] bg-[#0A0F1C]/90 backdrop-blur-2xl transition-all duration-300 z-30 sticky top-0 h-screen ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-18 border-b border-white/[0.08] flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-black text-sm tracking-tight text-slate-100 flex items-center gap-0.5">
                  Athlete<span className="text-cyan-400">Care</span>
                </span>
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-widest">
                  {profile.role} portal
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => {
                      if (pathname !== item.href) {
                        setIsNavigating(true);
                      }
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 relative group ${
                      isActive
                        ? roleTheme.activeBg
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-850/60"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                        isActive ? "text-slate-950 stroke-[2.5]" : "text-slate-400"
                      }`}
                    />
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span className="truncate font-semibold">{item.label}</span>
                        {!isActive && item.badge && (
                          <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/40">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card in Footer */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070B14]/80">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 mb-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                {profile.full_name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {profile.full_name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {profile.email}
                </p>
              </div>
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shrink-0 ${roleTheme.badge}`}
              >
                {profile.role}
              </span>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <div
                className={`w-3 h-3 rounded-full ${roleTheme.indicator}`}
                title={`${profile.full_name} (${profile.role})`}
              />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 border border-transparent hover:border-rose-900/40 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title="Sign out of AthleteCare"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 sm:h-18 border-b border-white/[0.08] bg-[#070B14]/85 backdrop-blur-2xl sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{profile.full_name}</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border hidden sm:inline-flex ${roleTheme.badge}`}
                >
                  {profile.role}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>{profile.primary_sport || "AthleteCare Member"}</span>
                {profile.playing_position && (
                  <>
                    <span>•</span>
                    <span>{profile.playing_position}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live IST Clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime || "Asia/Kolkata"}</span>
            </div>

            {/* Cloud Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Cloud ap-south-1</span>
            </div>

            <NotificationsDropdown userId={profile.id} />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-white/[0.08] bg-[#070B14]/95 backdrop-blur-2xl p-4 space-y-3 z-20">
            {navGroups.map((g, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  {g.group}
                </p>
                {g.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        setMobileOpen(false);
                        if (pathname !== item.href) {
                          setIsNavigating(true);
                        }
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive
                          ? roleTheme.activeBg
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
