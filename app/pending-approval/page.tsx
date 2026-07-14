"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function PendingApprovalPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/chew/login");
    }
    if (!isLoading && user?.verificationStatus === "VERIFIED") {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <h1 className="text-xl font-bold text-foreground tracking-tight mb-3">
            Registration Successful
          </h1>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your account has been submitted for verification.
            A system administrator will verify your information before access is granted.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Your account is awaiting verification</strong> by MamaConnect Administrators.
              Once verified you will automatically gain access to your dashboard.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>{user.email}</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="mt-8 w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
