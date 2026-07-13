"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Shield, Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { chewService } from "@/lib/services/chew.service";
import { FadeInUp } from "@/app/components/animations";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["chew", "profile"],
    queryFn: () => chewService.getProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const display = profile || user;

  const fields = [
    { icon: Mail, label: "Email", value: display?.email },
    { icon: Phone, label: "Phone", value: display?.phone || "—" },
    { icon: MapPin, label: "State", value: profile?.state || "—" },
    { icon: MapPin, label: "LGA", value: profile?.lga || "—" },
    { icon: Building2, label: "Healthcare Centre", value: profile?.primaryHealthcareCentre || "—" },
    { icon: Globe, label: "Preferred Language", value: profile?.preferredLanguage || "English" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Your professional information</p>
      </div>

      <FadeInUp>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {display?.firstName?.charAt(0)}{display?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {display?.firstName} {display?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{display?.email}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-[10px] font-medium rounded-full bg-primary-light text-primary-dark">
                <Shield className="w-3 h-3" /> Community Health Extension Worker
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.label} className="flex items-start gap-3 p-4 rounded-xl bg-background-soft">
                <field.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
