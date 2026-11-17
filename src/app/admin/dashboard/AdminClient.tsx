"use client";

import React, { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Profile, AuditLog, UserRole } from "@/types/database";
import {
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Download,
  ShieldAlert,
  Server,
  Layers,
  Eye,
  X,
  Users,
} from "lucide-react";

interface AdminClientProps {
  adminId: string;
  users: Profile[];
  auditLogs: AuditLog[];
  stats: {
    totalWellness: number;
    totalNutrition: number;
    totalInjuries: number;
    totalExercises: number;
  };
}

export function AdminClient({ adminId, users, auditLogs, stats }: AdminClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"users" | "telemetry" | "squads" | "audit" | "simulation">("users");
  const [userList, setUserList] = useState<Profile[]>(users);
  const [logsList, setLogsList] = useState<AuditLog[]>(auditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<Profile | null>(null);
  const [auditFilter, setAuditFilter] = useState<string>("all");

  // Metrics
  const totalUsers = userList.length;
  const athletesCount = userList.filter((u) => u.role === "athlete").length;
  const coachesCount = userList.filter((u) => u.role === "coach").length;
  const medicalCount = userList.filter((u) => u.role === "medical").length;
  const adminCount = userList.filter((u) => u.role === "admin").length;
  const activeCount = userList.filter((u) => u.is_active).length;
  const suspendedCount = userList.filter((u) => !u.is_active).length;

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.primary_sport && u.primary_sport.toLowerCase().includes(searchTerm.toLowerCase()));

    if (roleFilter === "all") return matchesSearch;
    if (roleFilter === "suspended") return matchesSearch && !u.is_active;
    return matchesSearch && u.role === roleFilter;
  });

  const filteredAuditLogs = logsList.filter((log) => {
    if (auditFilter === "all") return true;
    return log.action === auditFilter;
  });

  // Handle role change
  const handleRoleChange = async (targetUser: Profile, newRole: UserRole) => {
    if (targetUser.id === adminId && newRole !== "admin") {
      alert("Security Guard: You cannot demote your own active Administrator session.");
      return;
    }

    setUpdatingUserId(targetUser.id);
    setStatusMsg(null);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", targetUser.id);

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else {
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );

      const newAudit: AuditLog = {
        id: crypto.randomUUID(),
        actor_id: adminId,
        action: "ROLE_CHANGE",
        entity_type: "profile",
        entity_id: targetUser.id,
        details: {
          user_email: targetUser.email,
          previous_role: targetUser.role,
          new_role: newRole,
        },
        created_at: new Date().toISOString(),
      };

      await supabase.from("audit_logs").insert({
        actor_id: adminId,
        action: "ROLE_CHANGE",
        entity_type: "profile",
        entity_id: targetUser.id,
        details: {
          user_email: targetUser.email,
          previous_role: targetUser.role,
          new_role: newRole,
        },
      });

      setLogsList((prev) => [newAudit, ...prev]);

      setStatusMsg({
        type: "success",
        text: `Successfully updated ${targetUser.full_name}'s role to ${newRole.toUpperCase()}.`,
      });

      startTransition(() => {
        router.refresh();
      });
    }
    setUpdatingUserId(null);
  };

  // Toggle user active status
  const handleToggleActive = async (targetUser: Profile) => {
    if (targetUser.id === adminId) {
      alert("Security Guard: You cannot deactivate your own active Administrator account.");
      return;
    }

    setUpdatingUserId(targetUser.id);
    setStatusMsg(null);
    const newActiveState = !targetUser.is_active;

    const { error } = await supabase
      .from("profiles")
      .update({ is_active: newActiveState, updated_at: new Date().toISOString() })
      .eq("id", targetUser.id);

    if (error) {
      setStatusMsg({ type: "error", text: error.message });
    } else {
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: newActiveState } : u))
      );

      const actionName = newActiveState ? "USER_ACTIVATED" : "USER_DEACTIVATED";
      const newAudit: AuditLog = {
        id: crypto.randomUUID(),
        actor_id: adminId,
        action: actionName,
        entity_type: "profile",
        entity_id: targetUser.id,
        details: { user_email: targetUser.email },
        created_at: new Date().toISOString(),
      };

      await supabase.from("audit_logs").insert({
        actor_id: adminId,
        action: actionName,
        entity_type: "profile",
        entity_id: targetUser.id,
        details: { user_email: targetUser.email },
      });

      setLogsList((prev) => [newAudit, ...prev]);

      setStatusMsg({
        type: "success",
        text: `${targetUser.full_name}'s account has been ${newActiveState ? "activated" : "deactivated"}.`,
      });

      startTransition(() => {
        router.refresh();
      });
    }
    setUpdatingUserId(null);
  };

  // Trigger Demo Seed API
  const handleSeedDemoData = async () => {
    if (
      !confirm(
        "Generate 7 days of realistic collegiate wellness & nutrition logs for all registered athletes? This will populate graphs on athlete, coach, and medical dashboards."
      )
    ) {
      return;
    }

    setSeeding(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setStatusMsg({
          type: "success",
          text: data.message || "College demo data seeded successfully!",
        });
        startTransition(() => {
          router.refresh();
        });
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to seed demo data.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error running seed process.";
      setStatusMsg({
        type: "error",
        text: message,
      });
    }
    setSeeding(false);
  };

  // Export CSV of system directory
  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Email", "Role", "Active", "Sport", "Position", "Created At"];
    const rows = userList.map((u) => [
      u.id,
      `"${u.full_name}"`,
      u.email,
      u.role,
      u.is_active ? "Active" : "Suspended",
      `"${u.primary_sport || "N/A"}"`,
      `"${u.playing_position || "N/A"}"`,
      u.created_at,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AthleteCare_Users_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMsg({
      type: "success",
      text: "User directory exported successfully as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Executive Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Platform Administration Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage user accounts, assign privileged roles, inspect telemetry, and govern security audit logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 text-xs font-bold transition-all"
            title="Download full user directory CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{seeding ? "Generating Data..." : "Simulate 7-Day Demo"}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-md ${
            statusMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-950/30 text-rose-300 border border-rose-900/50"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* ADMIN MODULE NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-3.5 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === "users"
              ? "bg-slate-100 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          User Accounts & Permissions ({totalUsers})
        </button>
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-3.5 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === "telemetry"
              ? "bg-slate-100 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Cloud Telemetry & Database
        </button>
        <button
          onClick={() => setActiveTab("squads")}
          className={`px-3.5 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === "squads"
              ? "bg-slate-100 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Squad & Coach Mapping
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-3.5 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === "audit"
              ? "bg-slate-100 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Security Audit Trail ({logsList.length})
        </button>
        <button
          onClick={() => setActiveTab("simulation")}
          className={`px-3.5 py-2 rounded-xl transition-colors shrink-0 ${
            activeTab === "simulation"
              ? "bg-slate-100 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Demo Simulation Factory
        </button>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Total Accounts</span>
          <span className="text-xl font-black text-slate-100">{totalUsers}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">{activeCount} Active • {suspendedCount} Susp.</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-cyan-400 block font-medium">Athletes</span>
          <span className="text-xl font-black text-cyan-400">{athletesCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Self-checkin</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-blue-400 block font-medium">Coaches</span>
          <span className="text-xl font-black text-blue-400">{coachesCount}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Squad monitors</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-purple-400 block font-medium">Medical Staff</span>
          <span className="text-xl font-black text-purple-400">{medicalCount}</span>
          <span className="text-[10px] text-amber-400 block mt-0.5">{adminCount} Admins</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Wellness Logs</span>
          <span className="text-xl font-black text-slate-100">{stats.totalWellness}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Daily records</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-rose-400 block font-medium">Injuries / Rehab</span>
          <span className="text-xl font-black text-rose-400">{stats.totalInjuries}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{stats.totalExercises} exercises</span>
        </div>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === "users" && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                User Directory & Role Permissions
              </h3>
              <p className="text-xs text-slate-400">
                Search athletes, provision roles, and manage account states
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, email, sport..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-56"
                />
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800">
                {(["all", "athlete", "coach", "medical", "admin", "suspended"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRoleFilter(filter)}
                    className={`px-2 py-1 rounded-lg capitalize text-[11px] font-medium transition-colors ${
                      roleFilter === filter
                        ? "bg-slate-100 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">User & Email</th>
                  <th className="px-3 py-2.5">Role</th>
                  <th className="px-3 py-2.5">Sport & Position</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No users matching criteria found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isCurrentAdmin = u.id === adminId;
                    const roleBadgeColor = {
                      athlete: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                      coach: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      medical: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    }[u.role];

                    return (
                      <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{u.full_name}</span>
                            {isCurrentAdmin && (
                              <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded font-mono">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="px-3 py-2.5">
                          <select
                            value={u.role}
                            disabled={updatingUserId === u.id || isCurrentAdmin}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            aria-label={`Role for ${u.full_name}`}
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase border cursor-pointer bg-slate-900 focus:outline-none ${roleBadgeColor} ${
                              isCurrentAdmin ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="athlete">Athlete</option>
                            <option value="coach">Coach</option>
                            <option value="medical">Medical</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-3 py-2.5">
                          {u.primary_sport ? (
                            <div>
                              <span className="font-medium text-slate-200">{u.primary_sport}</span>
                              {u.playing_position && (
                                <span className="text-[10px] text-slate-400 block">{u.playing_position}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Not logged</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                              <span className="w-1 h-1 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedUserForModal(u)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(u)}
                              disabled={updatingUserId === u.id || isCurrentAdmin}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                u.is_active
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              } ${isCurrentAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                              title={u.is_active ? "Suspend User" : "Activate User"}
                            >
                              {u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TELEMETRY & CLOUD INSTANCE */}
      {activeTab === "telemetry" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-cyan-400" />
              Cloud Infrastructure Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cloud Database</span>
                <strong className="text-sm font-bold text-slate-200">Supabase PostgreSQL 15</strong>
                <p className="text-[10px] text-emerald-400 mt-1">Region: ap-south-1 Mumbai</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Edge Deployment</span>
                <strong className="text-sm font-bold text-slate-200">Vercel Fluid Compute</strong>
                <p className="text-[10px] text-cyan-400 mt-1">Server Actions & SSR Handlers</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Security Framework</span>
                <strong className="text-sm font-bold text-slate-200">Row Level Security (RLS)</strong>
                <p className="text-[10px] text-indigo-400 mt-1">Enforced at Postgres Core</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Timezone Protocol</span>
                <strong className="text-sm font-bold text-slate-200">Asia/Kolkata (IST)</strong>
                <p className="text-[10px] text-amber-400 mt-1">Units: cm, kg, ml/L</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQUADS & COACH MAPPING */}
      {activeTab === "squads" && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Squad Roster & Coach Assignments
          </h3>
          <p className="text-xs text-slate-400">
            Current collegiate athletic team mapping: <strong>{athletesCount}</strong> athlete(s) mapped to Coach Vikram Malhotra.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            All registered athletes in AthleteCare are dynamically synchronized to the Coach Team Dashboard with real-time privacy isolation.
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Security Audit Log Trail
            </h3>
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              aria-label="Filter audit logs"
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
            >
              <option value="all">All Actions</option>
              <option value="ROLE_CHANGE">ROLE_CHANGE</option>
              <option value="USER_ACTIVATED">USER_ACTIVATED</option>
              <option value="USER_DEACTIVATED">USER_DEACTIVATED</option>
              <option value="SEED_TRIGGERED">SEED_TRIGGERED</option>
            </select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {log.action}
                  </span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {JSON.stringify(log.details)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DEMO SIMULATION FACTORY */}
      {activeTab === "simulation" && (
        <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Demo Simulation Factory & Data Seeder
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generate realistic multi-day biometric telemetry (sleep duration, sleep quality, water intake, fatigue ratings, and meal logs) across all registered athletes to showcase dynamic charts during collegiate presentation review.
          </p>

          <div className="pt-2">
            <button
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seeding ? "Generating 7-Day Demo Records..." : "Generate 7-Day Athlete Data"}</span>
            </button>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUserForModal && (
        <div className="fixed inset-0 z-50 bg-[#070B14]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-white/[0.1] bg-slate-900/95 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedUserForModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-base">
                {selectedUserForModal.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">
                  {selectedUserForModal.full_name}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedUserForModal.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Role</span>
                <span className="font-bold uppercase text-slate-200">{selectedUserForModal.role}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Status</span>
                <span className={`font-bold ${selectedUserForModal.is_active ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedUserForModal.is_active ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Sport</span>
                <span className="font-bold text-slate-200">{selectedUserForModal.primary_sport || "N/A"}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-400 block text-[10px]">Position</span>
                <span className="font-bold text-slate-200">{selectedUserForModal.playing_position || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
