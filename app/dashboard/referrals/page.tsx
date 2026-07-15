"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Loader2,
  Plus,
  ArrowRightLeft,
  ExternalLink,
  X,
} from "lucide-react";
import { referralsService } from "@/lib/services/referrals.service";
import { patientsService } from "@/lib/services/patients.service";
import { StaggerContainer, StaggerItem } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import { toast } from "sonner";
import type { Referral, CreateReferralRequest } from "@/lib/types/dashboard";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function ReferralsPage() {
  return (
    <RequireVerified>
      <ReferralsContent />
    </RequireVerified>
  );
}

function ReferralsContent() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateReferralRequest>({
    patientId: "",
    reason: "",
    hospital: "",
    notes: "",
  });
  const queryClient = useQueryClient();

  const { data: referrals = [], isLoading } = useQuery<Referral[]>({
    queryKey: ["chew", "referrals"],
    queryFn: () => referralsService.getReferrals(),
  });

  const { data: patientsRes } = useQuery({
    queryKey: ["chew", "patients"],
    queryFn: () => patientsService.getPatients(),
  });
  const patients = patientsRes?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (data: CreateReferralRequest) => referralsService.createReferral(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chew", "referrals"] });
      toast.success("Referral created");
      setShowCreate(false);
      setForm({ patientId: "", reason: "", hospital: "", notes: "" });
    },
    onError: () => toast.error("Failed to create referral"),
  });

  const handleCreate = () => {
    if (!form.patientId || !form.reason || !form.hospital) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Referrals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${referrals.length} referral${referrals.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all"
        >
          <Plus className="w-4 h-4" /> New Referral
        </button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="w-32 h-4 rounded bg-background-soft mb-3" />
              <div className="w-48 h-3 rounded bg-background-soft mb-2" />
              <div className="w-24 h-3 rounded bg-background-soft" />
            </div>
          ))}
        </div>
      ) : referrals.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No referrals yet</p>
        </div>
      ) : (
        <StaggerContainer className="grid sm:grid-cols-2 gap-4">
          {referrals.map((r) => (
            <StaggerItem key={r.id}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{r.patientName}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusStyles[r.status] || ""}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium">Reason:</span> {r.reason}
                </p>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium">Hospital:</span> {r.hospital}
                </p>
                <p className="text-xs text-muted-foreground">{r.createdAt}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">New Referral</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-background-soft">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Patient</label>
                <select
                  value={form.patientId}
                  onChange={(e) => setForm((p) => ({ ...p, patientId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Reason</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  placeholder="e.g. High blood pressure"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Hospital / Facility</label>
                <input
                  type="text"
                  value={form.hospital}
                  onChange={(e) => setForm((p) => ({ ...p, hospital: e.target.value }))}
                  placeholder="e.g. General Hospital"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes || ""}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Additional information..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-background-soft rounded-xl hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Create Referral
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
