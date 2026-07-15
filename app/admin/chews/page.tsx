"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Loader2, Search, CheckCircle, XCircle, Eye, Shield, Phone,
  MapPin, Calendar, X, Trash2, Save, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminUser } from "@/types/admin";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const roleOptions = ["CHEW", "SUPERVISOR", "ADMIN"];
const statusOptions = ["PENDING", "VERIFIED", "REJECTED"];

function UserDrawer({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState(user.role);

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; role?: string }) => adminService.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User updated");
    },
    onError: (err) => showApiError(err),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User deleted");
      onClose();
    },
    onError: (err) => showApiError(err),
  });

  const verifyMutation = useMutation({
    mutationFn: (status: "VERIFIED" | "REJECTED") => adminService.verifyUser(user.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User status updated");
    },
    onError: (err) => showApiError(err),
  });

  const initials = (user.name?.charAt(0) || "") + (user.name?.split(" ")[1]?.charAt(0) || "") || "U";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40" />
      <div className="relative w-full max-w-lg bg-card border-l border-border h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-foreground">User Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background-soft"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Phone, label: "Phone", value: user.phone || "—" },
              { icon: Shield, label: "Role", value: user.role },
              { icon: MapPin, label: "State", value: user.lga?.state?.name || "—" },
              { icon: MapPin, label: "LGA", value: user.lga?.name || "—" },
              { icon: Calendar, label: "Registered", value: new Date(user.createdAt).toLocaleDateString() },
            ].map((field) => (
              <div key={field.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-background-soft">
                <field.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Edit User</h3>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button
              onClick={() => { if (name !== (user.name || "") || role !== user.role) updateMutation.mutate({ name, role }); }}
              disabled={updateMutation.isPending}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60"
            >
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
          <div className="border-t border-border pt-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Verification</h3>
            <div className="flex items-center gap-3">
              {user.verificationStatus !== "VERIFIED" && (
                <button onClick={() => verifyMutation.mutate("VERIFIED")} disabled={verifyMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
              )}
              {user.verificationStatus !== "REJECTED" && (
                <button onClick={() => verifyMutation.mutate("REJECTED")} disabled={verifyMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-60">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              )}
            </div>
          </div>
          <div className="border-t border-border pt-5">
            <button
              onClick={() => { if (confirm("Delete this user?")) deleteMutation.mutate(); }}
              disabled={deleteMutation.isPending}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-60"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusBadge = (status: string) => {
  if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
  if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Shield className="w-3 h-3" /> Pending</span>;
};

export default function AdminChewsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("CHEW");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ["admin", "users", { page, q: debouncedSearch, role: roleFilter, status: statusFilter }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => adminService.getUsers({
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      q: debouncedSearch || undefined,
      page,
      limit: 20,
    }),
    placeholderData: (prev) => prev,
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">CHEW Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{meta ? `${meta.total} users` : "Loading..."}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, email, phone..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Roles</option>
          {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-soft">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && !users.length ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 bg-background-soft rounded animate-pulse" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} onClick={() => router.push(`/admin/chews/${user.id}`)}
                    className="hover:bg-background-soft transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">{user.name?.charAt(0) || "U"}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[200px]">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{user.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{user.role}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{statusBadge(user.verificationStatus)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {meta.page} of {meta.totalPages} ({meta.total} total)</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              const start = Math.max(1, meta.page - 2);
              const p = start + i;
              if (p > meta.totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold ${p === page ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
