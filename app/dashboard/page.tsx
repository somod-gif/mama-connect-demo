"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  ArrowRightLeft,
  CalendarCheck,
  Shield,
  Clock,
  XCircle,
  ExternalLink,
  FileText,
  X,
  TrendingUp,
  Activity,
  ChevronRight,
  Bell,
  UserPlus,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { dashboardService } from "@/lib/services/dashboard.service";
import { documentService } from "@/services/document.service";
import { useAuth } from "@/hooks/useAuth";
import {
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/app/components/animations";
import { VerificationBadge } from "@/app/components/shared/VerificationGate";
import type { DashboardData, PatientCounts } from "@/lib/types/dashboard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const summaryCards = [
  {
    key: "patientCounts" as const,
    subKey: "total" as keyof PatientCounts,
    icon: Users,
    label: "Total Mothers",
    color: "text-teal-600",
    bg: "bg-teal-50",
    ring: "ring-teal-500/10",
  },
  {
    key: "highRiskCases" as const,
    icon: HeartPulse,
    label: "High Risk",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-500/10",
  },
  {
    key: "todayFollowUps" as const,
    icon: CalendarCheck,
    label: "Today's Appointments",
    color: "text-violet-600",
    bg: "bg-violet-50",
    ring: "ring-violet-500/10",
  },
  {
    key: "pendingReferralCount" as const,
    icon: ArrowRightLeft,
    label: "Pending Referrals",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-500/10",
  },
  {
    key: "upcomingAppointments" as const,
    icon: Bell,
    label: "Upcoming (7 days)",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-500/10",
  },
  {
    key: "overdueCheckIns" as const,
    icon: Activity,
    label: "Overdue Check-ins",
    color: "text-orange-600",
    bg: "bg-orange-50",
    ring: "ring-orange-500/10",
  },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-background-soft" />
            <div className="w-10 h-6 rounded bg-background-soft" />
          </div>
          <div className="w-20 h-3.5 rounded bg-background-soft" />
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

const activityIconMap: Record<string, typeof Bell> = {
  registration: UserPlus,
  checkin: CalendarCheck,
  referral: ArrowRightLeft,
  alert: AlertTriangle,
};

const activityColorMap: Record<string, string> = {
  registration: "bg-teal-500",
  checkin: "bg-blue-500",
  referral: "bg-amber-500",
  alert: "bg-rose-500",
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [dismissedDocs, setDismissedDocs] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("mama_dismiss_docs_banner") === "true";
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["my-documents"],
    queryFn: () => documentService.list(),
    enabled: user?.verificationStatus === "VERIFIED",
  });

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["chew", "dashboard"],
    queryFn: () => dashboardService.getDashboard(),
  });

  const needsAttention = (data?.overdueCheckIns ?? 0) + (data?.unverifiedFlagCount ?? 0);

  return (
    <div className="space-y-6">
      {user?.verificationStatus === "PENDING" && (
        <FadeInUp>
          <div className="flex items-start gap-3.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-amber-900">Pending Verification</p>
                <VerificationBadge status="PENDING" />
              </div>
              <p className="text-xs text-amber-800/80 mt-1">
                Your account is under review. Full access will be available once approved by an administrator.
              </p>
            </div>
          </div>
        </FadeInUp>
      )}

      {user?.verificationStatus === "REJECTED" && (
        <FadeInUp>
          <div className="flex items-start gap-3.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-red-900">Verification Required</p>
                <VerificationBadge status="REJECTED" />
              </div>
              <p className="text-xs text-red-800/80 mt-1">
                Your account couldn&apos;t be verified. Please update your information or contact support.
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Shield className="w-3 h-3" />
                  Update Profile
                </Link>
                <a
                  href="https://wa.me/2348169725007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-background-soft transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </FadeInUp>
      )}

      {user?.verificationStatus === "VERIFIED" && (
        <>
          {documents.length === 0 && !dismissedDocs && (
            <FadeInUp>
              <div className="flex items-start gap-3.5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Upload Supporting Documents</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your professional documents to complete your profile.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <Link
                      href="/dashboard/documents"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      Upload Documents
                    </Link>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDismissedDocs(true);
                    localStorage.setItem("mama_dismiss_docs_banner", "true");
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-background-soft transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </FadeInUp>
          )}
        </>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            {getGreeting()}, {user?.firstName || "CHEW"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s your overview for today
          </p>
        </div>
        <Link
          href="/dashboard/mothers"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
        >
          <Users className="w-4 h-4" />
          View All Mothers
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {needsAttention > 0 && (data?.patientCounts?.verified ?? 0) > 0 && (
        <FadeInUp>
          <div className="flex items-start gap-3.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-rose-900">
                {needsAttention} item{needsAttention !== 1 ? "s" : ""} need{needsAttention === 1 ? "s" : ""} your attention
              </p>
              <p className="text-xs text-rose-800/80 mt-1">
                {data && data.overdueCheckIns > 0 && `${data.overdueCheckIns} overdue check-in${data.overdueCheckIns !== 1 ? "s" : ""}`}
                {data && data.overdueCheckIns > 0 && data.unverifiedFlagCount > 0 && " · "}
                {data && data.unverifiedFlagCount > 0 && `${data.unverifiedFlagCount} unverified flag${data.unverifiedFlagCount !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </FadeInUp>
      )}

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(() => {
            const d = data;
            return summaryCards.map((stat) => {
              const Icon = stat.icon;
              let value = 0;
              if (d) {
                const dAny = d as unknown as Record<string, unknown>;
                if (stat.subKey) {
                  const parent = dAny[stat.key] as Record<string, number> | undefined;
                  value = parent?.[stat.subKey] ?? 0;
                } else {
                  value = dAny[stat.key] as number ?? 0;
                }
              }
              return (
                <StaggerItem key={stat.label}>
                  <div className="bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center ring-1 ${stat.ring}`}>
                        <Icon className={`w-4.5 h-4.5 ${stat.color}`} />
                      </div>
                      <span className="text-xl font-bold text-foreground tabular-nums">
                        {value}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{stat.label}</p>
                  </div>
                </StaggerItem>
              );
            });
          })()}
        </StaggerContainer>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Recent Activity
          </h3>
          {isLoading ? (
            <div className="bg-card border border-border rounded-xl p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonActivity key={i} />
              ))}
            </div>
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {data.recentActivity.slice(0, 10).map((item, i) => {
                  const AIcon = activityIconMap[item.type] || Bell;
                  return (
                    <FadeInUp key={item.id} delay={i * 0.02}>
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-background-soft transition-colors">
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ring-2 ring-white ${activityColorMap[item.type] || "bg-gray-400"}`} />
                          {i < Math.min(data.recentActivity.length, 10) - 1 && (
                            <div className="w-px flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-2">
                            <AIcon className={`w-3.5 h-3.5 ${item.type === "alert" ? "text-rose-500" : item.type === "referral" ? "text-amber-500" : "text-primary"}`} />
                            <p className="text-sm font-semibold text-foreground truncate">
                              {item.patientName}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1">
                            {getRelativeTime(item.timestamp)}
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/mothers/${item.id.replace(/^(ref-|reg-)/, "")}`}
                          className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </FadeInUp>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Activity will appear as you work with patients
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Quick Overview
            </h3>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assigned Mothers</span>
                <span className="text-sm font-bold text-foreground">{data?.patientCounts?.total ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Follow-ups Today</span>
                <span className="text-sm font-bold text-violet-600">{data?.todayFollowUps ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verified</span>
                <span className="text-sm font-bold text-green-600">{data?.patientCounts?.verified ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Verification</span>
                <span className="text-sm font-bold text-amber-600">{data?.patientCounts?.pending ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unreachable</span>
                <span className="text-sm font-bold text-rose-600">{data?.patientCounts?.unreachable ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High Risk</span>
                <span className="text-sm font-bold text-rose-600">{data?.highRiskCases ?? 0}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Upcoming Appointments</span>
                <span className="text-sm font-bold text-blue-600">{data?.upcomingAppointments ?? 0}</span>
              </div>
            </div>
          </div>

          {data?.recentPatients && data.recentPatients.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent Patients
              </h3>
              <div className="bg-card border border-border rounded-xl divide-y divide-border">
                {data.recentPatients.slice(0, 4).map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/dashboard/mothers/${patient.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-background-soft transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {(patient.name || "??").charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {patient.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {patient.verificationStatus === "VERIFIED" ? "Verified" : "Pending"}
                        {patient.lastActivityAt ? ` · ${getRelativeTime(patient.lastActivityAt)}` : ""}
                      </p>
                    </div>
                    <div className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                      patient.engagementStatus === "UNREACHABLE"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : patient.engagementStatus === "MISSED_CHECK_IN"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}>
                      {patient.engagementStatus === "UNREACHABLE"
                        ? "Unreachable"
                        : patient.engagementStatus === "MISSED_CHECK_IN"
                        ? "Missed"
                        : "Active"}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
