"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, MapPin, Globe, Calendar, Shield, Activity, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";

const riskStyles: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-green-50 text-green-700 border-green-200",
};

export default function MotherProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: patient, isLoading } = useQuery({
    queryKey: ["chew", "patient", id],
    queryFn: () => patientsService.getPatientById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground mb-4">Mother not found</p>
        <Link href="/dashboard/mothers" className="text-sm font-medium text-primary hover:text-primary-dark">
          Back to Assigned Mothers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/dashboard/mothers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Assigned Mothers
      </Link>

      <FadeInUp>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-xl font-bold text-white">{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{patient.firstName} {patient.lastName}</p>
              <p className="text-sm text-muted-foreground">{patient.age} years old | {patient.pregnancyWeek} weeks pregnant</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${riskStyles[patient.risk] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                  {patient.risk?.toUpperCase() || "UNKNOWN"} RISK
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <a
              href={`tel:${patient.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary-light rounded-xl hover:bg-primary-light/80 transition-all"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Phone, label: "Phone", value: patient.phone || "—" },
              { icon: MapPin, label: "Location", value: patient.community || "—" },
              { icon: Globe, label: "Language", value: patient.language || "—" },
              { icon: Calendar, label: "Last Check-in", value: patient.lastCheckIn ? new Date(patient.lastCheckIn).toLocaleDateString() : "N/A" },
              { icon: Shield, label: "Status", value: patient.status || "—" },
                  { icon: Calendar, label: "Registered", value: patient.registeredAt ? new Date(patient.registeredAt).toLocaleDateString() : "—" },
            ].map((field) => (
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

      {patient.status === "active" && (
        <FadeInUp delay={0.1}>
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => toast.info("Observation recording will be available soon")}
                className="flex items-center gap-3 p-4 rounded-xl bg-background-soft hover:bg-primary-light transition-colors text-left"
              >
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Record Observation</p>
                  <p className="text-xs text-muted-foreground">BP, weight, temperature</p>
                </div>
              </button>
              <button
                onClick={() => toast.info("Referral feature will be available soon")}
                className="flex items-center gap-3 p-4 rounded-xl bg-background-soft hover:bg-primary-light transition-colors text-left"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Refer to Facility</p>
                  <p className="text-xs text-muted-foreground">Create a referral</p>
                </div>
              </button>
            </div>
          </div>
        </FadeInUp>
      )}
    </div>
  );
}
