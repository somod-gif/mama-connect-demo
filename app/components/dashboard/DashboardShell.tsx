"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { documentService } from "@/services/document.service";

const Sidebar = lazy(() => import("@/app/components/dashboard/sidebar/Sidebar"));
const Topbar = lazy(() => import("@/app/components/dashboard/topbar/Topbar"));

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["my-documents"],
    queryFn: () => documentService.list(),
    enabled: !!user && user.verificationStatus === "PENDING",
  });

  useEffect(() => {
    if (isLoading || docsLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role === "ADMIN") router.replace("/admin");
    else if (
      user?.verificationStatus === "PENDING" &&
      documents?.length === 0 &&
      pathname !== "/dashboard/documents"
    ) {
      router.replace("/dashboard/documents");
    }
  }, [isAuthenticated, isLoading, user, documents, pathname, router, docsLoading]);

  if (!isAuthenticated || user?.role === "ADMIN") return null;
  if (user?.verificationStatus === "PENDING" && docsLoading) {
    return (
      <div className="min-h-screen bg-background-soft flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
