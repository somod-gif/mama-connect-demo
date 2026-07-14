"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, UserPlus, FileText, Clock, CheckCircle, Activity } from "lucide-react";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardData } from "@/types/admin";

const summaryCards = [
  { key: "totalUsers" as const, icon: Users, label: "Total Users", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-500/10" },
  { key: "totalPatients" as const, icon: UserPlus, label: "Total Patients", color: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-500/10" },
  { key: "totalCHEWs" as const, icon: Users, label: "Total CHEWs", color: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-500/10" },
  { key: "pendingCHEWs" as const, icon: Clock, label: "Pending CHEWs", color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-500/10" },
  { key: "pendingPatients" as const, icon: Clock, label: "Pending Patients", color: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-500/10" },
  { key: "verifiedPatients" as const, icon: CheckCircle, label: "Verified Patients", color: "text-green-600", bg: "bg-green-50", ring: "ring-green-500/10" },
  { key: "pendingDocuments" as const, icon: FileText, label: "Pending Documents", color: "text-rose-600", bg: "bg-rose-50", ring: "ring-rose-500/10" },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<AdminDashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Platform overview</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-background-soft" />
                <div className="w-12 h-7 rounded bg-background-soft" />
              </div>
              <div className="w-28 h-4 rounded bg-background-soft" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((stat) => (
            <div key={stat.key} className="bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ring-1 ${stat.ring}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold text-foreground tabular-nums">
                  {data?.[stat.key] ?? 0}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-base font-bold text-foreground mb-3">Recent Activity</h3>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-background-soft mt-1.5" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-3.5 rounded bg-background-soft" />
                    <div className="w-48 h-3 rounded bg-background-soft" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="divide-y divide-border">
              {data.recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-background-soft transition-colors">
                  <Activity className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">{item.description}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
