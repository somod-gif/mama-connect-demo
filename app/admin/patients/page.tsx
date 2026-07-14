"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, CheckCircle, XCircle, Clock, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminPatient, AdminUser } from "@/types/admin";

function EditPatientDialog({
  patient,
  onClose,
}: {
  patient: AdminPatient;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(patient.name || "");
  const [age, setAge] = useState(String(patient.age ?? ""));
  const [state, setState] = useState(patient.state?.name || "");
  const [lga, setLga] = useState(patient.lga?.name || "");
  const [address, setAddress] = useState(patient.address || "");
  const [preferredLanguage, setPreferredLanguage] = useState(patient.preferredLanguage || "");
  const [preferredChannel, setPreferredChannel] = useState(patient.preferredChannel || "");

  const updateMutation = useMutation({
    mutationFn: () =>
      adminService.updatePatient(patient.id, {
        name,
        age: age ? Number(age) : undefined,
        state, lga, address, preferredLanguage, preferredChannel,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "patients"] });
      toast.success("Patient updated");
      onClose();
    },
    onError: (err) => showApiError(err),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Edit Patient</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-background-soft"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">State</label>
              <input value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">LGA</label>
              <input value={lga} onChange={(e) => setLga(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Language</label>
              <input value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Channel</label>
              <select value={preferredChannel} onChange={(e) => setPreferredChannel(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="USSD">USSD</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 transition-all"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function VerifyPatientDialog({
  patient,
  onClose,
}: {
  patient: AdminPatient;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [chewId, setChewId] = useState("");

  const { data: chews = [] } = useQuery<AdminUser[]>({
    queryKey: ["admin", "users", "CHEW", "VERIFIED"],
    queryFn: () => adminService.getUsers({ role: "CHEW", status: "VERIFIED" }),
  });

  const verifyMutation = useMutation({
    mutationFn: () => adminService.verifyPatient(patient.id, { chewId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "patients"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Patient verified and assigned");
      onClose();
    },
    onError: (err) => showApiError(err),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Verify Patient</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-background-soft"><XCircle className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Assign <strong>{patient.name}</strong> to a CHEW to verify.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Assign CHEW</label>
            <select
              value={chewId}
              onChange={(e) => setChewId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select CHEW</option>
              {chews.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.email}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending || !chewId}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60 transition-all"
          >
            {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Verify & Assign
          </button>
        </div>
      </div>
    </div>
  );
}

const statusBadge = (status: string) => {
  if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
  if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
};

function PatientCard({
  patient,
  onEdit,
  onVerify,
}: {
  patient: AdminPatient;
  onEdit: (p: AdminPatient) => void;
  onVerify: (p: AdminPatient) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{patient.name}</p>
          <p className="text-[11px] text-muted-foreground">{patient.maternalId || "—"}</p>
        </div>
        {statusBadge(patient.verificationStatus)}
      </div>
      <div className="text-[11px] text-muted-foreground space-y-0.5">
        <p>CHEW: {patient.chew?.name || "Unassigned"}</p>
        <p>{patient.state?.name || "—"} · {patient.lga?.name || "—"}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(patient)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-primary bg-primary-light rounded-lg hover:bg-primary/20 transition-all">
          <Edit3 className="w-3 h-3" /> Edit
        </button>
        {patient.verificationStatus !== "VERIFIED" && (
          <button onClick={() => onVerify(patient)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
            <CheckCircle className="w-3 h-3" /> Verify
          </button>
        )}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="w-40 h-4 rounded bg-background-soft" />
            <div className="w-24 h-3 rounded bg-background-soft" />
          </div>
          <div className="w-20 h-6 rounded-full bg-background-soft" />
        </div>
      ))}
    </div>
  );
}

export default function AdminPatientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editPatient, setEditPatient] = useState<AdminPatient | null>(null);
  const [verifyPatient, setVerifyPatient] = useState<AdminPatient | null>(null);

  const { data: patients = [], isLoading } = useQuery<AdminPatient[]>({
    queryKey: ["admin", "patients"],
    queryFn: () => adminService.getPatients(),
  });

  const filtered = patients.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.name?.toLowerCase() || "").includes(q) ||
      (p.maternalId || "").toLowerCase().includes(q) ||
      (p.chew?.name || "").toLowerCase().includes(q)
    );
  });

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

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-soft">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Maternal ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Assigned CHEW</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Verification</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">State</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">LGA</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7}><TableSkeleton /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No patients found</td></tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-background-soft transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{patient.maternalId || "—"}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{patient.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.chew?.name || "—"}</td>
                    <td className="px-4 py-3">{statusBadge(patient.verificationStatus)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.state?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lga?.name || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditPatient(patient)} className="p-2 rounded-lg hover:bg-background-soft text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {patient.verificationStatus !== "VERIFIED" && (
                          <button onClick={() => setVerifyPatient(patient)} className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Verify">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="space-y-2">
                <div className="w-32 h-4 rounded bg-background-soft" />
                <div className="w-24 h-3 rounded bg-background-soft" />
              </div>
              <div className="w-full h-9 rounded-lg bg-background-soft mt-3" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No patients found</p>
          </div>
        ) : (
          filtered.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={setEditPatient}
              onVerify={setVerifyPatient}
            />
          ))
        )}
      </div>

      {editPatient && (
        <EditPatientDialog patient={editPatient} onClose={() => setEditPatient(null)} />
      )}
      {verifyPatient && (
        <VerifyPatientDialog patient={verifyPatient} onClose={() => setVerifyPatient(null)} />
      )}
    </div>
  );
}
