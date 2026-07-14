"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, Search, CheckCircle, XCircle, Eye, Shield } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { AdminChewUser } from "@/types/admin";

export default function AdminChewsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: chews = [], isLoading } = useQuery<AdminChewUser[]>({
    queryKey: ["admin", "chews"],
    queryFn: () => adminService.getCHEWs(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "VERIFIED" | "REJECTED" }) =>
      adminService.verifyCHEW(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "chews"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("CHEW status updated");
    },
    onError: () => toast.error("Failed to update CHEW status"),
  });

  const filtered = chews.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const statusBadge = (status: string) => {
    if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
    if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Shield className="w-3 h-3" /> Pending</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">CHEW Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{chews.length} registered CHEWs</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search CHEWs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-soft">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">State</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">LGA</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Created</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((chew) => (
                <tr key={chew.id} className="hover:bg-background-soft transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{chew.firstName.charAt(0)}{chew.lastName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{chew.firstName} {chew.lastName}</p>
                        <p className="text-[11px] text-muted-foreground">{chew.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{chew.phone}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{chew.state}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{chew.lga}</td>
                  <td className="px-4 py-3">{statusBadge(chew.verificationStatus)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(chew.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/chews/${chew.id}`)}
                        className="p-2 rounded-lg hover:bg-background-soft text-muted-foreground hover:text-foreground transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {chew.verificationStatus !== "VERIFIED" && (
                        <button
                          onClick={() => verifyMutation.mutate({ id: chew.id, status: "VERIFIED" })}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {chew.verificationStatus !== "REJECTED" && (
                        <button
                          onClick={() => verifyMutation.mutate({ id: chew.id, status: "REJECTED" })}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No CHEWs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
