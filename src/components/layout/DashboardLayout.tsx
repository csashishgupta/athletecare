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

  // Reset navigation indicator on route change
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

  // Build role-specific navigation links
  const getNavLinks = () => {
    if (profile.role === "athlete") {
      return [
        {
          label: "Dashboard",
          href: "/athlete/dashboard",
          icon: LayoutDashboard,
          badge: "Overview",
        },
        {
          label: "Daily Wellness",
          href: "/athlete/wellness",
          icon: HeartPulse,
          badge: "Daily",
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
        {
          label: "My Profile",
          href: "/athlete/profile",
          icon: User,
          badge: "Bio",
        },
      ];
    } else if (profile.role === "coach") {
      return [
        {
          label: "Team Dashboard",
          href: "/coach/dashboard",
          icon: Users,
          badge: "Roster",
        },
      ];
    } else if (profile.role === "medical") {
      return [
        {
          label: "Medical & Rehab",
          href: "/medical/dashboard",
          icon: Stethoscope,
          badge: "Clinical",
        },
      ];
    } else {
      // Admin
      return [
        {
          label: "Admin Overview",
          href: "/admin/dashboard",
          icon: ShieldAlert,
          badge: "Master",
        },
      ];
    }
  };

  const navLinks = getNavLinks();

  const roleTheme = {
    athlete: {
      accent: "text-sports-green",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      activeBg: "bg-gradient-to-r from-sports-green to-emerald-400 text-navy-950 shadow-lg shadow-sports-green/20 font-bold",
      indicator: "bg-sports-green",
    },
    coach: {
      accent: "text-cyan-400",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      activeBg: "bg-gradient-to-r from-cyan-400 to-teal-400 text-navy-950 shadow-lg shadow-cyan-400/20 font-bold",
      indicator: "bg-cyan-400",
    },
    medical: {
      accent: "text-purple-400",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      activeBg: "bg-gradient-to-r from-purple-400 to-indigo-400 text-navy-950 shadow-lg shadow-purple-400/20 font-bold",
      indicator: "bg-purple-400",
    },
    admin: {
      accent: "text-amber-400",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      activeBg: "bg-gradient-to-r from-amber-400 to-orange-400 text-navy-950 shadow-lg shadow-amber-400/20 font-bold",
      indicator: "bg-amber-400",
    },
  }[profile.role];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col md:flex-row relative selection:bg-sports-green selection:text-navy-950">
      {/* Top Instant Navigation Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-sports-green via-cyan-400 to-emerald-400 animate-nav-progress shadow-md shadow-sports-green/50" />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-navy-800/80 bg-navy-900/70 backdrop-blur-2xl transition-all duration-300 z-30 sticky top-0 h-screen ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 border-b border-navy-800/80 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-sports-green flex items-center justify-center text-navy-950 shrink-0 shadow-lg shadow-sports-green/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-black text-base tracking-tight text-slate-100 flex items-center gap-0.5">
                  Athlete<span className="text-sports-green">Care</span>
                </span>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  {profile.role} portal
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
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
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 relative group ${
                  isActive
                    ? roleTheme.activeBg
                    : "text-slate-400 hover:text-slate-100 hover:bg-navy-850/80"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-navy-950 stroke-[2.5]" : "text-slate-400"
                  }`}
                />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate font-semibold">{item.label}</span>
                    {!isActive && item.badge && (
                      <span className="text-[10px] font-medium text-slate-400 px-1.5 py-0.5 rounded bg-navy-800/80 border border-navy-700/50">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                {isActive && (
                  <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-r-full bg-slate-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout in Footer */}
        <div className="p-3 border-t border-navy-800/80 bg-navy-950/60">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-navy-900/90 border border-navy-800 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
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
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${roleTheme.badge}`}
              >
                {profile.role}
              </span>
            </div>
          ) : (
            <div className="flex justify-center mb-2.5">
              <div
                className={`w-4 h-4 rounded-full ${roleTheme.indicator} ring-4 ring-navy-800/80`}
                title={`${profile.full_name} (${profile.role})`}
              />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 border border-transparent hover:border-rose-900/50 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            title="Log out of AthleteCare"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 sm:h-20 border-b border-navy-800/80 bg-navy-950/80 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-navy-850 border border-navy-800 text-slate-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>{profile.full_name}</span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border hidden sm:inline-flex ${roleTheme.badge}`}
                >
                  {profile.role}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
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

          {/* Header Action Tools */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live IST Clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900/80 border border-navy-800 text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-sports-green" />
              <span>{currentTime || "Asia/Kolkata"}</span>
            </div>

            {/* Supabase Connection Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Cloud ap-south-1</span>
            </div>

            {/* Notifications */}
            <NotificationsDropdown userId={profile.id} />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-navy-800 bg-navy-900/95 backdrop-blur-2xl p-4 space-y-2 z-20">
            {navLinks.map((item) => {
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? roleTheme.activeBg
                      : "text-slate-300 hover:bg-navy-800"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/20"
            >
              <LogOut className="w-5 h-5 shrink-0" />
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
