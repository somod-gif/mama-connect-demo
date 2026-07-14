"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = lazy(
  () => import("@/app/components/dashboard/sidebar/Sidebar")
);
const Topbar = lazy(
  () => import("@/app/components/dashboard/topbar/Topbar")
);

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/chew/login");
      } else if (user?.verificationStatus === "PENDING") {
        router.replace("/pending-approval");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background-soft flex">
      <Suspense fallback={null}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </Suspense>
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Suspense fallback={null}>
          <Topbar />
        </Suspense>
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-4 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
