"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  AlertTriangle,
  ArrowRightLeft,
  CalendarCheck,
} from "lucide-react";
import { dashboardService } from "@/lib/services/dashboard.service";
import { useAuth } from "@/hooks/useAuth";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/app/components/animations";
import type { DashboardData } from "@/lib/types/dashboard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const summaryCards = [
  {
    key: "assignedMothers" as const,
    icon: Users,
    label: "Assigned Mothers",
    color: "text-teal-600",
    bg: "bg-teal-50",
    ring: "ring-teal-500/10",
  },
  {
    key: "highRiskCases" as const,
    icon: AlertTriangle,
    label: "High Risk Cases",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-500/10",
  },
  {
    key: "pendingReferrals" as const,
    icon: ArrowRightLeft,
    label: "Pending Referrals",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-500/10",
  },
  {
    key: "todayFollowUps" as const,
    icon: CalendarCheck,
    label: "Today&apos;s Follow-ups",
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-500/10",
  },
];

function SkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-background-soft" />
            <div className="w-12 h-7 rounded bg-background-soft" />
          </div>
          <div className="w-28 h-4 rounded bg-background-soft" />
        </div>
      ))}
    </div>
  );
}

function SkeletonActivity() {
  return (
    <div className="flex items-start gap-3 p-3 animate-pulse">
      <div className="w-2 h-2 rounded-full bg-background-soft mt-1.5" />
      <div className="flex-1 space-y-2 pb-3">
        <div className="w-32 h-3.5 rounded bg-background-soft" />
        <div className="w-48 h-3 rounded bg-background-soft" />
        <div className="w-16 h-2.5 rounded bg-background-soft" />
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["chew", "dashboard"],
    queryFn: () => dashboardService.getDashboard(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          {getGreeting()}, {user?.firstName || "CHEW"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s your overview for today
        </p>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((stat) => (
            <StaggerItem key={stat.key}>
              <div className="bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <div>
        <h3 className="text-base font-bold text-foreground mb-3">
          Recent Activity
        </h3>
        {isLoading ? (
          <div className="bg-card border border-border rounded-xl p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonActivity key={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="divide-y divide-border">
                {data.recentActivity.map((item, i) => (
                  <FadeInUp key={item.id} delay={i * 0.03}>
                    <div className="flex items-start gap-3 px-5 py-3.5 hover:bg-background-soft transition-colors">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ring-2 ring-white ${
                            item.type === "registration"
                              ? "bg-teal-500"
                              : item.type === "checkin"
                              ? "bg-blue-500"
                              : item.type === "referral"
                              ? "bg-amber-500"
                              : "bg-violet-500"
                          }`}
                        />
                        {i < (data?.recentActivity?.length ?? 0) - 1 && (
                          <div className="w-px flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-0">
                        <p className="text-sm font-semibold text-foreground">
                          {item.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
