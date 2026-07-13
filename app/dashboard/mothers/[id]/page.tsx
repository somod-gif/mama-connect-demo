"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Phone,
  MapPin,
  Globe,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
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
    queryKey: ["chew", "patients", id],
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
        <p className="text-muted-foreground">Mother not found</p>
        <Link href="/dashboard/mothers" className="text-primary text-sm mt-2 inline-block">
          Back to mothers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/dashboard/mothers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to mothers
      </Link>

      <FadeInUp>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-primary">
                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${riskStyles[patient.risk]}`}>
                  {patient.risk}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {patient.age} years old
                {patient.pregnancyWeek ? ` · ${patient.pregnancyWeek} weeks pregnant` : ""}
              </p>
            </div>
            <a
              href={`tel:${patient.phone}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary-light rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Phone, label: "Phone", value: patient.phone },
              { icon: MapPin, label: "Location", value: [patient.state, patient.lga].filter(Boolean).join(", ") || "—" },
              { icon: Globe, label: "Language", value: patient.language || "—" },
              { icon: Calendar, label: "Last Check-in", value: patient.lastCheckIn || "None" },
              { icon: Activity, label: "Status", value: patient.status },
              { icon: ClipboardCheck, label: "Registered", value: patient.registeredAt },
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
              <button className="flex items-center gap-3 p-4 rounded-xl bg-background-soft hover:bg-primary-light transition-colors text-left">
                <Activity className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Record Observation</p>
                  <p className="text-xs text-muted-foreground">BP, weight, temperature</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-xl bg-background-soft hover:bg-primary-light transition-colors text-left">
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
