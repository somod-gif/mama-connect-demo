"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Calendar, Shield, Activity,
  AlertTriangle, Heart, Pill, ClipboardList, Clock,
  ChevronRight, MessageSquare, User, Globe,
  Loader2, Baby, Droplets, Scale, Thermometer,
  Stethoscope, Syringe, FileText, Eye,
  ChevronDown, ChevronUp, Mail,
} from "lucide-react";
import { toast } from "sonner";
import { patientsService } from "@/lib/services/patients.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import type { PatientDetail, MedicalAttribute, PatientCheckinsResponse } from "@/types/patient";
import { computePregnancyWeek } from "@/lib/utils/date";

const riskStyles: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-green-50 text-green-700 border-green-200",
};
const verificationStyles: Record<string, string> = {
  VERIFIED: "bg-green-50 text-green-700 border-green-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "checkins", label: "Check-ins", icon: Clock },
  { id: "medical", label: "Medical", icon: Activity },
  { id: "activity", label: "Activity", icon: ClipboardList },
];

export default function MotherProfilePage() {
  return (
    <RequireVerified>
      <MotherProfileContent />
    </RequireVerified>
  );
}

function MotherProfileContent() {
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: patient, isLoading } = useQuery({
    queryKey: ["chew", "patient", id],
    queryFn: () => patientsService.getPatientById(id),
    enabled: !!id,
  });

  const { data: checkins } = useQuery({
    queryKey: ["chew", "patient", id, "checkins"],
    queryFn: () => patientsService.getPatientCheckins(id),
    enabled: activeTab === "checkins" && !!id,
  });

  const { data: attributes } = useQuery({
    queryKey: ["chew", "patient", id, "attributes"],
    queryFn: () => patientsService.getPatientAttributes(id),
    enabled: activeTab === "medical" && !!id,
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

  const activePregnancy = patient.pregnancies?.find(p => p.isActive);
  const pregnancyWeek = activePregnancy?.edd ? computePregnancyWeek(activePregnancy.edd) : null;
  const initials = patient.name.split(" ").map(s => s[0]).join("").toUpperCase().slice(0, 2);
  const riskText = activePregnancy?.riskFactors?.toLowerCase() || "low";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/mothers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assigned Mothers
      </Link>

      <FadeInUp>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-lg font-semibold text-foreground truncate">{patient.name}</p>
                {patient.maternalId && (
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-background-soft rounded border text-muted-foreground">
                    {patient.maternalId}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {patient.age ? `${patient.age} years` : "Age unknown"}
                {pregnancyWeek ? ` · ${pregnancyWeek} weeks pregnant` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${riskStyles[riskText] || riskStyles.LOW}`}>
                  {riskText.toUpperCase()} RISK
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${verificationStyles[patient.verificationStatus] || ""}`}>
                  {patient.verificationStatus}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${patient.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary-light rounded-xl hover:bg-primary-light/80 transition-all"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Phone, label: "Phone", value: patient.phone || "—" },
              { icon: Globe, label: "Language", value: patient.preferredLanguage || patient.user?.phone || "—" },
              { icon: MapPin, label: "LGA", value: patient.lga?.name || "—" },
              { icon: Shield, label: "Status", value: patient.verificationStatus || "—" },
              { icon: Calendar, label: "Last Activity", value: patient.lastActivityAt ? new Date(patient.lastActivityAt).toLocaleDateString() : "N/A" },
              { icon: Heart, label: "Assigned CHEW", value: patient.chew?.name || "—" },
              { icon: Baby, label: "Pregnancy", value: activePregnancy ? `G${activePregnancy.gravida ?? "?"} P${activePregnancy.parity ?? "?"}` : "—" },
              { icon: Calendar, label: "Registered", value: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "—" },
            ].map(field => (
              <div key={field.label} className="flex items-start gap-3 p-3 rounded-xl bg-background-soft">
                <field.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{field.label}</p>
                  <p className="text-sm font-medium text-foreground truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.05}>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && <OverviewTab patient={patient} pregnancyWeek={pregnancyWeek} />}
            {activeTab === "checkins" && <CheckinsTab data={checkins} />}
            {activeTab === "medical" && <MedicalTab data={attributes} patientId={id} />}
            {activeTab === "activity" && <ActivityTab patient={patient} />}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}

function OverviewTab({ patient, pregnancyWeek }: { patient: PatientDetail; pregnancyWeek: number | null }) {
  const activePregnancy = patient.pregnancies?.find(p => p.isActive);
  const riskFactors = activePregnancy?.riskFactors ? activePregnancy.riskFactors.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-background-soft space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Personal Info
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{patient.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span className="font-medium">{patient.age ?? "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{patient.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Channel</span><span className="font-medium">{patient.preferredChannel}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="font-medium">{patient.preferredLanguage || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Maternal ID</span><span className="font-medium font-mono">{patient.maternalId || "—"}</span></div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background-soft space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Location
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">State</span><span className="font-medium">{patient.state?.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">LGA</span><span className="font-medium">{patient.lga?.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ward</span><span className="font-medium">{patient.ward?.name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium">{patient.address || "—"}</span></div>
          </div>
        </div>
      </div>

      {activePregnancy && (
        <div className="p-4 rounded-xl bg-background-soft space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" /> Pregnancy Details
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted-foreground block text-xs">LMP</span><span className="font-medium">{activePregnancy.lmp ? new Date(activePregnancy.lmp).toLocaleDateString() : "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">EDD</span><span className="font-medium">{activePregnancy.edd ? new Date(activePregnancy.edd).toLocaleDateString() : "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Gravida</span><span className="font-medium">{activePregnancy.gravida ?? "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Parity</span><span className="font-medium">{activePregnancy.parity ?? "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Week</span><span className="font-medium">{pregnancyWeek ? `${pregnancyWeek}w` : "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Care Status</span><span className="font-medium">{activePregnancy.careStatus || "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Engagement</span><span className="font-medium">{activePregnancy.engagementStatus || "—"}</span></div>
          </div>
          {riskFactors.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Risk Factors: </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {riskFactors.map(rf => (
                  <span key={rf} className="px-2 py-0.5 text-[10px] font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                    {rf}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toast.info("Recording observation...")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary-light text-primary rounded-xl hover:bg-primary-light/80 transition-all"
        >
          <Activity className="w-4 h-4" /> Record Observation
        </button>
        <button
          onClick={() => toast.info("Creating referral...")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all"
        >
          <AlertTriangle className="w-4 h-4" /> Refer to Facility
        </button>
        <button
          onClick={() => toast.info("Sending message...")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-background-soft text-foreground rounded-xl hover:bg-border transition-all"
        >
          <MessageSquare className="w-4 h-4" /> Send Message
        </button>
      </div>
    </div>
  );
}

function CheckinsTab({ data }: { data: PatientCheckinsResponse | undefined }) {
  const records = data?.healthRecords ?? [];

  if (!records.length) {
    return (
      <div className="text-center py-12">
        <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No check-in records yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.schedule && (
        <div className="p-4 rounded-xl bg-background-soft">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Check-in Schedule</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted-foreground block text-xs">Day</span><span className="font-medium">{data.schedule.dayOfWeek}</span></div>
            <div><span className="text-muted-foreground block text-xs">Time</span><span className="font-medium">{data.schedule.timeOfDay}</span></div>
            <div><span className="text-muted-foreground block text-xs">Missed</span><span className="font-medium">{data.schedule.consecutiveMissed > 0 ? `${data.schedule.consecutiveMissed}x` : "None"}</span></div>
            <div><span className="text-muted-foreground block text-xs">Last</span><span className="font-medium">{data.schedule.lastCheckInAt ? new Date(data.schedule.lastCheckInAt).toLocaleDateString() : "—"}</span></div>
          </div>
        </div>
      )}

      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Check-in Records</h4>
      <div className="space-y-2">
        {records.map((record, idx) => (
          <div key={record.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-background-soft text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                {record.type === "OBSERVATION" ? <Eye className="w-4 h-4 text-primary" /> : <ClipboardList className="w-4 h-4 text-primary" />}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{record.type}</p>
                <p className="text-xs text-muted-foreground">{record.value}{record.unit ? ` ${record.unit}` : ""}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">
              {new Date(record.recordedAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MedicalTab({ data, patientId }: { data: MedicalAttribute[] | undefined; patientId: string }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [attrType, setAttrType] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [attrUnit, setAttrUnit] = useState("");

  const records = data ?? [];

  const handleRecord = async () => {
    if (!attrType || !attrValue) {
      toast.error("Type and value are required");
      return;
    }
    try {
      await patientsService.recordAttribute(patientId, { type: attrType, value: attrValue, unit: attrUnit || undefined });
      queryClient.invalidateQueries({ queryKey: ["chew", "patient", patientId, "attributes"] });
      toast.success("Attribute recorded");
      setAttrType("");
      setAttrValue("");
      setAttrUnit("");
      setShowForm(false);
    } catch {
      toast.error("Failed to record attribute");
    }
  };

  if (!showForm && !records.length) {
    return (
      <div className="text-center py-12">
        <Activity className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">No medical records yet</p>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary-light text-primary rounded-xl hover:bg-primary-light/80 transition-all"
        >
          <Stethoscope className="w-4 h-4" /> Record First Measurement
        </button>
      </div>
    );
  }

  const iconMap: Record<string, typeof Scale> = {
    BLOOD_PRESSURE: Thermometer,
    WEIGHT: Scale,
    HEIGHT: Scale,
    TEMPERATURE: Thermometer,
    FUNDAL_HEIGHT: Scale,
    FETAL_HEART: Heart,
    VACCINATION: Syringe,
    MEDICATION: Pill,
    LAB_RESULT: FileText,
  };

  return (
    <div className="space-y-4">
      {records.length > 0 && (
        <div className="space-y-2">
          {records.map((attr, idx) => {
            const Icon = iconMap[attr.type] || Activity;
            return (
              <div key={attr.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-background-soft text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium capitalize">{attr.type.replace(/_/g, " ").toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {attr.value}{attr.unit ? ` ${attr.unit}` : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xs text-muted-foreground">{new Date(attr.recordedAt).toLocaleDateString()}</p>
                  {attr.recordedBy && <p className="text-[10px] text-muted-foreground/60">{attr.recordedBy}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="p-4 rounded-xl bg-background-soft space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Measurement</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <select
              value={attrType}
              onChange={e => setAttrType(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select type</option>
              <option value="BLOOD_PRESSURE">Blood Pressure</option>
              <option value="WEIGHT">Weight</option>
              <option value="TEMPERATURE">Temperature</option>
              <option value="FUNDAL_HEIGHT">Fundal Height</option>
              <option value="FETAL_HEART">Fetal Heart Rate</option>
              <option value="VACCINATION">Vaccination</option>
              <option value="MEDICATION">Medication</option>
              <option value="LAB_RESULT">Lab Result</option>
            </select>
            <input
              type="text"
              placeholder="Value"
              value={attrValue}
              onChange={e => setAttrValue(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Unit (optional)"
              value={attrUnit}
              onChange={e => setAttrUnit(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRecord}
              className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-semibold bg-card text-muted-foreground rounded-xl border border-border hover:bg-background-soft transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary-light text-primary rounded-xl hover:bg-primary-light/80 transition-all"
        >
          <Stethoscope className="w-4 h-4" /> Record Measurement
        </button>
      )}
    </div>
  );
}

function ActivityTab({ patient }: { patient: PatientDetail }) {
  const summaries = patient.recentSummaries as Array<{
    id: string;
    date: string;
    summary: string | null;
    toolCallsCount: number;
    flags: string | null;
  }> | undefined;

  if (!summaries?.length) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No recent activity recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {summaries.map(s => (
        <div key={s.id} className="p-4 rounded-xl bg-background-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{new Date(s.date).toLocaleDateString()}</span>
            {s.toolCallsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-primary-light text-primary rounded-full font-medium">
                {s.toolCallsCount} tool calls
              </span>
            )}
          </div>
          {s.summary && <p className="text-sm text-foreground">{s.summary}</p>}
          {s.flags && (
            <div className="flex flex-wrap gap-1.5">
              {s.flags.split(",").map(f => (
                <span key={f} className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  {f.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
