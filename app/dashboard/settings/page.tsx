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
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { chewService } from "@/services/chew.service";
import { FadeInUp } from "@/app/components/animations";

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

  const display = profile || user;

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
                        {display?.firstName?.charAt(0)}{display?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{display?.firstName} {display?.lastName}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary-light text-primary-dark">
                        CHEW
                      </span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { label: "Email", value: display?.email },
                      { label: "Phone Number", value: display?.phone || "—" },
                      { label: "State", value: profile?.state || "—" },
                      { label: "LGA", value: profile?.lga || "—" },
                      { label: "Healthcare Centre", value: profile?.primaryHealthcareCentre || "—" },
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
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6">Security</h3>
                  <p className="text-sm text-muted-foreground">Security settings will be available soon.</p>
                </div>
              </FadeInUp>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
