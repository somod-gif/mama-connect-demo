"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  AlertTriangle,
  ArrowRightLeft,
  CalendarCheck,
  Loader2,
} from "lucide-react";
import { dashboardService } from "@/lib/services/dashboard.service";
import { useAuth } from "@/lib/hooks/useAuth";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/app/components/animations";
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
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    key: "highRiskCases" as const,
    icon: AlertTriangle,
    label: "High Risk Cases",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    key: "pendingReferrals" as const,
    icon: ArrowRightLeft,
    label: "Pending Referrals",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "todayFollowUps" as const,
    icon: CalendarCheck,
    label: "Today&apos;s Follow-ups",
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-background-soft" />
        <div className="w-12 h-8 rounded bg-background-soft" />
      </div>
      <div className="w-28 h-4 rounded bg-background-soft" />
    </div>
  );
}

function SkeletonActivity() {
  return (
    <div className="flex items-start gap-3 p-3 animate-pulse">
      <div className="w-2.5 h-2.5 rounded-full bg-background-soft mt-1.5" />
      <div className="flex-1 space-y-2 pb-4">
        <div className="w-36 h-4 rounded bg-background-soft" />
        <div className="w-56 h-3 rounded bg-background-soft" />
        <div className="w-20 h-3 rounded bg-background-soft" />
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {getGreeting()}, {user?.firstName || "CHEW"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s your overview for today
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((stat) => (
            <StaggerItem key={stat.key}>
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-card border border-border rounded-2xl p-5 transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    {data?.[stat.key] ?? 0}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <div>
        <h3 className="text-base font-bold text-foreground mb-4">Recent Activity</h3>
        {isLoading ? (
          <div className="bg-card border border-border rounded-2xl p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonActivity key={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-4">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-1">
                {data.recentActivity.map((item, i) => (
                  <FadeInUp key={item.id} delay={i * 0.05}>
                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-background-soft transition-colors">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                            item.type === "registration"
                              ? "bg-primary"
                              : item.type === "checkin"
                              ? "bg-blue-500"
                              : item.type === "referral"
                              ? "bg-amber-500"
                              : "bg-secondary"
                          }`}
                        />
                        {i < (data?.recentActivity?.length ?? 0) - 1 && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-foreground">
                          {item.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
