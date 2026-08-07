"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types/auth";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

interface RequireRoleProps {
  /** Roles allowed to view the children. Platform ADMIN always passes. */
  roles: UserRole[];
  children: React.ReactNode;
}

/**
 * Route gate for role-scoped workspaces (org, patient, market).
 * Unauthenticated → /login; wrong role → a directed "this is not your desk"
 * screen instead of a dead-end error.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Loading…
        </span>
      </div>
    );
  }

  const allowed = user?.role === "ADMIN" || roles.includes(user?.role as UserRole);
  if (!allowed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center border-2 border-line bg-bone/70 rounded-lg p-8 shadow-paper">
          <Building2 className="w-10 h-10 mx-auto text-ink-faint" />
          <h2 className="mt-4 font-display text-2xl text-ink">
            This isn’t the desk for your role
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            You’re signed in as {user?.role}. This workspace is reserved for{" "}
            {roles.join(" / ")} accounts. Your dashboard is waiting on the
            other side.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}