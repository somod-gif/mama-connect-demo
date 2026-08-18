"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Save, Users, Mail, UserPlus } from "lucide-react";
import { orgsService } from "@/lib/services/orgs.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Stamp } from "@/app/components/shared/Stamp";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

const updateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  billingEmail: z.union([z.literal(""), z.string().email("Enter a valid email")]),
});

type UpdateForm = z.infer<typeof updateSchema>;

export default function OrgsOverviewPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: org, isLoading } = useQuery({
    queryKey: ["orgs", "me"],
    queryFn: orgsService.getMyOrg,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    values: org
      ? { name: org.name, billingEmail: org.billingEmail ?? "" }
      : { name: "", billingEmail: "" },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateForm) =>
      orgsService.updateMyOrg({
        name: data.name,
        billingEmail: data.billingEmail || undefined,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["orgs", "me"], updated);
      setEditing(false);
      toast.success("Workspace updated");
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not save changes");
    },
  });

  if (isLoading || !org) {
    return (
      <div className="py-24 flex items-center justify-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
          Opening the card…
        </span>
      </div>
    );
  }

  const seatPct = Math.min(100, Math.round((org.seatUsage / org.seatLimit) * 100));

  return (
    <div>
      <PageHeader
        eyebrow={`${org.type} organization · ${org.tier} plan`}
        title={org.name}
        description="Your workspace card — who works here, how many seats are left, and where the bills go."
        actions={
          <span className="hidden md:block">
            <Stamp
              text={org.status === "ACTIVE" ? "Active" : org.status}
              tone={org.status === "ACTIVE" ? "leaf" : "ink"}
              animate
            />
          </span>
        }
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section className="border-2 border-line bg-bone rounded-lg p-6 shadow-paper">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                Seats
              </h2>
              <Users className="w-4 h-4 text-ink-faint" />
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-5xl text-ink">{org.seatUsage}</span>
              <span className="mb-1.5 text-sm text-ink-soft">of {org.seatLimit} seats used</span>
            </div>
            <div
              className="mt-5 h-3 rounded-full bg-paper-deep overflow-hidden"
              role="progressbar"
              aria-valuenow={org.seatUsage}
              aria-valuemin={0}
              aria-valuemax={org.seatLimit}
            >
              <div
                className="h-full bg-leaf rounded-full transition-all duration-700"
                style={{ width: `${seatPct}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              {org.seatsRemaining > 0
                ? `${org.seatsRemaining} seats left — invite CHEWs and supervisors to fill them.`
                : "All seats are taken. Contact the team to move to a bigger plan."}
            </p>
          </section>

          <section className="border-2 border-line bg-bone rounded-lg p-6 shadow-paper">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold uppercase tracking-wider text-ink">
                <Save className="w-4 h-4" />
                Workspace details
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm font-semibold text-leaf hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink">
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-xs text-stamp">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="billingEmail" className="block text-sm font-semibold text-ink">
                    Billing email <span className="text-ink-faint">(optional)</span>
                  </label>
                  <input
                    id="billingEmail"
                    type="email"
                    {...register("billingEmail")}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm focus:border-ink focus:outline-none"
                  />
                  {errors.billingEmail && (
                    <p className="mt-1 text-xs text-stamp">{errors.billingEmail.message}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      reset();
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-ink-soft border-2 border-line rounded-xl hover:border-ink-soft/40"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  ["Organization", org.name],
                  ["Type", org.type],
                  ["Plan", org.tier],
                  ["Status", org.status],
                  ["Created", formatDate(org.createdAt)],
                  ["Billing", org.billingEmail ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-line pb-2">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      {label}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        </div>

        <aside className="border-2 border-dashed border-line bg-paper-deep/30 rounded-lg p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Keep the card alive
          </p>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex gap-2.5">
              <Mail className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              Invite CHEWs and supervisors from the Members tab.
            </li>
            <li className="flex gap-2.5">
              <UserPlus className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              New members verify their documents, then start on their dashboards.
            </li>
            <li className="flex gap-2.5">
              <Users className="w-4 h-4 text-leaf shrink-0 mt-0.5" />
              Mothers claiming into this desk count toward your seats.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}