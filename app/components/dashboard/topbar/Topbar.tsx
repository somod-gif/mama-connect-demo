"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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

  const pageTitle = getPageTitle(pathname);
  const initials = user ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "CH" : "CH";

  return (
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 lg:h-16">
        <div className="lg:hidden">
          <h1 className="text-base font-bold text-foreground">
            {pageTitle}
          </h1>
        </div>
        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">
            {getGreeting()},{" "}
            <span className="font-semibold text-foreground">
              {user?.firstName || "CHEW"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-background-soft">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">
                CHEW
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
