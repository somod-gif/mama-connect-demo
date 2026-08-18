"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RequireRole } from "@/app/components/shared/RequireRole";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Workspace", href: "/orgs", icon: Building2 },
  { label: "Members", href: "/orgs/members", icon: Users },
  { label: "Invite", href: "/orgs/invites", icon: UserPlus },
];

const PLATFORM_ORG = "mamaconnect-platform";

const PLATFORM_ORG_ID = "mamaconnect-platform";

export default function OrgsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <RequireRole roles={["ORG_ADMIN", "SUPERVISOR", "FACILITY_STAFF", "CHEW"]}>
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {user?.organizationId === PLATFORM_ORG_ID ? (
            <div className="mt-6 border-2 border-dashed border-line bg-bone/60 rounded-lg p-8 md:p-12 text-center max-w-2xl mx-auto">
              <Building2 className="w-11 h-11 mx-auto text-ink-faint" />
              <h1 className="mt-4 font-display text-3xl md:text-4xl text-ink">
                You’re on the platform card
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-md mx-auto">
                This account lives in the MamaConnect platform workspace.
                Register your organization to open your own desk for CHEWs,
                mothers and deliveries — then everyone you invite joins you here.
              </p>
              <Link
                href="/orgs/register"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
              >
                Register this organization
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <nav
                aria-label="Organization sections"
                className="flex items-center gap-1 border-b border-line overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const active = pathname === tab.href;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap",
                        active
                          ? "text-ink border-stamp"
                          : "text-ink-soft border-transparent hover:text-ink"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-8">{children}</div>
            </>
          )}
        </div>
      </main>
    </RequireRole>
  );
}