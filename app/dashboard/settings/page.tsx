"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Globe,
  Shield,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { chewService } from "@/services/chew.service";
import { FadeInUp } from "@/app/components/animations";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "language", label: "Language", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["chew", "profile"],
    queryFn: () => chewService.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { preferredLanguage?: string }) => chewService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chew", "profile"] });
      toast.success("Language preference updated");
    },
    onError: () => toast.error("Failed to update language preference"),
  });

  const firstName = profile?.name?.split(" ")[0] || user?.firstName || "";
  const lastName = profile?.name?.split(" ").slice(1).join(" ") || user?.lastName || "";

  const normalizeLga = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return (val as { name: string }).name || "—";
    return "—";
  };

  const normalizeState = (val: unknown): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") {
      const lga = val as { state?: { name?: string }; name?: string };
      if (lga.state?.name) return lga.state.name;
      return lga.name || "—";
    }
    return "—";
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    if (profile) {
      updateMutation.mutate({ preferredLanguage: lang });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                activeSection === section.id
                  ? "bg-primary-light text-primary"
                  : "text-muted-foreground hover:bg-background-soft"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <FadeInUp key="profile">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">Profile Information</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {firstName?.charAt(0)}{lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{firstName} {lastName}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary-light text-primary-dark">
                        CHEW
                      </span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { label: "Email", value: profile?.email || user?.email },
                      { label: "Phone Number", value: profile?.phone || user?.phone || "—" },
                      { label: "State", value: normalizeState(profile?.lga) },
                      { label: "LGA", value: normalizeLga(profile?.lga) },
                      { label: "Healthcare Centre", value: profile?.facility || "—" },
                      { label: "Role", value: "Community Health Extension Worker" },
                    ].map((field) => (
                      <div key={field.label}>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{field.label}</p>
                        <p className="text-sm font-medium text-foreground">{field.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}

            {activeSection === "notifications" && (
              <FadeInUp key="notifications">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Notification settings will be available soon.</p>
                </div>
              </FadeInUp>
            )}

            {activeSection === "language" && (
              <FadeInUp key="language">
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">Language Preference</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your current language preference is <strong>{profile?.preferredLanguage || "English"}</strong>
                  </p>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={profile?.preferredLanguage || "English"}
                    onChange={handleLanguageChange}
                  >
                    {["English", "Pidgin", "Yoruba", "Hausa", "Igbo"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </FadeInUp>
            )}

            {activeSection === "security" && (
              <FadeInUp key="security">
                <SecuritySection />
              </FadeInUp>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      chewService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
      reset();
    },
    onError: () => toast.error("Failed to change password. Check your current password."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Change Password</h3>
          <p className="text-sm text-muted-foreground">Update your account password</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          changePasswordMutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          })
        )}
        className="space-y-4 max-w-md"
      >
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              {...register("currentPassword")}
              className={inputClass}
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword")}
              className={inputClass}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className={inputClass}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-60 transition-all"
        >
          {changePasswordMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <KeyRound className="w-4 h-4" />
          )}
          {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
