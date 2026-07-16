"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Bell, ChevronLeft } from "lucide-react";
import { chewService } from "@/lib/services/chew.service";
import type { OpenAlert } from "@/types/dashboard";

const severityClass: Record<string, string> = {
  HIGH: "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-slate-100 text-slate-700",
};

export default function ConcernsPage() {
  const queryClient = useQueryClient();
  const { data: alerts = [], isLoading } = useQuery<OpenAlert[]>({
    queryKey: ["chew", "alerts"],
    queryFn: () => chewService.getAlerts(),
  });

  const acknowledge = useMutation({
    mutationFn: (id: string) => chewService.acknowledgeAlert(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chew", "alerts"] }),
  });
  const resolve = useMutation({
    mutationFn: (id: string) => chewService.resolveAlert(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chew", "alerts"] }),
  });

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-rose-600" />
        <h1 className="text-xl font-bold text-foreground">Open Concerns</h1>
        {alerts.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
            {alerts.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading concerns…</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No open concerns. You&apos;re all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
            >
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  severityClass[alert.severity] ?? severityClass.LOW
                }`}
              >
                {alert.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {alert.patientName}
                  {alert.maternalId ? ` · ${alert.maternalId}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">{alert.concern}</p>
                {alert.reason && (
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-2">
                    {alert.reason}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground/60 mt-1">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                {alert.status === "NEW" && (
                  <button
                    onClick={() => acknowledge.mutate(alert.id)}
                    disabled={acknowledge.isPending}
                    className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-primary-light text-primary hover:bg-primary-light/80 disabled:opacity-50"
                  >
                    Ack
                  </button>
                )}
                <button
                  onClick={() => resolve.mutate(alert.id)}
                  disabled={resolve.isPending}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground hover:bg-background-soft disabled:opacity-50"
                >
                  Resolve
                </button>
                <Link
                  href={`/dashboard/mothers/${alert.patientId}`}
                  className="text-[11px] font-semibold px-2 py-1 rounded-lg text-primary text-center hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
