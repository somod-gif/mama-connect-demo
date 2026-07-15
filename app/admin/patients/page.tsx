"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, CheckCircle, XCircle, Clock, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminPatient, AdminUser } from "@/types/admin";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

function EditPatientDialog({ patient, onClose }: { patient: AdminPatient; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(patient.name || "");
  const [age, setAge] = useState(String(patient.age ?? ""));
  const [selectedStateId, setSelectedStateId] = useState(patient.stateId || patient.state?.id || "");
  const [selectedLgaId, setSelectedLgaId] = useState(patient.lgaId || patient.lga?.id || "");
  const [address, setAddress] = useState(patient.address || "");
  const [preferredLanguage, setPreferredLanguage] = useState(patient.preferredLanguage || "");
  const [preferredChannel, setPreferredChannel] = useState(patient.preferredChannel || "");

  const { data: states = [] } = useQuery({
    queryKey: ["geography", "states"],
    queryFn: () => adminService.getStates(),
  });

  const { data: lgas = [] } = useQuery({
    queryKey: ["geography", "lgas", selectedStateId],
    queryFn: () => adminService.getLgas(selectedStateId),
    enabled: !!selectedStateId,
  });

  const updateMutation = useMutation({
    mutationFn: () => adminService.updatePatient(patient.id, {
      name: name || undefined,
      age: age ? Number(age) : undefined,
      stateId: selectedStateId || undefined,
      lgaId: selectedLgaId || undefined,
      address: address || undefined,
      preferredLanguage: preferredLanguage || undefined,
      preferredChannel: preferredChannel || undefined,
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
              <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">State</label>
              <select value={selectedStateId} onChange={(e) => { setSelectedStateId(e.target.value); setSelectedLgaId(""); }}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select State</option>
                {states.map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">LGA</label>
              <select value={selectedLgaId} onChange={(e) => setSelectedLgaId(e.target.value)}
                disabled={!selectedStateId}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
                <option value="">Select LGA</option>
                {lgas.map((l: { id: string; name: string }) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Language</label>
              <input value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Channel</label>
              <select value={preferredChannel} onChange={(e) => setPreferredChannel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="USSD">USSD</option>
              </select>
            </div>
          </div>
          <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function VerifyPatientDialog({ patient, onClose }: { patient: AdminPatient; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [chewId, setChewId] = useState("");

  const { data: chewsRes } = useQuery({
    queryKey: ["admin", "users", { role: "CHEW", status: "VERIFIED" }],
    queryFn: () => adminService.getUsers({ role: "CHEW", status: "VERIFIED", limit: 100 }),
  });
  const chews = chewsRes?.data ?? [];

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
        <p className="text-sm text-muted-foreground mb-4">Assign <strong>{patient.name}</strong> to a CHEW to verify.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Assign CHEW</label>
            <select value={chewId} onChange={(e) => setChewId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select CHEW</option>
              {chews.map((c: AdminUser) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
            </select>
          </div>
          <button onClick={() => verifyMutation.mutate()} disabled={verifyMutation.isPending || !chewId}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60">
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

export default function AdminPatientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editPatient, setEditPatient] = useState<AdminPatient | null>(null);
  const [verifyPatient, setVerifyPatient] = useState<AdminPatient | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ["admin", "patients", { page, q: debouncedSearch }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => adminService.getPatients({ q: debouncedSearch || undefined, page, limit: 20 }),
    placeholderData: (prev) => prev,
  });

  const patients = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Patient Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{meta ? `${meta.total} patients` : "Loading..."}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search by name, phone, maternal ID, or CHEW..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

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
              {isLoading && !patients.length ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-background-soft rounded animate-pulse" /></td></tr>
                ))
              ) : patients.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">No patients found</td></tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-background-soft transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{patient.maternalId || "—"}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{patient.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.chew?.name || "—"}</td>
                    <td className="px-4 py-3">{statusBadge(patient.verificationStatus)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.state?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lga?.name || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditPatient(patient)}
                          className="p-2 rounded-lg hover:bg-background-soft text-muted-foreground hover:text-foreground" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {patient.verificationStatus !== "VERIFIED" && (
                          <button onClick={() => setVerifyPatient(patient)}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600" title="Verify">
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

      <div className="sm:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse"><div className="h-8 bg-background-soft rounded" /></div>)
        ) : patients.length === 0 ? (
          <div className="text-center py-12"><p className="text-sm text-muted-foreground">No patients found</p></div>
        ) : (
          patients.map((patient) => (
            <div key={patient.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
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
                <button onClick={() => setEditPatient(patient)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-primary bg-primary-light rounded-lg hover:bg-primary/20">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                {patient.verificationStatus !== "VERIFIED" && (
                  <button onClick={() => setVerifyPatient(patient)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100">
                    <CheckCircle className="w-3 h-3" /> Verify
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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

      {editPatient && <EditPatientDialog patient={editPatient} onClose={() => setEditPatient(null)} />}
      {verifyPatient && <VerifyPatientDialog patient={verifyPatient} onClose={() => setVerifyPatient(null)} />}
    </div>
  );
}
