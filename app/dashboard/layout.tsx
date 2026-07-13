"use client";

import { useProtectedRoute } from "@/lib/hooks/use-protected-route";
import Sidebar from "@/app/components/dashboard/sidebar/Sidebar";
import Topbar from "@/app/components/dashboard/topbar/Topbar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-soft">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-soft flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 lg:pt-24">
          {children}
        </main>
      </div>
    </div>
  );
}
