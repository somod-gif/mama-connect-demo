"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Phone, MapPin, Building2, Globe, Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import type { AdminChewDetail } from "@/types/admin";

export default function AdminChewDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: chew, isLoading } = useQuery<AdminChewDetail>({
    queryKey: ["admin", "chew", id],
    queryFn: () => adminService.getCHEWDetail(id),
  });

  const verifyMutation = useMutation({
    mutationFn: (status: "VERIFIED" | "REJECTED") => adminService.verifyCHEW(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "chew", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "chews"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("CHEW status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!chew) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">CHEW not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">CHEW Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Full profile and verification</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-xl font-bold text-white">{chew.firstName.charAt(0)}{chew.lastName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{chew.firstName} {chew.lastName}</p>
            <p className="text-sm text-muted-foreground">{chew.email}</p>
            <div className="mt-1">
              {chew.verificationStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-50 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              ) : chew.verificationStatus === "REJECTED" ? (
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
            { icon: Mail, label: "Email", value: chew.email },
            { icon: Phone, label: "Phone", value: chew.phone || "—" },
            { icon: MapPin, label: "State", value: chew.state || "—" },
            { icon: MapPin, label: "LGA", value: chew.lga || "—" },
            { icon: Building2, label: "Primary Healthcare Centre", value: chew.primaryHealthcareCentre || "—" },
            { icon: Globe, label: "Preferred Language", value: chew.preferredLanguage || "—" },
            { icon: Calendar, label: "Created", value: new Date(chew.createdAt).toLocaleDateString() },
            { icon: Shield, label: "Role", value: chew.role || "CHEW" },
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

        {chew.verificationStatus !== "VERIFIED" && (
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <button
              onClick={() => verifyMutation.mutate("VERIFIED")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all"
            >
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => verifyMutation.mutate("REJECTED")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
