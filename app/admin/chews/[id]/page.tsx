"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, MapPin, Calendar, Shield, User, Users,
  FileText, CheckCircle, XCircle, Loader2, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminUserDetail, AdminPatient, AdminDocument } from "@/types/admin";

const statusBadge = (status: string) => {
  if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
  if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
};

export default function ChewDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<AdminUserDetail>({
    queryKey: ["admin", "user", id],
    queryFn: () => adminService.getUser(id),
  });

  const { data: patientsRes } = useQuery({
    queryKey: ["admin", "patients", { chewId: id }],
    queryFn: () => adminService.getPatients({ chewId: id, limit: 50 }),
    enabled: !!id,
  });

  const { data: docsRes } = useQuery({
    queryKey: ["admin", "documents", { userId: id }],
    queryFn: () => adminService.getDocuments({ userId: id, limit: 50 }),
    enabled: !!id,
  });

  const verifyMutation = useMutation({
    mutationFn: (status: "VERIFIED" | "REJECTED") => adminService.verifyUser(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const verifyDocMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      adminService.verifyDocument(id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "documents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Document updated");
    },
    onError: (err) => showApiError(err),
  });

  const patients = patientsRes?.data ?? [];
  const documents = docsRes?.data ?? [];
  const [rejectDocId, setRejectDocId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">User not found</p>
      </div>
    );
  }

  const initials = (user.name?.charAt(0) || "") + (user.name?.split(" ")[1]?.charAt(0) || "") || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/chews" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to CHEWs
      </Link>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-lg font-semibold text-foreground truncate">{user.name}</p>
              {statusBadge(user.verificationStatus)}
            </div>
            <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
          </div>
          {user.verificationStatus !== "VERIFIED" && (
            <button onClick={() => verifyMutation.mutate("VERIFIED")} disabled={verifyMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60">
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: User, label: "Role", value: user.role },
            { icon: Phone, label: "Phone", value: user.phone || "—" },
            { icon: MapPin, label: "State", value: user.lga?.state?.name || "—" },
            { icon: MapPin, label: "LGA", value: user.lga?.name || "—" },
            { icon: Calendar, label: "Joined", value: new Date(user.createdAt).toLocaleDateString() },
            { icon: Users, label: "Assigned Patients", value: String(patients.length) },
            { icon: FileText, label: "Documents", value: String(documents.length) },
            { icon: Shield, label: "Verification", value: user.verificationStatus },
          ].map(field => (
            <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-background-soft">
              <field.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-medium text-foreground">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {patients.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Assigned Patients ({patients.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {patients.map((p: AdminPatient) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-3 hover:bg-background-soft transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.maternalId || "—"} · {p.state?.name || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge(p.verificationStatus)}
                  <Link href={`/admin/patients`} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5">
                    <Users className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Documents ({documents.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {documents.map((doc: AdminDocument) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-3 hover:bg-background-soft transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.type}</p>
                    <p className="text-xs text-muted-foreground">{doc.type} · {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                  <div className="flex items-center gap-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline">View</a>
                  {statusBadge(doc.verificationStatus)}
                  {doc.verificationStatus === "PENDING" && (
                    <>
                      <button onClick={() => verifyDocMutation.mutate({ id: doc.id, action: "approve" })}
                        disabled={verifyDocMutation.isPending}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-50" title="Approve">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setRejectDocId(doc.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Reject">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rejectDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setRejectDocId(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">Reject Document</p>
                <p className="text-sm text-muted-foreground">
                  {documents.find((d) => d.id === rejectDocId)?.type}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject this document? This action can be undone by re-uploading.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setRejectDocId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-border bg-card text-foreground hover:bg-background-soft transition-colors">
                Cancel
              </button>
              <button onClick={() => {
                verifyDocMutation.mutate({ id: rejectDocId, action: "reject" });
                setRejectDocId(null);
              }} disabled={verifyDocMutation.isPending}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors">
                {verifyDocMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
