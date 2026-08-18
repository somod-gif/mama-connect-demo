"use client";

import { useAuth } from "@/hooks/useAuth";
import { Shield, Clock, XCircle, AlertCircle } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gold-light border border-gold/20 flex items-center justify-center mb-4">
        <Clock className="w-6 h-6 text-gold" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">Verification Required</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {status === "PENDING"
          ? "Your account is being reviewed by an administrator. This feature will be available once verified."
          : "You need a verified account to access this feature. Please contact your administrator."}
      </p>
    </div>
  );
}

export function VerificationBadge({ status }: { status?: string }) {
  if (status === "VERIFIED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-leaf-light text-leaf-dark border border-leaf/20">
        <Shield className="w-3 h-3" /> Verified
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-danger-bg text-danger border border-danger/20">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-gold-light text-gold-dark border border-gold/20">
      <AlertCircle className="w-3 h-3" /> Pending Review
    </span>
  );
}
