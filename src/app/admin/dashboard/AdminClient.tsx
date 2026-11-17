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
  ShieldCheck,
  ShieldAlert,
  Server,
  Wifi,
  Clock,
  Layers,
  Eye,
  X,
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

      // Log into audit_logs
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
        "Generate 7 days of realistic collegiate wellness & nutrition logs for all registered athletes? (This will populate graphs on athlete, coach, and medical dashboards)."
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
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
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-200 border border-navy-800 text-xs font-bold transition-all"
            title="Download full user directory CSV"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sports-green hover:bg-sports-green-hover text-navy-950 text-xs font-bold transition-all shadow-lg shadow-sports-green/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{seeding ? "Generating Data..." : "Simulate 7-Day Demo"}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-md ${
            statusMsg.type === "success"
              ? "bg-sports-green/10 text-sports-green border border-sports-green/30"
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

      {/* CLOUD INFRASTRUCTURE & TELEMETRY */}
      <div className="glass-card rounded-2xl p-5 border border-navy-800">
        <div className="flex items-center justify-between pb-4 border-b border-navy-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-sports-green" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Cloud Infrastructure & Backend Telemetry
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Real-time Status
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-navy-850/80 border border-navy-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Database Instance</span>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="mt-1 font-bold text-slate-200">Supabase PostgreSQL 15</p>
            <p className="text-[10px] text-emerald-400">Region: ap-south-1 (Mumbai)</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/80 border border-navy-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Security & RLS</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="mt-1 font-bold text-slate-200">Row Level Security Active</p>
            <p className="text-[10px] text-cyan-400">Strict Stakeholder Isolation</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/80 border border-navy-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Auth Service</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-sports-green" />
            </div>
            <p className="mt-1 font-bold text-slate-200">Auto-Confirm Triggers</p>
            <p className="text-[10px] text-slate-400">Active sessions: {activeCount}</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/80 border border-navy-800">
            <div className="flex items-center justify-between text-slate-400">
              <span>Timezone Standard</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="mt-1 font-bold text-slate-200">Asia/Kolkata (IST)</p>
            <p className="text-[10px] text-amber-400">Units: kg, cm, ml/L</p>
          </div>
        </div>
      </div>

      {/* PLATFORM KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-slate-400 block font-medium">Total Accounts</span>
          <span className="text-2xl font-black text-slate-100">{totalUsers}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">{activeCount} Active • {suspendedCount} Susp.</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-emerald-400 block font-medium">Athletes</span>
          <span className="text-2xl font-black text-emerald-400">{athletesCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Self-checkin</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-cyan-400 block font-medium">Coaches</span>
          <span className="text-2xl font-black text-cyan-400">{coachesCount}</span>
          <span className="text-[10px] text-slate-400 block mt-1">Squad monitors</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-purple-400 block font-medium">Medical / Physio</span>
          <span className="text-2xl font-black text-purple-400">{medicalCount}</span>
          <span className="text-[10px] text-amber-400 block mt-1">{adminCount} Admins</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-slate-400 block font-medium">Wellness Logs</span>
          <span className="text-2xl font-black text-slate-100">{stats.totalWellness}</span>
          <span className="text-[10px] text-sports-green block mt-1">Daily records</span>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-navy-800">
          <span className="text-[11px] text-rose-400 block font-medium">Injuries / Rehab</span>
          <span className="text-2xl font-black text-rose-400">{stats.totalInjuries}</span>
          <span className="text-[10px] text-slate-400 block mt-1">{stats.totalExercises} exercises</span>
        </div>
      </div>

      {/* USER MANAGEMENT & ROLE GOVERNANCE */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sports-green" />
              User Accounts & Role Permissions Directory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Provision roles, manage account activations, and audit stakeholder privileges
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, sport..."
                className="pl-9 pr-3 py-2 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sports-green w-60"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-900 border border-navy-800 text-xs">
              {(["all", "athlete", "coach", "medical", "admin", "suspended"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRoleFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                    roleFilter === filter
                      ? "bg-sports-green text-navy-950 font-bold"
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
            <thead className="bg-navy-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-navy-800">
              <tr>
                <th className="px-4 py-3">User & Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Sport & Position</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No users matching criteria &quot;{searchTerm}&quot; found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === adminId;
                  const roleBadgeColor = {
                    athlete: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    coach: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                    medical: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                    admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  }[u.role];

                  return (
                    <tr key={u.id} className="hover:bg-navy-850/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{u.full_name}</span>
                          {isCurrentAdmin && (
                            <span className="text-[9px] bg-sports-green/20 text-sports-green px-1.5 py-0.2 rounded font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-block relative">
                          <select
                            value={u.role}
                            disabled={updatingUserId === u.id || isCurrentAdmin}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            aria-label={`Role for ${u.full_name}`}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border cursor-pointer bg-navy-900 focus:outline-none ${roleBadgeColor} ${
                              isCurrentAdmin ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="athlete">Athlete</option>
                            <option value="coach">Coach</option>
                            <option value="medical">Medical</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {u.primary_sport ? (
                          <div>
                            <span className="font-medium text-slate-200">{u.primary_sport}</span>
                            {u.playing_position && (
                              <span className="text-[10px] text-slate-400 block">{u.playing_position}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {u.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUserForModal(u)}
                            className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-slate-100 transition-colors"
                            title="View Profile Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleActive(u)}
                            disabled={updatingUserId === u.id || isCurrentAdmin}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              u.is_active
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            } ${isCurrentAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={u.is_active ? "Deactivate User" : "Activate User"}
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

      {/* AUDIT LOG TRAIL */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-navy-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Immutable Security & Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of administrative actions, role transitions, and system triggers
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter:</span>
            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              aria-label="Filter audit logs by action"
              className="px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Actions</option>
              <option value="ROLE_CHANGE">ROLE_CHANGE</option>
              <option value="USER_ACTIVATED">USER_ACTIVATED</option>
              <option value="USER_DEACTIVATED">USER_DEACTIVATED</option>
              <option value="SEED_TRIGGERED">SEED_TRIGGERED</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredAuditLogs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No audit logs recorded for this criteria.
            </div>
          ) : (
            filteredAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-navy-800 text-slate-300 border border-navy-700">
                    {log.action}
                  </span>
                  <span className="text-slate-200 font-medium">
                    Entity: {log.entity_type}{" "}
                    {log.details && (
                      <span className="text-slate-400 text-[11px] font-mono">
                        ({JSON.stringify(log.details)})
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.created_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUserForModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full rounded-2xl p-6 border border-navy-800 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedUserForModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sports-green/10 border border-sports-green/30 text-sports-green flex items-center justify-center font-bold text-lg">
                {selectedUserForModal.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">
                  {selectedUserForModal.full_name}
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedUserForModal.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-navy-800">
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Assigned Role</span>
                <span className="font-bold text-slate-200 uppercase">{selectedUserForModal.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Account Status</span>
                <span className={`font-bold ${selectedUserForModal.is_active ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedUserForModal.is_active ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Primary Sport</span>
                <span className="font-bold text-slate-200">{selectedUserForModal.primary_sport || "N/A"}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Position</span>
                <span className="font-bold text-slate-200">{selectedUserForModal.playing_position || "N/A"}</span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Height</span>
                <span className="font-bold text-slate-200">
                  {selectedUserForModal.height_cm ? `${selectedUserForModal.height_cm} cm` : "Not logged"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-navy-850">
                <span className="text-slate-400 block text-[10px]">Weight</span>
                <span className="font-bold text-slate-200">
                  {selectedUserForModal.weight_kg ? `${selectedUserForModal.weight_kg} kg` : "Not logged"}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400">
              User ID: <span className="font-mono text-slate-300">{selectedUserForModal.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
