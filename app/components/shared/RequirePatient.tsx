"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { HeartPulse, ArrowLeft } from "lucide-react";

/**
 * Patient gate for /passport and /timeline. Only PATIENT roles carry a
 * maternal passport; everyone else gets a directed, role-aware next step.
 */
export function RequirePatient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Loading…
        </span>
      </div>
    );
  }

  if (user?.role !== "PATIENT") {
    const isCareWorker = ["CHEW", "SUPERVISOR", "ORG_ADMIN", "FACILITY_STAFF", "ADMIN"].includes(
      user?.role ?? ""
    );
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center rounded-lg border-2 border-dashed border-line bg-bone/60 p-8 shadow-paper">
          <HeartPulse className="w-10 h-10 mx-auto text-stamp" />
          <h2 className="mt-4 font-display text-2xl text-ink">
            This card belongs to a mama
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {isCareWorker
              ? "Mothers see the passport and timeline from their own account. You can open any assigned mother’s passport from the dashboard."
              : "Mamas register on WhatsApp so their passport opens automatically. New here? Start from the landing page."}
          </p>
          <Link
            href={isCareWorker ? "/dashboard" : "/"}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isCareWorker ? "Back to your dashboard" : "Go home"}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}