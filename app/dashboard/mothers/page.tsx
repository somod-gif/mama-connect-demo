"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Phone, Users, ChevronLeft, ChevronRight, SlidersHorizontal, X, AlertTriangle, CheckCircle } from "lucide-react";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import { ConfirmDialog } from "@/app/components/shared/ConfirmDialog";
import { toast } from "sonner";
import type { Patient } from "@/lib/types/patient";
import { computePregnancyWeek } from "@/lib/utils/date";
import { careStatusToRiskLevel } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const riskStyles: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-green-50 text-green-700 border-green-200",
};
const verificationStyles: Record<string, string> = {
  VERIFIED: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};
const alertStyles: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-slate-100 text-slate-700",
};

export default function MothersPage() {
  return (
    <RequireVerified>
      <MothersContent />
    </RequireVerified>
  );
}

function MothersContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [engagementFilter, setEngagementFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [alertsFilter, setAlertsFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [verifyId, setVerifyId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ["chew", "patients", { page, q: debouncedSearch, status: statusFilter, engagement: engagementFilter, risk: riskFilter, alerts: alertsFilter }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => patientsService.getPatients({
      page,
      limit: 20,
      q: debouncedSearch || undefined,
      status: statusFilter || undefined,
      engagement: engagementFilter || undefined,
      risk: riskFilter || undefined,
      alerts: alertsFilter || undefined,
    }),
    placeholderData: (prev) => prev,
  });

  const patients = data?.data ?? [];
  const meta = data?.meta;

  const queryClient = useQueryClient();
  const verifyMutation = useMutation({
    mutationFn: (id: string) => patientsService.verifyPatient(id),
    onSuccess: () => {
      setVerifyId(null);
      queryClient.invalidateQueries({ queryKey: ["chew", "patients"] });
      toast.success("Mother verified — Maternal ID issued");
    },
    onError: () => toast.error("Failed to verify mother"),
  });

  const resetFilters = useCallback(() => {
    setStatusFilter("");
    setEngagementFilter("");
    setRiskFilter("");
    setAlertsFilter("");
    setPage(1);
  }, []);

  const hasActiveFilters = statusFilter || engagementFilter || riskFilter || alertsFilter;

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Assigned Mothers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : meta ? `${meta.total} mother${meta.total !== 1 ? "s" : ""} under your care` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-colors ${hasActiveFilters ? "bg-primary text-white border-primary" : "bg-background border-border text-muted-foreground hover:border-primary"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <FadeInUp>
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Engagement</label>
              <select
                value={engagementFilter}
                onChange={(e) => { setEngagementFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="ENGAGED">Engaged</option>
                <option value="MISSED_CHECK_IN">Missed Check-in</option>
                <option value="UNREACHABLE">Unreachable</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Risk</label>
              <select
                value={riskFilter}
                onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Concerns</label>
              <button
                onClick={() => { setAlertsFilter(alertsFilter ? "" : "open"); setPage(1); }}
                className={`w-full px-3 py-2 text-sm rounded-xl border transition-colors ${alertsFilter ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-background border-border text-muted-foreground hover:border-primary"}`}
              >
                {alertsFilter ? "Open concerns ✓" : "Has open concern"}
              </button>
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </FadeInUp>
      )}

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {isLoading && !patients.length ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-background-soft" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 rounded bg-background-soft" />
                  <div className="w-20 h-3 rounded bg-background-soft" />
                </div>
                <div className="w-16 h-6 rounded-full bg-background-soft" />
                <div className="w-16 h-8 rounded-lg bg-background-soft" />
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No mothers match your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {patients.map((patient: Patient, i: number) => {
              const initials = patient.name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
              const activePreg = patient.pregnancies?.find(p => p.isActive);
              const pregnancyWeek = activePreg?.edd ? computePregnancyWeek(activePreg.edd) : null;
              const riskText = careStatusToRiskLevel(activePreg?.careStatus);
              return (
                <FadeInUp key={patient.id} delay={i * 0.03}>
                  <div className="flex items-center gap-4 p-4 hover:bg-background-soft transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age ? `${patient.age} yrs` : ""}
                        {pregnancyWeek ? ` · ${pregnancyWeek} weeks` : ""}
                        {patient.preferredLanguage ? ` · ${patient.preferredLanguage}` : ""}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border hidden sm:inline ${riskStyles[riskText] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {riskText.toUpperCase()}
                    </span>

                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border hidden sm:inline ${verificationStyles[patient.verificationStatus] || ""}`}>
                      {patient.verificationStatus}
                    </span>

                    {patient.openAlerts && patient.openAlerts.length > 0 && (() => {
                      const alerts = patient.openAlerts!;
                      const hasHigh = alerts.some((a) => a.severity === "HIGH");
                      const sev = hasHigh ? "HIGH" : alerts[0].severity;
                      return (
                        <span
                          className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border hidden sm:inline flex items-center gap-1 ${alertStyles[sev] || alertStyles.LOW}`}
                          title="Open concern"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {alerts.length > 1 ? `${alerts.length} concerns` : "Concern"}
                        </span>
                      );
                    })()}

                    <div className="flex items-center gap-1.5">
                      {patient.verificationStatus === "PENDING" && (
                        <button
                          onClick={() => setVerifyId(patient.id)}
                          disabled={verifyMutation.isPending && verifyMutation.variables === patient.id}
                          title="Verify enrollment"
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <Link href={`/dashboard/mothers/${patient.id}`} className="p-2 rounded-lg text-primary hover:bg-primary-light transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a href={`tel:${patient.phone}`} className="p-2 rounded-lg text-primary hover:bg-primary-light transition-colors">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              const start = Math.max(1, meta.page - 2);
              const pageNum = start + i;
              if (pageNum > meta.totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold transition-colors ${
                    pageNum === page ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={verifyId !== null}
        title="Verify mother's enrollment?"
        description="This confirms the enrollment and issues a Maternal ID. The mother will be marked as verified."
        confirmLabel="Verify"
        variant="success"
        isPending={verifyMutation.isPending}
        onConfirm={() => verifyId && verifyMutation.mutate(verifyId)}
        onCancel={() => setVerifyId(null)}
      />
    </div>
  );
}
