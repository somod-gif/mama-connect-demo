"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/dashboard/mothers/")) return "Mother Profile";
  if (pathname === "/dashboard/mothers") return "Assigned Mothers";
  if (pathname === "/dashboard/find-mothers") return "Find Mothers";
  if (pathname === "/dashboard/referrals") return "Referrals";
  if (pathname === "/dashboard/profile") return "Profile";
  if (pathname === "/dashboard/settings") return "Settings";
  return "Dashboard";
}

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isOnboarding = pathname === "/dashboard/onboarding";

  if (isOnboarding) return null;

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        <div>
          <h1 className="text-lg font-bold text-foreground lg:hidden">
            {pageTitle}
          </h1>
          <p className="hidden lg:block text-sm text-muted-foreground">
            {getGreeting()}, <span className="font-semibold text-foreground">{user?.firstName || "CHEW"}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
              <span className="text-xs font-bold text-primary">
                {user?.firstName?.charAt(0) || "C"}{user?.lastName?.charAt(0) || "W"}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground">CHEW</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
