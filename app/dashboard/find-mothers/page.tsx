"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Loader2, UserPlus, Search } from "lucide-react";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import { toast } from "sonner";
import type { Patient } from "@/lib/types/patient";

export default function FindMothersPage() {
  return (
    <RequireVerified>
      <FindMothersContent />
    </RequireVerified>
  );
}

function FindMothersContent() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["chew", "patients", "unassigned"],
    queryFn: () => patientsService.getUnassignedPatients(),
  });

  const assignMutation = useMutation({
    mutationFn: (id: string) => patientsService.assignPatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chew", "patients"] });
      toast.success("Mother assigned to you");
    },
    onError: () => {
      toast.error("Failed to assign mother");
    },
  });

  const filtered = patients.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.community || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Find Mothers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Claim unassigned mothers in your area
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone or community..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-background-soft mb-4" />
              <div className="w-32 h-4 rounded bg-background-soft mb-2" />
              <div className="w-24 h-3 rounded bg-background-soft mb-3" />
              <div className="w-full h-8 rounded-lg bg-background-soft" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {search
              ? "No unassigned mothers match your search"
              : "All mothers in your area have been assigned"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient, i) => (
            <FadeInUp key={patient.id} delay={i * 0.03}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-primary">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {patient.firstName} {patient.lastName}
                </h3>
                <div className="space-y-1 mb-4">
                  {patient.community && (
                    <p className="text-xs text-muted-foreground">
                      {patient.community}
                    </p>
                  )}
                  {patient.language && (
                    <p className="text-xs text-muted-foreground">
                      {patient.language}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Registered: {patient.registeredAt}
                  </p>
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
          ))}
        </div>
      )}
    </div>
  );
}
