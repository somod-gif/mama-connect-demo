"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Phone, MapPin, Calendar, Shield, Activity,
  AlertTriangle, Heart, Pill, ClipboardList, Clock,
  ChevronRight, MessageSquare, User, Globe,
  Loader2, Baby, Droplets, Scale, Thermometer,
  Stethoscope, Syringe, FileText, Eye,
  ChevronDown, ChevronUp, Mail, X, ExternalLink, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { patientsService } from "@/lib/services/patients.service";
import { chewService } from "@/lib/services/chew.service";
import { referralsService } from "@/lib/services/referrals.service";
import { FadeInUp } from "@/app/components/animations";
import { RequireVerified } from "@/app/components/shared/VerificationGate";
import { ConfirmDialog } from "@/app/components/shared/ConfirmDialog";
import type { PatientDetail, MedicalAttribute, PatientCheckinsResponse } from "@/types/patient";
import { computePregnancyWeek } from "@/lib/utils/date";
import { careStatusToRiskLevel, normalizeRiskFactors } from "@/lib/utils";

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

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

  const alertQueryClient = useQueryClient();
  const acknowledgeAlertMutation = useMutation({
    mutationFn: (alertId: string) => chewService.acknowledgeAlert(alertId),
    onSuccess: () => {
      alertQueryClient.invalidateQueries({ queryKey: ["chew", "patient", id] });
      toast.success("Concern acknowledged");
    },
    onError: () => toast.error("Failed to acknowledge concern"),
  });
  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: string) => chewService.resolveAlert(alertId),
    onSuccess: () => {
      alertQueryClient.invalidateQueries({ queryKey: ["chew", "patient", id] });
      toast.success("Concern resolved");
    },
    onError: () => toast.error("Failed to resolve concern"),
  });

  const verifyMutation = useMutation({
    mutationFn: () => patientsService.verifyPatient(id),
    onSuccess: () => {
      setShowVerify(false);
      alertQueryClient.invalidateQueries({ queryKey: ["chew", "patient", id] });
      alertQueryClient.invalidateQueries({ queryKey: ["chew", "patients"] });
      toast.success("Mother verified — Maternal ID issued");
    },
    onError: () => toast.error("Failed to verify mother"),
  });

  const createReferralMutation = useMutation({
    mutationFn: (data: { reason: string; toFacility: string; notes?: string }) =>
      referralsService.createReferral({ patientId: id, ...data }),
    onSuccess: () => {
      toast.success("Referral created");
      setShowReferralModal(false);
    },
    onError: () => toast.error("Failed to create referral"),
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
  const riskText = careStatusToRiskLevel(activePregnancy?.careStatus);

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
              {patient.verificationStatus === "PENDING" && (
                <button
                  onClick={() => setShowVerify(true)}
                  disabled={verifyMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Verify
                </button>
              )}
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
              { icon: Globe, label: "Language", value: patient.preferredLanguage || "—" },
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

      {patient.openAlerts && patient.openAlerts.length > 0 && (
        <FadeInUp delay={0.03}>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-900">
                Open Concerns ({patient.openAlerts.length})
              </h3>
            </div>
            <div className="space-y-2">
              {patient.openAlerts.map((alert) => {
                const sev =
                  alert.severity === "HIGH"
                    ? "bg-rose-100 text-rose-700"
                    : alert.severity === "MEDIUM"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700";
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-rose-100"
                  >
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${sev}`}
                    >
                      {alert.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {alert.concern}
                      </p>
                      {alert.reason && (
                        <p className="text-xs text-muted-foreground/80 mt-0.5">
                          {alert.reason}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground/60 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {alert.status === "NEW" && (
                        <button
                          onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                          disabled={acknowledgeAlertMutation.isPending}
                          className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-50"
                        >
                          Ack
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlertMutation.mutate(alert.id)}
                        disabled={resolveAlertMutation.isPending}
                        className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-card border border-border text-muted-foreground hover:bg-background-soft disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeInUp>
      )}

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
            {activeTab === "overview" && (
              <OverviewTab
                patient={patient}
                pregnancyWeek={pregnancyWeek}
                onRecordObservation={() => { setActiveTab("medical"); }}
                onRefer={() => setShowReferralModal(true)}
              />
            )}
            {activeTab === "checkins" && <CheckinsTab data={checkins} />}
            {activeTab === "medical" && (
              <MedicalTab data={attributes} patientId={id} />
            )}
            {activeTab === "activity" && <ActivityTab patient={patient} />}
          </div>
        </div>
      </FadeInUp>

      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowReferralModal(false)}>
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">New Referral</h3>
              <button onClick={() => setShowReferralModal(false)} className="p-1 rounded-lg hover:bg-background-soft"><X className="w-5 h-5" /></button>
            </div>
            <ReferralForm
              onSubmit={(data) => createReferralMutation.mutate(data)}
              isPending={createReferralMutation.isPending}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showVerify}
        title="Verify mother's enrollment?"
        description="This confirms the enrollment and issues a Maternal ID."
        confirmLabel="Verify"
        variant="success"
        isPending={verifyMutation.isPending}
        onConfirm={() => verifyMutation.mutate()}
        onCancel={() => setShowVerify(false)}
      />
    </div>
  );
}

function ReferralForm({ onSubmit, isPending }: { onSubmit: (data: { reason: string; toFacility: string; notes?: string }) => void; isPending: boolean }) {
  const [reason, setReason] = useState("");
  const [toFacility, setToFacility] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!reason || !toFacility) { toast.error("Reason and facility are required"); return; }
    onSubmit({ reason, toFacility, notes: notes || undefined });
    setReason("");
    setToFacility("");
    setNotes("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Reason</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. High blood pressure"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Hospital / Facility</label>
        <input type="text" value={toFacility} onChange={e => setToFacility(e.target.value)} placeholder="e.g. General Hospital"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => { setReason(""); setToFacility(""); setNotes(""); }}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-muted-foreground bg-background-soft rounded-xl hover:bg-border transition-colors">Cancel</button>
        <button onClick={handleSubmit} disabled={isPending}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
          Create Referral
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ patient, pregnancyWeek, onRecordObservation, onRefer }: { patient: PatientDetail; pregnancyWeek: number | null; onRecordObservation: () => void; onRefer: () => void }) {
  const activePregnancy = patient.pregnancies?.find(p => p.isActive);
  const riskFactors = normalizeRiskFactors(activePregnancy?.riskFactors);

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
          onClick={onRecordObservation}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-primary-light text-primary rounded-xl hover:bg-primary-light/80 transition-all"
        >
          <Activity className="w-4 h-4" /> Record Observation
        </button>
        <button
          onClick={onRefer}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all"
        >
          <AlertTriangle className="w-4 h-4" /> Refer to Facility
        </button>
        <a
          href={`https://wa.me/${patient.phone?.replace(/\+/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-background-soft text-foreground rounded-xl hover:bg-border transition-all"
        >
          <MessageSquare className="w-4 h-4" /> Send Message
        </a>
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
      await patientsService.recordAttribute(patientId, {
        attributes: [
          {
            attributeKey: attrType,
            attributeValue: attrUnit ? `${attrValue} ${attrUnit}` : attrValue,
          },
        ],
      });
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
            const Icon = iconMap[attr.attributeKey] || Activity;
            return (
              <div key={attr.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-background-soft text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium capitalize">{attr.attributeKey.replace(/_/g, " ").toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">
                      {attr.attributeValue}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  {attr.recordedAt && (
                    <p className="text-xs text-muted-foreground">{new Date(attr.recordedAt).toLocaleDateString()}</p>
                  )}
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
    messageCount?: number;
    hadFlags?: boolean;
    hadToolCalls?: boolean;
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
      {summaries.map((s) => (
        <div key={s.id} className="p-4 rounded-xl bg-background-soft space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{new Date(s.date).toLocaleDateString()}</span>
            <div className="flex items-center gap-1.5">
              {s.messageCount ? (
                <span className="text-[10px] px-2 py-0.5 bg-primary-light text-primary rounded-full font-medium">
                  {s.messageCount} messages
                </span>
              ) : null}
              {s.hadFlags ? (
                <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200 font-medium">
                  Had concerns
                </span>
              ) : null}
            </div>
          </div>
          {s.summary && <p className="text-sm text-foreground">{s.summary}</p>}
        </div>
      ))}
    </div>
  );
}
