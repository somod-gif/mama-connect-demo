"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = lazy(() => import("@/app/components/dashboard/sidebar/Sidebar"));
const Topbar = lazy(() => import("@/app/components/dashboard/topbar/Topbar"));

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.replace("/login");
      else if (user?.role === "ADMIN") router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (!isAuthenticated || user?.role === "ADMIN") return null;

  return (
    <div className="min-h-screen bg-background-soft flex">
      <Suspense fallback={<div className="w-64 h-screen bg-card border-r border-border animate-pulse" />}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen(!mobileOpen)} />
      </Suspense>
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <Suspense fallback={<header className="h-12 lg:h-14 bg-card/80 border-b border-border animate-pulse" />}>
          <Topbar mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen(!mobileOpen)} />
        </Suspense>
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-3 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
