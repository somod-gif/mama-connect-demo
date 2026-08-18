"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus, Send } from "lucide-react";
import { orgsService } from "@/lib/services/orgs.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { toast } from "sonner";
import type { InviteRole } from "@/lib/types/org";

const inviteSchema = z
  .object({
    name: z.string().min(2, "Enter the member’s full name"),
    email: z.union([z.literal(""), z.string().email("Enter a valid email")]),
    phone: z.union([
      z.literal(""),
      z.string().regex(/^\+234\d{10}$/, "Use +234 followed by 10 digits"),
    ]),
    role: z.enum(["SUPERVISOR", "CHEW", "FACILITY_STAFF"]),
  })
  .refine((data) => data.email || data.phone, {
    message: "Give them an email or a phone number to reach them on",
    path: ["email"],
  });

type InviteForm = z.infer<typeof inviteSchema>;

const roleOptions: Array<{ value: InviteRole; label: string; hint: string }> = [
  { value: "CHEW", label: "CHEW", hint: "Runs mothers in the field" },
  { value: "SUPERVISOR", label: "Supervisor", hint: "Oversees CHEWs" },
  { value: "FACILITY_STAFF", label: "Facility staff", hint: "Works at the clinic" },
];

export default function OrgsInvitesPage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "CHEW", name: "", email: "", phone: "" },
  });

  const inviteMutation = useMutation({
    mutationFn: (data: InviteForm) =>
      orgsService.inviteMember({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        role: data.role,
      }),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "me", "members"] });
      toast.success(`${member.name} invited`);
      reset();
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not send the invitation");
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Grow the desk"
        title="Invite a member"
        titleAccent="."
        description="They’ll get a WhatsApp setup link, set a password, and claim their seat on this card."
      />

      <form
        onSubmit={handleSubmit((data) => inviteMutation.mutate(data))}
        className="mt-8 max-w-2xl border-2 border-line bg-bone rounded-lg p-6 sm:p-8 space-y-5 shadow-paper"
        noValidate
      >
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-ink">
            Full name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Blessing Okafor"
            {...register("name")}
            className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-xs text-stamp">{errors.name.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-ink">
              Email <span className="text-ink-faint">(or phone below — either is fine)</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="chew@org.example"
              {...register("email")}
              className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-stamp">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-ink">
              Phone <span className="text-ink-faint">(WhatsApp number preferred)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+2348012345678"
              {...register("phone")}
              className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
            />
            {errors.phone && <p className="mt-1 text-xs text-stamp">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-ink">Role</span>
          <div className="mt-2 grid sm:grid-cols-3 gap-2">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className="cursor-pointer rounded-lg border-2 border-line px-3 py-3 text-center transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone"
              >
                <input type="radio" value={option.value} className="sr-only" {...register("role")} />
                <span className="block text-sm font-bold">{option.label}</span>
                <span className="mt-0.5 block text-[11px] opacity-70">{option.hint}</span>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-1 text-xs text-stamp">{errors.role.message}</p>}
        </div>

        <button
          type="submit"
          disabled={inviteMutation.isPending}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60 transition-colors"
        >
          {inviteMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          Send invitation
          <Send className="w-4 h-4 opacity-60" />
        </button>
      </form>
    </div>
  );
}