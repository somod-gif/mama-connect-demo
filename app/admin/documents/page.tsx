"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, FileText, CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { AdminDocument } from "@/types/admin";

export default function AdminDocumentsPage() {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<AdminDocument[]>({
    queryKey: ["admin", "documents"],
    queryFn: () => adminService.getDocuments(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "VERIFIED" | "REJECTED" }) =>
      adminService.verifyDocument(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "documents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Document status updated");
    },
    onError: () => toast.error("Failed to update document status"),
  });

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
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Document Verification</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{documents.length} documents</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-background-soft flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              {statusBadge(doc.verificationStatus)}
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">{doc.documentType}</p>
              <p className="text-xs text-muted-foreground mt-0.5">by {doc.chewName}</p>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(doc.uploadDate).toLocaleDateString()}
            </div>

            {doc.verificationStatus !== "VERIFIED" && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => verifyMutation.mutate({ id: doc.id, status: "VERIFIED" })}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                >
                  <CheckCircle className="w-3 h-3" /> Approve
                </button>
                <button
                  onClick={() => verifyMutation.mutate({ id: doc.id, status: "REJECTED" })}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                >
                  <XCircle className="w-3 h-3" /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {documents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-sm text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
