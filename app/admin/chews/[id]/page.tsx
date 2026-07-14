"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Phone, MapPin, Globe, Shield, Calendar, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { showApiError } from "@/lib/error-handler";
import type { AdminUser } from "@/types/admin";

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-background-soft" />
        <div className="space-y-2">
          <div className="w-40 h-5 rounded bg-background-soft" />
          <div className="w-32 h-4 rounded bg-background-soft" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-background-soft">
            <div className="w-20 h-3 rounded bg-background-soft/60 mb-2" />
            <div className="w-32 h-4 rounded bg-background-soft/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminChewDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: user, isLoading } = useQuery<AdminUser>({
    queryKey: ["admin", "user", id],
    queryFn: () => adminService.getUser(id),
  });

  const verifyMutation = useMutation({
    mutationFn: (status: "VERIFIED" | "REJECTED") =>
      adminService.verifyUser(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User status updated");
    },
    onError: (err) => showApiError(err),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Link href="/admin/chews" className="p-2 rounded-xl hover:bg-background-soft transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">User Profile</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Loading...</p>
          </div>
        </div>
        <DetailSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">User not found</p>
        <Link href="/admin/chews" className="text-sm text-primary hover:underline mt-2 inline-block">Back to users</Link>
      </div>
    );
  }

  const initials = (user.name?.split(" ")[0]?.charAt(0) || "") + (user.name?.split(" ")[1]?.charAt(0) || "") || "U";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/chews" className="p-2 rounded-xl hover:bg-background-soft transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">User Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Full profile and verification</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-1">
              {user.verificationStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              ) : user.verificationStatus === "REJECTED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 text-red-700">
                  <XCircle className="w-3 h-3" /> Rejected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-700">
                  <Shield className="w-3 h-3" /> Pending
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: Mail, label: "Email", value: user.email || "—" },
            { icon: Phone, label: "Phone", value: user.phone || "—" },
            { icon: MapPin, label: "State", value: user.lga?.state?.name || "—" },
            { icon: MapPin, label: "LGA", value: user.lga?.name || "—" },
            { icon: Calendar, label: "Created", value: new Date(user.createdAt).toLocaleDateString() },
            { icon: Shield, label: "Role", value: user.role || "CHEW" },
          ].map((field) => (
            <div key={field.label} className="flex items-start gap-3 p-4 rounded-xl bg-background-soft">
              <field.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{field.label}</p>
                <p className="text-sm font-medium text-foreground">{field.value}</p>
              </div>
            </div>
          ))}
        </div>

        {user.verificationStatus !== "VERIFIED" && (
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <button
              onClick={() => verifyMutation.mutate("VERIFIED")}
              disabled={verifyMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60 transition-all"
            >
              {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Approve
            </button>
            <button
              onClick={() => verifyMutation.mutate("REJECTED")}
              disabled={verifyMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-60 transition-all"
            >
              {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
