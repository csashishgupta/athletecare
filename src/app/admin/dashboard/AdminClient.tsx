"use client";

import React, { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Profile, AuditLog, UserRole } from "@/types/database";
import { updateUserRole, toggleUserStatus } from "@/actions/admin.actions";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { TelemetryStats } from "@/components/admin/TelemetryStats";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { DemoSimulationFactory } from "@/components/admin/DemoSimulationFactory";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldAlert,
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

  const [activeTab, setActiveTab] = useState<"users" | "telemetry" | "squads" | "audit" | "simulation">("users");
  const [userList, setUserList] = useState<Profile[]>(users);
  const [logsList, setLogsList] = useState<AuditLog[]>(auditLogs);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Metrics
  const totalUsers = userList.length;
  const athletesCount = userList.filter((u) => u.role === "athlete").length;
  const coachesCount = userList.filter((u) => u.role === "coach").length;
  const medicalCount = userList.filter((u) => u.role === "medical").length;
  const adminCount = userList.filter((u) => u.role === "admin").length;
  const activeCount = userList.filter((u) => u.is_active).length;
  const suspendedCount = userList.filter((u) => !u.is_active).length;

  // Handle role change via Server Action
  const handleRoleChange = async (targetUser: Profile, newRole: UserRole) => {
    if (targetUser.id === adminId && newRole !== "admin") {
      alert("Security Guard: You cannot demote your own active Administrator session.");
      return;
    }

    setUpdatingUserId(targetUser.id);
    setStatusMsg(null);

    const result = await updateUserRole(targetUser.id, newRole);

    if (!result.success) {
      setStatusMsg({ type: "error", text: result.error });
    } else {
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );

      const newAudit: AuditLog = {
        id: crypto.randomUUID(),
        actor_id: adminId,
        action: "UPDATE_USER_ROLE",
        entity_type: "profiles",
        entity_id: targetUser.id,
        details: { new_role: newRole, user_email: targetUser.email },
        created_at: new Date().toISOString(),
      };
      setLogsList((prev) => [newAudit, ...prev]);

      setStatusMsg({
        type: "success",
        text: result.message || `Successfully updated ${targetUser.full_name}'s role to ${newRole.toUpperCase()}.`,
      });

      startTransition(() => {
        router.refresh();
      });
    }
    setUpdatingUserId(null);
  };

  // Toggle user active status via Server Action
  const handleToggleActive = async (targetUser: Profile) => {
    if (targetUser.id === adminId) {
      alert("Security Guard: You cannot deactivate your own active Administrator account.");
      return;
    }

    setUpdatingUserId(targetUser.id);
    setStatusMsg(null);
    const newActiveState = !targetUser.is_active;

    const result = await toggleUserStatus(targetUser.id, newActiveState);

    if (!result.success) {
      setStatusMsg({ type: "error", text: result.error });
    } else {
      setUserList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, is_active: newActiveState } : u))
      );

      const actionName = newActiveState ? "USER_ACTIVATED" : "USER_DEACTIVATED";
      const newAudit: AuditLog = {
        id: crypto.randomUUID(),
        actor_id: adminId,
        action: actionName,
        entity_type: "profiles",
        entity_id: targetUser.id,
        details: { user_email: targetUser.email, is_active: newActiveState },
        created_at: new Date().toISOString(),
      };
      setLogsList((prev) => [newAudit, ...prev]);

      setStatusMsg({
        type: "success",
        text: result.message || `${targetUser.full_name}'s account has been ${newActiveState ? "activated" : "suspended"}.`,
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
        <UserManagementTable
          users={userList}
          currentAdminId={adminId}
          updatingUserId={updatingUserId}
          onRoleChange={handleRoleChange}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* TAB 2: TELEMETRY & CLOUD INSTANCE */}
      {activeTab === "telemetry" && <TelemetryStats />}

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
      {activeTab === "audit" && <AuditLogViewer logs={logsList} />}

      {/* TAB 5: DEMO SIMULATION FACTORY */}
      {activeTab === "simulation" && (
        <DemoSimulationFactory seeding={seeding} onSeed={handleSeedDemoData} />
      )}
    </div>
  );
}
