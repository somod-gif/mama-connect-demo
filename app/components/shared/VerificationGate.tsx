"use client";

import { useAuth } from "@/hooks/useAuth";
import { Shield, Clock, XCircle } from "lucide-react";

interface VerificationGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireVerified({ children, fallback }: VerificationGateProps) {
  const { user } = useAuth();
  const status = user?.verificationStatus;

  if (status === "VERIFIED") return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
        <Clock className="w-7 h-7 text-amber-600" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Feature Not Available</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {status === "PENDING"
          ? "This feature will be available once your account is verified by an administrator."
          : "You need a verified account to access this feature."}
      </p>
    </div>
  );
}

export function VerificationBadge({ status }: { status?: string }) {
  if (status === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
        <Shield className="w-3 h-3" /> Verified
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> Pending Verification
    </span>
  );
}
