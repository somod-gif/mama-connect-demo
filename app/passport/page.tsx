"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CalendarDays, AlertTriangle, HeartPulse } from "lucide-react";
import { passportService } from "@/lib/services/passport.service";
import { Stamp } from "@/app/components/shared/Stamp";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { RequirePatient } from "@/app/components/shared/RequirePatient";
import { formatDate } from "@/lib/utils/format";
import type { PassportIdentity } from "@/lib/types/passport";

const TRIMESTER = ["1st", "2nd", "3rd"] as const;

function Ruler({ weeks }: { weeks: number }) {
  const marks = Array.from({ length: 40 }, (_, i) => i + 1);
  return (
    <div className="relative">
      <div className="flex items-end gap-[2px]">
        {marks.map((week) => {
          const reached = week <= weeks;
          return (
            <span
              key={week}
              className={`flex-1 border border-line ${
                reached ? "bg-leaf" : "bg-paper-deep/40"
              }`}
              style={{ height: 14 + (week % 5) * 2 }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[9px] text-ink-faint">
        <span>wk 1</span>
        <span>wk 20</span>
        <span>wk 40</span>
      </div>
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-stamp opacity-60" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-stamp" />
      </span>
    </div>
  );
}

function PassportQr({ identity }: { identity: PassportIdentity }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const payload = [
      "MAMACONNECT:PASSPORT:v1",
      `mid=${identity.maternalId ?? ""}`,
      `name=${identity.name}`,
      `phone=${identity.phone}`,
      `state=${identity.state ?? ""}`,
      `lga=${identity.lga ?? ""}`,
    ].join("|");
    QRCode.toDataURL(payload, {
      margin: 1,
      width: 168,
      color: { dark: "#1B2531", light: "#FFFFFF" },
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [identity]);

  if (!src) return null;
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Portable QR code for this Maternal Passport"
        width={84}
        height={84}
        className="rounded-sm border border-line bg-paper px-1.5 py-1.5"
      />
      <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">
        {identity.maternalId ? `MID ${identity.maternalId}` : "Portable"}
      </span>
    </div>
  );
}

function severityTone(severity: string): "ink" | "stamp" | "leaf" {
  if (severity === "HIGH") return "stamp";
  if (severity === "MEDIUM") return "ink";
  return "leaf";
}

function statusTone(status: string): "ink" | "stamp" | "leaf" {
  if (status === "RESOLVED") return "leaf";
  if (status === "ACKNOWLEDGED") return "ink";
  return "stamp";
}

type Tab = "overview" | "appointments" | "alerts";

export default function PassportPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { data: passport, isLoading } = useQuery({
    queryKey: ["passport", "me"],
    queryFn: passportService.getMyPassport,
  });

  return (
    <RequirePatient>
      <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <PageHeader
            eyebrow="Digital Maternal Passport"
            title={
              passport?.identity?.name
                ? `${passport.identity.name}'s card`
                : "My passport"
            }
            titleAccent="."
            description="Your antenatal record, carried in your pocket."
          />

          {isLoading || !passport ? (
            <div className="mt-10 flex items-center justify-center py-24">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
                Fetching your card…
              </span>
            </div>
          ) : (
            <>
              <div className="mt-8 border-2 border-ink bg-bone rounded-lg shadow-paper overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dashed border-line">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    Passport
                    {passport.identity.maternalId && (
                      <span className="text-ink/50">
                        {" "}
                        #{passport.identity.maternalId}
                      </span>
                    )}
                  </p>
                  <Stamp
                    text={tab === "alerts" ? "Open alerts" : "Active"}
                    tone={tab === "alerts" ? "stamp" : "leaf"}
                    rotation={2}
                  />
                </div>

                <div className="px-6 py-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h1 className="font-display text-3xl text-ink">
                          {passport.identity.name}
                        </h1>
                        {passport.identity.age !== null && (
                          <span className="text-sm text-ink-soft">
                            age {passport.identity.age}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-soft">
                        {passport.identity.state ?? "—"}
                        {passport.identity.lga &&
                          ` · ${passport.identity.lga}`}
                        {passport.identity.ward &&
                          ` · ${passport.identity.ward}`}
                      </p>
                    </div>
                    <PassportQr identity={passport.identity} />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                        Pregnancy week
                      </p>
                      <span className="font-mono text-xs text-ink">
                        {passport.pregnancy
                          ? `${passport.pregnancy.gestationalAgeWeeks ?? "?"} wks`
                          : "Not in care"}
                      </span>
                    </div>
                    {passport.pregnancy?.gestationalAgeWeeks != null && (
                      <Ruler
                        weeks={Math.min(
                          passport.pregnancy.gestationalAgeWeeks,
                          40
                        )}
                      />
                    )}
                  </div>

                  {passport.pregnancy && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-paper/60 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                          Due
                        </p>
                        <p className="mt-1 font-semibold text-sm text-ink">
                          {formatDate(passport.pregnancy.edd)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-paper/60 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                          Trimester
                        </p>
                        <p className="mt-1 font-semibold text-sm text-ink">
                          {passport.pregnancy.trimester
                            ? TRIMESTER[passport.pregnancy.trimester - 1]
                            : "—"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-paper/60 p-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                          Care status
                        </p>
                        <p className="mt-1 font-semibold text-sm text-ink">
                          {passport.pregnancy.careStatus}
                        </p>
                      </div>
                    </div>
                  )}

                  {passport.chew && (
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-line p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper/60">
                          <HeartPulse className="h-5 w-5 text-ink-soft" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">
                            {passport.chew.name}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Your CHEW · {passport.chew.phone ?? "—"}
                          </p>
                        </div>
                      </div>
                      {passport.chew.phone && (
                        <Link
                          href={`https://wa.me/${passport.chew.phone.replace(/[^\d]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-leaf hover:underline shrink-0"
                        >
                          WhatsApp
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-1 border-b border-line">
                {(
                  [
                    ["overview", "Overview"],
                    ["appointments", "Appointments"],
                    ["alerts", "Alerts"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${
                      tab === key
                        ? "text-ink border-b-2 border-ink"
                        : "text-ink-faint hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-line p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Next appointment
                      </p>
                      {passport.appointments.length > 0 ? (
                        <>
                          <p className="mt-2 text-sm font-semibold text-ink">
                            {passport.appointments[passport.appointments.length - 1].title}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {formatDate(
                              passport.appointments[0].scheduledAt
                            )}
                          </p>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-ink-soft">
                          No appointments yet
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg border border-line p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Open alerts
                      </p>
                      <p className="mt-2 text-sm font-semibold text-ink">
                        {passport.alerts.length} alert
                        {passport.alerts.length === 1 ? "" : "s"}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        {passport.alerts[0]?.concern ??
                          "You’re all clear, mama."}
                      </p>
                    </div>
                  </div>

                  {Object.keys(passport.attributes.highlights).length > 0 && (
                    <div className="rounded-lg border border-line p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                        Highlighted notes
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(passport.attributes.highlights).map(
                          ([k, v]) => (
                            <span
                              key={k}
                              className="rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 font-mono text-[11px] font-medium text-leaf-dark capitalize"
                            >
                              {k}: {v}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "appointments" && (
                <ul className="mt-6 space-y-3">
                  {passport.appointments.length === 0 ? (
                    <li className="rounded-lg border-2 border-dashed border-line p-8 text-center text-sm text-ink-soft">
                      No appointments on file yet.
                    </li>
                  ) : (
                    passport.appointments.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-4 rounded-lg border-2 border-line bg-bone p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper/60">
                          <CalendarDays className="h-5 w-5 text-ink-soft" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-ink">{a.title}</p>
                          <p className="text-xs text-ink-soft">
                            {formatDate(a.scheduledAt)}
                          </p>
                        </div>
                        <Stamp text={a.status} tone={statusTone(a.status)} rotation={1} />
                      </li>
                    ))
                  )}
                </ul>
              )}

              {tab === "alerts" && (
                <ul className="mt-6 space-y-3">
                  {passport.alerts.length === 0 ? (
                    <li className="rounded-lg border-2 border-dashed border-line p-8 text-center text-sm text-ink-soft">
                      Nothing to flag. Keep checking in, mama.
                    </li>
                  ) : (
                    passport.alerts.map((a) => (
                      <li
                        key={a.id}
                        className="rounded-lg border-2 border-line bg-bone p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">
                              {a.concern}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {formatDate(a.createdAt)}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <Stamp text={a.severity} tone={severityTone(a.severity)} rotation={-1} />
                            <Stamp text={a.status} tone={statusTone(a.status)} rotation={1} />
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
    </RequirePatient>
  );
}