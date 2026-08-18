"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { orgsService } from "@/lib/services/orgs.service";
import { toast } from "sonner";
import type { OrgType } from "@/lib/types/org";

const registerSchema = z.object({
  name: z.string().min(3, "Give your organization a name (at least 3 characters)"),
  type: z.enum(["NGO", "GOV", "CLINIC"]),
  adminName: z.string().min(2, "Enter the admin’s full name"),
  adminEmail: z.string().email("Enter a valid email address"),
  adminPhone: z
    .string()
    .regex(/^\+234\d{10}$/, "Use +234 followed by 10 digits, e.g. +2348012345678"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function OrgsRegisterPage() {
  const [result, setResult] = useState<{ orgName: string; adminEmail: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { type: "NGO" },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await orgsService.register(data);
      setResult({ orgName: response.org.name, adminEmail: response.admin.email });
      toast.success("Organization created");
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? "Could not create the organization. Try again.");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 paper-ruled">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[11px] md:text-xs font-medium uppercase tracking-[0.22em] text-ink-faint">
            For clinics · NGOs · government
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-[1.02]">
            Open your own <em className="italic text-stamp">maternal desk</em>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] md:text-base leading-relaxed text-ink-soft">
            One workspace for your CHEWs, mothers, check-ins and deliveries —
            on the same card system MamaConnect uses everywhere.
          </p>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-2 border-ink bg-bone rounded-lg shadow-paper p-6 sm:p-8"
          >
            {result ? (
              <div className="text-center py-10">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-leaf-light">
                  <CheckCircle2 className="w-7 h-7 text-leaf" />
                </span>
                <h2 className="mt-4 font-display text-3xl text-ink">
                  {result.orgName} is on the board
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft max-w-md mx-auto">
                  A setup link was sent to <strong className="text-ink">{result.adminEmail}</strong>{" "}
                  on WhatsApp. The admin completes their password there, then signs in to invite
                  CHEWs and supervisors.
                </p>
                <Link
                  href="/login"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-bone bg-ink rounded-xl hover:bg-ink-soft transition-colors"
                >
                  Sign in as the admin
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink">
                    Organization name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Lagos Health Initiative"
                    {...register("name")}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-stamp">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <span className="block text-sm font-semibold text-ink">Organization type</span>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {(
                      [
                        { value: "NGO", label: "NGO" },
                        { value: "GOV", label: "Government" },
                        { value: "CLINIC", label: "Clinic" },
                      ] as Array<{ value: OrgType; label: string }>
                    ).map((option) => (
                      <label
                        key={option.value}
                        className="cursor-pointer rounded-lg border-2 border-line px-3 py-2.5 text-center text-sm font-semibold text-ink-soft transition-colors has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bone"
                      >
                        <input
                          type="radio"
                          value={option.value}
                          className="sr-only"
                          {...register("type")}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="adminName" className="block text-sm font-semibold text-ink">
                      Admin’s full name
                    </label>
                    <input
                      id="adminName"
                      type="text"
                      placeholder="Amina Yusuf"
                      {...register("adminName")}
                      className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
                    />
                    {errors.adminName && (
                      <p className="mt-1 text-xs text-stamp">{errors.adminName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="adminEmail" className="block text-sm font-semibold text-ink">
                      Admin’s email
                    </label>
                    <input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@org.example"
                      {...register("adminEmail")}
                      className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
                    />
                    {errors.adminEmail && (
                      <p className="mt-1 text-xs text-stamp">{errors.adminEmail.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="adminPhone" className="block text-sm font-semibold text-ink">
                    Admin’s WhatsApp number
                  </label>
                  <input
                    id="adminPhone"
                    type="tel"
                    placeholder="+2348012345678"
                    {...register("adminPhone")}
                    className="mt-1.5 w-full rounded-lg border-2 border-line bg-paper/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
                  />
                  {errors.adminPhone && (
                    <p className="mt-1 text-xs text-stamp">{errors.adminPhone.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-bone bg-ink rounded-xl hover:bg-ink-soft disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating workspace…
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Create organization
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-ink-faint">
                  Starts free on the Trial plan with 50 seats. Setup takes minutes.
                </p>
              </form>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-2 border-dashed border-line bg-paper-deep/40 rounded-lg p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              What you get
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              {[
                "A workspace card your whole team works from",
                "CHEW + supervisor seats, invited by you",
                "Patients claimed into your organization",
                "Marketplace deliveries routed to your CHEWs",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stamp" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
