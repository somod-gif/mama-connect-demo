"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { geographyService } from "@/services/geography.service";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid Nigerian phone number")
    .regex(/^(\+234|0)[789]\d{9}$/, "Please enter a valid Nigerian phone number (e.g. +2348012345678)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
  stateId: z.string().min(1, "Please select your state"),
  lgaId: z.string().min(1, "Please select your LGA"),
  primaryHealthcareCentre: z.string().min(2, "Please enter your Primary Healthcare Centre"),
  preferredLanguage: z.string().min(1, "Please select your preferred language"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const LANGUAGES = ["English", "Pidgin", "Yoruba", "Hausa", "Igbo"];

export default function ChewRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      stateId: "",
      lgaId: "",
      primaryHealthcareCentre: "",
      preferredLanguage: "",
    },
  });

  const selectedStateId = watch("stateId");

  const { data: states = [] } = useQuery({
    queryKey: ["geography", "states"],
    queryFn: () => geographyService.getStates(),
  });

  const { data: lgas = [], isFetching: lgasLoading } = useQuery({
    queryKey: ["geography", "lgas", selectedStateId],
    queryFn: () => geographyService.getLGAs(selectedStateId),
    enabled: !!selectedStateId,
  });

  const password = watch("password", "");

  function getStrength(password: string): { score: number; label: string; color: string } {
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 1) return { score: 20, label: "Weak", color: "bg-red-500" };
    if (s <= 2) return { score: 40, label: "Fair", color: "bg-orange-500" };
    if (s <= 3) return { score: 60, label: "Good", color: "bg-yellow-500" };
    if (s <= 4) return { score: 80, label: "Strong", color: "bg-primary" };
    return { score: 100, label: "Very Strong", color: "bg-primary-dark" };
  }

  const strength = getStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        stateId: data.stateId,
        lgaId: data.lgaId,
        primaryHealthcareCentre: data.primaryHealthcareCentre,
        preferredLanguage: data.preferredLanguage,
      });
    } catch {
      // Toast handles error display
    }
  };

  const isPending = isLoading || isSubmitting;

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join MamaConnect as a Community Health Extension Worker
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">
                  First Name
                </label>
                <input id="firstName" placeholder="Your first name" {...register("firstName")} disabled={isPending} className={inputClass} />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">
                  Last Name
                </label>
                <input id="lastName" placeholder="Your last name" {...register("lastName")} disabled={isPending} className={inputClass} />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={isPending} className={inputClass} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Phone Number
                </label>
                <input id="phone" type="tel" placeholder="+2348012345678" {...register("phone")} disabled={isPending} className={inputClass} />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...register("password")}
                    disabled={isPending}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-background-soft rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">{strength.label}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                    disabled={isPending}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Professional Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stateId" className="block text-sm font-medium text-foreground mb-1.5">
                    State
                  </label>
                  <select id="stateId" {...register("stateId")} disabled={isPending} className={inputClass}>
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.stateId && <p className="mt-1 text-xs text-red-500">{errors.stateId.message}</p>}
                </div>
                <div>
                  <label htmlFor="lgaId" className="block text-sm font-medium text-foreground mb-1.5">
                    LGA
                  </label>
                  <select id="lgaId" {...register("lgaId")} disabled={isPending || !selectedStateId || lgasLoading} className={inputClass}>
                    <option value="">{lgasLoading ? "Loading..." : "Select LGA"}</option>
                    {lgas.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                  {errors.lgaId && <p className="mt-1 text-xs text-red-500">{errors.lgaId.message}</p>}
                </div>
                <div>
                  <label htmlFor="primaryHealthcareCentre" className="block text-sm font-medium text-foreground mb-1.5">
                    Primary Healthcare Centre
                  </label>
                  <input id="primaryHealthcareCentre" type="text" placeholder="e.g. General Hospital, Gwagwalada" {...register("primaryHealthcareCentre")} disabled={isPending} className={inputClass} />
                  {errors.primaryHealthcareCentre && <p className="mt-1 text-xs text-red-500">{errors.primaryHealthcareCentre.message}</p>}
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="block text-sm font-medium text-foreground mb-1.5">
                    Preferred Language
                  </label>
                  <select id="preferredLanguage" {...register("preferredLanguage")} disabled={isPending} className={inputClass}>
                    <option value="">Select language</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {errors.preferredLanguage && <p className="mt-1 text-xs text-red-500">{errors.preferredLanguage.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:-translate-y-0.5"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {isPending ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/chew/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
