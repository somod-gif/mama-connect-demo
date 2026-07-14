"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Eye,
  Phone,
  Users,
} from "lucide-react";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import type { Patient } from "@/lib/types/patient";

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-background-soft" />
      <div className="flex-1 space-y-2">
        <div className="w-32 h-4 rounded bg-background-soft" />
        <div className="w-20 h-3 rounded bg-background-soft" />
      </div>
      <div className="w-16 h-6 rounded-full bg-background-soft" />
      <div className="w-16 h-8 rounded-lg bg-background-soft" />
    </div>
  );
}

const riskStyles: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-green-50 text-green-700 border-green-200",
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

  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["chew", "patients"],
    queryFn: () => patientsService.getPatients(),
  });

  const filtered = patients.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Assigned Mothers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${patients.length} mother${patients.length !== 1 ? "s" : ""} under your care`}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {search ? "No mothers match your search" : "No assigned mothers yet"}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {filtered.map((patient, i) => (
            <FadeInUp key={patient.id} delay={i * 0.03}>
              <div className="flex items-center gap-4 p-4 hover:bg-background-soft transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {patient.age} yrs
                    {patient.pregnancyWeek ? ` · ${patient.pregnancyWeek} weeks` : ""}
                    {patient.language ? ` · ${patient.language}` : ""}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                  {patient.lastCheckIn && (
                    <span>Last: {patient.lastCheckIn}</span>
                  )}
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${
                    riskStyles[patient.risk] || "bg-gray-50 text-gray-700"
                  }`}
                >
                  {patient.risk}
                </span>

                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/dashboard/mothers/${patient.id}`}
                    className="p-2 rounded-lg text-primary hover:bg-primary-light transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <a
                    href={`tel:${patient.phone}`}
                    className="p-2 rounded-lg text-primary hover:bg-primary-light transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      )}
    </div>
  );
}
