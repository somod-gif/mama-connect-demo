"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ShieldAlert, Stethoscope, RotateCcw, GraduationCap, HeartPulse } from "lucide-react";
import { passportService } from "@/lib/services/passport.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { RequirePatient } from "@/app/components/shared/RequirePatient";
import { formatDate } from "@/lib/utils/format";
import type { TimelineEvent } from "@/lib/types/passport";

const EVENT_META: Record<
  TimelineEvent["type"],
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  APPOINTMENT: { label: "Appointment", icon: CalendarDays, tone: "text-leaf" },
  ALERT: { label: "Alert", icon: ShieldAlert, tone: "text-stamp" },
  HEALTH_RECORD: { label: "Health note", icon: Stethoscope, tone: "text-ink" },
  ENCOUNTER: { label: "Check-in", icon: RotateCcw, tone: "text-ink-soft" },
  REFERRAL: { label: "Referral", icon: HeartPulse, tone: "text-leaf" },
  EDUCATION: { label: "Education", icon: GraduationCap, tone: "text-ink-soft" },
};

function groupByDate(events: TimelineEvent[]): Array<{ date: string; items: TimelineEvent[] }> {
  const map = new Map<string, TimelineEvent[]>();
  for (const event of events) {
    const day = new Date(event.date).toISOString().slice(0, 10);
    const list = map.get(day) ?? [];
    list.push(event);
    map.set(day, list);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items }));
}

export default function TimelinePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["timeline", "me"],
    queryFn: passportService.getMyTimeline,
  });

  const groups = events ? groupByDate(events) : [];

  return (
    <RequirePatient>
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <PageHeader
            eyebrow="Mother Timeline"
            title="Your journey, day by day"
            titleAccent="."
            description="Check-ins, appointments, notes and alerts — in the order they happened."
          />

          {isLoading || !events ? (
            <div className="mt-10 flex items-center justify-center py-24">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
                Unrolling the timeline…
              </span>
            </div>
          ) : groups.length === 0 ? (
            <div className="mt-10 py-20 text-center border-2 border-dashed border-line rounded-lg">
              <p className="text-sm text-ink-soft">
                Nothing here yet. Your story starts with your first check-in.
              </p>
            </div>
          ) : (
            <ol className="mt-10 relative border-l-2 border-line ml-4 space-y-8">
              {groups.map((group) => (
                <li key={group.date} className="ml-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-ink bg-bone" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    {formatDate(group.date)}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {group.items.map((event, index) => {
                      const meta = EVENT_META[event.type] ?? EVENT_META.HEALTH_RECORD;
                      const Icon = meta.icon;
                      return (
                        <li
                          key={`${event.date}-${index}`}
                          className="flex items-start gap-3 rounded-lg border-2 border-line bg-bone p-4 shadow-paper"
                        >
                          <span
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper/60 ${meta.tone}`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                              {meta.label}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-ink">
                              {event.summary}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </RequirePatient>
  );
}