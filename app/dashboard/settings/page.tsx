"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { chewService } from "@/lib/services/chew.service";
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

  const { data: profile } = useQuery({
    queryKey: ["chew", "profile"],
    queryFn: () => chewService.getProfile(),
  });

  const display = profile || user;

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
                  {[
                    { label: "New mother registrations", description: "When a new mother registers in your area" },
                    { label: "High risk alerts", description: "When a mother is flagged as high risk" },
                    { label: "Missed check-ins", description: "When a mother misses a weekly check-in" },
                    { label: "Referral updates", description: "When a referral status changes" },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                      </div>
                    </label>
                  ))}
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
                    defaultValue={profile?.preferredLanguage || "English"}
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-soft">
                      <div>
                        <p className="text-sm font-medium text-foreground">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                      <button className="text-sm font-medium text-primary hover:text-primary-dark">Change</button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background-soft">
                      <div>
                        <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <button className="text-sm font-medium text-primary hover:text-primary-dark">Enable</button>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
