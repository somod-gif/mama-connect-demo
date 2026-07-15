"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Loader2, UserPlus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import { toast } from "sonner";
import type { Patient } from "@/lib/types/patient";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

export default function FindMothersPage() {
  return (
    <RequireVerified>
      <FindMothersContent />
    </RequireVerified>
  );
}

function FindMothersContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const queryClient = useQueryClient();

  const queryKey = ["chew", "patients", "unassigned", { page, q: debouncedSearch }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => patientsService.getUnassignedPatients({
      page,
      limit: 18,
      q: debouncedSearch || undefined,
    }),
    placeholderData: (prev) => prev,
  });

  const patients = data?.data ?? [];
  const meta = data?.meta;

  const assignMutation = useMutation({
    mutationFn: (id: string) => patientsService.assignPatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chew", "patients"] });
      queryClient.invalidateQueries({ queryKey: ["chew", "patients", "unassigned"] });
      toast.success("Mother assigned to you");
    },
    onError: () => toast.error("Failed to assign mother"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Find Mothers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : meta ? `${meta.total} unassigned mother${meta.total !== 1 ? "s" : ""} in your area` : ""}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone or LGA..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading && !patients.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-background-soft mb-4" />
              <div className="w-32 h-4 rounded bg-background-soft mb-2" />
              <div className="w-24 h-3 rounded bg-background-soft mb-3" />
              <div className="w-full h-8 rounded-lg bg-background-soft" />
            </div>
          ))}
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {debouncedSearch ? "No unassigned mothers match your search" : "All mothers in your area have been assigned"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient: Patient, i: number) => {
            const initials = patient.name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
            return (
              <FadeInUp key={patient.id} delay={i * 0.03}>
                <motion.div whileHover={{ y: -2 }} className="bg-card border border-border rounded-2xl p-5 hover:shadow-card-hover transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">{initials}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{patient.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-xs text-muted-foreground">
                      {patient.lga?.name}{patient.lga?.name && patient.state?.name ? ", " : ""}{patient.state?.name || ""}
                    </p>
                    {patient.preferredLanguage && <p className="text-xs text-muted-foreground">{patient.preferredLanguage}</p>}
                    <p className="text-xs text-muted-foreground">Registered: {new Date(patient.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => assignMutation.mutate(patient.id)}
                    disabled={assignMutation.isPending && assignMutation.variables === patient.id}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary bg-primary-light rounded-xl hover:bg-primary hover:text-white disabled:opacity-50 transition-all"
                  >
                    {assignMutation.isPending && assignMutation.variables === patient.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    Assign to Me
                  </button>
                </motion.div>
              </FadeInUp>
            );
          })}
        </div>
      )}

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
    </div>
  );
}
