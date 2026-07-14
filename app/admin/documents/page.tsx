"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, FileText, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminDocument } from "@/types/admin";

const statusBadge = (status: string) => {
  if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
  if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
};

function DocumentCard({ doc, onApprove, onReject }: { doc: AdminDocument; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-background-soft flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{doc.documentType}</p>
            <p className="text-[11px] text-muted-foreground truncate">{doc.chewName}</p>
          </div>
        </div>
        {statusBadge(doc.verificationStatus)}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Calendar className="w-3 h-3" />
        {new Date(doc.uploadDate).toLocaleDateString()}
      </div>
      {doc.verificationStatus !== "VERIFIED" && (
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(doc.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
          >
            <CheckCircle className="w-3 h-3" /> Approve
          </button>
          <button
            onClick={() => onReject(doc.id)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
          >
            <XCircle className="w-3 h-3" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-background-soft" />
          <div className="space-y-2">
            <div className="w-28 h-4 rounded bg-background-soft" />
            <div className="w-20 h-3 rounded bg-background-soft" />
          </div>
        </div>
        <div className="w-16 h-5 rounded-full bg-background-soft" />
      </div>
      <div className="w-24 h-3 rounded bg-background-soft" />
      <div className="flex gap-2 mt-3">
        <div className="flex-1 h-8 rounded-lg bg-background-soft" />
        <div className="flex-1 h-8 rounded-lg bg-background-soft" />
      </div>
    </div>
  );
}

export default function AdminDocumentsPage() {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<AdminDocument[]>({
    queryKey: ["admin", "documents"],
    queryFn: () => adminService.getDocuments(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) =>
      adminService.verifyDocument(id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "documents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Document status updated");
    },
    onError: (err) => showApiError(err),
  });

  const handleApprove = (id: string) => verifyMutation.mutate({ id, action: "approve" });
  const handleReject = (id: string) => {
    if (confirm("Reject this document?")) {
      verifyMutation.mutate({ id, action: "reject" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Document Verification</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{documents.length} documents</p>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-soft">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Document</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Uploaded By</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-xl bg-background-soft" />
                        <div className="flex-1 space-y-2">
                          <div className="w-32 h-4 rounded bg-background-soft" />
                          <div className="w-20 h-3 rounded bg-background-soft" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : documents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-muted-foreground">No documents found</td></tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-background-soft transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-background-soft flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.fileName || doc.documentType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.chewName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.documentType}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{statusBadge(doc.verificationStatus)}</td>
                    <td className="px-4 py-3 text-right">
                      {doc.verificationStatus !== "VERIFIED" && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleApprove(doc.id)}
                            disabled={verifyMutation.isPending}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(doc.id)}
                            disabled={verifyMutation.isPending}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No documents found</p>
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
}
