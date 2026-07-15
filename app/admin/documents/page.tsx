"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, FileText, Calendar, Search, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminDocument } from "@/types/admin";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

const statusBadge = (status: string) => {
  if (status === "VERIFIED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
  if (status === "REJECTED") return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
};

export default function AdminDocumentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const queryKey = ["admin", "documents", { page, q: debouncedSearch, type: typeFilter, verified: verifiedFilter }];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => adminService.getDocuments({
      q: debouncedSearch || undefined,
      type: typeFilter || undefined,
      verified: verifiedFilter || undefined,
      page,
      limit: 20,
    }),
    placeholderData: (prev) => prev,
  });

  const documents = data?.data ?? [];
  const meta = data?.meta;

  const verifyMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "approve" | "reject" }) => adminService.verifyDocument(id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "documents"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Document status updated");
    },
    onError: (err) => showApiError(err),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Document Verification</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{meta ? `${meta.total} documents` : "Loading..."}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by CHEW name..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Types</option>
          <option value="LICENSE">License</option>
          <option value="CERTIFICATE">Certificate</option>
          <option value="GOVERNMENT_ID">Government ID</option>
        </select>
        <select value={verifiedFilter} onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Status</option>
          <option value="true">Verified</option>
          <option value="false">Pending / Rejected</option>
        </select>
      </div>

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
              {isLoading && !documents.length ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-10 bg-background-soft rounded animate-pulse" /></td></tr>
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
                          <p className="text-sm font-medium text-foreground truncate">{doc.type}</p>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer"
                            className="text-[11px] text-primary hover:underline inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> Preview
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.type}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{statusBadge(doc.verificationStatus)}</td>
                    <td className="px-4 py-3 text-right">
                      {doc.verificationStatus === "PENDING" && (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => verifyMutation.mutate({ id: doc.id, action: "approve" })}
                            disabled={verifyMutation.isPending}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-50" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => { if (confirm("Reject this document?")) verifyMutation.mutate({ id: doc.id, action: "reject" }); }}
                            disabled={verifyMutation.isPending}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50" title="Reject">
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
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse"><div className="h-8 bg-background-soft rounded" /></div>)
        ) : documents.length === 0 ? (
          <div className="text-center py-12"><p className="text-sm text-muted-foreground">No documents found</p></div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-background-soft flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{doc.type}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{doc.user?.name || 'Unknown'}</p>
                  </div>
                </div>
                {statusBadge(doc.verificationStatus)}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Calendar className="w-3 h-3" /> {new Date(doc.createdAt).toLocaleDateString()}
                <span>·</span>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Preview</a>
              </div>
              {doc.verificationStatus === "PENDING" && (
                <div className="flex gap-2">
                  <button onClick={() => verifyMutation.mutate({ id: doc.id, action: "approve" })}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button onClick={() => { if (confirm("Reject?")) verifyMutation.mutate({ id: doc.id, action: "reject" }); }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              )}
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
              return <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold ${p === page ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{p}</button>;
            })}
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages}
              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
