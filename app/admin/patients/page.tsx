"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { AdminPatient } from "@/types/admin";

export default function AdminPatientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: patients = [], isLoading } = useQuery<AdminPatient[]>({
    queryKey: ["admin", "patients"],
    queryFn: () => adminService.getPatients(),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => adminService.verifyPatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "patients"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Patient verified");
    },
    onError: () => toast.error("Failed to verify patient"),
  });

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.maternalId.toLowerCase().includes(search.toLowerCase()) ||
      p.assignedCHEW.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
    if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
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
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Patient Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{patients.length} patients</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patients..."
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
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Maternal ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Assigned CHEW</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Verification</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">EDD</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">State</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">LGA</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-background-soft transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{patient.maternalId}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{patient.firstName} {patient.lastName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.assignedCHEW}</td>
                  <td className="px-4 py-3">{statusBadge(patient.verificationStatus)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.edd ? new Date(patient.edd).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.state}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lga}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {patient.verificationStatus !== "VERIFIED" && (
                        <button
                          onClick={() => verifyMutation.mutate(patient.id)}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          title="Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
