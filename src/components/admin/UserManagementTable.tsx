"use client";

import React, { useState } from "react";
import { Profile, UserRole } from "@/types/database";
import { Search, Eye, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface UserManagementTableProps {
  users: Profile[];
  currentAdminId: string;
  updatingUserId: string | null;
  onRoleChange: (user: Profile, newRole: UserRole) => void;
  onToggleActive: (user: Profile) => void;
}

export function UserManagementTable({
  users,
  currentAdminId,
  updatingUserId,
  onRoleChange,
  onToggleActive,
}: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.primary_sport && u.primary_sport.toLowerCase().includes(searchTerm.toLowerCase()));

    if (roleFilter === "all") return matchesSearch;
    if (roleFilter === "suspended") return matchesSearch && !u.is_active;
    return matchesSearch && u.role === roleFilter;
  });


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, sport..."
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
          {(["all", "athlete", "coach", "medical", "admin", "suspended"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRoleFilter(filter)}
              className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-medium transition-colors shrink-0 ${
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

      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-3.5 py-3">User & Email</th>
              <th className="px-3.5 py-3">Assigned Role</th>
              <th className="px-3.5 py-3">Sport & Position</th>
              <th className="px-3.5 py-3">Status</th>
              <th className="px-3.5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  No registered users match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isCurrentAdmin = u.id === currentAdminId;
                return (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-3.5 py-3">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{u.full_name}</span>
                        {isCurrentAdmin && (
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-3.5 py-3">
                      <select
                        value={u.role}
                        disabled={updatingUserId === u.id || isCurrentAdmin}
                        onChange={(e) => onRoleChange(u, e.target.value as UserRole)}
                        aria-label={`Role for ${u.full_name}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase border cursor-pointer bg-slate-900 border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-400 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <option value="athlete">Athlete</option>
                        <option value="coach">Coach</option>
                        <option value="medical">Medical</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-3.5 py-3">
                      {u.primary_sport ? (
                        <div>
                          <span className="font-medium text-slate-200">{u.primary_sport}</span>
                          {u.playing_position && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {u.playing_position}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3.5 py-3">
                      <Badge variant={u.is_active ? "success" : "danger"}>
                        {u.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleActive(u)}
                          disabled={updatingUserId === u.id || isCurrentAdmin}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.is_active
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          } ${isCurrentAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={u.is_active ? "Suspend Account" : "Activate Account"}
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

      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.full_name || "User Profile"}
        description={selectedUser?.email}
      >
        {selectedUser && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Assigned Role
              </span>
              <span className="font-bold text-slate-200 uppercase mt-0.5 block">
                {selectedUser.role}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Account Status
              </span>
              <span
                className={`font-bold mt-0.5 block ${
                  selectedUser.is_active ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {selectedUser.is_active ? "Active" : "Suspended"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Primary Sport
              </span>
              <span className="font-semibold text-slate-200 mt-0.5 block">
                {selectedUser.primary_sport || "N/A"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Playing Position
              </span>
              <span className="font-semibold text-slate-200 mt-0.5 block">
                {selectedUser.playing_position || "N/A"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                System Account ID
              </span>
              <span className="font-mono text-slate-300 text-[11px] mt-0.5 block select-all">
                {selectedUser.id}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
